var express = require('express')
var app = express();
var mustacheLayout = require("../../app.js"); // in your app you want to use mustache-layout instead
var express3Base = process.cwd() + '';


app.set('views', express3Base + '/view');
app.set('view engine', 'html');
app.set("view options", {layout: true});
app.engine("html", mustacheLayout);

require(express3Base + '/routers.js')(app);

app.listen(3002, function () {
	console.log('Example app listening on port 3002!')
})


// var express = require('express'),
// 	http = require('http'),
// 	path = require('path'),
// 	app = express(),
// 	bodyParser = require('body-parser'),
// 	fs = require('fs'),
// 	mustacheLayout = require("../../app.js"); // in your app you want to use mustache-layout instead

// app.set('port', process.env.PORT || 3002);

	
// // some environment variables
// app.locals({
// 	"title": "Demo mustache layout with express"
// });
// app.set('views', './view');
// app.set('view engine', 'html');
// app.set("view options", {layout: true});
// app.engine("html", mustacheLayout);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.cookieParser('your secret here'));
// app.use(bodyParser.json());
// app.use(express.methodOverride());
// app.use(express.session());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

// require('routers.js')(app);

// app.listen(3002);