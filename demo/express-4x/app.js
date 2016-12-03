var express = require('express')
var app = express();
var mustacheLayout = require("../../app.js"); // in your app you want to use mustache-layout instead
var express3Base = process.cwd() + '/../express-3x';


app.set('views', express3Base + '/view');
app.set('view engine', 'html');
app.set("view options", {layout: true});
app.engine("html", mustacheLayout);

require(express3Base + '/routers.js')(app);

app.listen(3003, function () {
	console.log('Example app listening on port 3003!')
})