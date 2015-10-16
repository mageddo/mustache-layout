var render = require("./../app.js");
var tests = [
	//require("./mustacheLayoutTest")(render),
	require("./mustacheLayoutComEscapeTest")(render)
];

for(var k in tests){
	for(var l in tests[k]){
		try{
			console.log("testing: %s", l);
			tests[k][l]();
		}catch(e){
			console.log("error: ", e);
		}
	}
}