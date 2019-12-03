var http = require('http');
var io = require('socket.io')(http);
var data = require('./data')
var SocketActionTypes = require('./socketactions')


io.on('connection', (socket) => {
    socket.on('message', (payload) => {
        console.log(`Received payload: ${payload}`)

        const message = JSON.parse(payload);

        switch (message.channel) {
            case SocketActionTypes.ADD_THREAD:
                if (message.payload) {
                    message.payload.serverId = uuid();
                    data.threads.push(message);
                    io.emit(JSON.stringify(message));
                }

                break;
            default:
                console.log('Unable to interpret message.')
        }
    })
})

module.exports = io;