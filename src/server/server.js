const express = require('express');

const PORT = process.env.PORT || 5000

const server = express();


server.use('/dist', express.static('dist'));
server.use('/index.html', express.static('src/public/index.html'))

server.get('/', (req, res) => {
  res.redirect('/index.html')
})

server.listen(PORT, () => console.log('Server is running...'));