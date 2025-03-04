$(function () {
  $.ajaxSetup({
    cache: false,
  });
  if(window.sessionStorage.token && window.sessionStorage.no_kad_pengenalan){
    users(function(){
      
    });
  } else {
    window.location.replace('login/');
  }
  listNotification();
  loadHalamanUtama();
  kategoriProgram();
  listVip();
  listProgram();
  if (window.sessionStorage.content == "halamanutama") {
    $("#data_load").html("");
    $("#page_title").html(
      '<li class="breadcrumb-item active"><a href="javascript:void(0)">Laman Utama</a></li>'
    );
    loadHalamanUtama();
  } else if (window.sessionStorage.content == "list") {
    $("#data_load").html("");
    $("#page_title").html(
      '<li class="breadcrumb-item active"><a href="javascript:void(0)">Senarai Permohonan</a></li>'
    );
    list();
  } else if (window.sessionStorage.content == "profil") {
    $("#data_load").html("");
    $("#permohonan").hide();
    $("#page_title").html(
      '<li class="breadcrumb-item active"><a href="javascript:void(0)">Profil Pengguna</a></li>'
    );
    $("#data_load").load("profil.html");
  } else if (window.sessionStorage.content == "ubahkatalaluan") {
    $("#data_load").html("");
    $("#permohonan").hide();
    $("#page_title").html(
      '<li class="breadcrumb-item active"><a href="javascript:void(0)">Ubah Katalaluan</a></li>'
    );
    $("#data_load").load("ubahkatalaluan.html");
  }
});
$(document).ready(function () {
  let token = window.sessionStorage.token;
  if (token == null) {
    window.location.replace("login/");
  } else {
    $("body").show();
  }
});

$("#nama").html(window.sessionStorage.nama);
// alert(window.sessionStorage.id);
//Laman Utama

//LOAD IMAGE

// $(function(){
//     $.ajaxSetup ({
//         cache: false
//     });
//     tableKategori();
//     formatList();
// });

function kategoriProgram() {
  var obj = new get(host+`kategoriprogramList`,window.sessionStorage.token).execute();
  if(obj.success){
    var data = obj.data;
    $("#FK_kategori").empty();
    $("#FK_kategori").append("<option>Kategori</option>");
    $.each(data, function (i, item) {
      $("#FK_kategori").append(
        $("<option>", {
          value: item.id_kategoriProgram,
          text: item.nama_kategori,
        })
      );
    });
  } else {
    
  }
}

function listVip() {
  var obj = new get(host+`vipsList`,window.sessionStorage.token).execute();
  if(obj.success){
    var data = obj.data;
    $("#FK_vip").empty();
    $.each(data, function (i, item) {
      $("#FK_vip").append(
        $("<option>", {
          value:
            item.nama_gelaran +
            " " +
            item.nama_vip +
            " (" +
            item.jawatan_vip +
            ")",
          text:
            item.nama_gelaran +
            " " +
            item.nama_vip +
            " (" +
            item.jawatan_vip +
            ")",
        })
      );
    });
  } else {

  }
}

function listProgram() {
  var obj = new get(host+`programListPublish`,window.sessionStorage.token).execute();
  if(obj.success){
    console.log(obj);
    var data = obj.data;
    $("#nama_program").empty();
    $.each(data, function (i, item) {
      $("#nama_program").append(
        $("<option>", {
          value: item.nama_program,
          text: item.nama_program,
        })
      );
    });
  } else {

  }
}

function loadHalamanUtama() {
  $("#permohonan").hide();
  $("#data_load").html("");
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Laman Utama</a></li>'
  );
  $("#checkAll").prop("checked", "");

  var gallery_tab =
    '<div class="default-tab mt-60">' +
    '<ul class="nav nav-tabs" role="tablist">' +
    '<li class="nav-item">' +
    '<a class="nav-link active" data-toggle="tab" href="#images"><i class="la la-image mr-2"></i> Galeri Gambar</a>' +
    "</li>" +
    '<li class="nav-item">' +
    '<a class="nav-link" data-toggle="tab" href="#videos"><i class="la la-file-video-o mr-2"></i> Galeri Video</a>' +
    "</li>" +
    '<li class="nav-item">' +
    '<a class="nav-link" data-toggle="tab" href="#document"><i class="la la-file-pdf-o mr-2"></i> Galeri Dokumen</a>' +
    "</li>" +
    "</ul>" +
    '<div class="tab-content">' +
    '<div class="tab-pane fade show active pt-2" id="images" role="tabpanel">' +
    '<div class="row" id="image">' +
    "</div>" +
    "</div>" +
    '<div class="tab-pane fade pt-2" id="videos" role="tabpanel">' +
    '<div class="row" id="video" >' +
    "</div>" +
    "</div>" +
    '<div class="tab-pane fade pt-2" id="document" role="tabpanel">' +
    '<div class="row" id="dokumen">' +
    "</div>" +
    "</div>" +

    "</div>" +
    "</div>";

  $("#data_load").append(gallery_tab);

  loadSenaraiProgramBergambar("programListBergambar", "image");
  loadSenaraiProgramBergambar("programListVideo", "video");
  loadSenaraiProgramBergambar("programListDokumen", "dokumen");

}

// End Laman Utama

// Carian

function loadSenaraiProgramBergambar(varAPI, varAppend) {
  var obj = new get(host+varAPI,window.sessionStorage.token).execute();
  console.log(obj)
  if(obj.success){
    console.log(obj);
    var data = obj.data;
    $.each(data, function (f, field) {
      imgsrc = "";
      if (field.media_path != null) {
        img = JSON.parse(field.media_path);
        imgsrc = img[0].images;
      }
      t_program = new Date(field.tarikh_program);

      if (varAppend == "image") {
        flag = 1;
        thumbnail =
          '<img class="img-fluid" src="../api_asdcm/public/uploads/' +
          imgsrc +
          '" alt="">';
      } else if(varAppend == "video"){
        flag = 2;
        thumbnail =
          '<video id="video-element" src="../api_asdcm/public/uploads/' +
          imgsrc +
          '" controls>' +
          '<source type="video/mp4">' +
          "</video>" +
          '<canvas id="canvas-element"></canvas>';
      } else{
        let fileSrc = "../api_asdcm/public/uploads/" + imgsrc;
        flag = 3;
        thumbnail =
          '<a href="' + fileSrc + '" target="_blank" class="document-link">' +
          imgsrc +
          "</a>";      
        }


      
      data_programs =
        '<div class="col-lg-12 col-xl-6">' +
        '<div class="card">' +
        '<div class="card-body">' +
        '<div class="row m-b-30">' +
        '<div class="col-md-5 col-xxl-12">' +
        '<div class="new-arrival-product mb-4 mb-xxl-4 mb-md-0">' +
        '<div class="new-arrivals-img-contnent">' +
        '<img class="img-fluid" src="api_asdcm/public/uploads/' +
        imgsrc +
        '" onclick="detail_media(' +
        field.PK +
        "," +
        flag +
        ')" alt="">' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="col-md-7 col-xxl-12">' +
        '<div class="new-arrival-content position-relative">' +
        "<h4>" +
        field.nama_program +
        "</h4>" +
        '<p>Tarikh: <span class="item" id="tarikh"> ' +
        t_program.getDate() +
        "/" +
        (t_program.getMonth() + 1) +
        "/" +
        t_program.getFullYear() +
        " </span></p>" +
        '<p>Kategori Program: <span class="item">' +
        field.nama_kategori +
        "</span> </p>" +
        '<p>Lokasi: <span class="item">' +
        field.nama_kampus +
        "</span></p>" +
        '<p>Kluster: <span class="item">' +
        field.nama_kluster +
        "</span></p>" +
        '<p>VIP: <span class="item">' +
        field.FK_vip +
        "</span></p>" +
        '<button class="btn btn-info" onclick="detail_media(' +
        field.PK +
        "," +
        flag +
        ')"><i class="la la-image"></i> <span style="font-size: 12px;">Lihat</span></button>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
      $("#" + varAppend).append(data_programs);
    });
  }else {
    $("#" + varAppend).html(
      '<div class="alert alert-info text-center text-black" role="alert">Tiada maklumat dipaparkan</div>'
    );  }
}

$("#Search").on("keyup", function () {
  val = $(this).val().toLowerCase();
  $(".card").each(function () {
    $(this).toggle($(this).text().toLowerCase().includes(val));
  });
});

// End Carian

$("#home").click(function () {
  sessionStorage.content = "halamanutama";
  $("#data_load").html("");
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Laman Utama</a></li>'
  );
  window.location.reload();
  // loadHalamanUtama();
  // data_program();
});

$("#profil").click(function () {
  sessionStorage.content = "profil";
  $("#data_load").html("");
  $("#permohonan").hide();
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Profil Pengguna</a></li>'
  );
  $("#data_load").load("profil.html");
  //load data_load
});

$("#ubahkatalaluan").click(function () {
  sessionStorage.content = "ubahkatalaluan";
  $("#data_load").html("");
  $("#permohonan").hide();
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Ubah Katalaluan</a></li>'
  );
  $("#data_load").load("ubahkatalaluan.html");
  //load data_load
});

$("#notification").click(function () {
  sessionStorage.content = "list";
  $("#data_load").html("");
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Senarai Permohonan</a></li>'
  );
  list();
  //load data_load
});

$("#list").click(function () {
  sessionStorage.content = "list";
  $("#data_load").html("");
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Senarai Permohonan</a></li>'
  );
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
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    window.sessionStorage.clear();
    window.location.replace("login/");
  });
});

function detail_media(indexs, varType) {
  // alert(varType);
  $("#data_load").html("");
  $("#checkboxmedia").html("");

  $("#page_title").html(
    '<li class="breadcrumb-item"><a href="javascript:void(0)" onclick="window.location.reload()">Laman Utama</a></li>' +
      '<li class="breadcrumb-item active"><a href="javascript:void(0)">Maklumat Program</a></li>'
  );

  var obj = new get(host+`program/`+indexs,window.sessionStorage.token).execute();
  if(obj.success){
    var data = obj.data;
    $("#data_load").append(
      '<div id="checkboxmedia" class="row  mt-110"></div>'
    );
    // $("#data_load").append('<div id="checkboxmedia" class="row"></div>');
    $(":checkbox").attr("checked", false);

    $("#permohonan").show();
    $("#disp_id").val(data.id_program);
    $("#nama_program").text(data.nama_program);
    $("#tarikh_program").text(data.tarikh_program);
    media_path = JSON.parse(data.media_path);
    size = media_path.length;

    let bil = 0;
    $.each(media_path, function (f, field) {
      var preview = "";
      // bil++;
      let ext = field.images.split(".");
      let vip = "";
      if (field.FK_vip != undefined) {
        vip = field.FK_vip.replace(/;/g, ",");
      }

      if (varType == 1) {
        if (ext[1] != "mp4" && ext[1] != "mov") {
          preview =
            '<img class="img-fluid"  style="height:50%" src="api_asdcm/public/uploads/' +
            field.images +
            '" alt="JING">';

          data_programs =
            '<div class="pic-view">' +
            '<label for="'+field.images+'">' +
            `<div class="card p-0-7">` +
            '<div class="card-body p-0"><input class="" type="checkbox" name="media_selected[]" value="' +
            field.images +
            ";" +
            field.FK_vip +
            '" id="' +
            field.images +
            '"/>' +
            '<div class="new-arrival-product">' +
            '<div class="new-arrivals-img-contnent">' +
            '<div class="watermark">' +
            preview +
            "<span>" +
            vip +
            "</span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            '</label>' +
            "</div>";
          if(data.media_path_2){
            $.each(data.media_path_2,function(i,item){
              if(item == field.images){
                bil++;
                $("#bilangan_media").text(bil);
                $("#checkboxmedia").append(data_programs);
              }
            })
          }
        }
      } else {
        if (ext[1] == "mp4" || ext[1] == "mov") {
          // preview = '<span class="" style="font-size:175px"><i class="la la-file-video-o"></i></span>';
          preview =
            '<video id="video-element' +
            field.images +
            '" height="200">' +
            '<source src="../api_asdcm/public/uploads/' +
            field.images +
            '" type="video/mp4" preload="none" >' +
            "</video>" +
            '<canvas id="canvas-element' +
            field.images +
            '"></canvas>';

          data_programs =
            '<div class="vid-view">' +
            '<div class="card p-0-7">' +
            `<div class="card-body p-0" onclick="$('#`+field.images+`').prop('checked',true)"><input class="" type="checkbox" name="media_selected[]" value="` +
            field.images +
            ";" +
            field.FK_vip +
            '" id="' +
            field.images +
            '"/>' +
            '<div class="new-arrival-product">' +
            '<div class="new-arrivals-img-contnent">' +
            preview +
            "<span>" +
            vip +
            "</span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
          if(data.media_path_2){
            $.each(data.media_path_2,function(i,item){
              if(item == field.images){
                bil++;
                $("#bilangan_media").text(bil);
                $("#checkboxmedia").append(data_programs);
              }
            })
          }
          getThumbnail(field.images);
        }
      }
    });

    let class_vid_length = "";
    let count_vid = $(".vid-view").length;
    if (count_vid == 1)
      class_vid_length = "col-xl-6 col-lg-6 col-md-6 col-sm-6";
    else if (count_vid == 2)
      class_vid_length = "col-xl-5 col-lg-6 col-md-6 col-sm-6";
    else if (count_vid > 2)
      class_vid_length = "col-xl-3 col-lg-6 col-md-6 col-sm-6";
    $(".vid-view").addClass(class_vid_length);

    let class_pic_length = "";
    let count_pic = $(".pic-view").length;
    if (count_pic == 1)
      class_pic_length = "col-xl-6 col-lg-6 col-md-6 col-sm-6";
    else if (count_pic == 2)
      class_pic_length = "col-xl-5 col-lg-6 col-md-6 col-sm-6";
    else if (count_pic > 2)
      class_pic_length = "col-xl-3 col-lg-6 col-md-6 col-sm-6";
    $(".pic-view").addClass(class_pic_length);
  } else {

  }
}

function getThumbnail(images) {
  data_programs =
    "<script>" +
    'var _VIDEO = document.querySelector("#video-element"' +
    images +
    ")," +
    '_CANVAS = document.querySelector("#canvas-element"' +
    images +
    ");" +
    // Video metadata is loaded
    '_VIDEO.addEventListener("loadedmetadata", function() {' +
    // Set canvas dimensions same as video dimensions
    // '_CANVAS.width = _VIDEO.videoWidth;'+
    // '_CANVAS.height = _VIDEO.videoHeight;'+
    "});" +
    'var _VIDEO = document.querySelector("#video-element"' +
    images +
    ")," +
    '_CANVAS = document.querySelector("#canvas-element"' +
    images +
    ")," +
    '_CANVAS_CTX = _CANVAS.getContext("2d");' +
    // Placing the current frame image of the video in the canvas
    "_CANVAS_CTX.drawImage(_VIDEO, 0, 0, _VIDEO.videoWidth, _VIDEO.videoHeight);" +
    "</script>";
  $("#data_load").append(data_programs);
}

function data_program() {
  $("#permohonan").hide();
  $("#data_load").html("");
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Laman Utama</a></li>'
  );
  var obj = new get(host+`programListBergambar`,window.sessionStorage.token).execute();
  if(obj.success){
    var data = obj.data;
    $.each(data, function (i, field) {
      imgsrc = "";
      if (field.media_path != null) {
        img = JSON.parse(field.media_path);
        bil = 0;
        $.each(img, function (i2, field2) {
          while (bil < 1) {
            imgsrc = field2.images;
            // console.log(imgsrc);
            bil++;
          }
        });
        // console.log(img);
      }
      t_program = new Date(field.tarikh_program);
      data_programs =
        '<div class="col-lg-6 col-xl-6">' +
        '<div class="card">' +
        '<div class="card-body">' +
        '<div class="row m-b-30">' +
        '<div class="col-sm-12 col-md-5 col-xl-5">' +
        '<div class="new-arrival-product mb-4 mb-xxl-4 mb-md-0">' +
        '<div class="new-arrivals-img-contnent">' +
        '<img class="img-fluid" src="../api_asdcm/public/uploads/' +
        imgsrc +
        '" alt="">' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="col-sm-12 col-md-7 col-xl-7">' +
        '<div class="new-arrival-content position-relative">' +
        "<h4>" +
        field.nama_program +
        "</h4>" +
        '<p>Tarikh: <span class="item" id="tarikh"> ' +
        t_program.getDate() +
        "/" +
        (t_program.getMonth() + 1) +
        "/" +
        t_program.getFullYear() +
        " </span></p>" +
        '<p>Kategori Program: <span class="item">' +
        field.nama_kategori +
        "</span> </p>" +
        '<p>Lokasi: <span class="item">' +
        field.nama_kampus +
        "</span></p>" +
        '<button class="btn btn-info" onclick="detail_media(' +
        field.PK +
        ')"><i class="fa fa-view"></i> Lihat</button>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
      $("#data_load").append(data_programs);
    });
  } else {

  }
}

function list() {
  $("#data_load").html("");
  $("#permohonan").hide();
  $("#page_title").html(
    '<li class="breadcrumb-item active"><a href="javascript:void(0)">Senarai Permohonan</a></li>'
  );
  data_programs =
    "" +
    '<div class="col-lg-12 col-xl-12 mt-60">' +
    '<div class="card">' +
    '<div class="card-body">' +
    '<div id="tablePermohonan">' +
    '<textarea style="display: none;" id="dataList"></textarea>' +
    '<table id="permohonanList" class="table table-striped table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%; font-size: 12px;"></table>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";
  $("#data_load").append(data_programs);
  var colums = [
    { data: "bil", title: "<span style='font-size: 12px;'>Bil</span>" },
    { data: "nama_program", title: "<span style='font-size: 12px;'>Nama Program</span>", class: "desktop" },
    // { "data": "nama", "title": "Nama Pemohon", class: "desktop" },
    { data: "tarikh_permohonan", title: "<span style='font-size: 12px;'>Tarikh Permohonan</span>", class: "desktop" },
    { data: "tarikh_pengesahan", title: "<span style='font-size: 12px;'>Tarikh Pengesahan</span>", class: "desktop" },
    { data: "tarikh_luput", title: "<span style='font-size: 12px;'>Tarikh Luput</span>", class: "desktop" },
    { data: "nama_status", title: "<span style='font-size: 12px;'>Status</span>", class: "desktop" },
    { data: "upt_btn", title: "<span style='font-size: 12px;'>Tindakan</span>", class: "desktop" },
    // {"name":"status","title":"Status","breakpoints":"sm xs"}
  ];

  var obj = new get(host+`permohonanByUsers/`+window.sessionStorage.id,window.sessionStorage.token).execute();
  if(obj.success){
    var data = obj.data;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];
    let bil = 1;

    $.each(data, function (i, field) {
      t_permohonan = new Date(field.tarikh_permohonan);
      if (field.tarikh_luput == null) {
        t_luput_list = "-";
      } else {
        t_luput = new Date(field.tarikh_luput);
        t_luput_list =
          t_luput.getDate() +
          "/" +
          (t_luput.getMonth() + 1) +
          "/" +
          t_luput.getFullYear();
      }
      if (field.tarikh_pengesahan == null) {
        t_pengesahan_list = "-";
      } else {
        t_pengesahan = new Date(field.tarikh_pengesahan);
        t_pengesahan_list =
          t_pengesahan.getDate() +
          "/" +
          (t_pengesahan.getMonth() + 1) +
          "/" +
          t_pengesahan.getFullYear();
      }
      var button_detail = "";
      var button_download = "";
      var button_update = "";
      now = new Date();
      if (field.nama_status == "Lulus") {
        if (t_luput - now < 0) {
          var form = new FormData();
          form.append("id_permohonan", field.id_permohonan);
          form.append("status_permohonan", "5");
          var obj = new post(host+`permohonanLuput`,form,window.sessionStorage.token).execute();
          if(obj.success){

          } else {

          }
          var settings = {
            url: host + "permohonanLuput",
            method: "POST",
            timeout: 0,
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            data: form,
          };
          $.ajax(settings).done(function (response) {});
          badge_status = '<span class="badge badge-danger">Luput</span>';
          button_detail = "";
          button_download = "";
          button_update = 'dark"';
        } else {
          badge_status =
            '<span class="badge badge-success">' +
            field.nama_status +
            "</span>";
          // button_detail = '<a onclick="download_media('+field.id_permohonan+')">' + field.nama_program + '</a>'
          button_detail = field.nama_program;
          button_download =
            'success" onclick="muatturun_permohonan(\'' +
            field.id_permohonan +
            "')\"";
        }
      } else if (field.status_permohonan == "3") {
        badge_status =
          '<span class="badge badge-danger">' + field.nama_status + "</span>";
        button_detail = field.nama_program;
        button_download = 'dark"';
        button_update = 'dark"';
      } else if (field.status_permohonan == "4") {
        badge_status =
          '<span class="badge badge-danger">' + field.nama_status + "</span>";
        button_detail = field.nama_program;
        button_download = 'dark"';
        button_update = 'dark"';
      } else if (field.status_permohonan == "1") {
        badge_status =
          '<span class="badge badge-primary">' + field.nama_status + "</span>";
        button_detail = field.nama_program;
        button_download = 'dark"';
        button_update = 'primary" onclick=';
      } else if (field.status_permohonan == "5") {
        badge_status =
          '<span class="badge badge-danger">' + field.nama_status + "</span>";
        button_detail = field.nama_program;
        button_download = 'dark"';
        button_update = 'dark"';
      }

      list.push({
        id: field.PK,
        FK_users: field.FK_users,
        nama_program: button_detail,
        nama: field.nama,
        tarikh_pengesahan: t_pengesahan_list,
        tarikh_permohonan:
          t_permohonan.getDate() +
          "/" +
          (t_permohonan.getMonth() + 1) +
          "/" +
          t_permohonan.getFullYear(),
        tarikh_luput: t_luput_list,
        nama_status: badge_status,
        bil: bil++,
        upt_btn:
          '<button type="button" class="badge badge-' +
          button_update +
          "\"loadData('" +
          i +
          '\')"><i class="fa fa-pencil-square-o"></i></button> ' +
          '<button type="button" class="badge badge-' +
          button_download +
          '><i class="fa fa-download"></i></button>',
      });
    });

    $("#permohonanList").DataTable({
      retrieve: true,
      columns: colums,
      data: list,
    });
  } else {

  }
}

function loadData(indexs) {
  let data = JSON.parse($("#dataList").val());
  let medialist = JSON.stringify(data[indexs].media_list).split(",");
  $("#upt_id").val(data[indexs].id_permohonan);
  $("#upt_nama_program").html(data[indexs].nama_program);
  $("#upt_tarikh_program").html(data[indexs].tarikh_program);
  $("#upt_bilangan_media").html(medialist.length);
  $("#upt_sebab").val(data[indexs].sebab);
  $("#upt_customCheckBox3").prop("checked", true);

  $("#update-permohonan").modal("show");
}

function download_media(indexs) {
  $("#checkAll").prop("checked", false);
  $("#data_load").html("");
  $("#checkboxmedia").html("");
  $("#page_title").html(
    '<li class="breadcrumb-item"><a href="javascript:void(0)" onclick="list()">Senarai Permohonan</a></li>' +
      '<li class="breadcrumb-item active"><a href="javascript:void(0)">Maklumat Program</a></li>'
  );

  var settings = {
    url: host + "permohonan/" + indexs,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    $("#data_load").append('<div id="checkboxmedia" class="row mt-110"></div>');
    // $("#permohonan").show();
    $("#muatturun").show();
    $("#disp_id").val(data.FK_program);
    media_path = JSON.parse(data.media_path);
    // console.log(data.media_path);

    $.each(media_path, function (i, field) {
      data_programs =
        '<div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">' +
        '<div class="card">' +
        '<div class="card-body"><input class="" type="checkbox" name="media_selected[]" value="' +
        field.images +
        '" id="' +
        field.images +
        '"/>' +
        '<div class="new-arrival-product">' +
        '<div class="new-arrivals-img-contnent">' +
        '<label for="' +
        field.images +
        '"><img class="img-fluid" src="api_asdcm/public/uploads/' +
        field.images +
        '" alt=""></label>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
      $("#checkboxmedia").append(data_programs);
    });
    // $("#data_load").append('</div>')
  });
}

$("#reg-permohonan").on("shown.bs.modal", function () {
  $(this).find("#sebab").focus();
});

$("#modal-permohonan").click(function () {
  $("#bilangan_media_selected").text("");
  let media_list = $('#checkboxmedia [type="checkbox"]:checked')
    .map(function () {
      let bil_selected = $("#bilangan_media_selected").text();
      if (bil_selected != "") bil_selected = parseInt(bil_selected) + 1;
      else bil_selected = 1;

      $("#bilangan_media_selected").text(bil_selected);
    })
    .get();

  $("#reg-permohonan").modal("show");
});

var confirmed = false;
$("#registerpermohonan").on("submit", function (e) {
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
      html: false,
    }).then(function () {
      $("#reg-permohonan").modal("hide");
      t_program = new Date();
      let FK_users = window.sessionStorage.id;
      let sebab = $("#sebab").val();
      let FK_program = $("#disp_id").val();
      let status_permohonan = "1";
      let tarikh_permohonan =
        t_program.getFullYear() +
        "-" +
        (t_program.getMonth() + 1) +
        "-" +
        t_program.getDate();
      let statusrekod = "1";
      let image = "";
      let flag_vip = 0;
      let media_list = $('#checkboxmedia [type="checkbox"]:checked')
        .map(function () {
          image = this.value.split(";");

          if (image[1] != "undefined") {
            flag_vip = 1;
          } else {
            if (flag_vip == 1) flag_vip = 1;
          }
          return image[0];
        })
        .get();

      // alert(media_list);
      // var param = {
      //     twmTitle: FK_program,
      //     twmDescription: status_permohonan,
      //     twmSdate: tarikh_permohonan,
      //     twmEdate: statusrekod,
      // }
      // console.log(param)

      var form = new FormData();
      // formData.append("key","mSideDiary");
      form.append("FK_users", FK_users);
      form.append("sebab", sebab);
      form.append("FK_program", FK_program);
      form.append("status_permohonan", status_permohonan);
      form.append("tarikh_permohonan", tarikh_permohonan);
      form.append("media_list", media_list);
      form.append("created_by", window.sessionStorage.id);
      form.append("updated_by", window.sessionStorage.id);
      form.append("statusrekod", "1");
      form.append("flag_vip", flag_vip);

      var obj = new post(host+`addPermohonan`,form,window.sessionStorage.token).execute();
      if(obj.success){
        swal({
          title: "Muat Turun Media",
          text: "Permohonan Berjaya Didaftar!",
          type: "success",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          // sessionStorage.token = result.token;
          // window.location.reload();
          loadHalamanUtama();
        });
      } else {
        swal({
          title: "Muat Turun Media",
          text: "Permohonan Gagal!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          return false;
        });
      }
    });
  }
});

var confirmed = false;
$("#updatepermohonan").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Kemaskini Permohonan Muat Turun Media",
      text: "Anda Pasti Untuk Kemaskini Permohonan Muat Turun?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      $("#update-permohonan").modal("hide");
      t_program = new Date();
      let FK_users = window.sessionStorage.id;
      let id = $("#upt_id").val();
      let sebab = $("#upt_sebab").val();
      // let sebab = $("#sebab").val();
      // let FK_program = $("#disp_id").val();
      // let status_permohonan = "1";
      // let tarikh_permohonan = t_program.getFullYear() + "-" + (t_program.getMonth() + 1) + "-" + t_program.getDate();
      // let statusrekod = "1";
      // let image = '';
      // let flag_vip = 0;
      // let media_list = $('#checkboxmedia [type="checkbox"]:checked').map(function () {

      //     image = this.value.split(';');

      //     if(image[1] != 'undefined'){
      //         flag_vip = 1;
      //     }else{
      //         if(flag_vip == 1) flag_vip = 1;
      //     }
      //     return image[0];
      // }).get();

      var form = new FormData();

      form.append("updated_by", FK_users);
      form.append("sebab", sebab);
      form.append("id_permohonan", id);

      var settings = {
        url: host + "permohonanUpdatePemohon",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
      };

      $.ajax(settings).done(function (response) {
        // console.log(response);
        result = JSON.parse(response);
        if (!result.success) {
          // Swal(result.message, result.data, "error");
          // return;
          swal({
            title: "Kemaskini Permohonan",
            text: "Permohonan Gagal!",
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            window.location.reload();
          });
        }
        swal({
          title: "Kemaskini Permohonan",
          text: "Permohonan Berjaya Direkod!",
          type: "success",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          // sessionStorage.token = result.token;
          window.location.reload();
        });
      });
    });
  }
});

$("#carianProgram").on("submit", function (e) {
  // let $this = $(this);

  let tahun = $("#tahun").val();
  let FK_kategori = $("#FK_kategori").val();
  let nama_program = $("#nama_program").val();
  let FK_vip = $("#FK_vip").val();

  if (!confirmed) {
    e.preventDefault();
    var form = new FormData();
    // formData.append("key","mSideDiary");
    form.append("tahun", tahun);
    form.append("FK_kategori", FK_kategori);
    form.append("nama_program", nama_program);
    form.append("FK_vip", FK_vip);

    var settings = {
      url: host + "searchProgram",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      // console.log(response);
      result = JSON.parse(response);
      if (!result.success) {
        sessionStorage.token = result.token;
        window.location.reload();
      }
    });
  }
});

function del_record() {
  swal({
    title: "Batal Permohonan",
    text: "Anda Pasti Untuk Membatalkan Permohonan?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    let id = $("#upt_id").val();
    var form = new FormData();
    form.append("id_permohonan", id);

    var settings = {
      url: host + "permohonanCancel",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      // console.log(response)
      result = JSON.parse(response);
      if (!result.success) {
        // return;
        swal({
          title: "Batal Permohonan",
          text: "Gagal!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          window.location.reload();
        });
      } else {
        swal({
          title: "Batal Permohonan",
          text: "Berjaya!",
          type: "success",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          sessionStorage.content = "list";
          saveLog(
            window.sessionStorage.id,
            "Cancel Data [" + nama_program + "] at Permohonan Media.",
            window.sessionStorage.browser
          );
          $("#update-permohonan").modal("hide");
        });
      }

      // saveLog(window.sessionStorage.id,"Change Record Status for [id_tempoh = " + result.data.id_tempoh + "] at Tetapan Tempoh Media.",window.sessionStorage.browser);
    });
    window.location.reload();
  });
}

//MIMI : CLICK BUTTON MOHON LEPAS PILIH FILE START
// $("#muatturun-permohonan").click(function () {
//     swal({
//         title: "Muat Turun Media",
//         text: "Anda Pasti Untuk Muat Turun?",
//         type: "question",
//         showCancelButton: true,
//         confirmButtonText: "Ya",
//         cancelButtonText: "Tidak",
//         closeOnConfirm: true,
//         allowOutsideClick: false,
//         html: false
//     }).then(function(){

//         t_program = new Date();
//         let FK_users = window.sessionStorage.id;
//         let status_permohonan = "1";
//         let tarikh_muatturun = t_program.getFullYear() + "" + (t_program.getMonth() + 1) + "" + t_program.getDate();
//         let FK_program = $("#disp_id").val();
//         let media_list = $('#checkboxmedia [type="checkbox"]:checked').map(function () {
//             return this.value;
//         }).get();
//         let statusrekod = "1";

//         var form = new FormData();
//         form.append("FK_users",FK_users);
//         form.append("FK_program",FK_program);
//         form.append("tarikh_muatturun",tarikh_muatturun);
//         form.append("media_list",media_list);
//         form.append("statusrekod","1");

//         var settings = {
//             "url": host+"public/permohonanDownload",
//             "method": "POST",
//             "timeout": 0,
//             "processData": false,
//             "mimeType": "multipart/form-data",
//             "contentType": false,
//             "data": form
//         };

//         $.ajax(settings).done(function (response) {

//             console.log(response);
//             result = JSON.parse(response);
//             if (result.success) {

//                 window.location="../api_asdcm/public/"+result.data;

//                 removeZip(result.data);

//             }

//         });

//     });
// });
function muatturun_permohonan(id) {
  swal({
    title: "Muat Turun Media",
    text: "Anda Pasti Untuk Muat Turun?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    t_program = new Date();
    // let FK_users = window.sessionStorage.id;
    // let status_permohonan = "1";
    let tarikh_muatturun =
      t_program.getFullYear() +
      "" +
      (t_program.getMonth() + 1) +
      "" +
      t_program.getDate();
    let statusrekod = "1";

    var form = new FormData();
    form.append("tarikh_muatturun", tarikh_muatturun);
    form.append("id_permohonan", id);
    $("#loading_modal").modal("show");
    var settings = {
      url: host + "permohonanDownload",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      // console.log(response);
      result = JSON.parse(response);
      $("#loading_modal").modal("hide");

      if (result.success) {
        window.location = "api_asdcm/public/uploads/" + result.data;
        swal({
          title: "Muat Turun Media",
          text: "Muat turun media berjaya!",
          type: "success",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          removeZip(result.data);
        });
      } else {
        swal({
          title: "Muat Turun Media",
          text: "Media tiada dalam rekod!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {});
      }
    });
  });
}
//MIMI : CLICK BUTTON MOHON LEPAS PILIH FILE END

//MIMI : REMOVE FILE ZIP LEPAS DOWNLOAD START
function removeZip(file_name) {
  var formDel = new FormData();
  formDel.append("file_name", file_name);

  var settingPadam = {
    url: host + "permohonanRemove",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: formDel,
  };

  $.ajax(settingPadam).done(function (responsePadam) {
    window.location.reload();
  });
}
//MIMI : REMOVE FILE ZIP LEPAS DOWNLOAD END

//MIMI : CHECKED ALL CHECKBOX START
$("#checkAll").click(function () {
  $("input:checkbox").not(this).prop("checked", this.checked);
});
//MIMI : CHECKED ALL CHECKBOX END

function listNotification(returnValue) {
  var obj = new get(host+`permohonanByUsersNotification/`+window.sessionStorage.id).execute();
  if(obj.success){
    obj_listNotification = obj;
    if (JSON.stringify(obj_listNotification.data) != "[]") {
      $.each(obj_listNotification.data, function (i, item) {
        t_luput = new Date(item.tarikh_luput);
        $("#icon_notification").show();
        listnotification =
          "<li>" +
          '<div class="timeline-panel">' +
          '<div class="media-body">' +
          '<h6 class="mb-1">' +
          item.nama_program +
          "<br>Status: " +
          item.nama_status +
          "</h6>" +
          '<small class="d-block">Sah Sehingga: ' +
          t_luput.getDate() +
          "/" +
          (t_luput.getMonth() + 1) +
          "/" +
          t_luput.getFullYear() +
          "</small>" +
          "</div>" +
          "</div>" +
          "</li>";
        $("#notification").append(listnotification);
      });
    } else {
      listnotification =
        "<li>" +
        '<div class="timeline-panel">' +
        '<div class="media-body">' +
        '<h6 class="mb-1">Tiada Notifikasi</h6>' +
        "</div>" +
        "</div>" +
        "</li>";
      $("#notification").append(listnotification);
    }
  } else {

  }
}

var timeoutSession;
$(document).mousemove(function (e) {
  clearTimeout(timeoutSession);
  timeoutSession = setTimeout(function () {
    swal({
      title: "Penamatan Sesi",
      text: "Sila Log Semula.",
      type: "error",
      showConfirmButton: false,
      allowOutsideClick: false,
      html: false,
      timer: 3000,
    }).then(
      function () {},
      function (dismiss) {
        if (dismiss === "timer") {
          window.sessionStorage.clear();
          window.location.replace("login/");
        }
      }
    );
  }, 900000); //5 mins
});
