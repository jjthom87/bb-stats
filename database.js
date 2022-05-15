/*
  Importing the MySql Node Module into this file
  So that we can connect to the database in our code
*/
var mysql = require('mysql');

let database = "bbstats"

/* We can store our database credentials in an object */
var creds = {
	user: 'root',
	password: '',
	database: database,
	host: 'localhost',
	port: 3306
}
/* Or we can store our database credentials in a string */

/*
  We are setting up our connection to the MySql Database here
  The actual connection is happening below when we run .connect()
  You can insert either the connection object or the connection string into mysql.createConnection function
  We are storing the connection in a variable called databaseConnection
*/
// var databaseConnection = mysql.createConnection(creds);
var databaseConnection = mysql.createConnection(creds);

/*
  We are officially connecting to the database here
  when we run the .connect() function from the mysql.createConnection(databaseConnectionCredentials)
  using databaseConnection.connect()
  You need to run this somewhere in your application so that your application is officially connected to the database
*/

/* Exporting the database connection in this method */
module.exports = databaseConnection;
