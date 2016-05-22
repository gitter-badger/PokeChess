'use strict'

var app = angular.module('gameApp', ['btford.socket-io', 'nywton.chessboard', 'ui.router'])

var player;
var score = 0;


app.controller('profileCtrl', function($scope, Auth, $state) {
  console.log('profileCtrl!');
  console.log(Auth.currentUser);
  console.log('$scope.currentUser:', $scope.currentUser);


  $scope.createPost = (post) => {



    console.log('$scope.currentUser:', $scope.currentUser);
  }


})


app.controller('homeCtrl', function($scope, Auth) {
  console.log('homeCtrl!');



})


app.controller('authFormCtrl', function($scope, $state, Auth) {
  console.log('authFormCtrl!');

  $scope.currentState = $state.current.name;

  $scope.submitForm = () => {
    if($scope.currentState === 'register') {

      // register user

      if($scope.user.password !== $scope.user.password2) {

        $scope.user.password = '';
        $scope.user.password2 = '';

        alert('Passwords must match.')
      } else {
        Auth.register($scope.user)
        .then(res => {
          return Auth.login($scope.user);
        })
        .then(res => {
          $state.go('chess');
        })
        .catch(res => {
          alert(`registration error: ${res.data.error}`);
        });
      }
    } else {
      // login user
      console.log($scope.user)
      Auth.login($scope.user)
      .then(res => {
        $state.go('chess');
      })
      .catch(res => {
        alert(`login error: ${res.data.error}`);
      })

    }
  };
});


app.controller('profileCtrl', function() {
  console.log('profileCtrl!');
})

app.controller('loginCtrl', function() {
  console.log('loginCtrl!');
})

app.controller('logoutCtrl', function() {
  console.log('logoutCtrl!');
})

app.controller('chessCtrl', function() {
  console.log('chessCtrl!');
})


app.factory('mySocket', function (socketFactory) {
  console.log('factory!');
  return socketFactory();
})

app.controller('mainCtrl', function($scope, Service, mySocket, $timeout, Auth, $state) {

  $scope.$watch(function() {
    return Auth.currentUser;
  }, function(newVal, oldVal) {
    console.log('oldVal: ', oldVal);
    console.log('newVal: ', newVal );
    $scope.currentUser = newVal;
  })


  // console.log('mainCtrl');
  // Auth.getProfile()
  //   .then(res => {
  //     $scope.currentUser = res.data;
  //   })
  //   .catch(res => {
  //     $scope.currentUser = null;
  //   })
  $scope.logout = () => {
    Auth.logout()
    .then(res => {
      $state.go('home');
    })
  }


  $(document).ready(function () {

    var board33 = ChessBoard("board33", {
      draggable: true,
      dropOffBoard: "snapback",
      position: "8/8/8/4k3/8/8/8/KQ6"
    });

    $("#getMove").click(function () {
      console.log(board33.fen());
    });

  });

  console.log('mainCtrl!');
  $scope.userScore=score;

  $scope.question = Service.getMathQuestion();



  $scope.$on('socket:error',  function(ev, data) {
    console.log('socket error:', data);
  });

  mySocket.on('playerNum',  function(playerNum) {
    console.log('playerNum: ', playerNum);
    $scope.player = playerNum;
    $scope.waitText = 'Waiting for opponent'
  });

  mySocket.on('gameStart', () => {
    if($scope.player) {
      $scope.waitText= 'Press Start to Begin!'
      ee    }
    })

    mySocket.on('winner', (winner) => {
      if(winner === 'draw') {
        $scope.waitText = 'You tied!';
      } else if(winner === score) {
        $scope.waitText = 'You win!';
      } else {
        $scope.waitText = 'You lose!';
      }

    })

    $scope.startTimer = () => {
      console.log('timer!');
      $scope.waitText = 'Your timer has started! You have 20 seconds!'
      $timeout(function () {
        mySocket.emit('timeout', score);
        $scope.waitText='Your time is up! Waiting for oponent to finish.'
      }, 20000);
    }

    $scope.checkAnswer = function(answer) {

      $scope.correctAns = $scope.question.answer;

      if(answer == $scope.question.answer) {
        console.log("correct");
        score += 10;
        $scope.userScore = score;
      }
      //update question
      $scope.question = Service.getMathQuestion();
    }





  });
