const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('HTTP request: GET /');
});
app.post('/user', (req, res) => {
    res.send('HTTP request: POST /');
});
app.put('/user/:id', (req, res) => {
    res.send('HTTP request: PUT /');
});
app.delete('/user/:id', (req, res) => {
    res.send('HTTP request: DELETE /');
});
app.listen(3000);
