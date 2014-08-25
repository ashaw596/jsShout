function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

//read in URL tag values
var urlTags=getUrlVars();
//var name=urlTags["name"];
var gameType=urlTags["type"];
var gameID=urlTags["gameID"];

var game = new Game(gameType, gameID);