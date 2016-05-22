var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');

var router = express.Router();

router.get('/', function(req, res) {

    mongoose.model('User').find({}, function(err, users) {
      console.log('users: ', users);
    res.render('partials/rank', {
        title: 'Chess Hub - Ranking',
        users: users,
        isRankPage: true
    });
});
});


module.exports = router;





// router.get('/puzzles', function(req, res) {
//   mongoose.model('Puzzle').find({}, function(err, puzzles) {
//     var randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
//     var token = req.params.token;
//     res.render('partials/puzzles', {
//       title: 'Play a Puzzle',
//       puzzle: randomPuzzle,
//       token: token,
//       user: req.user
//     })
//
// })
// }
