var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');

var router = express.Router();

router.get('/', function(req, res) {
    var errors = req.flash('error');
    var error = '';
    if (errors.length) {
        error = errors[0];
    }

    res.render('partials/rank', {
        title: 'Chess Hub - Ranking',
        error: error,
        isRankPage: true
    });
});
router.get('/puzzles', function(req, res) {
  mongoose.model('Puzzle').find({}, function(err, puzzles) {
    var randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    var token = req.params.token;
    res.render('partials/puzzles', {
      title: 'Play a Puzzle',
      puzzle: randomPuzzle,
      token: token,
      user: req.user
    })

})
}
