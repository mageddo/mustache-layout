var fs = require("fs"),
		mustache = require("mustache"),
		debugMode = false,
		log;
module.exports = function(file, rootData, next){

	var that = this;
	log("file: ", file, "\n");
	log("rootData: ", rootData, "\n");
	log("next: ", next, "\n");
	log("arguments: ",arguments);
	log("this: ", this, "\n--------------------------------------\n\n");

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
				log("compilando com layout...");
				fs.readFile(files.layout, function(err, data){
					if(!err){
						loadFile(data.toString());
					}
				});
			}else{
				log("não existe arquivo de layout %s", files.layout);
				loadFile();
			}
		});
	}else{
		log("o uso de layout está desativado");
		loadFile();
	}

	function loadFile(template){
		fs.exists(files.view, function(is){
			fs.readFile(files.view, function(err, data){
				if(template){
					//log("baixou ", data.toString());
					log("compilando com layout e com view...");
					render(template, rootData, {body: data.toString()});
				}else{
					log("compilando sem layout e com view...");
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
		log("renderizando...\n", templateHtml, "\n---------------\n", options);
		try{
			var html;
			if(options.compile === false){
				var replaceMustache = /\{\{[\ ]*>[\ ]*body[\ ]*\}\}/, keyReplace = "tmpBodyHightTest";
				html = templateHtml.replace(replaceMustache, keyReplace);
				html = mustache.to_html(html, options);
				html = html.replace(keyReplace, partials.body);
			}else{
				html = mustache.to_html(templateHtml, options, partials);
			}
			next(null, html);
		}catch(err){
			next(err);
		}
	}

}
module.exports.debug = function(debugMode){
	if(debugMode){
		log = console.log;
	}else{
		log = function(){};
	}
}
module.exports.debug(debugMode);