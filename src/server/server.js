const express = require('express')
const {Pool} = require('pg')
const multer = require('multer')
const { parseCsv, fillRowHeaders, convertTo24Hour, dateHeadersToISO } = require('./utils/utils')
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

// If no endpoint, redirect
server.get('/', (_req, res) => {
  res.redirect('/index.html')
})

// Handler for uploaded schedules
server.post('/uploadFile', upload.single('file'), async (req, res) => {

  const result = await pool.query('SELECT employees.name FROM employees ORDER BY employees.name DESC')
  const employees = result.rows.map(obj => obj.name)

  if (req.file.mimetype === 'text/csv') {
    const csvString = req.file.buffer.toString()  // Single string representation of CSV
    const parsed = parseCsv(csvString) // Makes 2D array representation of csv, with each inner array representing a row
    const formattedDates = dateHeadersToISO(parsed)
    const filled = fillRowHeaders(formattedDates)
    const amPm = convertTo24Hour(filled) // Fills blank first indices in each row with building name
    res.json(amPm)

    // TODO: Sort out shifts, check each name against employees list. If no match, find closest relative using
    // Levenshtein ratio. Assume 4 hour shift.


  } else {
    res.status(400).send('File must be CSV')
  }
})

// Get all employee names
server.get('/employees', async (_req, res) => {
  const result = await pool.query('SELECT employees.name FROM employees ORDER BY employees.name DESC')
  res.json(result.rows)
})

// Get all shifts for an employee by name
server.get('/employees/:name/shifts', async (req, res) => {

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
      shifts.building_id=buildings.building_id\
    ORDER BY shifts.start ASC\
  ', [req.params.name])
  res.json(result.rows)
})

server.listen(PORT, () => console.log(`Server listening on ${PORT}...`));