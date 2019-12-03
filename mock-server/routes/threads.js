var express = require('express');
var router = express.Router();
var data = require('../data')
var uuid = require('uuid')
var io = require('../socket')
var SocketActionTypes = require('../socketactions')


router.get('/', function(req, res) {
  res.status(200);
  res.json(data);
})

router.post('/like', function(req, res) {
  const likeDto = req.body;

  if (!likeDto) {
    res.status(400);
    res.type('json').send({ error: 'Bad input.' });
    return;
  }

  const thread = data.threads.find(t => t.id === likeDto.id);

  if (!thread) {
    res.status(404);
    res.type('json').send({ error: 'Thread not found at server.' });
    return;
  }

  if (thread.likedBy.find(user => user === likeDto.user)) {
    res.status(409);
    res.type('json').send({ error: 'You cannot like the same question twice.' });
    return;
  }

  thread.likedBy.push(likeDto.user);

  io.emit('message', JSON.stringify({ channel: SocketActionTypes.LIKE_THREAD, payload: likeDto }));

  res.status(200);
  res.json(likeDto);
});

router.post('/comment', function(req, res) {
  const commentDto = req.body;

  const thread = data.threads.find(t => t.id === commentDto.id);

  if (!thread) {
    res.status(404);
    res.type('json').send({ error: 'Thread not found.' });
    return;
  }

  thread.comments.push(commentDto.threadComment);

  io.emit('message', JSON.stringify({ channel: SocketActionTypes.ADD_COMMENT, payload: commentDto }));

  res.status(200);
  res.type('json').send({});
});

router.post('/', function(req, res) {
  const thread = req.body;

  if (!thread) {
    res.status(400);
    res.type('json').send({ error: 'Invalid input: Thread object missing.' });
    return;
  }

  thread.id = uuid();

  data.threads.push(thread);

  io.emit('message', JSON.stringify({ channel: SocketActionTypes.ADD_THREAD, payload: thread }));

  res.status(200);
  res.type('json').send({});
});

module.exports = router;
