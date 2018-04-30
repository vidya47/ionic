const user = require('../models/user');
const config = require('../config/database');
const jwt = require('jwt-simple');

var functions = {
  authenticate: function(req, res){
    user.findOne({
      name: req.body.name
    }, function(err, user){
      if (err) { throw err; }
      if (!user) {
        res.status(403).send({success: false, msg: 'Authentication failed. User not found!'});
      } else {
        user.comparePassword(req.body.password, function(err, isMatch){
          if(isMatch && !err){
            var token = jwt.encode(user, config.secret);
            res.json({success: true, token: token});
          } else {
            return res.status(403).send({success: false, msg: 'Authentication failed. Wrong password!'})
          }
        })
      }
    })
  },
  addNew: function(req, res){
    if((!req.body.name) || (!req.body.password)){
      res.json({success: false, msg: 'Enter all the values'});
    } else {
      var newUser = user ({
        name: req.body.name,
        password: req.body.password
      });
      newUser.save(function(err, newUser){
        if (err){
          res.json({success:false, msg:'Failed to save'});
        } else {
          res.json({success:true, msg:'Successfully saved'});
        }
      })
    }
  },
  getInfo: function(req, res){
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
      var token = req.headers.authorization.split(' ')[1];
      var decodedtoken = jwt.decode(token, config.secret);
      return res.json({success:true, msg: 'hello '+decodedtoken.name});
    } else {
      return res.json({success:false, msg: 'No header'});
    }
  }
};

module.exports = functions;
