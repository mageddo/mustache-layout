# mustache-layout
A mustache template engine with layout architecture

# Features

* All [Mustache ](http://mustache.github.io) features like
	* Partials
	* Fors
	* Functions 
* Express 3.x/4.x support

# A Simple example

Looping cart product items

cart-items.html

	<ul>
	{{#cartItems}}
		<li>{{name}} - {{price}}</li>
	{{/cartItems}}
	</ul>

controller.js

	app.get("/cart", function(req, res) {
		res.render("cartItems", {
			cartItems: [
				{
					name: "Tommy Hilfiger",
					description: "Combining contrast brand name printed on the front ...",
					price: 9.98,
					quantity: 3
				},{
					name: "TOPMAN",
					description: "Classic fit",
					price: 15.98,
					quantity: 5
				}
			],
		});
	});


# Other samples
* Visit demo folder and run the express sample `npm install && npm start` then visit [the demo](http://localhost:3003)
*	[Download the project demo](https://github.com/mageddo/mustache-layout-demo)

* creating your own demo

	```javascript
	var app = require("express");
	// here express configurations
	...
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
	```

# Escaping template tags
On versions `1.0.6` and bellow, all the mustache templates are compiled on serverside, it means that if you have a 
template tag inside `.html` it will be compiled, now it not occurs

## Observations
* Make sure that every template have a id, or unique attribute to be different of others templates
	* wrong examples

			<script type="text/template" class="xyz"></script>
			<script type="text/template" class="xyz"></script>

	* right examples

			<script type="text/template" class="xyz"></script>
			<script type="text/template" class="xyz2"></script>

* Ever, use `type="text/template"`


## If for some motive you want to do not it, on `view options` set `escapeTemplate` to `false`

# License

This project is released under version 2.0 of the [Apache License][].
[Apache License]: http://www.apache.org/licenses/LICENSE-2.0

**Please** say me if it works for you contacting `edigitalb@gmail.com` or [creating suggestions and defects](https://github.com/mageddo/mustache-layout/issues)
