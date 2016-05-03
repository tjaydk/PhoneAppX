angular.module('starter.services', [])

  .factory("Items", function ($firebaseArray) {
    var itemsRef = new Firebase("https://phoneappx.firebaseio.com/items");
    return $firebaseArray(itemsRef);
  })

  .factory("Login", function ($firebaseArray) {
    return {
      login: function (user) {

        //Create current date and time string
        var date = new Date();
        var logintime = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + "-" + date.getHours() + ":" + date.getMinutes();

        //user object
        var userData = {
          username: user.facebook.displayName,
          loggedIn: logintime
        };

        //add user to database if doesnt exists
        var account = new Firebase("https://phoneappx.firebaseio.com/accounts/" + user.uid);
        if (account == null) {
          account.set(userData);
        }

        //add user to online userlist
        var loginUser = new Firebase("https://phoneappx.firebaseio.com/online/" + user.uid);
        loginUser.set(userData);
      },
      logout: function (user) {
        //Remove user from online userlist
        var removeUser = new Firebase("https://phoneappx.firebaseio.com/online/" + user.uid);
        removeUser.remove();

        //Unathenticate user and remove session token
        var ref = new Firebase("https://phoneappx.firebaseio.com");
        ref.unauth();
      },
      chats: function (user) {
        var chats = new Firebase("https://phoneappx.firebaseio.com/accounts/" + user.uid + "/chats");
        return $firebaseArray(chats);
      },
      sendMsg: function (user, msg) {
        var chats = new Firebase("https://phoneappx.firebaseio.com/accounts/" + user.uid + "/chats");
        chats.set(msg.message)
      }
    }
  })

  .factory("Users", function ($firebaseArray) {
    var onlineUsers = new Firebase("https://phoneappx.firebaseio.com/online");
    return $firebaseArray(onlineUsers);
  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
