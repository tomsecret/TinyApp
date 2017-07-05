var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};


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
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

///// urls new /////
app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  result = req.body
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  random = generateRandomString();
  console.log(random);
  urlDatabase[random] = result.longURL;
  res.redirect('http://localhost:8080/urls/' + random)
});

app.post("/urls/:id/delete", (req, res) => {
  console.log(req.params.id)
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
});

app.post("/urls/:id/update", (req, res) => {
  console.log(req.params.id)
  result = req.body
  urlDatabase[req.params.id] = result.longURL
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//// add login endpoint /////
app.post("/login", (req, res) => {
  username1 = req.body.username
  console.log(username1);
  res.cookie('username', username1)
  res.redirect('/urls')
})

//// add logout /////

app.post("/logout", (end, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
})

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

