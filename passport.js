module.exports = (passport, db) => {
  var LocalStrategy = require('passport-local').Strategy;
  var bcrypt = require('bcrypt-nodejs');
  const jwt = require('jwt-simple');
  const ExtractJwt = require('passport-jwt').ExtractJwt;
  const JwtStrategy = require('passport-jwt').Strategy;

  passport.serializeUser(function(user,done){
  	done(null, user);
  });

  passport.deserializeUser(function(obj,done){
  	done(null, obj);
  });

  passport.use('local-signin', new LocalStrategy({
  	usernameField: 'username',
  	passwordField: 'password',
  	passReqToCallback: true
  },
  function(req, username, password, done){
  	process.nextTick(function(){
  		db.query("SELECT * FROM users WHERE username='" + username + "'", (err, user) => {
  			if(user.length == 0)
  				return done(null, false, {message: 'no user'});
        if (!bcrypt.compareSync(password, user[0].password)){
          return done(null, false, {message: 'incorrect password'});
        }
  			return done(null, {id: user[0].id, username: user[0].username});
  		});
  	});
  }));

  //look for the local-signup used in one of the routes below
  //basically, this below function is called where this 'strategy' is used in the route below
  passport.use('local-signup', new LocalStrategy({
  	usernameField: 'username',
  	passwordField: 'password',
  	passReqToCallback: true
  },
  function(req, username, password, done){
  	process.nextTick(function(){
  		db.query("SELECT username FROM users WHERE username='" + username + "'", (err, user) => {
  			if(user.length == 1){
  				return done(null, false, {message: 'username already signed up'});
  			} else {
  				var salt = bcrypt.genSaltSync(10);
  				var hashedPassword = bcrypt.hashSync(password, salt);
  				var query = "INSERT INTO users (username, password) VALUES ('"+username+"','"+hashedPassword+"')";
  				db.query(query, (error,queryRes) => {
  					if(error){
  						console.error(error)
  					} else {
              query = "SELECT * FROM users WHERE username='"+username+"'";
              db.query(query, (error,user) => {
                return done(null, {username: user[0].username})
              })
  					}
  				});
  			};
    		});
      });
  }));

  passport.use('local-jwt', new JwtStrategy({
    secretOrKey: 'fartsplosion',
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
  }, function(payload, done){
    db.query("SELECT * FROM users WHERE username='" + payload.sub + "'", (err, user) => {
      if(err){
        return done(err, false)}
  		if(user){
  			done(null, user);
  		} else {
  			done(null, false)
  		}
    });
  }))
}
