var express = require('express');
var router = express.Router();
var data = require('../data')
var uuid = require('uuid')
var io = require('../socket')
var SocketActionTypes = require('../socketactions')

router.post('/', function(req, res) {
    const userDto = req.body;

    if (!userDto) {
        res.status(400);
        res.type('json').send({ error: 'Bad input.' });
        return;
    }

    const user = data.users.find(u => u.name === userDto.name);

    if (user) {
        res.status(409);
        res.type('json').send({ error: 'User already exists.' });
        return;
    }

    data.users.push(userDto);

    io.emit('message', JSON.stringify({ channel: SocketActionTypes.LIKE_THREAD, payload: likeDto }));

    res.status(200);
    res.json(likeDto);
});