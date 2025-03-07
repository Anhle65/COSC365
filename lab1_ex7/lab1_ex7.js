const data = require('./users.json');
const users = data.users;
const bodyParser = require('body-parser');

// console.log(users);
const express = require('express');
const app = express();
app.get('/users', (req, res) => {
    res.status(200).send(users);
});
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    let response = `No user with id ${id}`;
    for (const user of users) {
        if (parseInt(id, 10) === user.id) {
            response = user;
            break;
            }
        }
    res.status(200).send(response);
});
app.use(bodyParser.json());
app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201) // POST requests should return 201 if they create something
    .send(users);
});
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const updateUser = req.body;
    for (const user of users) {
        if (parseInt(id, 10) === user.id) {
            const index = users.indexOf(user);
            users[index] = updateUser;
            break;
        }
    }
    res.status(200).send(updateUser);
});
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    for(const user of users) {
        if(parseInt(id, 10) === user.id) {
            const index = users.indexOf(user);
            users.splice(index, 1);   // Remove 1 user from the array at this index
        }
    }
    res.send(users);
});
app.listen(3000);