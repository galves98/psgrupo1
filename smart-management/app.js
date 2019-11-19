require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//var MongoClient = require('mongodb').MongoClient;

// app.route('/allProducts').get(function(req, res){ MongoClient.connect(url, function(err, db){
//             var cursor = db.collection('ProductArtLima').find();
//             cursor.each(function(err, item) {
//                 if (item != null) {
//                     str = str + "   id  " + "</br>";
//                 }
//             });
//             res.send(str);
//             db.close();
//         });
//     });

//var server = app.listen(3000, function() {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'some-private-cpe-key', key: 'cpe' }));
app.use(
	sassMiddleware({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		indentedSyntax: true, // true = .sass and false = .scss
		sourceMap: true
	})
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const config = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DATABASE_URL,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

mongoose.connect('mongodb+srv://jota:kopenhagen@cpe-dxzhb.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlPasser: true,
	useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once('open', () => {
	console.log('database connect!');
});


module.exports = app;
