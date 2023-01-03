var confirmed = false;
$(function(){
    $.ajaxSetup ({
        cache: false
    });    
});
if (window.sessionStorage.FK_jenis_pengguna == '1')    {
    window.sessionStorage.content = "kerajaan";
    $('#content').load('kerajaan.html');
} else if (window.sessionStorage.FK_jenis_pengguna == '2')    {
    window.sessionStorage.content = "swasta";
    $('#content').load('swasta.html');
} else if (window.sessionStorage.FK_jenis_pengguna == '3')    {
    window.sessionStorage.content = "pelajar";
    $('#content').load('pelajar.html');
}

document.getElementById("no_kad_pengenalan_semak").focus();
if ((typeof window.sessionStorage.no_kad_pengenalan !== 'undefined') && typeof window.sessionStorage.FK_jenis_pengguna == 'undefined') {
    $("#checkic").hide();
    $("#checkic2").show();
    document.getElementById("FK_jenis_pengguna").focus();
    document.getElementById("no_kad_pengenalan_daftar").value = window.sessionStorage.no_kad_pengenalan;
}

if ((typeof window.sessionStorage.no_kad_pengenalan !== 'undefined') && typeof window.sessionStorage.FK_jenis_pengguna !== 'undefined') {
    $("#checkic2").hide();
    $("#aftercheckic").show();
}

$("#checkusers").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let no_kad_pengenalan = $("#no_kad_pengenalan_semak").val();
        check_users(no_kad_pengenalan,function(){
            if(obj_users.success){
                result = JSON.parse(response);
                // console.log(result);
                if (!result.success) {
                    swal({
                        title: "Semak Pengguna",
                        text: "Sila Masukkan Kategori Pengguna",
                        type: "success",
                        closeOnConfirm: true,
                        allowOutsideClick: false,
                        html: false
                    }).then(function(){
                        // sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
                        // window.location.reload();   
                    });
                } else  {                
                    swal({
                        title: "Semak Pengguna",
                        text: "No Kad Pengenalan " + no_kad_pengenalan + " telah berdaftar di dalam sistem.",
                        type: "success",
                        closeOnConfirm: true,
                        allowOutsideClick: false,
                        html: false
                    }).then(function(){
                        sessionStorage.token = result.token;
                        window.location.replace("../login");      
                    });
                }
            }
            else{
                window.sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
                $('#content').load('kerajaan.html');
            }
        });
    }
});

$('#no_kad_pengenalan_daftar').change(function(){
    let no_kad_pengenalan = $('#no_kad_pengenalan_daftar').val();
    $("#btn_daftar").prop('disabled',true);
    $("#icon_daftar").prop('class','fa fa-cog fa-spin');
    $('#divFK_jenis_pengguna').prop('style','display:none');

    if(no_kad_pengenalan != ""){
        check_users(no_kad_pengenalan,function(){
            if(obj_users.success){ // dah daftar
                swal({
                    title: "Semak Pengguna",
                    text: "No Kad Pengenalan " + no_kad_pengenalan + " telah berdaftar di dalam sistem.",
                    type: "warning",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: false
                }).then(function(){
                    // sessionStorage.token = result.token;
                    window.location.replace("../login");      
                });
            }
            else{
                check_hrmis(no_kad_pengenalan,function(){
                    if(obj_hrmis == 2){ //check hrmis
                        $('#divFK_jenis_pengguna').prop('style','');
                        $("#btn_daftar").prop('disabled',false);
                        $("#btn_daftar").html('<i id="icon_daftar" class="fa fa-plus"></i> Daftar');
                        $('#FK_jenis_pengguna').val("");
                        window.sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
                    }
                    else{
                        $('#divFK_jenis_pengguna').prop('style','');
                        $('#FK_jenis_pengguna').val(1);
                        $('#FK_jenis_pengguna').attr("style", "pointer-events: none;");
                        $("#btn_daftar").prop('disabled',false);
                        $("#btn_daftar").html('<i id="icon_daftar" class="fa fa-plus"></i> Daftar');
                        // $("#icon_daftar").prop('class','fa fa-plus');
                        window.sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
                        window.sessionStorage.FK_jenis_pengguna = '1';
                        window.location.reload();
                    }
                });
            }
        });
    }
    else{
        $("#btn_daftar").prop('disabled',true);
        $("#icon_daftar").prop('class','fa fa-plus');

    }
});

$("#checkusers2").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let FK_jenis_pengguna = $("#FK_jenis_pengguna").val();
        let FK_jenis_pengguna_text = $("#FK_jenis_pengguna").text();
        swal({
            title: "Daftar Pengguna",
            text: "Sila lengkapkan butiran pendaftaran.",
            type: "question",
            confirmButtonText: "Teruskan",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            sessionStorage.FK_jenis_pengguna = FK_jenis_pengguna;
            window.location.reload();
        });
    }
});

//Dropdown Jenis Pengguna List
var settings = {
    "url": host+"api_pentadbir/public/jenispenggunasList",
    "method": "GET",
    "timeout": 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#FK_jenis_pengguna').empty();
        $('#FK_jenis_pengguna').append($('<option>', { 
            value: "",
            text : "Pilih Kategori Pengguna" 
        }));
        $.each(response.data, function (i, item) {
            $('#FK_jenis_pengguna').append($('<option>', { 
                value: item.id_jenispengguna,
                text : item.jenis_pengguna 
            }));
        });
        
    });
// END Dropdown Jenis Pengguna List

function check_users(noic,returnValue){
    var form = new FormData();
    form.append("no_kad_pengenalan",noic);

    var settings = {
        "url": host+"api_pentadbir/public/users",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };
    $.ajax(settings).done(function (response) {
        obj_users = JSON.parse(response);
        returnValue();
        
    }); 
}

function check_usersIntan(noic,returnValue){
    $.ajax({
//        "url": "http://localhost/user/register/"+noic+".json",
        "url": "https://admin.dtims.intan.my/api/ezxs/check/"+noic,
        "method": "GET",
        "timeout": 0,
    
        success: function(response) {
            obj_usersIntan = response.posts;
        returnValue();
    },
        error: function(){
            obj_usersIntan = false;
        returnValue();
    }
    });
}

function check_hrmis(noic,returnValue){
    $.ajax({
        "url": " https://admin.dtims.intan.my/api/hrmis/check/"+noic,
        // "url": "http://10.1.3.152/ezxs_webservice/index.php?ic="+noic,
        "method": "GET",
        "timeout": 0,
        success: function(response){
            obj_hrmis = JSON.parse(response);
            returnValue();
        },
        error: function(){
            obj_hrmis = 2;
        returnValue();
    }
    });
}