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
		layoutViewDisableCompileTest: function(){

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
				message: "Hello World",
				compile: false
			}, function(err, data){
				if(err)
					throw err;
				console.log("\n----------------\nfinal data [layoutViewDisableCompileTest]:\n ", data);
			});
		},
		layoutViewDisableEscapeTemplatesTest: function(){
			myName = arguments.callee.name;
			render.call({
				name: "index",
				root: __dirname + "/view",
				ext: ".html"
			}, __dirname + '/view/index.html', {
				settings: {
					'view options': {
						layout: true,
						escapeTemplate: false
					}
				},
				title: "Test App",
				message: "Hello World"
			}, function(err, data){
				if(err)
					throw err;
				console.log("\n----------------\nfinal data [layoutViewEscapeTemplatesTest]:\n ", data);
			});
		}
	}
};