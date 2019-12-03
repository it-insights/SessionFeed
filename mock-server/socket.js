var http = require('http');
var io = require('socket.io')(http);
var data = require('./data')
var SocketActionTypes = require('./socketactions')


io.on('connection', (socket) => {
    socket.emit('message', JSON.stringify({
        channel: SocketActionTypes.INIT,
        payload: data.threads
    }));
})

module.exports = io;