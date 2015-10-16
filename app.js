var fs = require("fs"),
		mustache = require("mustache"),
		debugMode = process.argv.slice(2)[0] === 'debug',
		log,
		systemOptions;

module.exports = function(file, rootData, next){

	var that = this;
	systemOptions = rootData.settings['view options'];
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
		}else if(systemOptions.layout){
			files.layout = getPath('layout');
		}
	}
	files.view = getPath(that.name);

	if(files.layout){
		fs.exists(files.layout, function(is){
			if(is){
				log("layout exists...");
				fs.readFile(files.layout, function(err, data){
					if(!err){
						loadFile(data.toString());
					}
				});
			}else{
				log("layout file do not exists: %s", files.layout);
				loadFile();
			}
		});
	}else{
		log("layout use it is disabled");
		loadFile();
	}

	function loadFile(template){
		fs.exists(files.view, function(is){
			fs.readFile(files.view, function(err, data){
				if(template){
					log("compiling with layout and view...");
					render(template, rootData, {body: data.toString()});
				}else{
					log("compiling without layout and with view...");
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
		log("rendering...\n", templateHtml, "\n---------------\n", options);
		try{
			var html;
			// compile  partials (layout need to be true)
			// @deprecated
			if(options.compile === false){
				var replaceMustache = /\{\{[\ ]*>[\ ]*body[\ ]*\}\}/, keyReplace = "tmpBodyHightTest";
				html = templateHtml.replace(replaceMustache, keyReplace);
				html = mustache.to_html(html, options);
				html = html.replace(keyReplace, partials.body);
				next(null, html);
			}else{
				if(systemOptions.escapeTemplate === false){
					log("template not scaped");
					html = mustache.to_html(templateHtml, options, partials);
					next(null, html);
				}else{
					var originalTemplates = getMustacheTemplates(partials.body || templateHtml);
					html = mustache.to_html(templateHtml, options, partials);
					var modifiedTemplates = getMustacheTemplates(html);
					html = recoverTemplates(originalTemplates, modifiedTemplates, html);
					log("template escaped");
					log(
						"original template", originalTemplates, "\n\n  modified template", modifiedTemplates,
						"\n\nhtml done! ", html
					);
			    next(null, html);
				}
			}
			
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

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}
function getMustacheTemplates(html){
    var templates = [], finalTemplate = "</script>";
    for(var index = search(html, index); index != -1; index = search(html, index)){
        //console.log("antes", index);
        var lastSearched = html.indexOf(finalTemplate, index) + finalTemplate.length;
        templates.push(html.substring(index, lastSearched));
        index = lastSearched;
        //console.log("depois %s, total %s", index, html.length);
    }
    return templates;
    //console.log(templates);
}
function recoverTemplates(templates, templatesToFind, html){
    for(var i=0; i < templates.length; i++){
        html = html.replace(templatesToFind[i], templates[i]);
    }
    return html;
}
function search(html, index){
    return html.regexIndexOf(/<script[\ ]+type="text\/template/mg, index);
}


module.exports.debug(debugMode);
