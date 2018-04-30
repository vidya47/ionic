var mongoose = require('mongoose');
var cors = require('cors');
var express = require('express');
var morgan = require('morgan');
var config = require('./config/database.js');
var passport = require('passport');
var routes = require('./routes/routes');
var bodyParser = require('body-parser');

mongoose.connect(config.database);

mongoose.connection.on('open', function() {
  console.log('Mongo is connected!');
  var app = express();
  app.use(morgan('dev'));
  app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  var originsWhitelist = [
  'http://localhost:8100',      //this is my front-end url for development
  ];
  var corsOptions = {
    origin: function(origin, callback){
          var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials:true
  }
  //here is the magic
  app.use(cors(corsOptions));

  app.use(routes);
  require('./config/passport')(passport);

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

  app.listen(process.env.PORT || 3000, function(err) {
    console.log('Server is running!')
  });
});
