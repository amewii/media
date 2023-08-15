// SERVER
// var host = "https://admin.media.intan.my/api_asdcm/";

// LOCALHOST
//untuk panggkl API
var host = "http://localhost/media/api_asdcm/public/";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
