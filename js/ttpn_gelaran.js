$("#reg-gelaran").on('shown.bs.modal', function(){
    $(this).find('#nama_gelaran').focus();
});

$("#update-gelaran").on('shown.bs.modal', function(){
    $(this).find('#upt_nama_gelaran').focus();
});

var colums = [
    { "name": "bil", "title": "Bil" },
    { "name": "nama_gelaran", "title": "Nama" },
    { "name": "status_rekod", "title": "Status" },
    { "name": "upt_btn", "title": "Tindakan", "breakpoints": "md sm xs" },
];
var settings = {
    "url": host + "gelaransListAll",
    "method": "GET",
    "timeout": 0,
  };

$.ajax(settings).done(function (response) {
    let convertList = JSON.stringify(response.data);
    $("#dataList").val(convertList);
    var list = [];
    let bil = 1;

    $.each(response.data, function (i, field) {
        var checked;
        if (field.statusrekod == '1') {
            checked = 'checked';
            badge = 'badge-success';
            text_statusrekod = 'Aktif';
        } else  {
            badge = 'badge-danger';
            text_statusrekod = 'Tidak Aktif';   
        }
        list.push({
            id: field.id, nama_gelaran: field.nama_gelaran, bil: bil++,
            status_rekod: '<label class="adomx-switch-2 success"><input type="checkbox" id="status_sistem" class="form-control mb-20" '+checked+' onclick="del_rekod(\''+field.id+'\')"> <i class="lever"></i> <span id="text_statusrekod'+field.id+'" class="badge '+ badge +'">'+text_statusrekod+'</span></label>', 
            upt_btn:  '<button class="button button-box button-sm button-primary" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ti-pencil-alt"></i></button> '
        });
    });

    $("#gelaranList").footable({
        "columns": colums,
        "rows": list,
        "paging": {
            "enabled": true,
            "size": 5
        },
        "filtering": {
            "enabled": true,
            "placeholder": "Carian...",
            "dropdownTitle": "Carian untuk:",
            "class": "brown-700"
        }
    });
});

function loadData(indexs){   

    let data = JSON.parse($("#dataList").val());
    $('#upt_id').val(data[indexs].id);   
    $('#upt_nama_gelaran').val(data[indexs].nama_gelaran);   
    saveLog(window.sessionStorage.id,"View Data of [id = " + data[indexs].id + "]" + data[indexs].nama_gelaran + " at Tetapan Gelaran.",window.sessionStorage.browser);

    $("#update-gelaran").modal("show");
    document.getElementById("upt_nama_gelaran").focus();    
}

var confirmed = false;
$("#register").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Daftar Gelaran",
            text: "Anda Pasti Untuk Simpan?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Ya",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            $("#reg-gelaran").modal("hide");
            let nama_gelaran = $("#nama_gelaran").val();
            
            var form = new FormData();
            form.append("nama_gelaran",nama_gelaran);
            var settings = {
                "url": host+"addGelarans",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                result = JSON.parse(response);
                if (!result.success) {
                    swal({
                        title: "Daftar Gelaran",
                        text: result.message + " " + result.data,
                        type: "error",
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
                } else {              
                    swal({
                        title: "Daftar Gelaran",
                        text: result.message,
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        html: false,
                        timer: 1000
                    }).then(function(){},
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                saveLog(window.sessionStorage.id,"Register Data ["+ nama_gelaran +"] at Tetapan Gelaran.",window.sessionStorage.browser);
                                window.location.reload();  
                            }
                        }
                    ); 
                }
            });

        });
    }
});

//FUNCTION UPDATE

$("#update").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Kemaskini Gelaran",
            text: "Anda Pasti Untuk Kemaskini?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Ya",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let upt_id = $("#upt_id").val();
            let upt_nama_gelaran = $("#upt_nama_gelaran").val();
            let statusrekod = "EDT";

            var form = new FormData();
            form.append("id", upt_id);
            form.append("nama_gelaran", upt_nama_gelaran);

            var settings = {
                "url": host+"gelaransUpdate",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                result = JSON.parse(response);
                if (!result.success) {
                    swal({
                        title: "Kemaskini Gelaran",
                        text: result.message + " " + result.data,
                        type: "error",
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
                } else {                    
                    swal({
                        title: "Kemaskini Gelaran",
                        text: result.message,
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 1000
                    }).then(function(){},
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                saveLog(window.sessionStorage.id,"Update Data for [id = " + upt_id + "]" + upt_nama_gelaran + " at Tetapan Gelaran.",window.sessionStorage.browser);
                                window.location.reload();     
                            }
                        }
                    );
                }  
            });

        });
    }
});

// FUNCTION DELETE

function del_rekod(i){

    let statusrekod = 'DEL';
    let id = i;

    var form = new FormData();
    form.append("id", id);    

    var settings = {
        "url": host+"gelaransDelete",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };

    $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if (!result.success) {
            swal({
                title: "Hapus Gelaran",
                text: "Gagal!",
                type: "error",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: false
            }).then(function(){
                sessionStorage.token = result.token;
                window.location.reload();      
            });
        }
        if (result.data.statusrekod == 1)   {
            $('#text_statusrekod'+result.data.id).text('Aktif').removeClass("badge-danger").addClass("badge-success");
        } else  {
            $('#text_statusrekod'+result.data.id).text('Tidak Aktif').removeClass("badge-success").addClass("badge-danger");
        }        
        saveLog(window.sessionStorage.id,"Delete Data for [id = " + upt_id + "]" + upt_nama_gelaran + " at Tetapan Gelaran.",window.sessionStorage.browser);
    });
}