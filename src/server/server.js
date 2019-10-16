const express = require('express')
const { Pool} = require('pg')
require('dotenv').config()

const PORT = process.env.PORT || 5000

const server = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "psql://arttix:arttix@localhost:5432/arttix",
  ssl: (process.env.DATABASE_SSL || 'true') === 'true'
})


server.use('/dist', express.static('dist'));
server.use('/index.html', express.static('src/public/index.html'))

server.get('/', (req, res) => {
  res.redirect('/index.html')
})

server.get('/employees/:name/shifts', async (req, res) => {
  const dows = {
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday',
    '6': 'saturday',
    '7': 'sunday'
}

  const hourMap =  {
    '8': 2,
    '9': 6,
    '10': 10,
    '11': 14,
    '12': 18,
    '13': 22,
    '14': 26,
    '15': 30,
    '16': 34,
    '17': 38,
    '18': 42,
    '19': 46,
    '20': 50,
    '21': 54,
    '22': 58
}

  const minMap = {
    '00': 0,
    '15': 1,
    '30': 2,
    '45': 3
}

  let result = await pool.query(
    'select extract(isodow from start) as dow, extract(doy from start) as doy, extract(hour from start) as start_hour, extract(minute from start) as start_min, extract(hour from "end") as end_hour, extract(minute from "end") as end_min, shifts.shift_id::integer, shifts.start, shifts.end, shifts.building_id, buildings.name as building, employees.name from shifts, employees, buildings where employees.name=$1 and shifts.employee_id=employees.employee_id and shifts.building_id=buildings.building_id order by shifts.start asc', [req.params.name]
  )
  // Convert to string in query (::text) or after?

  // Do all this on server or client?

  result = result.rows.map(row => {
    row.start = row.start.toLocaleString('en-us', {hour12: false})
    row.end = row.end.toLocaleString('en-us', {hour12: false})
    row.start_min = row.start_min.toString().padStart(2, '0')
    row.start_hour = row.start_hour.toString()
    row.end_min = row.end_min.toString().padStart(2, '0')
    row.end_hour = row.end_hour.toString()
    row.dow = dows[row.dow]
    row.gridStart = hourMap[row.start_hour] + minMap[row.start_min]
    row.gridEnd = hourMap[row.end_hour] + minMap[row.end_min]
    return row
})

  res.json(result)
})

server.listen(PORT, () => console.log(`Server listening on ${PORT}...`));