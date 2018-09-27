const exp = require('express');
const app = exp();
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');

const port = process.env.PORT;
const secret = process.env.SECRET;

const User = require('./models/user');



// configuration ===============================================================
let mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true } ); //connect our database
mongoose.set('debug', true);


// set up our express application
// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from forms


// app.use(jwt({
//   secret: process.env.SECRET,
//   getToken: function fromHeaderOrCookie (req) { //fromHeaderOrQuerystring
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//       return req.headers.authorization.split(' ')[1];
//     } else if (req.cookies && req.cookies.token) {
//       return req.cookies.token;
//     }
//     return null;
//   }
// }).unless({path: ['/', '/login', '/signup', '/scripts.js']}));

// set up templating engine
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

// Static content
app.use(exp.static(__dirname + '/public'));

// index route
app.get('/', (req, res) => {
  res.render('index');
});

// render the signup template
app.get('/signup', (req, res) => {
  res.render('signup');
});

// CREATE A NEW USER signup route
app.post('/signup', (req, res) => {
  // add the code here
  let user = new User(req.body);

  user.save().then( user => {
    let token = jwt.sign({ _id: user._id }, secret);
    res.cookie('nToken', token, {maxAge: 900000, httpOnly: true});
    res.redirect('/');
  })
    .catch( err => {
      console.log(err.message);
      return res.status(400).send({err: err});
    })
});


// render the login template
app.get('/login', (req, res) => {
  res.render('login');
});

// POST login route
app.post('login', (req, res) => {
  // add the code to make login work
});


// launch ======================================================================
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});