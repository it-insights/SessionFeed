var uuid = require('uuid')

const threads = [{
    clientId: uuid(),
    serverId: uuid(),
    timestamp: new Date(),
    likedBy: [ 'Peter' ],
    author: 'Server',
    text: 'Initial state from server 1',
    comments: []
}]

exports.threads = threads;