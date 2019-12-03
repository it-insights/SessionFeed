var express = require('express');
var router = express.Router();
var data = require('../data')
var uuid = require('uuid')
var io = require('../socket')
var SocketActionTypes = require('../socketactions')

router.post('/', function(req, res) {
  const voteDto = req.body;

  if (!voteDto) {
    res.status(400);
    res.type('json').send({ error: 'Bad input.' });
    return;
  }

  const vote = data.votes.find(t => t.author === voteDto.author);

  if (vote) {
    res.status(409);
    res.type('json').send({ error: 'Cannot vote twice.' });
    return;
  }

  data.votes.push({ ...voteDto });

  const aggregate = data.votes
    .map(v => v.categories)
    .reduce((totals, curr, idx) => {
      for (let c of curr) {
        c.rating = c.rating || 0

        if (!totals) {
          totals = {};
        }

        if (!totals[c.name]) {
          totals[c.name] = {
            count: 1,
            sum: c.rating
          };

          continue;
        }

        totals[c.name] = {
          count: totals[c.name].count + 1,
          sum: totals[c.name].sum + c.rating
        }
      }

      return totals;
    }, {})

  for (category of voteDto.categories) {
    category.count = aggregate[category.name].count;
    category.average = (aggregate[category.name].sum / aggregate[category.name].count).toFixed(2);
  }

  io.emit('message', JSON.stringify({ channel: SocketActionTypes.ADD_VOTE, payload: { categories: voteDto.categories } }));

  res.status(200);
  res.json(voteDto);
});

module.exports = router;
