# mustache-layout
A mustache template engine with layout architecture

# testing 
* run tests

		$ npm test

*	[download the project demo](https://github.com/mageddo/mustache-layout-demo)

* creating your own demo

		var mustacheLayout = require("mustache-layout");
		
		app.locals({
			"title": "Demo mustache layout with express"
		});
		
		app.set('views', './view');
		app.set('view engine', 'html');
		app.set("view options", {layout: true});
		app.engine("html", mustacheLayout);

		app.get("/withCustomLayout", function(req, res) {
			res.render("myView", {
				aVariable: "helloWorld",
				layout: "myCustomLayout"
			});
		});
		app.get("/withoutLayout", function(req, res) {
			res.render("myView", {
				aVariable: "helloWorld",
				layout: false
			});
		});
		app.get("/withDefaultLayout", function(req, res) {
			res.render("myView", {
				aVariable: "helloWorld"
			});
		});