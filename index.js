const express = require('express');

const server = express();
server.use(express.json());

const users = ['Cadu', 'Larissa', 'Edu'];

server.use((req, res, next) => {
    console.time('Request');

    console.log('Init request');

    next();
    console.timeEnd('Request')
})

function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: 'User not found on request body' });
    }

    return next();
}

function checkUserInArray(req, res, next) {
    if (!users[req.params.index]) {
        return res.status(400).json({ error: 'User does not exists' });
    }

    return next();
}

server.get('/users', (req, res) => {
    return res.json({ users: users })
})

server.get('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    return res.json({ user: users[index] });
});

server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.json({ users: users });
})

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json({ user: users[index] });
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.json({ users: users });
})

server.listen(3000);