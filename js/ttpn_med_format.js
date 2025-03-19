$(function () {
  $.ajaxSetup({
    cache: false,
  });
  tableFormat();
  cekCapaian();
});

function cekCapaian() {
  //TETAPAN MEDIA (ID:1)
  if (window.sessionStorage.control_tetapan_media_C1 == 1) {
    $("#control_tetapan_media_C1").removeClass("hidden");
  }
  if (window.sessionStorage.control_tetapan_media_R1 == 1) {
    $("#control_tetapan_media_R1").removeClass("hidden");
  }
  if (window.sessionStorage.control_tetapan_media_U1 == 1) {
    $("#control_tetapan_media_U1").removeClass("hidden");
  }
  if (window.sessionStorage.control_tetapan_media_D1 == 1) {
    $("#control_tetapan_media_D1").removeClass("hidden");
  }
}

function tableFormat() {
  var columns = [
    { name: "bil", title: "Bil" },
    { name: "kod_format", title: "Nama" },
    { name: "status_rekod", title: "Status", breakpoints: "md sm xs" },
  ];
  if (window.sessionStorage.control_tetapan_media_U1 == 1) {
    columns.push(
      { name: "upt_btn", title: "Tindakan", breakpoints: "md sm xs" },
    );
  }

  var obj = new get(host+`formatListAll`,window.sessionStorage.token).execute();
  if(obj.success){
    let convertList = JSON.stringify(obj.data);
    $("#dataList").val(convertList);
    var list = [];
    let bil = 1;

    $.each(obj.data, function (i, field) {
      var checked;
      if (field.statusrekod == "1") {
        checked = "checked";
        badge = "badge-success";
        text_statusrekod = "Aktif";
      } else {
        badge = "badge-danger";
        text_statusrekod = "Tidak Aktif";
      }

      if (window.sessionStorage.control_tetapan_media_U1 == 1) {
        list.push({
          id: field.id_format,
          kod_format: field.kod_format,
          bil: bil++,
          status_rekod:
            '<label class="adomx-switch-2 success "><input type="checkbox" id="status_sistem" class="form-control mb-20" ' +
            checked +
            " onclick=\"del_rekod('" +
            field.id_format +
            '\')"> <i class="lever"></i> <span id="text_statusrekod' +
            field.id_format +
            '" class="badge ' +
            badge +
            '">' +
            text_statusrekod +
            "</span></label>",
          upt_btn:
            '<button class="button button-bx button-sm button-primary " id="control_tetapan_media_U1" onclick="loadData(\'' +
            i +
            '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ti-pencil-alt"></i></button> ',
        });
      } else {
        list.push({
          id: field.id_format,
          kod_format: field.kod_format,
          bil: bil++,
          status_rekod:
            '<label class="adomx-switch-2 success "><span id="text_statusrekod' +
            field.id_format +
            '" class="badge ' +
            badge +
            '">' +
            text_statusrekod +
            "</span></label>",
        });
      }
    });

    $(".formatList-length").html(list.length);
    $("#formatList").footable({
      columns: columns,
      rows: list,
      paging: {
        enabled: true,
        size: 10,
      },
      filtering: {
        enabled: true,
        placeholder: "Carian...",
        dropdownTitle: "Carian untuk:",
        class: "brown-700",
      },
    });
  } else {
  }
}

function loadData(indexs) {
  let data = JSON.parse($("#dataList").val());
  $("#upt_id").val(data[indexs].id_format);
  $("#upt_kod_format").val(data[indexs].kod_format);
  saveLog(
    id_users_master,
    "View Data of [id_format = " +
      data[indexs].id_format +
      "]" +
      data[indexs].kod_format +
      " at Tetapan Format Media.",
    window.sessionStorage.browser
  );

  $("#update-format").modal("show");
}

$("#reg-format").on("shown.bs.modal", function () {
  $(this).find("#kod_format").focus();
});

$("#update-format").on("shown.bs.modal", function () {
  $(this).find("#upt_kod_format").focus();
});

// FUNCTION REGISTER

var confirmed = false;

$("#register").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Daftar Format",
      text: "Anda Pasti Untuk Simpan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let kod_format = $("#kod_format").val();
      let statusrekod = "1";

      var form = new FormData();
      form.append("kod_format", kod_format);
      form.append("statusrekod", statusrekod);
      form.append("created_by", id_users_master);
      form.append("updated_by", id_users_master);

      var obj = new post(host+`addFormat`,form,window.sessionStorage.token).execute();
      if(obj.success){
        var data = obj.data;
        swal({
          title: "Daftar Format",
          text: obj.message,
          type: "success",
          showConfirmButton: false,
          allowOutsideClick: false,
          html: false,
          timer: 1000,
        }).then(
          function () {},
          function (dismiss) {
            if (dismiss === "timer") {
              saveLog(
                id_users_master,
                "Register Data [" + kod_format + "] at Tetapan Format Media.",
                window.sessionStorage.browser
              );
              $("#reg-format").modal("hide");
              tableFormat();
            }
          }
        );
      } else {
        swal({
          title: "Daftar Format",
          text: obj.message,
          type: "error",
          showConfirmButton: false,
          allowOutsideClick: false,
          html: false,
          timer: 1000,
        }).then(
          function () {},
          function (dismiss) {
            if (dismiss === "timer") {
              $("#reg-format").modal("hide");
              tableFormat();
            }
          }
        );

      }
    });
  }
});

//FUNCTION UPDATE

$("#update").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Kemaskini Format",
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
      let upt_kod_format = $("#upt_kod_format").val();
      let upt_jenis_format = $("#upt_jenis_format").val();
      let statusrekod = "EDT";

      var form = new FormData();
      form.append("id_format", upt_id);
      form.append("kod_format", upt_kod_format);
      form.append("jenis_format", upt_jenis_format);
      form.append("updated_by", window.sessionStorage.no_kad_pengenalan);

      var obj = new post(host+`formatUpdate`,form,window.sessionStorage.token).execute();
      if(obj.success){
        swal({
          title: "Kemaskini Format",
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
              saveLog(
                id_users_master,
                "Update Data for [id = " +
                  upt_id +
                  "]" +
                  upt_kod_format +
                  " at Tetapan Format Media.",
                window.sessionStorage.browser
              );
              $("#update-format").modal("hide");
              tableFormat();
            }
          }
        );
      } else {
        swal({
          title: "Kemaskini Format",
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
              $("#update-format").modal("hide");
              tableFormat();
            }
          }
        );
      }
    });
  }
});

// FUNCTION DELETE

function del_rekod(i) {
  let id = i;

  var form = new FormData();
  form.append("id_format", id);

  var obj = new post(host+`formatDelete`,form,window.sessionStorage.token).execute();
  if(obj.success){
    saveLog(
      id_users_master,
      "Delete Data [" + kod_format + "] at Tetapan Format Media.",
      window.sessionStorage.browser
    );
  } else {
    swal({
      title: "Hapus Format",
      text: "Gagal!",
      type: "error",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      window.location.reload();
    });
  }
  if (obj.data.statusrekod == 1) {
    $("#text_statusrekod" + obj.data.id_format)
      .text("Aktif")
      .removeClass("badge-danger")
      .addClass("badge-success");
  } else {
    $("#text_statusrekod" + obj.data.id_format)
      .text("Tidak Aktif")
      .removeClass("badge-success")
      .addClass("badge-danger");
  }
}
