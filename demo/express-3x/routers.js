module.exports = function(app){

app.get("/", function(req, res) {
	res.render("index", {
		time: new Date().toString()
	});
});

// SIDEBARS USING PARTIALS
app.get("/product/1", function(req, res) {
	res.render("product", {
		title: "Black Socks",
		image: "http://pngimg.com/upload/socks_PNG8264.png",
		categories: ["Acessories", "Phones", "Joypads"],
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
		cart: 'sidebar/user-cart'
	});
});

}