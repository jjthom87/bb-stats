var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

const fs = require("fs");
const { parse } = require("csv-parse");

var app = express();

var PORT = process.env.PORT || 8000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

app.use(express.static('./public_html'));

app.get('/api/data', function(req,res){
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
	createDataFromCsv()
		.then((arr) => {
			res.json({data: arr});
		});
});

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname,'./public_html/index.html'));
});

app.listen(PORT);
