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
app.put('/users/following/:id/:fid', (req, res) => {
    const id = req.params.id;
    const followingId = req.params.fid;
    for (const user of users) {
        if(parseInt(id, 10) === user.id) {
            const index = users.indexOf(user);
            const following = users[index]['following'];
            for (const fuser of users) {
                if(parseInt(followingId,10) === fuser.id) {
                    if(followingId === id) {
                        res.send("Can not following yourself");
                        break;
                    }
                    if(following.includes(followingId)) {
                        res.send("Already following this person");
                        break;
                    }
                    following.push(followingId);
                    res.status(200).send(users);
                    break;
                }
            }
        }
    }
    // res.status(200).send(users);
});
app.get('/users/following/:id', (req, res) => {
    const id = req.params.id;
    for (const user of users) {
        if (parseInt(id, 10) === user.id) {
            const index = users.indexOf(user);
            const following = users[index]['following'];
            res.send(following);
        }
    }
});
app.put('/users/unfollowing/:id/:fid', (req, res) => {
    const id = req.params.id;
    const followingId = req.params.fid;
    for (const user of users) {
        if(parseInt(id, 10) === user.id) {
            const index = users.indexOf(user);
            const following = users[index]['following'];
            for (const fuser of users) {
                if(parseInt(followingId,10) === fuser.id) {
                    if(followingId === id) {
                        res.send("Can not unfollowing yourself");
                        break;
                    }
                    if(!following.includes(followingId)) {
                        res.send("You haven't followed this person");
                        break;
                    }
                    const f_index = following.indexOf(followingId);
                    following.splice(f_index, 1);
                    res.status(200).send(users);
                    break;
                }
            }
        }
    }
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