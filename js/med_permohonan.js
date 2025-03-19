window.sessionStorage.med_permohonan_id = 0;

$(function () {
  $.ajaxSetup({
    cache: false,
  });
  cekCapaian();
  listPermohonan();
  // onPageLoad();
});

function cekCapaian() {
  //TETAPAN MEDIA (ID:1)
  if (window.sessionStorage.control_program_media_C3 == 1) {
    $("#control_program_media_C3").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_R3 == 1) {
    $("#control_program_media_R3").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_U3 == 1) {
    $("#control_program_media_U3").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_D3 == 1) {
    $("#control_program_media_D3").removeClass("hidden");
  }
}

var settings = {
  url: host + "tempoh/1",
  method: "GET",
  timeout: 0,
};

$.ajax(settings).done(function (response) {
  $("#upt_tempoh").val(response.data.tempoh);
});

$("#back").click(function () {
  window.sessionStorage.content = "med_program";
  $("#content").load("med_program.html");
});

function listPermohonan() {
  if (window.sessionStorage.control_program_media_U3 == 1) {
    var colums = [
      { name: "bil", title: "Bil" },
      { name: "nama_program", title: "Nama Program" },
      { name: "nama", title: "Nama Pemohon", breakpoints: "md sm xs" },
      {
        name: "tarikh_permohonan",
        title: "Tarikh Permohonan",
        breakpoints: "md sm xs",
      },
      { name: "tarikh_luput", title: "Tarikh Luput", breakpoints: "md sm xs" },
      { name: "nama_status", title: "Status", breakpoints: "md sm xs" },
      { name: "upt_btn", title: "Tindakan", breakpoints: "md sm xs" },
    ];
  } else {
    var colums = [
      { name: "bil", title: "Bil2" },
      { name: "nama_program", title: "Nama Program" },
      { name: "nama", title: "Nama Pemohon", breakpoints: "md sm xs" },
      {
        name: "tarikh_permohonan",
        title: "Tarikh Permohonan",
        breakpoints: "md sm xs",
      },
      { name: "tarikh_luput", title: "Tarikh Luput", breakpoints: "md sm xs" },
      { name: "nama_status", title: "Status", breakpoints: "md sm xs" },
    ];
  }
  var list = [];
  let bil = 1;

  var obj = new get(host+`permohonanListFilter/`+FK_peranan_master+`/`+FK_kluster_master,window.sessionStorage.token);
  if (FK_peranan_master == 1) {
    obj = new get(host+`permohonanList`,window.sessionStorage.token);
  }
  obj = obj.execute();
  if(obj.success){
    let convertList = JSON.stringify(obj.data);

    $("#dataList").val(convertList);
    $.each(obj.data, function (f, field) {
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
      let badge_status = "";
      let disabled_button = "";
      let button_class = "";
      now = new Date();
      if (field.status_permohonan == "2") {
        if (t_luput - now < 0) {
          var form = new FormData();
          form.append("id", field.id_permohonan);
          form.append("status_permohonan", "5");
          objLuput = new post(host+`permohonanLuput`,form,window.sessionStorage.token).execute();
          badge_status = '<span class="badge badge-danger">Luput</span>';
          disabled_button = "disabled";
          button_class = "button-dark";
        } else {
          badge_status =
            '<span class="badge badge-success">' +
            field.nama_status +
            "</span>";
          button_class = "button-primary";
        }
      } else if (field.status_permohonan == "3") {
        badge_status =
          '<span class="badge badge-danger">' + field.nama_status + "</span>";
        button_class = "button-primary";
      } else if (field.status_permohonan == "4") {
        badge_status =
          '<span class="badge badge-danger">' + field.nama_status + "</span>";
        disabled_button = "disabled";
        button_class = "button-dark";
      } else if (field.status_permohonan == "1") {
        badge_status =
          '<span class="badge badge-primary">' + field.nama_status + "</span>";
        button_class = "button-primary";
      } else if (field.status_permohonan == "5") {
        badge_status =
          '<span class="badge badge-danger">' + field.nama_status + "</span>";
        disabled_button = "disabled";
        button_class = "button-dark";
      }
      list.push({
        id: field.id_permohonan,
        FK_users: field.FK_users,
        nama_program: `<p style="white-space: pre-line;">`+field.nama_program + `</p>`,
        nama_kampus: `<p style="white-space: pre-line;">`+field.nama_kampus + `</p>`,
        nama: field.nama,
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
          '<button class="button button-box button-sm ' +
          button_class +
          '" ' +
          disabled_button +
          " onclick=\"loadData('" +
          f +
          '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ti-pencil-alt"></i></button> ' +
          ' <button class="button button-box button-sm button-danger" title="Hapus" onclick="del_rekod(\'' +
          field.id_permohonan +
          '\')"><i class="ti-trash"></i>',
      });
    });
  } else {

  }
  $('#totalpermohonan').html(`<span class="timeline-date">`+(list.length)+` Permohonan</span>`);
  $("#permohonanList").html('');
  $("#permohonanList").footable({
    columns: colums,
    rows: list,
    paging: {
      enabled: true,
      size: 5,
    },
    filtering: {
      enabled: true,
      placeholder: "Carian...",
      dropdownTitle: "Carian untuk:",
      class: "brown-700",
    },
  });
}

function loadData(indexs) {
  let data = JSON.parse($("#dataList").val());
  var t_luput = new Date();
  var t_pengesahan = new Date();
  var t_permohonan = new Date(data[indexs].tarikh_permohonan);
  var media_list = data[indexs].media_list.split(",");

  document.getElementById("disp_nama_program").innerHTML =
    data[indexs].nama_program;
  document.getElementById("disp_nama").innerHTML = data[indexs].nama;
  document.getElementById("disp_tarikh_permohonan").innerHTML =
    t_permohonan.getDate() +
    "/" +
    (t_permohonan.getMonth() + 1) +
    "/" +
    t_permohonan.getFullYear();
  document.getElementById("disp_sebab").innerHTML = data[indexs].sebab;

  $("#upt_id").val(data[indexs].id_permohonan);
  $("#upt_status_permohonan").val(data[indexs].status_permohonan);
  $("#upt_catatan_permohonan").val(data[indexs].catatan_permohonan);
  $("#upt_tarikh_pengesahan").val(
    t_pengesahan.getFullYear() +
      "-" +
      (t_pengesahan.getMonth() + 1) +
      "-" +
      t_pengesahan.getDate()
  );
  $("#upt_tarikh_luput").val(
    t_luput.getFullYear() +
      "-" +
      (t_luput.getMonth() + 1) +
      "-" +
      t_luput.getDate()
  );
  $("#upt_pegawai_pelulus").val(window.sessionStorage.id);
  $("#upt_updated_by").val(window.sessionStorage.id);

  $("#media-list").html("");
  $.each(media_list, function (i, item) {
    var append_media = "";
    let split = item.split(".");
    let ext = split[1];

    if (
      ext != "mp4" &&
      ext != "mov" &&
      ext != "wmv" &&
      ext != "avi" &&
      ext != "flv" &&
      ext != "mkv" &&
      ext != "webm"
    ) {
      append_media =
        '<div class="col-lg-6 col-md-6 col-sm-12 mb-3">' +
        '<img src="user/api_asdcm/public/uploads/' +
        item +
        '" >' +
        "</div>";
    } else {
      append_media =
        '<div class="col-lg-6 col-md-6 col-sm-12 mb-3"><video src="user/api_asdcm/public/uploads/' +
        item +
        '" width="450" controls=""></video></div>';
    }

    $("#media-list").append(append_media);
  });

  $("#update-permohonan").modal("show");
}

function detail(i, indexs) {
  let d = JSON.parse($("#dataList").val());
  let data = d[indexs];
  window.sessionStorage.med_program_id = data.FK_program;
  window.sessionStorage.med_permohonan_id = data.PK;
  window.sessionStorage.content = "detail_med_program";
  window.location.reload();
}

var confirmed = false;

//FUNCTION UPDATE

$("#update").on("submit", function (e) {
  let $this = $(this);

  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Kemaskini Permohonan",
      text: "Anda Pasti Untuk Kemaskini?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let upt_id = $("#upt_id").val();
      let upt_catatan_permohonan = $("#upt_catatan_permohonan").val();
      let upt_status_permohonan = $("#upt_status_permohonan").val();
      let upt_tarikh_pengesahan = $("#upt_tarikh_pengesahan").val();
      let upt_tarikh_luput = $("#upt_tarikh_luput").val();
      let upt_tempoh = $("#upt_tempoh").val();
      let upt_pegawai_pelulus = $("#upt_pegawai_pelulus").val();
      let upt_updated_by = $("#upt_updated_by").val();

      var param = {
        twmTitle: upt_id,
        twmDescription: upt_tarikh_pengesahan,
        twmSdate: upt_tarikh_luput,
        twmEdate: upt_tempoh,
        twmYear: upt_updated_by,
      };

      var form = new FormData();
      form.append("id_permohonan", upt_id);
      form.append("catatan_permohonan", upt_catatan_permohonan);
      form.append("status_permohonan", upt_status_permohonan);
      form.append("tarikh_pengesahan", upt_tarikh_pengesahan);
      form.append("tarikh_luput", upt_tarikh_luput);
      form.append("tempoh", upt_tempoh);
      form.append("pegawai_pelulus", upt_pegawai_pelulus);
      form.append("updated_by", upt_updated_by);

      var obj = new post(host+`permohonanUpdate`,form,window.sessionStorage.token).execute();
      if(obj.success){
        swal({
          title: "Kemaskini Permohonan",
          text: "Kemaskini Berjaya!",
          type: "success",
          showConfirmButton: false,
          allowOutsideClick: false,
          html: false,
          timer: 1000,
        }).then(
          function () {},
          function (dismiss) {
            if (dismiss === "timer") {
              window.location.reload();
            }
          }
        );
      } else {
        swal({
          title: "Kemaskini Permohonan",
          text: "Kemaskini Gagal!",
          type: "error",
          showConfirmButton: false,
          allowOutsideClick: false,
          html: false,
          timer: 1000,
        }).then(
          function () {},
          function (dismiss) {
            if (dismiss === "timer") {
              window.location.reload();
            }
          }
        );
      }
    });
  }
});

// FUNCTION DELETE

function del_rekod(i) {
  let statusrekod = "DEL";
  let id = i;

  var form = new FormData();
  form.append("id_permohonan", id);

  swal({
    title: "Hapus Permohonan",
    text: "Anda Pasti Untuk Hapus?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    var settings = {
      url: host + "permohonanDelete",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      result = JSON.parse(response);
      if (!result.success) {
        swal({
          title: "Hapus Permohonan",
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
        title: "Hapus Permohonan",
        text: "Berjaya!",
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

//Dropdown Kampus List
var settings = {
  url: host + "statusList",
  method: "GET",
  timeout: 0,
};

$.ajax(settings).done(function (response) {
  //LIST OPTION UPDATE
  $("#upt_status_permohonan").empty();
  $("#upt_status_permohonan").append(
    $("<option>", {
      value: "",
      text: "Pengesahan",
    })
  );
  $.each(response.data, function (i, item) {
    $("#upt_status_permohonan").append(
      $("<option>", {
        value: item.id_status,
        text: item.nama_status,
      })
    );
  });
});
// END Dropdown Kampus List
