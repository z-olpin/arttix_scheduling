const express = require('express')
const {Pool} = require('pg')
const multer = require('multer')
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

server.get('/', (_req, res) => {
  res.redirect('/index.html')
})

// Handler for uploaded schedules
server.post('/uploadFile', upload.single('file'), (req, res) => {
  if (req.file.mimetype === 'text/csv') {
    // Single string representation of CSV
    const csvStr = req.file.buffer.toString()

    // Makes 2D array representation of csv, with each inner array representing a row
    let csvRows = csvStr.split(/[\n\r]+/)
      .map(rowStr => rowStr.replace(/"([\w\,\s]*)"/g, (_match, p1) => p1.replace(",", "")) 
        .split(",").map(ent => ent.trim().toLowerCase()))
    // Returns rows with row[0] === the correct building name
      .reduce((acc,curr,ind) => (curr[0] != '')
        ? acc.concat([curr])
        : acc.concat([[acc[ind-1][0], ...curr.slice(1)]]), [])
      .map(row => row.slice(0, 22))

    res.json(csvRows)
  } else {
    res.status(400).send('File must be CSV')
  }
})

// Get all employee names
server.get('/employees', async (_req, res) => {
  const result = await pool.query('SELECT employees.name FROM employees ORDER BY employees.name DESC')
  res.json(result.rows)
})

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