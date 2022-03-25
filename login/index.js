sessionStorage.url = '../../media/login';
window.sessionStorage.removeItem("no_kad_pengenalan");
window.sessionStorage.removeItem("FK_jenis_pengguna");
window.sessionStorage.removeItem("content");
document.getElementById("no_kad_pengenalan").focus();
var confirmed = false;

$("#login").on('submit', function (e) {
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let no_kad_pengenalan = $("#no_kad_pengenalan").val();
        let katalaluan = $("#katalaluan").val();
        
        var form = new FormData();
        form.append("no_kad_pengenalan", no_kad_pengenalan);
        form.append("katalaluan", katalaluan);
        var settings = {
            "url": host + "api_auth_asdcm/public/login",
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
                // Swal(result.message, result.data, "error");
                // return;
                swal({
                    title: "Log Masuk",
                    text: result.data,
                    type: "error",
                    closeOnConfirm: true,
                    allowOutsideClick: false,
                    html: false
                }).then(function(){
                    sessionStorage.token = result.token;
                    window.location.reload();      
                });
            } else  {
                // alert(result.data.PK);
                sessionStorage.id = result.data.PK;
                sessionStorage.token = result.data.token;
                sessionStorage.no_kad_pengenalan = result.data.no_kad_pengenalan;
                sessionStorage.nama = result.data.nama;
                sessionStorage.emel = result.data.emel;
                window.location.replace("../"); 
            }
        });
    }
});