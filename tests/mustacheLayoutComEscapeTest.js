module.exports = function(render){
	return {
		layoutViewTest: function(){
			render.call({
				name: "index",
				root: __dirname + "/view",
				ext: ".html"
			}, __dirname + '/view/index.html', {
				settings: {
					'view options': {
						layout: true
					}
				},
				title: "Test App",
				message: "Hello World"
			}, function(err, data){
				if(err)
					throw err;
				console.log("\n----------------\nfinal data:\n ", data);
			});
		},
		layoutEscapeTemplateTest2: function(){
			render.call({
				name: "index2",
				root: __dirname + "/view",
				ext: ".html"
			}, __dirname + '/view/index2.html', {
				settings: {
					'view options': {
						layout: true
					}
				},
				layout: false,
				title: "Test App",
				message: "Hello World"
			}, function(err, data){
				if(err)
					throw err;
				console.log("\n----------------\nfinal data:\n ", data);
			});
		}
	}
};