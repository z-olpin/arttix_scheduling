const express = require('express')
const { Pool} = require('pg')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const csvParser = require('csv-parser')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const server = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "psql://arttix:arttix@localhost:5432/arttix",
  ssl: (process.env.DATABASE_SSL || 'true') === 'true'
})

server.use(bodyParser.urlencoded({extended: true}))
server.use('/dist', express.static('dist'));
server.use('/uploads', express.static('uploads'));
server.use('/index.html', express.static('src/public/index.html'))

// Storage engine to write uploaded schedules to disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname)
  }
})
const upload = multer({ storage: storage })

// Handler for uploaded schedules
server.post('/uploadFile', upload.single('file'), (req, res, next) => {
  const file = req.file
  // Parse uploaded CSV and send back rows
  const csvRows = []
  fs.createReadStream(`uploads/${file.filename}`)
    .pipe(csvParser({headers: false}))
    .on('data', row  => csvRows.push(row))
    .on('end', () => res.json(csvRows.map(rowObj => Object.values(rowObj).map(cell => cell.toLowerCase().trim()))))
})

server.get('/', (req, res) => {
  res.redirect('/index.html')
})

server.get('/employees/:name/shifts', async (req, res) => {

  let result = await pool.query('\
    select\
      shifts.shift_id::integer,\
      shifts.start,\
      shifts.end,\
      shifts.building_id,\
      buildings.name as building,\
      employees.name\
    from shifts, employees, buildings\
    where\
      employees.name=$1 and\
      shifts.employee_id=employees.employee_id and\
      shifts.building_id=buildings.building_id\
    order by shifts.start asc\
  ', [req.params.name])
  res.json(result.rows)
})

server.listen(PORT, () => console.log(`Server listening on ${PORT}...`));