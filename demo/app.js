var express = require('express')
var app = express();
var base = process.cwd();

var mustacheLayout = require("../app.js"); // in your app you want to use mustache-layout instead

app.set('views', base + '/view');
app.set('view engine', 'html');
app.set("view options", {layout: true});
app.engine("html", mustacheLayout);

require(base + '/routers.js')(app);

app.listen(3003, function () {
	console.log('Example app listening on port 3003!')
})