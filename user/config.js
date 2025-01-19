// SERVER
// var host = "https://media.intan.my/api_asdcm/";

// SERVER
// var host = "http://localhost/media/api_asdcm/";
if(window.location.hostname == "10.1.3.36"){
    var host = window.location.protocol+"//"+window.location.hostname+"/api_asdcm/public/";
} else if(window.location.hostname == "media.intan.my"){
    var host = window.location.protocol+"//"+window.location.hostname+"/user/api_asdcm/public/";
} else if(window.location.hostname == "www.ctmg.intan.my" || window.location.hostname == "10.1.3.92"){
    var host = window.location.protocol+"//"+window.location.hostname+"/media/user/api_asdcm/public/";
}
else if(window.location.port == "8081"){
    var host = window.location.protocol+"//"+window.location.hostname+":8081/media/user/api_asdcm/public/";
} else {
    var host = window.location.protocol+"//"+window.location.hostname+"/media/user/api_asdcm/public/";
}

var id_users_master, nama_master, emel_master, emel_kerajaan_master, notel_master, notel_kerajaan_master, FK_jenis_pengguna_master, id_usersgov_master, nama_jawatan_master, id_usersswasta_master;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function users(returnValue){
  var obj = new get(host+`usersGetIc/`+window.sessionStorage.no_kad_pengenalan,window.sessionStorage.token).execute();
  console.log(obj);
  objUsers = obj
  if(objUsers.success){
    var data = objUsers.data;
    $(".text_nama").html(data.nama);
    id_users_master = data.id_users
    nama_master = data.nama;
    emel_master = data.emel;
    id_usersgov_master = data.detail_pengguna.id_usersgov;
    id_usersswasta_master = data.detail_pengguna.id_usersswasta;
    FK_jenis_pengguna_master = data.FK_jenis_pengguna;
    switch(FK_jenis_pengguna_master){
        case 1: nama_jawatan = data.detail_pengguna.nama_jawatan; break;
        case 1: nama_jawatan = data.detail_pengguna.jawatan; break;
        case 1: nama_jawatan = ""; break;
    }
    nama_jawatan_master = nama_jawatan;
    emel_kerajaan_master = data.detail_pengguna.emel_kerajaan;
    notel_kerajaan_master = data.detail_pengguna.notel_kerajaan;
    returnValue();
  } else {
    // window.location.replace('login/');
  }
}