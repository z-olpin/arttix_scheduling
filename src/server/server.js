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

// Handler for uploaded schedules
server.post('/uploadFile', upload.single('file'), (req, res) => {
  // TODO: Post to database
  const csvStr = req.file.buffer.toString()
  res.json(csvStr)
})

server.get('/', (_req, res) => {
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