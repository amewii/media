// SERVER
// var host = "https://admin.media.intan.my/api_asdcm/";

// LOCALHOST
//untuk panggkl API
// var host = "http://localhost/media/api_asdcm/public/";

if(window.location.hostname == "10.1.3.36"){
    var host = window.location.protocol+"//admin.media.intan.my/user/api_asdcm/public/";
} else if(window.location.hostname == "admin.media.intan.my"){
    var host = window.location.protocol+"//admin.media.intan.my/user/api_asdcm/public/";
}
else if(window.location.port == "8081"){
    var host = window.location.protocol+"//"+window.location.hostname+":8081/media/user/api_asdcm/public/";
} else {
    let port = window.location.port ? ":" + window.location.port : ''
    var host = window.location.protocol + "//" + window.location.hostname + port + "/media/user/api_asdcm/public/";
}

var id_users_master, nama_master, FK_capaian_master, nama_peranan_master, listsubmodule_master = [], FK_peranan_master, FK_kluster_master;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
