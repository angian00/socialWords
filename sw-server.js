var SERVER_PORT = 8080;

var application_root = __dirname;

var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var mysql = require("mysql");
var http = require("http");

var passport = require("passport");
var BasicStrategy = require('passport-http').BasicStrategy;


var pool  = initPool();


var app = express();

// app config
app.use(bodyParser.json());   
app.use(methodOverride());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
app.use(passport.initialize());
//app.use(passport.authenticate('basic', { session: false }), express.static(path.join(application_root, "app")));
app.use(express.static(path.join(application_root, "public")));

app.set('views', path.join(application_root, 'views'));
app.set('view engine', 'jade');


//passport config
passport.use(new BasicStrategy(
	{ realm: 'socialWords' },
	function(email, password, done) {
		//console.log("logging in: " + email + ", " + password);

		return pool.query('select * from user where email=' + pool.escape(email), function(err, rows, fields) {
			if (err) { return done(err); } 

			if ((rows.length == 0) || password != rows[0].password)  { return done(null, false); }

			return done(null, privateUserFields(rows[0]));
		});
	}
));



//default page
app.get('/', function(req, res) {
    //res.sendfile('home.html', { root: __dirname + "/relative_path_of_file" } );
    //res.sendfile('index.html');
    res.redirect('/login');
});

app.get('/login', function(req, res) {
	res.render('index', { pageTitle: 'Login', isLogin: true });
});

app.get('/register', function(req, res) {
	res.render('index', { pageTitle: 'Register', isLogin: false });
});


app.get('/userHome', 
	passport.authenticate('basic', { session: false }),
	function(req, res) {
		res.render('userHome', { pageTitle: req.user.nickname, user: req.user });
});



//endpoints
// app.post('/auth', function(req, res, next) {
// 	passport.authenticate('basic', { session: false }, function(err, user, info) {
//     if (err) {
//     	return next(err); // will generate a 500 error
//     }

//     if (!user) {
//     	return res.send({ success : false, message : 'Authentication failed' });
//     }

//     return res.send({ success : true, message : 'Welcome!' });
//   })(req, res, next);
// });
app.post('/auth', 
	passport.authenticate('basic', { session: false }),
	function (req, res) {
    	return res.send({ success : true, message : 'Welcome!' });
});



app.get('/api', 
	passport.authenticate('basic', { session: false }),
	function (req, res) {
		res.send('socialWords API is running');
});


app.get('/api/users',
	passport.authenticate('basic', { session: false }),	
	function (req, res) {
		return pool.query('select * from user', function(err, rows, fields) {
			if (err) {
				return console.log(err);
			} else {
				var result = Array();
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].id == req.user.id)
				    	result.push(privateUserFields(rows[i]));
				    else
				    	result.push(publicUserFields(rows[i]));
				}
    			
    			return res.send(result);
			}
		});
});

// app.post('/api/users', function (req, res) {
// 	return pool.query('insert into user(nickname, first_name, last_name, email, password)' + 
// 		pool.escape(req.body.nickname, req.body.first_name, req.body.last_name, req.body.email, req.body.password), 
// 		function(err, rows, fields) {

// 		if (err) {
// 			return console.log(err);
// 		} else {
// 			return "User successfully created!";
// 		}

// 	});
// });

app.get('/api/users/:userId', 
	passport.authenticate('basic', { session: false }),
	function (req, res) {
	return pool.query('select * from user where id=' + pool.escape(req.params.userId), function(err, rows, fields) {
		if (err) {
			return console.log(err);
		} else {
			if (rows.length == 0) {
				return res.status(404).send('User not found');
			}

			var userData = rows[0];

			if (req.params.userId != req.user.id) {
				return res.send(publicUserFields(userData));
			} else {
				return res.send(privateUserFields(userData));
			}
		}

	});
});


app.get('/api/contacts',
	passport.authenticate('basic', { session: false }),	
	function (req, res) {
		return pool.query('select u.id, u.nickname, count(distinct m.id) as nUnread '
			+ 'from user u, contact c left join message m on c.contact_id=m.from_id and c.owner_id = m.to_id '
			+ 'where c.owner_id=' + pool.escape(req.user.id) + ' and u.id = c.contact_id '
			+ 'and m.read_ts is null '
			+ 'group by u.id, u.nickname order by c.favorite desc',

			function(err, rows, fields) {
				if (err) {
					return console.log(err);
				} else {
					var result = Array();
					for (var i = 0; i < rows.length; i++) {
						var resItem = publicUserFields(rows[i]);
						resItem.nUnread = rows[i].nUnread;

						result.push(resItem);
					}
	    			
	    			return res.send(result);
				}
			});
});


// Launch server
console.log("Launching server on port: " + SERVER_PORT);
var server = http.createServer(app);
server.listen(SERVER_PORT);




//attach to db
function initPool() {
	var jsonStr = fs.readFileSync(path.join(application_root, "connProps.json"));
	var connProps = JSON.parse(jsonStr);
	//return mysql.createConnection({
	return mysql.createConnection(connProps);
}

function publicUserFields(user) {
	//expose only public fields
	return { id: user.id, nickname: user.nickname };
}

function privateUserFields(user) {
	//remove secret fields before returning user
	delete user.password;

	return user;
}


