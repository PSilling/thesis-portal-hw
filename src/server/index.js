var express = require('express');
var router = express.Router();

var topic = {
  id: 0,
  title: 'Topic Title',
  Description: 'Lorem ipsum dolor sit amet, ut noster persius his. Vix te discere veritus, in graeco omnium vel. Ius decore animal inimicus ne, quo ut elit graeco admodum. Te corrumpit patrioque urbanitas duo. Oblique maiorum ut ius. Te ferri erant vivendum his, volumus definitiones mea no, ea nonumy ancillae mea. Nec purto iracundia an.',
  created: new Date()
}

var topics = new Array(topic);

router.get('/topics', function(req, res, next) {
  res.send(topics.filter(function(n){ return n != undefined }));
});

router.get('/topics/:id', function(req, res, next) {
  topics[req.params.id] ? res.send(topics[req.params.id]) : res.sendStatus(404);
});

router.post('/topics', function(req, res, next) {
  console.log(req.body);
  topics.push(req.body);
  res.status(201).send(topics[topics.length-1]);
});

router.put('/topics/:id', function(req, res, next) {
  console.log(req.body);
  topics[req.params.id]=req.body;
  res.status(200).send(topics[req.params.id]);
});

router.delete('/topics/:id', function(req, res, next) {
  //delete topics[req.params.id];
  topics.splice(req.params.id, 1);
  for (let i = req.params.id; i < topics.length; i++) {
    topics[i].id--;
  }
  res.sendStatus(204);
});

module.exports = router;
