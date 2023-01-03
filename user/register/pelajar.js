document.getElementById("no_kad_pengenalan_pelajar").value = window.sessionStorage.no_kad_pengenalan;

$("#registerpelajar").on('submit', function (e) {
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        $('#loading_modal').modal('show');
        let no_kad_pengenalan = $("#no_kad_pengenalan_pelajar").val();
        let nama = $("#nama_pelajar").val();
        let emel = $("#emel_pelajar").val();
        let notel = $("#notel_pelajar").val();
        let FK_jenis_pengguna = "3";
        let FK_gelaran = $("#FK_gelaran_pelajar").val();
        let katalaluan = $("#katalaluan").val();
        
        var form = new FormData();
        form.append("no_kad_pengenalan", no_kad_pengenalan);
        form.append("nama", nama);
        form.append("emel", emel);
        form.append("notel", notel);
        form.append("FK_jenis_pengguna", FK_jenis_pengguna);
        form.append("FK_gelaran", FK_gelaran);
        form.append("katalaluan", katalaluan);
        // formData.append("token",window.sessionStorage.token);
        var settingsregusers = {
            "url": host + "api_pentadbir/public/addUsers",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settingsregusers).done(function (response) {
            // console.log(response);
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }

            var settingsfetchusers = {
                "url": host + "api_pentadbir/public/users",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settingsfetchusers).done(function (response) {
                // console.log(response);
                result = JSON.parse(response);
                let FK_users = result.data.id_users;
                let nama_sekolah = $("#nama_sekolah_pelajar").val();
                // console.log(FK_users);
                // console.log(nama_sekolah);
                var formpelajar = new FormData();
                formpelajar.append("FK_users", FK_users);
                formpelajar.append("nama_sekolah", nama_sekolah);
                formpelajar.append("statusrekod", "1");

                var settingsreguserpelajars = {
                    "url": host + "api_pentadbir/public/addUserspelajars",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": formpelajar
                };                

                $.ajax(settingsreguserpelajars).done(function (response) {
                    // console.log(response);
                    result = JSON.parse(response);
                    $('#loading_modal').modal('hide');
                    if (!result.success) {
                        swal({
                            title: "Daftar Pengguna",
                            text: "Pendaftaran gagal! Sila cuba lagi.",
                            confirmButtonText: "OK",
                            closeOnConfirm: true,
                            allowOutsideClick: false,
                            html: false
                        }).then(function(){
                            window.location.replace("../login");
                        });
                    }
                    swal({
                        title: "Daftar Pengguna",
                        text: "Pendaftaran berjaya! Sila log masuk ke dalam sistem.",
                        confirmButtonText: "OK",
                        closeOnConfirm: true,
                        allowOutsideClick: false,
                        html: false
                    }).then(function(){
                        window.location.replace("../login");
                    });
                });
            });            
        });
    }
});

//Dropdown Gelaran List
var settings = {
    "url": host+"api_public/public/gelaransList",
    "method": "GET",
    "timeout": 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

    $.ajax(settings).done(function (response) {
        
        //LIST OPTION
        $('#FK_gelaran_pelajar').empty();
        $('#FK_gelaran_pelajar').append($('<option>', { 
            value: "",
            text : "Pilih Gelaran" 
        }));
        $.each(response.data, function (i, item) {
            $('#FK_gelaran_pelajar').append($('<option>', { 
                value: item.id_gelaran,
                text : item.nama_gelaran 
            }));
        });
        
    });
// END Dropdown Gelaran List