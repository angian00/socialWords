
var application_root = __dirname;

var fs = require('fs');
var path = require("path");
var mysql = require("mysql");
var legicon = require('legicon');


var conn;


function main() {
	initConn();
	generateAllAvatars();
}


//attach to db
function initConn() {
	var jsonStr = fs.readFileSync(path.join(application_root, "connProps.json"));
	var connProps = JSON.parse(jsonStr);
	conn = mysql.createConnection(connProps);
}


function generateAllAvatars() {
	conn.query('select * from user', function(err, rows, fields) {
		if (err) {
			return console.log(err);
		}

		rows.forEach(function(row) {
			var pngStream = legicon(row.nickname).pngStream();
			var outStream = fs.createWriteStream(path.join(application_root, "avatars", row.nickname + ".png"));
			
			pngStream.on('data', function(chunk) {
				outStream.write(chunk);
			});
			
			pngStream.on('end', function() {
				console.log("generated avatar for user: " + row.nickname);
			});
		});
	});
}


main();

