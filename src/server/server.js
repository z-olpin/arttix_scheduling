const express = require('express');
const { Pool } = require('pg')
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

server.get('/employees/:id/shifts', async (req, res) => {
  const result = await pool.query("select * from shifts")
  res.send(result.rows)
})

server.listen(PORT, () => console.log('Server is running...'));