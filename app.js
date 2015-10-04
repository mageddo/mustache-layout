var debugMode = false;
var c = console.log;
module.exports = function(file, rootData, next){

	var that = this;
	console.log("file: ", file, "\n");
	console.log("rootData: ", rootData, "\n");
	console.log("next: ", next, "\n");
	console.log("arguments: ",arguments);
	console.log("this: ", this, "\n--------------------------------------\n\n");

	var files = {
		layout: null,
		view: null
	};

	if(rootData.layout !== false){
		if(rootData.layout){
			files.layout = getPath(rootData.layout);
		}else if(rootData.settings['view options'] && rootData.settings['view options'].layout){
			files.layout = getPath('layout');
		}
	}
	files.view = getPath(that.name);

	if(files.layout){
		fs.exists(files.layout, function(is){
			if(is){
				console.log("compilando com layout...");
				fs.readFile(files.layout, function(err, data){
					if(!err){
						loadFile(data.toString());
					}
				});
			}else{
				console.log("não existe arquivo de layout %s", files.layout);
				loadFile();
			}
		});
	}else{
		console.log("o uso de layout está desativado");
		loadFile();
	}

	function loadFile(template){
		fs.exists(files.view, function(is){
			fs.readFile(files.view, function(err, data){
				if(template){
					//console.log("baixou ", data.toString());
					console.log("compilando com layout e com view...");
					render(template, rootData, {body: data.toString()});
				}else{
					console.log("compilando sem layout e com view...");
					render(data.toString(), rootData);
				}
			});
		})
	}

	function getPath(view){
		return that.root + "/" + view + that.ext;
	}

	function render(templateHtml, options, partials){
		partials = partials || {};
		console.log("renderizando...\n", templateHtml, "\n---------------\n", options);
		try{
			next(null, mustache.to_html(templateHtml, options, partials));
		}catch(err){
			next(err);
		}
	}

}
module.exports.debug = function(debugMode){
	if(debugMode){
		console.log = function(){};
	}{
		console.log = c;
	}
}
module.exports.debug(debugMode);