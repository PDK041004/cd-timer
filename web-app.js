const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { read, readFile } = require ('fs').promises;
const port = 3000;

app.get('/', async(req, res) => {
   res.send(await readFile('./countdown.html', 'utf8'))
})

http.listen(port, async() => {
   console.log(await 'Test app listening at http://localhost:'+ port);
})