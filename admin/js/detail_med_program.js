$(function () {
  $.ajaxSetup({
    cache: false,
  });
  cekCapaian();
  onPageLoad();
});

function cekCapaian() {
  //TETAPAN MEDIA (ID:1)
  if (window.sessionStorage.control_program_media_C2 == 1) {
    $("#control_program_media_C2").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_R2 == 1) {
    $("#control_program_media_R2").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_U2 == 1) {
    $("#control_program_media_U2").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_D2 == 1) {
    $("#control_program_media_D2").removeClass("hidden");
  }
}

var bil = 0;
var bil_upload = 0;
$.fileup({
  // url: 'file/upload',
  inputID: "upload-2",
  dropzoneID: "upload-2-dropzone",
  queueID: "upload-2-queue",
  lang: "en",
  onSelect: function (file) {
    let ext = file.name.split(".").pop();
    let kod_format = $("#disp_kod_format").text();
    let format = kod_format.toLowerCase().split(",");
    let formatupper = kod_format.toUpperCase().split(",");
    let bil_file = $("#disp_bilangan_fail").text();
    let img_list = $("#dataList").val().split(",").length - 1;
    let bal_file = bil_file - img_list;

    let size = $("#disp_saiz_fail").text() * 1048576;
    let size_file = file.size;

    if (bil < bal_file) {
      // if ($.inArray(ext, format) == 1){
      if (format.includes(ext) == true || formatupper.includes(ext) == true) {
        if (size_file < size) {
          $("#multiple button").show();
          ++bil;
        } else {
          return false;
        }
      } else {
        swal({
          title: "Muat Naik Media",
          text: "Hanya format fail " + kod_format + " sahaja dibenarkan!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {});
        return false;
      }
    } else {
      swal({
        title: "Muat Naik Media",
        text:
          img_list +
          " media daripada " +
          bil_file +
          " media telah disimpan. Hanya " +
          bal_file +
          " media dibenarkan untuk dimuat naik!",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {});
      return false;
    }
  },
  onRemove: function (file, total) {
    if (file === "*" || total === 1) {
      $("#multiple button").hide();
    }
    bil = 0;
  },
  onSuccess: function (response, file_number, file) {
    $("#loading_modal").modal("show");

    $("#finishButton").removeAttr("data-dismiss");
    $("#finishButton").removeClass("button-danger");
    $("#finishButton").addClass("button-dark");
    $("#finishButton").prop("disabled", "disabled");

    var file_data = file;
    var form_data = new FormData();
    form_data.append("file", file_data);
    form_data.append("updated_by", window.sessionStorage.id);

    let check = $.ajax({
      url: host + "programUpload/" + window.sessionStorage.med_program_id,
      dataType: "text",
      cache: false,
      contentType: false,
      processData: false,
      data: form_data,
      method: "post",
      timeout: 0,
    });

    if (JSON.stringify(check.readyState) == 1) {
      ++bil_upload;
      // alert(bil_upload);
      imglist = $("#dataList").val();
      if (imglist == "") {
        imglist = [];
        imglist.push({
          images: window.sessionStorage.med_program_id + "_" + file.name,
        });
        $("#dataList").val(JSON.stringify(JSON.stringify(imglist)));
        saveImgList(JSON.stringify(imglist));
      } else {
        imglist = JSON.parse(JSON.parse($("#dataList").val()));
        imglist.push({
          images: window.sessionStorage.med_program_id + "_" + file.name,
        });
        $("#dataList").val(JSON.stringify(JSON.stringify(imglist)));
        saveImgList(JSON.stringify(imglist));

        if (bil == bil_upload) {
          $("#finishButton").html("");
          $("#finishButton").prop("data-dismiss", "modal");
          $("#finishButton").append('<i class="ti-check"></i>Selesai');
          $("#loading_modal").modal("hide");

          swal({
            title: "Muat Naik Rekod Berjaya",
            text: "Berjaya!",
            type: "success",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            onPageLoad();
          });
        }
      }
    }
  },
  onError: function (event, file, file_number) {
    console.log(file.name + " - " + "error,");
    //swal error
  },
  onFinish: function (e) {
    // window.location.reload();
  },
});

function reload_page() {
  window.location.reload();
}

function saveImgList(varImg) {
  var form_upload = new FormData();
  form_upload.append("file", varImg);
  form_upload.append("updated_by", window.sessionStorage.id);
  var settings = {
    url: host + "programUpload2/" + window.sessionStorage.med_program_id,
    method: "POST",
    timeout: 0,
    contentType: false,
    processData: false,
    data: form_upload,
  };
  $.ajax(settings).done(function (response) {
    // window.location.reload();
  });
}

// $.fileup({
//     // url: 'file/upload',
//     inputID: 'upload-2',
//     dropzoneID: 'upload-2-dropzone',
//     queueID: 'upload-2-queue',
//     lang: 'en',
//     onSelect: function(file) {
//         $('#multiple button').show();
//     },
//     onRemove: function(file, total) {
//         if (file === '*' || total === 1) {
//             $('#multiple button').hide();
//         }
//     },
//     onSuccess: function(response, file_number, file) {
//         var file_data = file;

//         var ext = file.name.split('.').pop();

//         var form_data = new FormData();
//         form_data.append('file', file_data);
//         form_data.append('updated_by', window.sessionStorage.id);
//         $.ajax({
//             url: host + 'programUpload/' + window.sessionStorage.med_program_id,
//             dataType: 'text',
//             cache: false,
//             contentType: false,
//             processData: false,
//             data: form_data,
//             method: 'post',
//             timeout: 0
//         });
//         imglist = $('#dataList').val();
//         if(imglist == ""){
//             imglist = [];
//         }
//         else{
//             imglist =  JSON.parse(JSON.parse($('#dataList').val()));
//             // console.log(imglist)
//         }

//         var form_cek = new FormData();
//         form_cek.append('ext', ext);

//         var settings_cek = {
//             "url": host + "programUploadExt/" + window.sessionStorage.med_program_id,
//             "method": "POST",
//             "timeout": 0,
//             contentType: false,
//             processData: false,
//             data: form_upload,
//         };
//         $.ajax(settings).done(function (response) {

//             alert(response.data);
//             // if()

//             imglist.push({images: window.sessionStorage.med_program_id + "_" + file.name});
//             $('#dataList').val(JSON.stringify(JSON.stringify(imglist)));
//             // console.log(imglist)
//             var form_upload = new FormData();
//             form_upload.append('file', JSON.stringify(imglist));
//             form_upload.append('updated_by', window.sessionStorage.id);
//             var settings = {
//                 "url": host + "programUpload2/" + window.sessionStorage.med_program_id,
//                 "method": "POST",
//                 "timeout": 0,
//                 contentType: false,
//                 processData: false,
//                 data: form_upload,
//             };
//             $.ajax(settings).done(function (response) {
//                 window.location.reload();
//             });
//         });

//         //api_upload_img
//     },
//     onError: function(event, file, file_number) {
//         console.log(file.name+" - "+"error,");
//         //swal error
//     },
//     onFinish: function(e){
//         window.location.reload();
//     }
// });

function onPageLoad() {
  $("#loading_modal").modal("show");
  var settings = {
    url: host + "program/" + window.sessionStorage.med_program_id,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings)
    .done(function (response) {
      t_program = new Date(response.data.tarikh_program);

      vip = response.data.FK_vip;
      vip = vip.replace(/;/gi, " ,");

      // let vip = "";
      // console.log(JSON.parse(response.data.media_path));
      // $.each(JSON.parse(response.data.media_path), function(i, item){
      //     if (item.FK_vip != null){
      //         if (vip != ""){

      //         } else  {

      //         }
      //     }
      // });

      $("#disp_id").val(response.data.id_program);
      $("#upt_id").val(response.data.id_program);
      $("#disp_nama_program").text(response.data.nama_program);
      $("#disp_tarikh_program").text(
        t_program.getDate() +
          "/" +
          (t_program.getMonth() + 1) +
          "/" +
          t_program.getFullYear()
      );
      $("#disp_nama_kampus").text(response.data.nama_kampus);
      $("#disp_nama_kluster").text(response.data.nama_kluster);
      $("#disp_nama_unit").text(response.data.nama_unit);
      $("#disp_vip").text(vip);
      $("#disp_nama_kategori").text(response.data.nama_kategori);
      $("#disp_bilangan_fail").text(response.data.bilangan_fail);
      $("#disp_kod_format").text(response.data.kod_format);
      $("#disp_saiz_fail").text(response.data.saiz_fail);
      $("#uptid").val(response.data.id_program);
      let convertList = JSON.stringify(response.data.media_path);
      $("#dataList").val(convertList);

      if (convertList == "null") {
        $("#dataList").val("");
      }
      images = JSON.parse(response.data.media_path);
      $.each(images, function (i, field) {
        var preview = "";
        ext = field.images.split(".");

        var appendLoadData = "";

        if (window.sessionStorage.control_program_media_U2 == 1) {
          appendLoadData =
            "onclick=\"loadData('" +
            field.images +
            "',2,'" +
            field.FK_vip +
            "')\"";
        }

        if (ext[1] == "mp4" || ext[1] == "mov") {
          preview =
            '<span class="" style="font-size:80px" onclick="loadData(\'' +
            field.images +
            "',2,'" +
            field.FK_vip +
            '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-file-video-o"></i></span>';
          // preview = '<span class="" style="font-size:80px" onclick="loadData(\'' + field.images + '\',2)" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-file-video-o"></i></span>';
          // preview = '<img src="../api_asdcm/api_media//images/'+field.images+'" height="150px" alt="" onclick="loadData(\'' + field.images + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate">';
        } else if (ext[1] != "mp4" || ext[1] != "mov") preview = '<img src="../api_asdcm/public/uploads/' + field.images + '" height="150px" alt="" onclick="loadData(\'' + field.images + "',1,'" + field.FK_vip + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate">';

        listImages =
          '<div class="col-lg-3 col-12 mb-30 border">' +
          '<div class="row adomx-checkbox-radio-group" style="padding: 10px;"><input class="" type="checkbox" name="media_selected[]" value="' +
          field.images +
          ";" +
          field.id_program +
          '" id="' +
          field.images +
          '"/>' +
          '<div class="col-12" align="center"> <br>' +
          // '<div class="watermark">'+
          preview +
          "</div>" +
          // '</div>'+
          "</div>   " +
          "</div> ";
        $("#listImages").append(listImages);
      });
    })
    .then(function () {
      $("#loading_modal").modal("hide");
      $("#finishButton").removeClass("button-dark");
      $("#finishButton").addClass("button-primary");
      $("#finishButton").removeAttr("disabled");
    });
}

function loadData(indexs, varType, vip) {
  let data = JSON.parse($("#dataList").val());

  vip = vip.replace(/;/gi, " ,");

  if (varType == 1) {
    var img = new Image();
    img.src = "../api_asdcm/public/uploads/" + indexs;
  } else {
    var img = document.createElement("video");
    img.src = "../api_asdcm/public/uploads/" + indexs;
    img.width = 450;
    img.autoplay = false;
    img.controls = true;
    $("#video").bind("contextmenu", function () {
      return false;
    });
  }

  $("#imgText").val(indexs);

  // watermark = '<div class="watermark"></div>';
  document.getElementById("imgTags").appendChild(img);
  $("#FK_users").val("");
  if (vip != "undefined") $("#FK_users").val(vip);

  $("#tag-gambar").modal("show");
}

$("#closeButton").click(function () {
  const list = document.getElementById("imgTags");
  list.removeChild(list.firstElementChild);
});

$("#back").click(function () {
  if (window.sessionStorage.med_permohonan_id == 0) {
    window.sessionStorage.content = "html/med_program";
    $("#content").load("html/med_program.html");
  } else {
    window.sessionStorage.content = "html/med_permohonan";
    $("#content").load("html/med_permohonan.html");
  }
});

var confirmed = false;
$("#taggambar").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Tag VIP",
      text: "Anda Pasti Untuk Simpan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      $("#tag-gambar").modal("hide");

      let id = $("#upt_id").val();
      let imgText = $("#imgText").val();
      let FK_users = $("#FK_users").val();

      var form = new FormData();
      form.append("id_program", id);
      form.append("imgText", imgText);
      form.append("FK_users", FK_users);
      form.append("updated_by", window.sessionStorage.id);

      var settings = {
        url: host + "programTagging",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        result = JSON.parse(response);
        if (!result.success) {
          // Swal(result.message, result.data, "error");
          // return;
          swal({
            title: "Daftar Program",
            text: "Gagal!",
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            window.location.reload();
          });
        }
        swal({
          title: "Tagging Media",
          text: "Berjaya!",
          type: "success",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          sessionStorage.token = result.token;
          window.location.reload();
        });
      });
    });
  }
});

$("#reg-permohonan").click(function () {
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
    let FK_program = $("#disp_id").val();
    let status_permohonan = "1";
    let tarikh_permohonan =
      t_program.getFullYear() +
      "-" +
      (t_program.getMonth() + 1) +
      "-" +
      t_program.getDate();
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
    form.append("FK_users", FK_users);
    form.append("FK_program", FK_program);
    form.append("status_permohonan", status_permohonan);
    form.append("tarikh_permohonan", tarikh_permohonan);
    form.append("created_by", window.sessionStorage.id);
    form.append("updated_by", window.sessionStorage.id);
    form.append("statusrekod", "1");

    var settings = {
      url: host + "addPermohonan",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
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
          html: false,
        }).then(function () {
          window.location.reload();
        });
      }
      swal({
        title: "Muat Turun Media",
        text: "Permohonan Berjaya Direkod!",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        sessionStorage.token = result.token;
        window.location.reload();
      });
    });
  });
});

// $('#FK_users').change(function(){
//     var settings = {
//         "url": host+"vips/"+$("#FK_users").val(),
//         "method": "GET",
//         "timeout": 0,
//       };
//     $.ajax(settings).done(function (response) {
//         $("#FK_user").val(response.data.PK);
//         $("#FK_kampus").val(response.data.FK_kampus);
//         $("#FK_kluster").val(response.data.FK_kluster);
//         $("#FK_unit").val(response.data.FK_unit);
//     });
// })

//Dropdown User List
var settings = {
  url: host + "vipsList",
  method: "GET",
  timeout: 0,
  // "header":{
  //     "Authentication": "ASDCM"+window.sessionStorage.token
  //   }
};

$.ajax(settings).done(function (response) {
  //LIST OPTION
  $("#FK_userss").empty();
  $.each(response.data, function (i, item) {
    $("#FK_userss").append(
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
});
// END Dropdown User List

$("#listvip").change(function () {
  var text = $(this).val();
  var listvip = $("#FK_users").val().split(",");

  listvip.forEach((vip, index) => {
    if (vip.trim() == text) {
      listvip.splice(index, 1);
    }
  });

  if (listvip != "") {
    listvip = listvip + "," + text;
  } else {
    listvip = text;
  }

  $("#FK_users").val(listvip);
});

function del_media() {
  swal({
    title: "Kemaskini Media",
    text: "Anda Pasti Untuk Hapus Media?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    $("#tag-gambar").modal("hide");
    let FK_users = window.sessionStorage.id;
    let FK_program = $("#disp_id").val();
    let imgText = $("#imgText").val();

    var form = new FormData();

    form.append("updated_by", FK_users);
    // form.append("FK_program",FK_program);
    form.append("imgText", imgText);

    var settings = {
      url: host + "programMediaRemove/" + FK_program,
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      result = JSON.parse(response);
      if (!result.success) {
        // Swal(result.message, result.data, "error");
        // return;
        swal({
          title: "Kemaskini Media",
          text: "Hapus Media Gagal!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          window.location.reload();
        });
      }
      swal({
        title: "Hapus Media Media",
        text: "Hapus Media Berjaya!",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    });
  });
}

function del_media_multiple() {
  swal({
    title: "Hapus Media",
    text: "Anda Pasti Untuk Hapus Media Yang Dipilih?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    let media_list = $('#listImages [type="checkbox"]:checked')
      .map(function () {
        image = this.value.split(";");
        return image[0];
      })
      .get();
    del_media_multi(media_list);

    swal({
      title: "Hapus Media",
      text: "Hapus Media Berjaya!",
      type: "success",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      window.location.reload();
    });
  });
}

function del_media_multi(value) {
  let FK_users = window.sessionStorage.id;
  let FK_program = $("#disp_id").val();
  let imgText = value;

  var form = new FormData();

  form.append("updated_by", FK_users);
  // form.append("FK_program",FK_program);
  form.append("imgText", imgText);
  var settings = {
    url: host + "programMediaBunchRemove/" + FK_program,
    method: "POST",
    timeout: 0,
    processData: false,
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    return;
  });
}

$("#checkAll").click(function () {
  $("input:checkbox").not(this).prop("checked", this.checked);
});
