// SERVER
// var host = "https://media.intan.my/api_asdcm/";

// SERVER
var host = "http://localhost/media/api_asdcm/";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
