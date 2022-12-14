var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   res.send('GET route on things.');
});
router.post('/', function(req, res){
   res.send('POST route on things.');
});
router.get('/about', function (req, res) {
  res.send('About Get Page');
});
router.post('/about', function (req, res) {
  res.send('About Post Page');
});
router.get('/user/:name', function (req, res) {
  res.send("Welcome user: " + req.params.name);
})

//export this router to use in our index.js
module.exports = router;