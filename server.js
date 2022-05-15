var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash    = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var passportConfig = require('./passport.js')
var db = require('./database.js');
var path = require('path');
const fs = require("fs");
const { parse } = require("csv-parse");

db.connect();

passportConfig(passport, db);

var app = express();

var PORT = process.env.PORT || 8000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

app.use(express.static('./public_html'));

app.use(morgan('dev')); // log every request to the consolee
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
	secret: "secret",
	resave : true,
	saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

function createDataFromCsv(){
	let bbJsonObjectArray = [];
	return new Promise((resolve, reject) => {
		const columns = ["Beanie Baby Name","Animal/Character","Hang Tag","Mint","Non Mint","No Tag","Style #","Notes & Exclusivity"]
		fs.createReadStream("./2022-Prices.csv")
			.pipe(parse({ delimiter: ",", from_line: 2 }))
			.on("data", function (row) {
				var bbo = {}
				for(var i = 0; i < row.length; i++){
					bbo[columns[i]] = row[i]
				}
				bbJsonObjectArray.push(bbo);
				if(bbJsonObjectArray.length == 3285){
					resolve(bbJsonObjectArray)
				}
			})
	});
}

app.get('/api/data', function(req,res){
	createDataFromCsv().then((arr) => {
			res.json({data: arr});
	});
});

app.get('/api/checked', function(req, res){
	createDataFromCsv().then((arr) => {
			var query = `SELECT * FROM checks where user_id=${req.session.passport.user.id}`;
			db.query(query, (error,queryRes) => {
				if(error){
					res.json({success: false, error: error})
				} else {
					for(var i = 0; i < arr.length; i++){
						arr[i]['checked'] = false;
						for(var j = 0; j < queryRes.length; j++){
							if((arr[i]['Hang Tag'] + 'th Generation ' + arr[i]['Beanie Baby Name']) == queryRes[j]['bb']){
								if(queryRes[j]['checked'] == 1){
									arr[i]['checked'] = true;
								}
							}
						}
					}
					res.json({sucess: true, data: arr})
				}
			});
	});
});

app.post('/api/checked', function(req, res){
	var query = `SELECT id FROM users WHERE username='${req.body.user}'`;
	db.query(query, (error,user) => {
		if(error){
			res.json({success: false, error: error})
		} else {
			query = `SELECT * FROM checks WHERE bb='${req.body.bb}' AND user_id=${user[0].id}`;
			db.query(query, (error,checksRes) => {
				if(error){
					res.json({success: false, error: error})
				} else {
					if(checksRes.length > 0){
						query = `UPDATE checks SET checked=${req.body.checked ? 1 : 0} WHERE bb='${req.body.bb}' AND user_id=${user[0].id}`;
						db.query(query, (error,queryRes) => {
							if(error){
								res.json({success: false, error: error})
							} else {
								res.json({success: true, checks: queryRes})
							}
						});
					} else {
						query = `INSERT INTO checks (bb,user_id,checked) VALUES ('${req.body.bb}',${user[0].id},${req.body.checked ? 1 : 0})`;
						db.query(query, (error,queryRes) => {
							if(error){
								res.json({success: false, error: error})
							} else {
								res.json({success: true, checks: queryRes})
							}
						});
					}
				}
			});

		}
	});
})

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname,'./public_html/index.html'));
});

app.get('/auth', function(req,res){
	if(req.session.passport == undefined){
		res.sendFile(path.join(__dirname,'./public_html/auth.html'));
	} else {
		res.redirect('/checklist')
	}
});

app.get('/checklist', function(req,res){
		if(req.session.passport != undefined){
			res.sendFile(path.join(__dirname,'./public_html/checklist.html'));
		} else {
			res.redirect('/auth')
		}
});

app.get('/api/signed-in', function(req,res){
	if(req.session.passport != undefined){
		res.json({success: true, message: 'signed in user', user: req.session.passport.user});
	} else {
		res.json({success: false, message: 'noone signed in'})
	}
});

app.post('/api/sign-up', function(req,res,next){
	passport.authenticate('local-signup', function(err, user, info){
		if (err) {
			return next(err);
		} else {
			res.json({user: user, info: info})
		}
	})(req, res, next);
});

app.post('/api/sign-in', function(req,res,next){
	passport.authenticate('local-signin', function(err, user, info){
			if (err) {
					return next(err);
			}
			if (!user) {
				return res.json({success : false, message : 'authentication failed', info: info});
			}
			req.login(user, function(err){
			if(err){
				return next(err);
			}
			return res.status(200).json({success : true, message : 'authentication succeeded', user: user, info: info});
		});
		})(req, res, next);
});

app.listen(PORT);
