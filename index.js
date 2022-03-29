$(document).ready(function(){
    let token = window.sessionStorage.token;
    if(token == null){
        window.location.replace("login/");
    }
});
$('#nama').html(window.sessionStorage.nama);
// alert(window.sessionStorage.id);
//Laman Utama

$("#data_load").html("");
$("#page_title").html('<li class="breadcrumb-item active"><a href="javascript:void(0)">Laman Utama</a></li>');
var settings = {
    "url": host + "api_media/public/programListBergambar",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    $.each(response.data, function (i, field) {
        imgsrc = "";
        if (field.media_path != null) {
            img = JSON.parse(field.media_path);
            bil = 0;
            $.each(img, function (i2,field2) {
                while (bil < 1) {
                    imgsrc = field2.images;
                    console.log(imgsrc);
                    bil++;
                }
            })
            // console.log(img);
        }
        t_program = new Date(field.tarikh_program);
        data_programs = '<div class="col-lg-12 col-xl-6">'+
        '<div class="card">'+
            '<div class="card-body">'+
                '<div class="row m-b-30">'+
                    '<div class="col-md-5 col-xxl-12">'+
                        '<div class="new-arrival-product mb-4 mb-xxl-4 mb-md-0">'+
                            '<div class="new-arrivals-img-contnent">'+
                                '<img class="img-fluid" src="../api_asdcm/api_media/public/uploads/'+ imgsrc +'" alt="">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-md-7 col-xxl-12">'+
                        '<div class="new-arrival-content position-relative">'+
                            '<h4>'+field.nama_program+'</h4>'+                            
                            '<p>Tarikh: <span class="item" id="tarikh"> ' + t_program.getDate() + "/" + (t_program.getMonth() + 1) + "/" + t_program.getFullYear() + ' </span></p>'+
                            '<p>Kategori Program: <span class="item">' + field.nama_kategori + '</span> </p>'+
                            '<p>Lokasi: <span class="item">' + field.nama_kampus + '</span></p>'+
                            '<button class="btn btn-info" onclick="detail_media('+field.PK+')"><i class="fa fa-view"></i> View</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    $("#data_load").append(data_programs);
    });
});

// End Laman Utama

// Carian

$("#Search").on("keyup", function () {
    val = $(this).val().toLowerCase();
    $(".card").each(function () {
        $(this).toggle($(this).text().toLowerCase().includes(val));
    });
});

// End Carian

$("#home").click(function(){      
    $("#data_load").html("");
    $("#page_title").html('<li class="breadcrumb-item active"><a href="javascript:void(0)">Laman Utama</a></li>');
    data_program();
});

$("#profil").click(function(){
    $("#data_load").html("");
    $("#page_title").html('<li class="breadcrumb-item active"><a href="javascript:void(0)">Profil Pengguna</a></li>');

    //load data_load
    
});

$("#list").click(function(){
    $("#data_load").html("");
    $("#page_title").html('<li class="breadcrumb-item active"><a href="javascript:void(0)">Senarai Permohonan</a></li>');
    list();
    //load data_load
    
});

$("#logKeluar").click(function () {
    // document.getElementById("menu-kanan").classList.remove("show");
    swal({
        title: "Log Keluar",
        text: "Anda Pasti Untuk Log Keluar?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Ya",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        window.sessionStorage.clear();
        window.location.replace("login/");
    });
});

function detail_media(indexs){
    $("#data_load").html("");
    $("#page_title").html('<li class="breadcrumb-item"><a href="javascript:void(0)" onclick="data_program()">Laman Utama</a></li>'+
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Detail Program</a></li>');
    var settings = {
        "url": host + "api_media/public/program/"+indexs,
        "method": "GET",
        "timeout": 0,
    };
    // console.log(settings)
    $.ajax(settings).done(function (response) {
        $("#permohonan").show();
        $('#disp_id').val(response.data.PK);
        $("#nama_program").text(response.data.nama_program);
        $("#tarikh_program").text(response.data.tarikh_program);
        media_path = JSON.parse(response.data.media_path)
        // console.log(response.data.media_path);
        let bil = 0;
        $.each(media_path, function (i, field) {
            bil++;
            data_programs = '<div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">'+
                                '<div class="card">'+
                                    '<div class="card-body">'+
                                        '<div class="new-arrival-product">'+
                                            '<div class="new-arrivals-img-contnent">'+
                                                '<img class="img-fluid" src="../api_asdcm/api_media/public/uploads/'+field.images+'" alt="">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
        $("#bilangan_media").text(bil);
        $("#data_load").append(data_programs); 
        });
    });
}

function data_program(){
    $("#permohonan").hide();
    $("#data_load").html("");
    $("#page_title").html('<li class="breadcrumb-item active"><a href="javascript:void(0)">Laman Utama</a></li>');
    var settings = {
        "url": host + "api_media/public/programListBergambar",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        $.each(response.data, function (i, field) {
            imgsrc = "";
            if (field.media_path != null) {
                img = JSON.parse(field.media_path);
                bil = 0;
                $.each(img, function (i2,field2) {
                    while (bil < 1) {
                        imgsrc = field2.images;
                        console.log(imgsrc);
                        bil++;
                    }
                })
                // console.log(img);
            }
            t_program = new Date(field.tarikh_program);
            data_programs = '<div class="col-lg-12 col-xl-6">'+
            '<div class="card">'+
                '<div class="card-body">'+
                    '<div class="row m-b-30">'+
                        '<div class="col-md-5 col-xxl-12">'+
                            '<div class="new-arrival-product mb-4 mb-xxl-4 mb-md-0">'+
                                '<div class="new-arrivals-img-contnent">'+
                                    '<img class="img-fluid" src="../api_asdcm/api_media/public/uploads/'+ imgsrc +'" alt="">'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-7 col-xxl-12">'+
                            '<div class="new-arrival-content position-relative">'+
                                '<h4>'+field.nama_program+'</h4>'+                            
                                '<p>Tarikh: <span class="item" id="tarikh"> ' + t_program.getDate() + "/" + (t_program.getMonth() + 1) + "/" + t_program.getFullYear() + ' </span></p>'+
                                '<p>Kategori Program: <span class="item">' + field.nama_kategori + '</span> </p>'+
                                '<p>Lokasi: <span class="item">' + field.nama_kampus + '</span></p>'+
                                '<button class="btn btn-info" onclick="detail_media('+field.PK+')"><i class="fa fa-view"></i> View</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
        $("#data_load").append(data_programs);
        });
    });
}

function list(){
    $("#data_load").html("");
    $("#page_title").html('<li class="breadcrumb-item active"><a href="javascript:void(0)">Senarai Permohonan</a></li>');
    data_programs = ''+
    '<div class="col-lg-12 col-xl-12">'+
        '<div class="card">'+
            '<div class="card-body">'+
                '<div id="tablePermohonan">'+
                    '<textarea style="display: none;" id="dataList"></textarea>'+
                    '<table id="permohonanList" class="table table-striped table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;"></table>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    $("#data_load").append(data_programs);
    var colums = [
        { "data": "bil", "title": "Bil" },
        { "data": "nama_program", "title": "Nama Program" },
        // { "data": "nama", "title": "Nama Pemohon", class: "desktop" },
        { "data": "tarikh_permohonan", "title": "Tarikh Permohonan", class: "desktop" },
        { "data": "tarikh_pengesahan", "title": "Tarikh Pengesahan", class: "desktop" },
        { "data": "tarikh_luput", "title": "Tarikh Luput", class: "desktop" },
        { "data": "nama_status", "title": "Status", class: "desktop" },
        { "data": "upt_btn", "title": "Tindakan", class: "desktop" },
        // {"name":"status","title":"Status","breakpoints":"sm xs"}
    ];
    
    var settings = {
        "url": host + "api_media/public/permohonanByUsers/"+window.sessionStorage.id,
        "method": "GET",
        "timeout": 0,
    };
    console.log(settings);

    $.ajax(settings).done(function (response) {
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        var list = [];
        let bil = 1;

        $.each(response.data, function (i, field) {
            t_permohonan = new Date(field.tarikh_permohonan);
            if (field.tarikh_luput == null)    {
                t_luput_list = "-";
            } else  {
                t_luput = new Date(field.tarikh_luput);
                t_luput_list = t_luput.getDate() + "/" + (t_luput.getMonth() + 1) + "/" + t_luput.getFullYear()
            }
            if (field.tarikh_pengesahan == null)    {
                t_pengesahan_list = "-";
            } else  {
                t_pengesahan = new Date(field.tarikh_pengesahan);
                t_pengesahan_list = t_pengesahan.getDate() + "/" + (t_pengesahan.getMonth() + 1) + "/" + t_pengesahan.getFullYear()
            }
            var button_detail = '';
            now = new Date();
            if (field.nama_status == 'Lulus')   {
                if (t_luput - now < 0)   {
                    var form = new FormData();
                    form.append("id", field.PK);
                    form.append("status_permohonan","5");
                    var settings = {
                        "url": host + "api_media/public/permohonanLuput",
                        "method": "POST",
                        "timeout": 0,
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,
                        "data": form
                    };
                    $.ajax(settings).done(function (response) {});
                    badge_status = '<span class="badge badge-danger">Luput</span>';
                    button_detail = ''
                } else  {
                    badge_status = '<span class="badge badge-success">'+ field.nama_status +'</span>';
                    button_detail = '<a onclick="download_media('+field.PK+')">' + field.nama_program + '</a>'
                }
            }
                
            else if (field.status_permohonan == '3'){
                badge_status = '<span class="badge badge-danger">'+ field.nama_status +'</span>';
                button_detail = field.nama_program;
                }
                
            else if (field.status_permohonan == '4'){
                badge_status = '<span class="badge badge-danger">'+ field.nama_status +'</span>';
                button_detail = field.nama_program;
            }
                
            else  if (field.status_permohonan == '1'){
                badge_status = '<span class="badge badge-primary">'+ field.nama_status +'</span>';
                button_detail = field.nama_program;
            }
                
            else  if (field.status_permohonan == '5'){
                badge_status = '<span class="badge badge-danger">'+ field.nama_status +'</span>';
                button_detail = field.nama_program;
            }
            
            list.push({
                id: field.PK, FK_users: field.FK_users, 
                nama_program: button_detail, 
                nama: field.nama,
                tarikh_pengesahan: t_pengesahan_list, 
                tarikh_permohonan: t_permohonan.getDate() + "/" + (t_permohonan.getMonth() + 1) + "/" + t_permohonan.getFullYear(), 
                tarikh_luput: t_luput_list, 
                nama_status: badge_status,
                bil: bil++,
                "upt_btn":  '<button type="button" class="badge badge-primary" onclick="upt_rekod(\''+field.PK+'\')"><i class="fa fa-pencil-square-o"></i></button> '+
                            '<button type="button" class="badge badge-success" onclick="upt_rekod(\''+field.PK+'\')"><i class="fa fa-download"></i></button>'
            });
        });

        $("#permohonanList").DataTable({
            retrieve: true,
            "columns": colums,
            "data": list,
        });
    });
}

function download_media(indexs){

    $('#checkAll').prop('checked', false);
    $("#data_load").html("");
    $("#checkboxmedia").html("");
    $("#page_title").html('<li class="breadcrumb-item"><a href="javascript:void(0)" onclick="list()">Senarai Permohonans</a></li>'+
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Detail Program</a></li>');

    
    var settings = {
        "url": host + "api_media/public/permohonan/"+indexs,
        "method": "GET",
        "timeout": 0,
    };
    // console.log(settings)
    $.ajax(settings).done(function (response) {
        $("#data_load").append('<div id="checkboxmedia" class="row"></div>');
        // $("#permohonan").show();
        $("#muatturun").show();
        $('#disp_id').val(response.data.FK_program);
        media_path = JSON.parse(response.data.media_path)
        // console.log(response.data.media_path);
        
        $.each(media_path, function (i, field) {
            data_programs = '<div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">'+
                                '<div class="card">'+
                                    '<div class="card-body"><input class="" type="checkbox" name="media_selected[]" value="'+ field.images +'" id="'+ field.images +'"/>'+
                                        '<div class="new-arrival-product">'+
                                            '<div class="new-arrivals-img-contnent">'+
                                                '<img class="img-fluid" src="../api_asdcm/api_media/public/uploads/'+field.images+'" alt="">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
        $("#checkboxmedia").append(data_programs);
        });
        // $("#data_load").append('</div>')
    });
    
}

$("#reg-permohonan").on('shown.bs.modal', function(){
    $(this).find('#sebab').focus();
});

$("#modal-permohonan").click(function () {
    $("#reg-permohonan").modal("show");
});

var confirmed = false;
$("#registerpermohonan").on('submit', function (e) {
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
                title: "Muat Turun Media",
                text: "Anda Pasti Untuk Membuat Permohonan Muat Turun?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Ya",
                cancelButtonText: "Tidak",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: false
            }).then(function(){
                $("#reg-permohonan").modal("hide");
                t_program = new Date();
                let FK_users = window.sessionStorage.id;
                let sebab = $("#sebab").val();
                let FK_program = $("#disp_id").val();
                let status_permohonan = "1";
                let tarikh_permohonan = t_program.getFullYear() + "-" + (t_program.getMonth() + 1) + "-" + t_program.getDate();
                let statusrekod = "1";
        
                // var param = {
                //     twmTitle: FK_program,
                //     twmDescription: status_permohonan,
                //     twmSdate: tarikh_permohonan,
                //     twmEdate: statusrekod,
                // }
                // console.log(param)
                
                var form = new FormData();
                // formData.append("key","mSideDiary");
                form.append("FK_users",FK_users);
                form.append("sebab",sebab);
                form.append("FK_program",FK_program);
                form.append("status_permohonan",status_permohonan);
                form.append("tarikh_permohonan",tarikh_permohonan);
                form.append("created_by",window.sessionStorage.id);
                form.append("updated_by",window.sessionStorage.id);
                form.append("statusrekod","1");
                
                var settings = {
                    "url": host+"api_media/public/addPermohonan",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };
        
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    result = JSON.parse(response);
                    if (!result.success) {
                        // Swal(result.message, result.data, "error");
                        // return;
                        swal({
                            title: "Muat Turun Media",
                            text: "Permohonan Gagal!",
                            type: "error",
                            closeOnConfirm: true,
                            allowOutsideClick: false,
                            html: false
                        }).then(function(){
                            window.location.reload();      
                        });
                    }
                    swal({
                        title: "Muat Turun Media",
                        text: "Permohonan Berjaya Direkod!",
                        type: "success",
                        closeOnConfirm: true,
                        allowOutsideClick: false,
                        html: false
                    }).then(function(){
                        sessionStorage.token = result.token;
                        window.location.reload();      
                    });
                });
        
            });
    }
});



//MIMI : CLICK BUTTON MOHON LEPAS PILIH FILE START
$("#muatturun-permohonan").click(function () {
    swal({
        title: "Muat Turun Media",
        text: "Anda Pasti Untuk Muat Turun?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function(){
        
        t_program = new Date();
        let FK_users = window.sessionStorage.id;
        let status_permohonan = "1";
        let tarikh_muatturun = t_program.getFullYear() + "" + (t_program.getMonth() + 1) + "" + t_program.getDate();
        let FK_program = $("#disp_id").val();
        let media_list = $('#checkboxmedia [type="checkbox"]:checked').map(function () {
            return this.value;
        }).get();
        let statusrekod = "1";
        
        var form = new FormData();
        form.append("FK_users",FK_users);
        form.append("FK_program",FK_program);
        form.append("tarikh_muatturun",tarikh_muatturun);
        form.append("media_list",media_list);
        form.append("statusrekod","1");
        
        var settings = {
            "url": host+"api_media/public/permohonanDownload",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            
            console.log(response);
            result = JSON.parse(response);
            if (result.success) {

                window.location="../api_asdcm/api_media/public/"+result.data;
                
                removeZip(result.data);
                
            }
            
        });

    });
});
//MIMI : CLICK BUTTON MOHON LEPAS PILIH FILE END

//MIMI : REMOVE FILE ZIP LEPAS DOWNLOAD START
function removeZip(file_name){
    var formDel = new FormData();
    formDel.append("file_name",file_name);

    var settingPadam = {
        "url": host+"api_media/public/permohonanRemove",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": formDel
    };

    $.ajax(settingPadam).done(function (responsePadam) {

        swal({
            title: "Muat Turun Media",
            text: "Permohonan Berjaya Direkod!",
            type: "success",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            sessionStorage.token = result.token;
            window.location.reload();      
        });

    });
}
//MIMI : REMOVE FILE ZIP LEPAS DOWNLOAD END

//MIMI : CHECKED ALL CHECKBOX START
$("#checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
});
//MIMI : CHECKED ALL CHECKBOX END

