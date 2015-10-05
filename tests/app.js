var render = require("./../app.js");
var tests = [
	require("./mustacheLayoutTest")(render)
];

for(var k in tests){
	for(var l in tests[k]){
		try{
			console.log("testando: %s", l);
			tests[k][l]();
		}catch(e){
			console.log("erro: ", e);
		}
	}
}