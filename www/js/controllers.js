angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, Login, Users) {

    //If not logged in then use facebook login
    if ($scope.authData == null) {
      $scope.users = Users;
      $scope.chats = [];
      var date = new Date();

      var ref = new Firebase("https://phoneappx.firebaseio.com");
      ref.authWithOAuthPopup("facebook", function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);

          //add user to onlinelist on Firebase
          Login.login(authData);
          $scope.authData = authData;

          //save user data in localstorage
          localStorage.setItem("userdata", authData);
        }
      });
    }


    $scope.logout = Login.logout;
  })

  .controller('ChatsCtrl', function ($scope, Chats, Login, $firebaseArray) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    var sessionUser = localStorage.getItem("firebase:session::phoneappx");
    var userJsonObj = JSON.parse(sessionUser);

    $scope.message = {};


    //If session present then load chats
    $scope.chats = Login.chats(userJsonObj);

    $scope.sendMsg = function(){
      //alert($scope.message.data);
      //Login.sendMsg(userJsonObj, {message: $scope.message.data});
      $scope.chats.$add({message: $scope.message.data});
    }
    //$scope.remove = function (chat) {
    //  Chats.remove(chat);
    //};
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
