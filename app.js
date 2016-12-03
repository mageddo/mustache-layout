var fs = require("fs"),
		util = require("util"),
		async = require("async"),
		mustache = require("mustache"),
		debugMode = process.env.debug === '1',
		log, err,
		systemOptions;

if(debugMode){
	log = function(){
		console.log.bind(console, util.format.apply(null, arguments))();
	};
}else{
	log = function(){};
}
err = function(){
	console.error.bind(console, util.format.apply(null, arguments))();
};

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
		log('loading %s', template);
		fs.exists(files.view, function(is){
			fs.readFile(files.view, function(err, data){
				if(err){
					data = util.format("Could not read the view %s, %s", files.view, err);
					log(data);
					log(err);
				}

				var strData = data.toString(), nested = {body: strData}, tasks = [];
				loadPartials(strData, nested, function(){ // when all series stack mounted
					if(template){
						log("compiling with layout and view...");
						render(template, rootData, nested);
					}else{
						log("compiling without layout and with view...");
						render(data.toString(), rootData, nested);
					}
				});

			});
		})
	}

	function loadFileContent(file, callback){
		fs.exists(file, function(fileExists){
			if(fileExists){
				fs.readFile(file, function(err, data){
					if(!err){
						callback(null, data.toString());
					}else{
						callback(err);
					}
				});
			}else{
				callback(util.format("'%s' not found", file));
			}
		});
	}

	function loadPartials(strData, partials, callback, fromPartial){
		var tasks = [];
		log("m=loadPartials, status=begin, fromPartial=%s", fromPartial);
		var partialsRegex = /{{\s*>\s*([\w\/\-_\$]+)\s*}}/g, r;
		var arr = [];
		while( (r  = partialsRegex.exec(strData)) != null ){
			log("m=loadPartials, status=executed, partialsName=%s", r[1]);
			tasks.push( 
				(function(partialsName){
					return function(cb){
						var viewToLoad = rootData[partialsName] || partialsName, path = getPath(viewToLoad);
						log("m=loadPartials, status=matched, partialsName=%s, view=%s, path=%s", partialsName, viewToLoad, path);
						loadFileContent(path, function(err, data){
							if(err){
								partials[partialsName] = err;
								log("m=loadPartials, status=err, err=%s", err);
								cb();
							}else{
								log("m=loadPartials, status=loading-new, data=%s", data);
								partials[partialsName] = data;

								loadPartials(data, partials, function(){
									log("m=cb, partialsName=%s", partialsName);
									cb(null, partialsName);
								}, partialsName);
							}
						});
					}
				})(r[1])
			);
		}

		tasks.push(function(cb){
			log('m=loadPartials, status=end');
			cb('end');
			callback();
		});
		async.series(tasks, function(err, results){
			log("m=loadPartials, status=process-serie, err=%s, results=%s", err, results);
		})
		log("m=loadPartials, status=success");
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
