var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['covfefe'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

///// url ////////
var urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "admin"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "admin"
  }
};


///// user register/////

const users = {
  "admin": {
    id: "admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync('123', 10)
  },
 "guest": {
    id: "guest",
    email: "guest@guest.com",
    password: bcrypt.hashSync('123', 10)
  }
}
/////generate string////
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

/////find value in object////////

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
    if (object[key]['email'] === value) {
      return true
    }
  }
}

// function findEmailandPassword(value, password, object) {
//   for (var key in object) {
//     if (object[key]['email'] === value) {
//       if (object[key]['password'] === password) {
//         return true
//       }
//     }
//   }
// }



////// get key by value //////
function getKeyByValue(value, object) {
  for (var key in object) {
    if (object[key]['email'] === value) {
      return key;
    }
  }
}

function getPasswordByEmail(value, object) {
  for (var key in object) {
    if (object[key]['email'] === value) {
      return object[key]['password'];
    }
  }
}

/////////original code //////////////////
app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//// hello page/////
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

////// urls page//////
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.session.user_ID};
  res.render("urls_index", templateVars);
});

///// urls new /////
app.get("/urls/new", (req, res) => {
  if (!req.session.user_ID) {
    res.redirect('/login')
  }
  else {let templateVars = { urls: urlDatabase, username: req.session.user_ID}
  res.render("urls_new", templateVars)
  };
});

/////////the most complicated part////////


app.post("/urls", (req, res) => {  // debug statement to see POST parameters
  result = req.body
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  random = generateRandomString();
  urlDatabase[random] = {url: result.longURL, userID: req.session.user_ID}
  res.redirect('http://localhost:8080/urls/' + random)
});

app.post("/urls/:id/delete", (req, res) => {
    if (req.session.user_ID === urlDatabase[req.params.id]['userID']) {
    delete urlDatabase[req.params.id]
    res.redirect('/urls')
  }
  else {
    res.send('access denied')
  }
  // console.log(req.params.id)
  // delete urlDatabase[req.params.id]
  // res.redirect('/urls')
});

app.post("/urls/:id/update", (req, res) => {
  console.log(req.params.id)
  result = req.body
  urlDatabase[req.params.id] = result.longURL
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  longURL = urlDatabase[req.params.shortURL]['url']
  res.redirect(longURL);
});

//// add login endpoint /////
app.post("/login", (req, res) => {
  if (findEmail(req.body.email, users)) {
    var hashed_password = getPasswordByEmail(req.body.email, users)
    if (bcrypt.compareSync(req.body.password, hashed_password)) {
      tempID = getKeyByValue(req.body.email, users)
      req.session.user_ID = tempID;
      // res.cookie('user_ID', tempID)
      res.redirect('/urls')
    }
    else {
      res.status(403);
      res.send('wrong password')
    }}
  else {
    res.status(403);
    res.send('not existing email')
  }
})

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.session.user_ID}
  res.render("urls_login", templateVars)
})
//// add logout /////

app.post("/logout", (end, res) => {
  res.clearCookie('session')
  res.redirect('/urls')
})

/////user registration page//////
app.get("/register", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase, username: req.session.user_ID};
  res.render("urls_register", templateVars)
})

//// post form to register/////

app.post("/register", (req, res) => {
  var tempID = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Email or password can not be empty")
  }

  else if (findValue(req.body.email, users)) {
    res.status(400);
    res.send("existing email")
  }

  else {
  var hashed_password = bcrypt.hashSync(req.body.password, 10);
  users[tempID] = {id: tempID, email: req.body.email, password: hashed_password};
  req.session.user_ID = tempID;
  res.redirect('/urls')
  // console.log(users)
}

});

app.get("/urls/:id", (req, res) => {
  if (req.session.user_ID === urlDatabase[req.params.id]['userID']) {
    let templateVars = { shortURL: req.params.id, urls: urlDatabase, username: req.session.user_ID};
    res.render("urls_show", templateVars)
  }
  else {
    res.send('access denied')
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

