document.getElementById("no_kad_pengenalan").value = window.sessionStorage.no_kad_pengenalan;

$(function(){
    $.ajaxSetup ({
        cache: false
    });
    kampusList();
    klusterList();
    subklusterList();
    unitList();
    gelaranList();
    skimList();
    gredList();
    kategoriperkhidmatanList();
    kementerianList();
    agensiList();
    bahagianList();
    ilaList();
});

$("#registergov").on('submit', function (e) {
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let nama = $("#nama").val();
        let emel = $("#emel").val();
        let no_kad_pengenalan = $("#no_kad_pengenalan").val();
        let katalaluan = $("#katalaluan").val();
        let notel = $("#notel").val();
        let FK_jenis_pengguna = "1";
        let FK_gelaran = $("#FK_gelaran").val();
        // let ucreate = window.sessionStorage.noanggota;
        // var param = {
        //     twmTitle: no_kad_pengenalan,
        //     twmDescription: nama,
        //     a: FK_jantina,
        //     b: emel,
        //     c: tarikh_lahir,
        // }
        // console.log(param)
        var form = new FormData();
        // formData.append("key","mSideDiary");
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
                let emel_kerajaan = $("#emel_kerajaan").val();
                let notel_kerajaan = $("#notel_kerajaan").val();
                let nama_jawatan = $("#nama_jawatan").val();
                let kategori_perkhidmatan = $("#kategori_perkhidmatan").val();
                let skim = $("#skim").val();
                let gred = $("#gred").val();
                let users_intan = $('#users_intan').val();
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
                formgov.append("FK_users", FK_users);
                formgov.append("emel_kerajaan", emel_kerajaan);
                formgov.append("notel_kerajaan", notel_kerajaan);
                formgov.append("nama_jawatan", nama_jawatan);
                formgov.append("kategori_perkhidmatan", kategori_perkhidmatan);
                formgov.append("skim", skim);
                formgov.append("gred", gred);
                formgov.append("users_intan", users_intan);
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

                var settingsregusersgovs = {
                    "url": host + "api_pentadbir/public/addUsersgovs",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": formgov
                };

                $.ajax(settingsregusersgovs).done(function (response) {
                    // console.log(response);
                    result = JSON.parse(response);
                    swal({
                        title: "Daftar Pengguna",
                        text: "Pendaftaran berjaya! Sila log masuk ke dalam sistem.",
                        confirmButtonText: "OK",
                        closeOnConfirm: true,
                        allowOutsideClick: false,
                        html: false
                    }).then(function(){
                        
                        // sessionStorage.token = result.token;
                        // sessionStorage.no_kad_pengenalan = result.no_kad_pengenalan;
                        window.location.replace("../login");                
                    });
                });
            });            
        });
    }
});

$('#users_intan').change(function(){
    if ($('#users_intan').val() == 1) {
        $("#usersintan").show();
        $("#divFK_kampus").show();
        $("#usersluar").hide();
        $("#FK_kampus").prop('required', true);
        $("FK_kementerian").prop('required', false);
        $("FK_agensi").prop('required', false);
        $("FK_bahagian").prop('required', false);
        $("alamat1_pejabat").prop('required', false);
        $("alamat2_pejabat").prop('required', false);
        $("poskod_pejabat").prop('required', false);
        $("daerah_pejabat").prop('required', false);
        $("negeri_pejabat").prop('required', false);
    } else if ($('#users_intan').val() == 0)    {
        $("#usersintan").hide();
        $("#usersluar").show();
        $("FK_kampus").prop('required', false);
        $("FK_kluster").prop('required', false);
        $("FK_kementerian").prop('required', true);
        $("FK_agensi").prop('required', true);
        $("FK_bahagian").prop('required', true);
        $("alamat1_pejabat").prop('required', true);
        $("alamat2_pejabat").prop('required', true);
        $("poskod_pejabat").prop('required', true);
        $("daerah_pejabat").prop('required', true);
        $("negeri_pejabat").prop('required', true);
    }
})

$('#FK_kampus').change(function(){
    if ($('#FK_kampus').val() == 11) {
        $("#divFK_kluster").show();
        $("#divFK_subkluster").show();
        $("#divFK_unit").show();
        $("#divFK_kluster").prop('required', true);
        $("#divFK_subkluster").prop('required', true);
        // $("#divFK_unit").prop('required', true);
    } else {
        $("#divFK_kluster").hide();
        $("#divFK_subkluster").show();
        $("#divFK_kluster").prop('required', true);
        $("#divFK_subkluster").prop('required', true);
        $("#divFK_unit").show();
        // $("#divFK_unit").prop('required', true);
    }
})

$("#poskod_pejabat").blur(function(){
    var settings = {
        "url": host + "api_public/public/sysposkod/" + $("#poskod_pejabat").val(),
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        document.getElementById("daerah_pejabat").value=response.data.bandar;
        document.getElementById("negeri_pejabat").value=response.data.nama;    
    }); 
});

function kampusList()   {
    //Dropdown Kampus List
    var settings = {
        "url": host+"api_public/public/kampusList",
        "method": "GET",
        "timeout": 0
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
        
    });
    // END Dropdown Kampus List
}

function klusterList()  {
    //Dropdown Kluster List
    $('#FK_kluster').empty();
    $('#FK_kluster').append($('<option>', { 
        value: "",
        text : "Pilih Kluster" 
    }));
    
    $('#FK_kampus').change(function(){
        var settings = {
            "url": host+"api_public/public/klusters/" + $('#FK_kampus').val(),
            "method": "GET",
            "timeout": 0
        };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#FK_kluster').empty();
            $('#FK_kluster').append($('<option>', { 
                value: "",
                text : "Pilih Kluster" 
            }));
            $.each(response.data, function (i, item) {
                if ($('#FK_kampus').val() != '11')  {
                    var selected = 'selected';
                    $('#FK_kluster').append($('<option>', { 
                        value: item.id_kluster,
                        text : item.nama_kluster
                    }).attr(selected,true));
                    subklusterListNonKiara();
                    // alert(selected)
                } else  {
                    var selected = 'selected';
                    $('#FK_kluster').append($('<option>', { 
                        value: item.id_kluster,
                        text : item.nama_kluster
                    }));
                }
            });
            
        });
    });
    // END Dropdown Kluster List
}

function subklusterListNonKiara()   {
    //Dropdown Subkluster List
    $('#FK_subkluster').empty();
    $('#FK_subkluster').append($('<option>', { 
        value: "",
        text : "Pilih Subkluster" 
    }));
    
    //Dropdown Subkluster List
    var settings = {
        "url": host+"api_public/public/subklusters/" + $('#FK_kluster').val(),
        "method": "GET",
        "timeout": 0
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
            
        });
    // END Dropdown Subkluster List
}

function subklusterList()   {
    //Dropdown Subkluster List
    $('#FK_subkluster').empty();
    $('#FK_subkluster').append($('<option>', { 
        value: "",
        text : "Pilih Subkluster" 
    }));
    
    $('#FK_kluster').change(function(){
        //Dropdown Subkluster List
        var settings = {
            "url": host+"api_public/public/subklusters/" + $('#FK_kluster').val(),
            "method": "GET",
            "timeout": 0
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
                
            });
        // END Dropdown Subkluster List
        
    });//Dropdown Subkluster List
}

function unitList() {
    $('#FK_unit').empty();
    $('#FK_unit').append($('<option>', { 
        value: "",
        text : "Pilih Unit" 
    }));
    
    $('#FK_subkluster').change(function(){
        //Dropdown Unit List
        var settings = {
            "url": host+"api_public/public/units/" + $('#FK_kluster').val() + "/" + $('#FK_subkluster').val(),
            "method": "GET",
            "timeout": 0
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
            
        });
        // END Dropdown Unit List
        
    });
}

function gelaranList()  {
    //Dropdown Gelaran List
    var settings = {
        "url": host+"api_public/public/gelaransList",
        "method": "GET",
        "timeout": 0
      };
    
        $.ajax(settings).done(function (response) {
            
            //LIST OPTION
            $('#FK_gelaran').empty();
            $('#FK_gelaran').append($('<option>', { 
                value: "",
                text : "Pilih Gelaran" 
            }));
            $.each(response.data, function (i, item) {
                $('#FK_gelaran').append($('<option>', { 
                    value: item.id_gelaran,
                    text : item.nama_gelaran 
                }));
            });
            
        });
    // END Dropdown Gelaran List
}

function skimList() {
    //Dropdown Skim List
    var settings = {
        "url": host+"api_pentadbir/public/skimsList",
        "method": "GET",
        "timeout": 0
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
        "timeout": 0
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

function kategoriperkhidmatanList() {
    //Dropdown Kategori Perkhidmatan List
    var settings = {
        "url": host+"api_pentadbir/public/kategoriperkhidmatansList",
        "method": "GET",
        "timeout": 0
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#kategori_perkhidmatan').empty();
            $('#kategori_perkhidmatan').append($('<option>', { 
                value: "",
                text : "Pilih Kategori Perkhidmatan" 
            }));
            $.each(response.data, function (i, item) {
                $('#kategori_perkhidmatan').append($('<option>', { 
                    value: item.id,
                    text : item.nama_kategoriperkhidmatan 
                }));
            });
            
        });
    // END Dropdown Kategori Perkhidmatan List
}

function kementerianList()  {
    //Dropdown Kementerian List
    var settings = {
        "url": host+"api_public/public/kementeriansList",
        "method": "GET",
        "timeout": 0
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#FK_kementerian').empty();
            $('#FK_kementerian').append($('<option>', { 
                value: "",
                text : "Pilih Kementerian" 
            }));
            $.each(response.data, function (i, item) {
                $('#FK_kementerian').append($('<option>', { 
                    value: item.kod_kementerian,
                    text : item.nama_kementerian + " (" + item.kod_kementerian + ")"
                }));
            });
            
        });
    // END Dropdown Kementerian List
}

function agensiList()   {
    //Dropdown Agensi List
    var settings = {
        "url": host+"api_public/public/agensisList",
        "method": "GET",
        "timeout": 0
      };
    
        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#FK_agensi').empty();
            $('#FK_agensi').append($('<option>', { 
                value: "",
                text : "Pilih Agensi" 
            }));
            $.each(response.data, function (i, item) {
                $('#FK_agensi').append($('<option>', { 
                    value: item.kod_agensi,
                    text : item.nama_agensi + " (" + item.kod_agensi + ")"
                }));
            });
            
        });
    // END Dropdown Agensi List
}

function bahagianList() {
    //Dropdown Bahagian List
    $('#FK_bahagian').empty();
    $('#FK_bahagian').append($('<option>', { 
        value: "",
        text : "Pilih Bahagian" 
    }));
    
    $('#FK_agensi').change(function(){
        var settings = {
            "url": host+"api_public/public/bahagians/" + $('#FK_kementerian').val() + "/" + $('#FK_agensi').val(),
            "method": "GET",
            "timeout": 0
        };
        // console.log(settings);
    
            $.ajax(settings).done(function (response) {
                //LIST OPTION
                $('#FK_bahagian').empty();
                $('#FK_bahagian').append($('<option>', { 
                    value: "",
                    text : "Pilih Bahagian" 
                }));
                $.each(response.data, function (i, item) {
                    $('#FK_bahagian').append($('<option>', { 
                        value: item.kod_bahagian,
                        text : item.nama_bahagian  + " (" + item.kod_bahagian + ")"
                    }));
                });
                               
            });
        // END Dropdown Sub Modul List    
    });
}

function ilaList()  {
    //Dropdown Bahagian List
    $('#FK_ila').empty();
    $('#FK_ila').append($('<option>', { 
        value: "",
        text : "Pilih ILA" 
    }));
    
    $('#FK_bahagian').change(function(){
        var settings = {
            "url": host+"api_public/public/ilawams/" + $('#FK_bahagian').val(),
            "method": "GET",
            "timeout": 0
        };
        // console.log(settings);
    
            $.ajax(settings).done(function (response) {
                //LIST OPTION
                $('#FK_ila').empty();
                $('#FK_ila').append($('<option>', { 
                    value: "",
                    text : "Pilih ILA" 
                }));
                $.each(response.data, function (i, item) {
                    $('#FK_ila').append($('<option>', { 
                        value: item.kod_ila,
                        text : item.nama_ila  + " (" + item.kod_ila + ")"
                    }));
                });
                               
            });
        // END Dropdown Sub Modul List
    });
}