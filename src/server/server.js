const express = require('express')
const { Pool} = require('pg')
const bodyParser = require('body-parser')
const multer = require('multer');
require('dotenv').config()

const PORT = process.env.PORT || 5000

const server = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "psql://arttix:arttix@localhost:5432/arttix",
  ssl: (process.env.DATABASE_SSL || 'true') === 'true'
})


server.use(bodyParser.urlencoded({extended: true}))
server.use('/dist', express.static('dist'));
server.use('/index.html', express.static('src/public/index.html'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString())
  }
})
 
const upload = multer({ storage: storage })

const parse = csv => {

}

server.post('/uploadFile', upload.single('file'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
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