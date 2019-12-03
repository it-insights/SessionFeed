var uuid = require('uuid')

const votes = [{
    categories: [{
        name: 'Category 1',
        rating: 5
    }, {
        name: 'Category 2',
        rating: 1
    },{
        name: 'Category 3',
        rating: 2
    }],
    autor: 'Peter',
},{
    categories: [{
        name: 'Category 1',
        rating: 1
    }, {
        name: 'Category 2',
        rating: 2
    },{
        name: 'Category 3',
        rating: 3
    }],
    autor: 'Peter',
}, {
    categories: [{
        name: 'Category 1',
        rating: 4
    }, {
        name: 'Category 2',
        rating: 4
    },{
        name: 'Category 3',
        rating: 1
    }],
    autor: 'Peter',
}, {
    categories: [{
        name: 'Category 1',
        rating: 3
    }, {
        name: 'Category 2',
        rating: 1
    },{
        name: 'Category 3',
        rating: 1
    }],
    autor: 'Peter',
}, {
    categories: [{
        name: 'Category 1',
        rating: 5
    }, {
        name: 'Category 2',
        rating: 2
    },{
        name: 'Category 3',
        rating: 3
    }],
    autor: 'Peter',
}];

const threads = [{
    clientId: uuid(),
    serverId: uuid(),
    timestamp: new Date(),
    likedBy: [ 'Peter' ],
    author: 'Server',
    text: 'Initial state from server 1',
    comments: []
}]

exports.votes = votes;
exports.threads = threads;