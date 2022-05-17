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
var bcrypt = require('bcrypt-nodejs');

db.connect();

passportConfig(passport, db);

var app = express();

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

function setListItemName(hangTag, bbName){
  let postNum;
  switch(hangTag){
    case "1":
      postNum = "1st Generation";
      break;
    case "2":
      postNum = "2nd Generation";
      break;
    case "3":
      postNum = "3rd Generation";
      break;
    case "4":
      postNum = "4th Generation";
      break;
    case "5":
      postNum = "5th Generation";
      break;
    case "6":
      postNum = "6th Generation";
      break;
    case "7":
      postNum = "7th Generation";
      break;
    case "8":
      postNum = "8th Generation";
      break;
    case "9":
      postNum = "9th Generation";
      break;
    case "10":
      postNum = "10th Generation";
      break;
    case "11":
      postNum = "11th Generation";
      break;
    case "12":
      postNum = "12th Generation";
      break;
    case "13":
      postNum = "13th Generation";
      break;
    case "14":
      postNum = "14th Generation";
      break;
    case "15":
      postNum = "15th Generation";
      break;
    case "16":
      postNum = "16th Generation";
      break;
    case "17":
      postNum = "17th Generation";
      break;
    case "18":
      postNum = "18th Generation";
      break;
    case "19":
      postNum = "19th Generation";
      break;
    case "4, 5" || "45":
      postNum = "4th/5th Generation"
      break;
    case "6, 7":
      postNum = "6th/7th Generation"
      break;
    case "7, 11":
      postNum = "7th/11th Generation"
      break;
    case "14, 17":
      postNum = "14th/17th Generation";
      break;
    case "14 sm" || "14sm":
      postNum = "sm 14th Generation";
      break;
    case "15 sm":
      postNum = "sm 15th Generation";
      break;
    case "15 UK":
      postNum = "UK 15th Generation";
      break;
    case "15, ?":
      postNum = "15th/?th Generation";
      break;
    case "15, 18UK":
      postNum = "UK 15th/18th Generation";
      break;
    case "15UK, 19":
      postNum = "UK 15th/19th Generation";
      break;
    case "16,18":
      postNum = "16th/18th Generation";
      break;
    case "17 sm":
      postNum = "sm 17th Generation";
      break;
    case "17,18":
      postNum = "17th/18th Generation";
      break;
    case "17, 18":
      postNum = "17th/18th Generation";
      break;
    case "18 sm":
      postNum = "sm 18th Generation";
      break;
    case "18 UK":
      postNum = "UK 18th Generation";
      break;
    case "18,19":
      postNum = "18th/19th Generation";
      break;
    case "18, 19":
      postNum = "18th/19th Generation";
      break;
    case "19 sm":
      postNum = "sm 19th Generation";
      break;
    case "19 UK":
      postNum = "UK 19th Generation";
      break;
    case "19,19":
      postNum = "19th Generation";
      break;
		case "19, 19":
      postNum = "19th Generation";
      break;
    case "3,4":
      postNum = "3rd/4th Generation";
      break;
    case "4,5":
      postNum = "4th/5th Generation";
      break;
    case "6,7":
      postNum = "6th/7th Generation";
      break;
    case "7,10":
      postNum = "7th/10th Generation";
      break;
    case "7,11":
      postNum = "7th/11th Generation";
      break;
    case "7,8":
      postNum = "7th/8th Generation";
      break;
    case "7,8,9":
      postNum = "7th/8th/9th Generation";
      break;
    case "7,9":
      postNum = "7th/9th Generation";
      break;
    default:
      postNum = hangTag;
      break;
  }
  return postNum + " " + bbName;
}

app.get('/api/checked', function(req, res){
	createDataFromCsv().then((arr) => {
			var query = `SELECT * FROM checks where user_id=${req.session.passport.user.id}`;
			db.query(query, (error,queryRes) => {
				if(error){
					res.json({success: false, error: error})
				} else {
					if(queryRes.length > 0){
						for(var i = 0; i < arr.length; i++){
							arr[i]['checked'] = false;
							for(var j = 0; j < queryRes.length; j++){
								if(setListItemName(arr[i]['Hang Tag'],arr[i]['Beanie Baby Name']) == queryRes[j]['bb']){
									if(queryRes[j]['checked'] == 1){
										arr[i]['checked'] = true;
									}
								}
							}
						}
					} else {
						for(var i = 0; i < arr.length; i++){
							arr[i]['checked'] = false;
						}
					}
					res.json({sucess: true, data: arr})
				}
			});
	});
});

app.post('/api/checked', function(req, res){
	let query = `SELECT * FROM checks WHERE bb='${req.body.bb}' AND user_id=${req.session.passport.user.id}`;
	db.query(query, (error,checksRes) => {
		if(error){
			res.json({success: false, error: error})
		} else {
			if(checksRes.length > 0){
				query = `UPDATE checks SET checked=${req.body.checked ? 1 : 0} WHERE bb='${req.body.bb}' AND user_id=${req.session.passport.user.id}`;
				db.query(query, (error,queryRes) => {
					if(error){
						res.json({success: false, error: error})
					} else {
						res.json({success: true, checks: queryRes})
					}
				});
			} else {
				query = `INSERT INTO checks (bb,user_id,checked) VALUES ('${req.body.bb}',${req.session.passport.user.id},${req.body.checked ? 1 : 0})`;
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
})

app.get('/', function(req,res){
	if(req.session.passport == undefined){
		res.sendFile(path.join(__dirname, './public_html/auth.html'));
	} else {
		res.redirect('/checklist')
	}
});

app.get('/checklist', function(req,res){
		if(req.session.passport != undefined){
			res.sendFile(path.join(__dirname, './public_html/checklist.html'));
		} else {
			res.redirect('/')
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
			if (!user) {
				return res.json({success : false, message : 'sign up failed', info: info});
			}
			req.login(user, function(err){
				if(err){
					return next(err);
				}
				return res.status(200).json({success : true, message : 'sign up and authentication succeeded', user: user, info: info});
			})
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

app.post('/api/reset-password', function(req,res){
	db.query("SELECT * FROM users WHERE username='" + req.body.username + "'", (err, user) => {
		if(user.length == 0){
			res.json({success: false, message: 'no user'});
		} else {
			var salt = bcrypt.genSaltSync(10);
			var hashedPassword = bcrypt.hashSync(req.body.password, salt);
			db.query("UPDATE users SET password='" + hashedPassword + "' WHERE username='"+req.body.username+"'", (error, resetRes) => {
				if(error){
					res.json({success: false, message: error})
				} else {
					res.json({success: true, response: resetRes})
				}
			});
		}
	});
});

app.delete('/api/logout-user', function (req, res) {
	req.session.destroy(function(out){
		res.json(out)
	});
});

app.listen(8000);
