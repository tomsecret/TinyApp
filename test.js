function findValue(value, object) {
  for (var i in object) {
    for (var j in object[i]){
      if (object[i][j] === value) {
        return true
      }
    }
  }
}

///////find email and check if password matches function/////
function findEmail(value, object) {
  for (var key in object) {
    if (object[key][email] === value) {
      return true
    }
  }
}

function findEmailandPassword(value, password, object) {
  for (var key in object) {
    if (object[key][email] === value) {
      if (object[key][password] === password) {
        return true
      }
    }
  }
}



////// get key by value //////
function getKeyByValue(value, object) {
  for (var key in object) {
    if (object[key][email] === value) {
      return key;
    }
  }
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
console.log
console.log(findValue("user@example.com", users));