const express = require('express')
const {Pool} = require('pg')
const multer = require('multer')
const dfns = require('date-fns')
const bodyParser = require('body-parser')

const { parseCsv, fillRowHeaders, convertTo24Hour, dateHeadersToISO, makeShiftObjs } = require('./utils/utils')
const fuzz = require('fuzzball')
require('dotenv').config()

const PORT = process.env.PORT || 5000

const server = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "psql://arttix:arttix@localhost:5432/arttix",
  ssl: (process.env.DATABASE_SSL || 'true') === 'true'
})

const upload = multer()

server.use('/dist', express.static('dist'));
server.use('/uploads', express.static('uploads'));
server.use('/index.html', express.static('src/public/index.html'))
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

// If no endpoint, redirect
server.get('/', (_req, res) => {
  res.redirect('/index.html')
})

// Handler for uploaded schedules
server.post('/uploadFile', upload.single('file'), async (req, res) => {

  const result = await pool.query('SELECT employees.name FROM employees ORDER BY employees.name DESC')
  const employees = result.rows.map(obj => obj.name)

  // TODO: Make a dictionary of equivalencies for e.g. building names, employee names/nicknames, etc.

  const buildingNameMap = {
    'abravanel': 'abravanel hall',
    'capitol': 'capitol',
    'delta hall': 'delta hall',
    'rsbb': 'regent street',
    'rose': 'rose wagner'
  }

  if (req.file.mimetype === 'text/csv') {
    const csvString = req.file.buffer.toString()  // Single string representation of CSV
    const parsed = parseCsv(csvString) // Makes 2D array representation of csv, with each inner array representing a row
    const formattedDates = dateHeadersToISO(parsed)  // Turn column headers into iso timestamps
    const filled = fillRowHeaders(formattedDates) // Fills blank first indices in each row with building name
    const amPm = convertTo24Hour(filled) // Identify AM or PM for cells with times
    const shifts = makeShiftObjs(amPm) // Make array of objects {employeeName, startTime, startDate, building}
    const errors = []

    // Date range from csv.
    const earliestShift = dfns.min(shifts.map(shift => shift.startTime))
    const latestShift = dfns.max(shifts.map(shift => shift.startTime))

    // Select most recent date from shifts in DB
    const lastDate = await pool.query('SELECT MAX(start) FROM shifts')
    
    // TODO: Test shifts, see if catching all, starttimes are correct etc etc
    
    // TODO: For all shifts, check name. If name in current list of employees, great. If not, 
    // figure out who it belongs too. Rule out those scheduled concurrently elsewhere and those scheduled for same shift.
    // After ruling out as many as possible, check Levenshtein ratio for remaining names.
    // If ratio very high for only one name, add to that employee with a note (for displaying to the user that it is uncertain).
    // If ratio does not obviously point to one name, add shift as unowned (display to all candidate owners as possible shift)
    
    // TODO: Check if csv's dates already in DB. If so, ask if user would like to replace existing shifts

    shifts.map(async s => {
      // Add employees to database
      await pool.query(
        'INSERT INTO employees (name) values ($1) ON CONFLICT DO NOTHING', // If name exists, don't add again
        [s.employeeName]
      ).catch(e => errors.push(e))

      // add shifts to database
      await pool.query(
        'INSERT INTO shifts (building_id, start, "end", employee_id) values (\
          (select building_id from buildings where buildings.name=$1),\
          $2,\
          $3,\
          (select employee_id from employees where employees.name=$4 limit 1)\
        )',
        [s.building,
        s.startTime.toISOString(),
        s.endTime.toISOString(),
        s.employeeName]).catch(e => errors.push(e))
    })

    res.json({errors: errors, shifts: shifts.map(shift => [shift.employeeName, shift.startTime, shift.building])})

  } else {
    res.status(400).send('File must be CSV')
  }
})

// Handler for created schedule
server.post('/shifts', async (req, res) => {
  const shifts = []
  Object.keys(req.body).map(k1 => {
    Object.keys(req.body[k1]).map(k2 => {
        if(req.body[k1][k2].length) {
            req.body[k1][k2].map(s => {
              shifts.push({
                building: k1.toLowerCase(),
                employee: s.employee.toLowerCase(),
                startTime: s.startTime,
                outTime: s.endTime
              })
            })
        }
    })
  })
  shifts.map(async s => {
    const res = await pool.query('insert into shifts (building_id, start, "end", employee_id) values ((select building_id from buildings where name=$1), $2, $3, (select employee_id from employees where name=$4))', [s.building, s.startTime, s.outTime, s.employee])
  })
  res.json(shifts)
})

// Get all employee names
server.get('/employees', async (_req, res) => {
  const result = await pool.query('SELECT employees.name FROM employees ORDER BY employees.name ASC')
  res.json(result.rows)
})

// Get all shifts for an employee by name
server.post('/employees/:name/shifts', async (req, res) => {

  const [rangeBegin, rangeEnd] = req.body
  const result = await pool.query('\
    SELECT\
      shifts.start,\
      shifts.end,\
      shifts.building_id,\
      buildings.name AS building,\
      employees.name\
    FROM shifts, employees, buildings\
    WHERE\
      employees.name=$1 AND\
      shifts.employee_id=employees.employee_id AND\
      shifts.building_id=buildings.building_id AND\
      shifts.start between $2 and $3\
    ORDER BY shifts.start ASC\
  ', [req.params.name, rangeBegin, rangeEnd]
  )
  res.json(result.rows)
})

server.post('/wipe', async (_req, res) => {
  const errors = []
  await pool.query('delete from shifts where True').catch(e => errors.push(e))
  await pool.query('alter sequence shifts_shift_id_seq restart with 1').catch(e => errors.push(e))
  res.json(errors.length ? 'success' : errors)
})

server.listen(PORT, () => console.log(`Server listening on ${PORT}...`));