$(function(){
    $.ajaxSetup ({
        cache: false
    });
    tableStatus();  
});

function tableStatus(){
    var colums = [
        { "name": "bil", "title": "Bil" },
        // { "name": "kod_status", "title": "Kod" },
        { "name": "nama_status", "title": "Nama" },
        {"name":"status","title":"Status","breakpoints":"sm xs"},
        { "name": "upt_btn", "title": "Tindakan", "breakpoints": "md sm xs" }
        
    ];
    var settings = {
        "url": host + "api_media/public/statusListAll",
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
                id: field.id_status, kod_status: field.kod_status, nama_status: field.nama_status, 
                bil: bil++,
                status: '<label class="adomx-switch-2 success"><input type="checkbox" id="status_sistem" class="form-control mb-20" '+checked+' onclick="del_rekod(\''+field.id_status+'\')"> <i class="lever"></i> <span id="text_statusrekod'+field.id_status+'" class="badge '+ badge +'">'+text_statusrekod+'</span></label>', 
                "upt_btn":  '<button class="button button-box button-sm button-primary" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ti-pencil-alt"></i></button> '
                            // '<button class="button button-box button-sm button-danger" title="Hapus" onclick="del_rekod(\''+field.id_status+'\')"><i class="ti-trash"></i>'
            });
        });
    
        $("#medstatusList").footable({
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
}

function del_rekod(i){
    let id = i;

    var form = new FormData();
    form.append("id_status", id);    

    var settings = {
        "url": host+"api_media/public/statusDelete",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };

    $.ajax(settings).done(function (response) {
        // console.log(response)
        result = JSON.parse(response);
        if (!result.success) {
            // Swal(result.message, result.data, "error");
            // return;
            swal({
                title: "Hapus Status",
                text: "Gagal!",
                type: "error",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: false
            }).then(function(){
                window.location.reload();        
            });
        }
        if (result.data.statusrekod == 1)   {
            $('#text_statusrekod'+result.data.id_status).text('Aktif').removeClass("badge-danger").addClass("badge-success");
        } else  {
            $('#text_statusrekod'+result.data.id_status).text('Tidak Aktif').removeClass("badge-success").addClass("badge-danger");
        }
        saveLog(window.sessionStorage.id,"Change Record Status for [id_status = " + id_status + "] at Tetapan Kategori Media.",window.sessionStorage.browser);
    });
}

function loadData(indexs){   

    let data = JSON.parse($("#dataList").val());
    $('#upt_id').val(data[indexs].id_status);   
    $('#upt_kod_status').val(data[indexs].kod_status);   
    $('#upt_nama_status').val(data[indexs].nama_status);

    $("#update-medstatus").modal("show");
    
}

$("#update-medstatus").on('shown.bs.modal', function(){
    $(this).find('#upt_nama_status').focus();
});

//FUNCTION UPDATE
var confirmed = false;

$("#update").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Kemaskini Status Media",
            text: "Anda Pasti Untuk Kemaskini?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let upt_id = $("#upt_id").val();
            let upt_kod_status = $("#upt_kod_status").val();
            let upt_nama_status = $("#upt_nama_status").val();

            var form = new FormData();
            form.append("id_status", upt_id);
            form.append("kod_status", upt_kod_status);
            form.append("nama_status",upt_nama_status);
            form.append("updated_by",window.sessionStorage.no_kad_pengenalan);

            var settings = {
                "url": host+"api_media/public/statusUpdate",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response)
                result = JSON.parse(response);
                // alert(result.success);
                if (!result.success) {
                    // alert(result.success);
                    swal({
                        title: "Kemaskini Status Media",
                        text: "Kemaskini Gagal!",
                        type: "error",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        html: false,
                        timer: 1000
                    }).then(function(){},
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                $("#update-medstatus").modal("hide");
                                tableStatus();   
                            }
                        }
                    );
                } else  {
                    swal({
                        title: "Kemaskini Status Media",
                        text: "Kemaskini Berjaya!",
                        type: "success",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        html: false,
                        timer: 1000
                    }).then(function(){},
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                saveLog(window.sessionStorage.id,"Update Data for [id_status = " + upt_id + "]" + upt_nama_status + " at Tetapan Status Media.",window.sessionStorage.browser);
                                $("#update-medstatus").modal("hide");
                                tableStatus();   
                            }
                        }
                    );
                }
            });

        });
    }
});