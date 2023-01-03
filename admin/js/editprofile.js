$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal('show');
    kampusList();
    klusterList();
    subklusterList();
    unitList();
    skimList();
    gredList();
    users_info(window.sessionStorage.id,function(){
  	    if ((result.data.users_intan) == 1)   {
            $('#displayjawatan').text(result.data.nama_kluster + ", " + result.data.nama_subkluster + ", " + result.data.nama_unit);
        } else  {
            $('#displayjawatan').text(result.data.nama_kementerian + ", " + result.data.nama_agensi + ", " + result.data.nama_bahagian);
        }
        $('#displayno_kad_pengenalan').val(result.data.no_kad_pengenalan);
        $('#displayemel').val(result.data.emel);
        $('#displaytarikhlahir').val(result.data.tarikh_lahir);
        $('#notel').val(result.data.notel);
        $('#displaynamamk').val(result.data.nama_mk);
        $('#displaynotelmk').val(result.data.notel_mk);
        $('#FK_jenis_pengguna').val(result.data.FK_jenis_pengguna);
        $('#id_users').val(result.data.id_users);
        if (result.data.id_usersgov != 'undefined')   {
            $('#divKerajaan').removeClass('hidden');
            $('#id_usersgov').val(result.data.id_usersgov);
            $('#emel_kerajaan').val(result.data.emel_kerajaan);
            $('#notel_kerajaan').val(result.data.notel_kerajaan);
            $('#nama_jawatan').val(result.data.nama_jawatan);
            $('#kategori_perkhidmatan').val(result.data.nama_kategoriperkhidmatan);
            $('#skim').val(result.data.skim);
            $('#gred').val(result.data.gred);
            $('#users_intan').val(result.data.users_intan);
            $('#usersluar').removeClass('hidden');
            $('#FK_kementerian').val(result.data.id_kementerian);
            $('#FK_agensi').val(result.data.id_agensi);
            $('#FK_bahagian').val(result.data.id_bahagian);
            //     if (result.data.users_intan == 1)   {
            //     $('#usersintan').removeClass('hidden');
            //     $('#FK_kampus').val(result.data.id_kampus);
            //     $('#FK_kluster').val(result.data.id_kluster);
            //     $('#FK_subkluster').val(result.data.id_subkluster);
            //     $('#FK_unit').val(result.data.id_unit);
            // } else {
            //     $('#FK_ila').val(result.data.id_ilawam);
            //     $('#alamat1_pejabat').val(result.data.alamat1_pejabat);
            //     $('#alamat2_pejabat').val(result.data.alamat2_pejabat);
            //     $('#poskod_pejabat').val(result.data.poskod_pejabat);
            //     $('#daerah_pejabat').val(result.data.daerah_pejabat);
            //     $('#negeri_pejabat').val(result.data.negeri_pejabat);
            // }
        } else if (result.data.usersswasta != 'undefined')  {
            $('#divSwasta').removeClass('hidden');
            $('#id_usersswasta').val(result.data.id_usersswasta);
            $('#nama_majikan').val(result.data.nama_majikan);
            $('#jawatan').val(result.data.jawatan);
        } else if (result.data.userspelajar != 'undefined')  {
            $('#divPelajar').removeClass('hidden');
            $('#id_userspelajar').val(result.data.id_userspelajar);
            $('#nama_sekolah').val(result.data.nama_sekolah);
        }
    });
    $("#loading_modal").modal('hide');
});
var confirmed = false;
$("#update").on('submit', function (e) {
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let id_users = $("#id_users").val();
        let emel = $("#displayemel").val();
        let notel = $("#notel").val();
        // let katalaluan = $("#katalaluan").val();

        var form = new FormData();
        // formData.append("key","mSideDiary");
        form.append("id_users", id_users);
        form.append("emel", emel);
        form.append("notel", notel);
        form.append("updated_by",window.sessionStorage.id);
        // form.append("katalaluan", katalaluan);
        // formData.append("token",window.sessionStorage.token);
        var settingseditprofileusers = {
            "url": host + "api_pentadbir/public/usersEditProfile",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "contentType": false,
            "data": form
        };
        $.ajax(settingseditprofileusers).done(function (response) {
            if (response.success == false) {
                // swal(response.message, response.data, "error");
                return;
            }
        });        

        if($("#FK_jenis_pengguna").val() == 1)  {
            let id_usersgov = $("#id_usersgov").val();
            let nama_jawatan = $("#nama_jawatan").val();
            let emel_kerajaan = $("#emel_kerajaan").val();
            let notel_kerajaan = $("#notel_kerajaan").val();
            let skim = $("#skim").val();
            let gred = $("#gred").val();
            let FK_kampus = $('#FK_kampus').val();
            let FK_kluster = $('#FK_kluster').val();
            let FK_subkluster = $('#FK_subkluster').val();
            let FK_unit = $('#FK_unit').val();
            let FK_kementerian = $('#FK_kementerian').val();
            let FK_agensi = $('#FK_agensi').val();
            let FK_bahagian = $('#FK_bahagian').val();
            let FK_ila = $('#FK_ila').val();
            let bahagian = $('#bahagian').val();
            let alamat1_pejabat = $('#alamat1_pejabat').val();
            let alamat2_pejabat = $('#alamat2_pejabat').val();
            let poskod_pejabat = $('#poskod_pejabat').val();
            let daerah_pejabat = $('#daerah_pejabat').val();
            let negeri_pejabat = $('#negeri_pejabat').val();
            
            var formgov = new FormData();
            formgov.append("id_usersgov", id_usersgov);
            formgov.append("nama_jawatan", nama_jawatan);
            formgov.append("emel_kerajaan", emel_kerajaan);
            formgov.append("notel_kerajaan", notel_kerajaan);
            formgov.append("skim", skim);
            formgov.append("gred", gred);
            formgov.append("FK_kampus", FK_kampus);
            formgov.append("FK_kluster", FK_kluster);
            formgov.append("FK_subkluster", FK_subkluster);
            formgov.append("FK_unit", FK_unit);
            formgov.append("FK_kementerian", FK_kementerian);
            formgov.append("FK_agensi", FK_agensi);
            formgov.append("FK_bahagian", FK_bahagian);
            formgov.append("FK_ila", FK_ila);
            formgov.append("bahagian", bahagian);
            formgov.append("alamat1_pejabat", alamat1_pejabat);
            formgov.append("alamat2_pejabat", alamat2_pejabat);
            formgov.append("poskod_pejabat", poskod_pejabat);
            formgov.append("daerah_pejabat", daerah_pejabat);
            formgov.append("negeri_pejabat", negeri_pejabat);
            formgov.append("statusrekod", "1");
            form.append("updated_by",window.sessionStorage.id);

            var settingseditprofileusersgovs = {
                "url": host + "api_pentadbir/public/usersgovsEditProfile",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": formgov
            };

            $.ajax(settingseditprofileusersgovs).done(function (response) {
                if (response.success == false) {
                    // swal(response.message, response.data, "error");
                    return;
                }
                swal({
                    title: "Edit Profile",
                    text: "Berjaya Kemaskini Profile!",
                    type: "success",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    html: false,
                    timer: 1000
                }).then(function(){},
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            window.location.reload();
                        }
                    }
                );
            }); 
        }
    }
});

function users_info(id,returnValue){
    var settings = {
        "url": host + "api_pentadbir/public/usersEditProfile/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        result = response;
        if(result.success){ 
            // console.log(response.data)
            returnValue();
        }
        else{
            swal(response.message,"Tiada Data",'warning');
        }
    });
}

$("#ubahkatalaluan").click(function () {
    $('#step-3').removeClass('hidden');
    $('#divubahkatalaluan').addClass('hidden');
});
$("#tutupubahkatalaluan").click(function () {    
    $('#step-3').addClass('hidden');
});

function kampusList()   {
    //Dropdown Kampus List
    var settings = {
        "url": host+"api_public/public/kampusList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#FK_kampus').empty();
            $('#FK_kampus').append($('<option>', { 
                value: "",
                text : "Pilih Kampus" 
            }));
            $.each(response.data, function (i, item) {
                $('#FK_kampus').append($('<option>', { 
                    value: item.id_kampus,
                    text : item.nama_kampus
                }));
            });
    
            //LIST OPTION UPDATE
            $('#upt_FK_kampus').empty();
            $('#upt_FK_kampus').append($('<option>', { 
                value: "",
                text : "Pilih Kluster" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_FK_kampus').append($('<option>', { 
                    value: item.id_kampus,
                    text : item.nama_kampus 
                }));
            });
            
        });
    // END Dropdown Kampus List
}

function ezxsKampus(id_kampus)  {
    //Dropdown Kluster List
    var form = new FormData();
    form.append("id_kampus",id_kampus);
    var settings = {
        "url": host+"api_public/public/kampus",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
    };    

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        result = JSON.parse(response);
        $('#FK_kampus_add').empty();
        $.each(result.data, function (i, item) {
            $('#FK_kampus_add').append($('<option>', { 
                value: item.id_kampus,
                text : item.nama_kampus
            }));
        });
        
    });
    // END Dropdown Kampus List
}

function klusterList()  {
    //Dropdown Kluster List
        var settings = {
            "url": host+"api_public/public/klustersList",
            "method": "GET",
            "timeout": 0,
            // "header":{
            //     "Authentication": "ASDCM"+window.sessionStorage.token
            //   }
        };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#FK_kluster').empty();
            $('#FK_kluster').append($('<option>', { 
                value: "",
                text : "Pilih Kluster" 
            }));
            $.each(response.data, function (i, item) {
                $('#FK_kluster').append($('<option>', { 
                    value: item.id_kluster,
                    text : item.nama_kluster 
                }));
            });
    
            //LIST OPTION UPDATE
            $('#upt_FK_kluster').empty();
            $('#upt_FK_kluster').append($('<option>', { 
                value: "",
                text : "Pilih Kluster" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_FK_kluster').append($('<option>', { 
                    value: item.id_kluster,
                    text : item.nama_kluster 
                }));
            });
            
        });
    // END Dropdown Kluster List
}

function ezxsKluster(id_kluster)    {
    //Dropdown Kluster List
    var form = new FormData();
    form.append("id_kluster",id_kluster);
    var settings = {
        "url": host+"api_public/public/klusters",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
    };    

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        result = JSON.parse(response)
        $('#FK_kluster_add').empty();
        $.each(result.data, function (i, item) {
            $('#FK_kluster_add').append($('<option>', { 
                value: item.id_kluster,
                text : item.nama_kluster 
            }));
            ezxsKampus(item.FK_kampus);
        });
        
    });
    // END Dropdown Kluster List
}

function subklusterList()   {
    //Dropdown Subkluster List
    var settings = {
        "url": host+"api_public/public/subklustersList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#FK_subkluster').empty();
            $('#FK_subkluster').append($('<option>', { 
                value: "",
                text : "Pilih Subkluster" 
            }));
            $.each(response.data, function (i, item) {
                $('#FK_subkluster').append($('<option>', { 
                    value: item.id_subkluster,
                    text : item.nama_subkluster 
                }));
            });
    
            //LIST OPTION UPDATE
            $('#upt_FK_subkluster').empty();
            $('#upt_FK_subkluster').append($('<option>', { 
                value: "",
                text : "Pilih Subkluster" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_FK_subkluster').append($('<option>', { 
                    value: item.id_subkluster,
                    text : item.nama_subkluster 
                }));
            });
            
        });
    // END Dropdown Subkluster List
}

function ezxsSubKluster(id_subkluster)  {
    //Dropdown Subkluster List
    var form = new FormData();
    form.append("id_subkluster",id_subkluster);
    var settings = {
        "url": host+"api_public/public/subklusters",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
    };
    $.ajax(settings).done(function (response) {
        //LIST OPTION
        result = JSON.parse(response)
        $('#FK_subkluster_add').empty();
        $.each(result.data, function (i, item) {
            $('#FK_subkluster_add').append($('<option>', { 
                value: item.id_subkluster,
                text : item.nama_subkluster 
            }));
            ezxsKluster(item.FK_kluster);
        });
        
    });
    // END Dropdown Subkluster List
}

function unitList() {
    //Dropdown Unit List
    var settings = {
        "url": host+"api_public/public/unitsList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#FK_unit').empty();
            $('#FK_unit').append($('<option>', { 
                value: "",
                text : "Pilih Unit" 
            }));
            $.each(response.data, function (i, item) {
                $('#FK_unit').append($('<option>', { 
                    value: item.id_unit,
                    text : item.nama_unit 
                }));
            });
    
            //LIST OPTION UPDATE
            $('#upt_FK_unit').empty();
            $('#upt_FK_unit').append($('<option>', { 
                value: "",
                text : "Pilih Unit" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_FK_unit').append($('<option>', { 
                    value: item.id_unit,
                    text : item.nama_unit 
                }));
            });
            
        });
    // END Dropdown Unit List
}

function skimList() {
    //Dropdown Skim List
    var settings = {
        "url": host+"api_pentadbir/public/skimsList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#skim').empty();
            $('#skim').append($('<option>', { 
                value: "",
                text : "Pilih Skim" 
            }));
            $.each(response.data, function (i, item) {
                $('#skim').append($('<option>', { 
                    value: item.id_skim,
                    text : item.kod_skim + " - " + item.nama_skim 
                }));
            });
            
        });
    // END Dropdown Skim List
}

function gredList() {
    //Dropdown Gred List
    var settings = {
        "url": host+"api_pentadbir/public/gredsList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#gred').empty();
            $('#gred').append($('<option>', { 
                value: "",
                text : "Pilih Gred" 
            }));
            $.each(response.data, function (i, item) {
                $('#gred').append($('<option>', { 
                    value: item.id_gred,
                    text : item.nama_gred 
                }));
            });
            
        });
    // END Dropdown Gred List
}