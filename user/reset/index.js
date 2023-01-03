const queryString = window.location.search;
if (queryString != '')  {
    const urlParams = new URLSearchParams(queryString);
    const temp = urlParams.get('temp');
    var settings = {
        "url": host+"api_pentadbir/public/usersResetKatalaluan/" + temp,
        "method": "GET",
        "timeout": 0
    };
    $.ajax(settings).done(function (response) {
        $("#no_kad_pengenalan_final").val(response.data.no_kad_pengenalan);
        if (typeof response.data.no_kad_pengenalan !== 'undefined')  {
            $("#checkic").hide();
            $("#backtologin").hide();
            $("#checkic3").show();
        } else  {
            swal({
                title: "Lupa Katalaluan",
                text: "",
                type: "error",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: "Pautan ini telah luput."
            }).then(function(){
                window.location.replace('../login');
            });
        }
    });
    // console.log(temp);    
}
var confirmed = false;
document.getElementById("no_kad_pengenalan_semak").focus();
if ((typeof window.sessionStorage.no_kad_pengenalan !== 'undefined')) {
    $("#checkic").hide();
    $("#checkic2").show();
    $("#no_kad_pengenalan_daftar").val(window.sessionStorage.no_kad_pengenalan);
}

if ((typeof window.sessionStorage.no_kad_pengenalan !== 'undefined') && typeof window.sessionStorage.emel !== 'undefined') {
    $("#checkic").hide();
    $("#checkic2").hide();
    $("#checkic3").show();
    $("#no_kad_pengenalan_final").val(window.sessionStorage.no_kad_pengenalan);
    $("#emel_final").val(window.sessionStorage.emel);
}

$("#checkusers").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let no_kad_pengenalan = $("#no_kad_pengenalan_semak").val();

        var form = new FormData();
        form.append("no_kad_pengenalan",no_kad_pengenalan);
        form.append("masa",new Date());
        form.append("landing_page","/reset");
        // console.log(nama_user)
        var settings = {
            "url": host+"api_pentadbir/public/usersResetToEmail",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            result = JSON.parse(response);
            // console.log(result);
            if (!result.success) {            
                swal({
                    title: "Lupa Katalaluan",
                    text: "No Kad Pengenalan " + no_kad_pengenalan + " tidak berdaftar di dalam sistem.",
                    type: "success",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: false
                }).then(function(){
                    window.location.replace('../');
                });
            } else  {    
                swal({
                    title: "Lupa Katalaluan",
                    text: "",
                    type: "success",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: result.message
                }).then(function(){
                    sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
                    window.location.replace('../login');
                });
            }
        });
    }
});

$("#checkusers2").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let no_kad_pengenalan = $("#no_kad_pengenalan_daftar").val();
        let emel = $("#emel_semak").val();

        var form = new FormData();
        form.append("no_kad_pengenalan",no_kad_pengenalan);
        form.append("emel",emel);

        // console.log(nama_user)
        var settings = {
            "url": host+"api_pentadbir/public/usersIcEmel",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            result = JSON.parse(response);
            // console.log(result);
            if (!result.success) {            
                swal({
                    title: "Lupa Katalaluan",
                    text: "Rekod tidak sah.",
                    type: "error",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: false
                }).then(function(){
                    sessionStorage.token = result.token;
                    window.location.reload();
                });
            } else  {    
                swal({
                    title: "Lupa Katalaluan",
                    text: "Sila Masukkan Katalaluan Baharu",
                    type: "success",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: false
                }).then(function(){
                    sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
                    sessionStorage.emel = emel;
                    window.location.reload();   
                });
            }
        });
    }
});

$("#ckatalaluan").blur(function(){
    if ($('#katalaluan').val() !== $('#ckatalaluan').val()) {
        alert("Katalaluan tidak sepadan.");
    } else  {
        $('#hantar').prop('disabled', false);
    }
});

$("#checkusers3").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let no_kad_pengenalan = $("#no_kad_pengenalan_final").val();
        let katalaluan = $("#katalaluan").val();

        var form = new FormData();
        form.append("no_kad_pengenalan",no_kad_pengenalan);
        form.append("katalaluan",katalaluan);

        // console.log(nama_user)
        var settings = {
            "url": host+"api_pentadbir/public/usersReset",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };
        console.log(settings);

        $.ajax(settings).done(function (response) {
            // console.log(response);
            result = JSON.parse(response);
            // console.log(result);
            if (!result.success) {            
                swal({
                    title: "Lupa Katalaluan",
                    text: "Gagal.",
                    type: "error",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: false
                }).then(function(){
                    sessionStorage.token = result.token;
                    window.location.reload();
                });
            } else  {    
                swal({
                    title: "Lupa Katalaluan",
                    text: "Katalaluan telah disetsemula. Sila log masuk menggunakan katalaluan baharu.",
                    type: "success",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: false
                }).then(function(){
                    window.sessionStorage.removeItem("no_kad_pengenalan");
                    window.sessionStorage.removeItem("emel");
                    window.location.replace('../login');   
                });
            }
        });
    }
});