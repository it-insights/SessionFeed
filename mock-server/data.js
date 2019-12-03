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
    id: uuid(),
    timestamp: new Date(),
    likedBy: [ 'Peter' ],
    author: {
        name: 'Server',
        avatarUrl: 'https://api.adorable.io/avatars/face/eyes2/nose5/mouth7/A170ED'
    },
    text: 'Initial state from server 1',
    comments: []
}]

const users = [{
    name: 'Server',
    avatarUrl: 'https://api.adorable.io/avatars/face/eyes2/nose5/mouth7/A170ED'
}]

exports.votes = votes;
exports.threads = threads;
exports.users = users;
