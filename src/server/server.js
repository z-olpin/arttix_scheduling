const express = require('express');
// import App from '../components/App';

const PORT = process.env.PORT || 5000

const server = express();


server.use(express.static('dist'));

server.get('/', (req, res) => {
  // const initialMarkup = ReactDOMServer.renderToString(<App />);

  // res.send(`
  //   <html>
  //     <head>
  //       <title>zschedul_</title>
  //       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
  //     </head>
  //     <body style="font-family: helvetica">
  //       <div id="app">${initialMarkup}</div>
  //       <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>

  //       <script src="/main.js"></script>
  //     </body>
  //   </html>
  // `)
res.send('<h1>Hello</h1>')
});

server.listen(PORT, () => console.log('Server is running...'));