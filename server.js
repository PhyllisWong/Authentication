const exp = require('express');
const app = exp();
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const jwt = require('express-jwt');

const port = process.env.PORT;



// configuration ===============================================================
let mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true } ); //connect our database
mongoose.set('debug', true);


// set up our express application
// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from forms


app.use(jwt({
  secret: process.env.SECRET,
  getToken: function fromHeaderOrCookie (req) { //fromHeaderOrQuerystring
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  }
}).unless({path: ['/', '/login', '/signup']}));

// set up templating engine
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

// Static content
app.use(exp.static('./public'));

app.get('/', (req, res) => {
  res.send('Hello Sloths');
});


// launch ======================================================================
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});