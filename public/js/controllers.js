'use strict'

var app = angular.module('gameApp', ['btford.socket-io', 'nywton.chessboard'])

var player;
var score = 0;


app.factory('mySocket', function (socketFactory) {
  console.log('factory!');
  return socketFactory();
})

app.controller('mainCtrl', function($scope, mySocket, $timeout) {

  $(document).ready(function () {
    
    var puzzle = getFen();
    
    var board = ChessBoard("board", { 
      draggable: true,
      dropOffBoard: "snapback",
      position: puzzle.fen1 
    });

    $scope.result;

    //check users answer and update users score
    $("#checkMove").click(function (e) {

      e.preventDefault();

      var userAnswer = board.fen();

      if(userAnswer == puzzle.fen2){

        $(".correct").removeClass("hidden");
        $(".wrong").addClass("hidden");
        $scope.userScore += 10;
        $scope.result = "Correct!";
        console.log("Correct!");

      } 

      else {
        $(".correct").addClass("hidden");
        $(".wrong").removeClass("hidden");
        console.log("Wrong!");
      }

      updateBoard();
    });


    //change puzzle
    $("#nextPuzzle").click(function (){
        updateBoard();
    });

    function updateBoard(){
      console.log("updateboard");
      puzzle = getFen();

      board = ChessBoard("board", { 
        draggable: true,
        dropOffBoard: "snapback",
        position: puzzle.fen1 
      });
     
    };


  });//closes document ready




  $scope.userScore=score;

  $scope.$on('socket:error',  function(ev, data) {
    console.log('socket error:', data);
  });

  mySocket.on('playerNum',  function(playerNum) {
    console.log('playerNum: ', playerNum);
    $scope.player = playerNum;
    $scope.waitText = 'Waiting for opponent';
  });

  mySocket.on('gameStart', () => {
    if($scope.player) {
      $scope.waitText= 'Press Start to Begin!';
    }
  });

  mySocket.on('winner', (winner) => {
    if(winner === 'draw') {
      $scope.waitText = 'You tied! No Pokemon caught';
    } else if(winner === score) {
      $scope.waitText = 'You caught a Pokemon!';
    } else {
      $scope.waitText = 'You lost! Missed that Pokemon!';
    }

  });

  $scope.startTimer = () => {
    console.log('timer!');
    
    $scope.waitText = 'Your timer has started! You have 20 seconds!'
    
    $timeout(function () {
    mySocket.emit('timeout', score);
    
    $scope.waitText='Your time is up! Waiting for oponent to finish.'
  }, 20000);
  }


});
