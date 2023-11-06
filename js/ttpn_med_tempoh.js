$(function () {
  $.ajaxSetup({
    cache: false,
  });
  tableTempoh();
});

function tableTempoh() {
  var colums = [
    { name: "bil", title: "Bil" },
    { name: "tempoh", title: "Tempoh" },
    { name: "status_rekod", title: "Status", breakpoints: "md sm xs" },
    { name: "upt_btn", title: "Tindakan", breakpoints: "md sm xs" },
    // {"name":"status","title":"Status","breakpoints":"sm xs"}
  ];
  var settings = {
    url: host + "tempohListAll",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    let convertList = JSON.stringify(response.data);
    $("#dataList").val(convertList);
    var list = [];
    let bil = 1;

    $.each(response.data, function (i, field) {
      var checked;
      if (field.statusrekod == "1") {
        checked = "checked";
        badge = "badge-success";
        text_statusrekod = "Aktif";
        tempoh = field.tempoh;
      } else {
        badge = "badge-danger";
        text_statusrekod = "Tidak Aktif";
        tempoh = field.tempoh_prev;
      }

      list.push({
        id: field.id_tempoh,
        tempoh: tempoh + " Hari",
        bil: bil++,
        status_rekod:
          '<label class="adomx-switch-2 success "><input type="checkbox" id="tempoh_sistem" class="form-control mb-20" ' +
          checked +
          " onclick=\"del_rekod('" +
          field.id_tempoh +
          '\')"> <i class="lever"></i> <span id="text_statusrekod' +
          field.id_tempoh +
          '" class="badge ' +
          badge +
          '">' +
          text_statusrekod +
          "</span></label>",
        upt_btn:
          '<button class="button button-box button-sm button-primary" onclick="loadData(\'' +
          i +
          '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ti-pencil-alt"></i></button> ',
        // '<button class="button button-box button-sm button-danger" title="Hapus" onclick="del_rekod(\''+field.id+'\')"><i class="ti-trash"></i>'
      });
    });

    $("#medtempohList").footable({
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
  });
}

function loadData(indexs) {
  let data = JSON.parse($("#dataList").val());
  $("#upt_id").val(data[indexs].id_tempoh);
  $("#upt_tempoh").val(data[indexs].tempoh);

  $("#update-medtempoh").modal("show");
}

//FUNCTION UPDATE

var confirmed = false;

$("#update").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Kemaskini Tempoh Media",
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
      let upt_tempoh = $("#upt_tempoh").val();
      let statusrekod = "EDT";

      var form = new FormData();
      form.append("id_tempoh", upt_id);
      form.append("tempoh", upt_tempoh);
      form.append("updated_by", window.sessionStorage.no_kad_pengenalan);

      var settings = {
        url: host + "tempohUpdate",
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
          swal({
            title: "Kemaskini Tempoh Media",
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
                $("#update-medtempoh").modal("hide");
                tableTempoh();
              }
            }
          );
        } else {
          swal({
            title: "Kemaskini Tempoh Media",
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
                $("#update-medtempoh").modal("hide");
                tableTempoh();
              }
            }
          );
        }
      });
    });
  }
});

// FUNCTION DELETE

function del_rekod(i) {
  let id = i;

  var form = new FormData();
  form.append("id_tempoh", id);

  var settings = {
    url: host + "tempohDelete",
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
      // Swal(result.message, result.data, "error");
      // return;
      swal({
        title: "Hapus Tempoh",
        text: "Gagal!",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    }
    if (result.data.statusrekod == 1) {
      $("#text_statusrekod" + result.data.id_tempoh)
        .text("Aktif")
        .removeClass("badge-danger")
        .addClass("badge-success");
    } else {
      $("#text_statusrekod" + result.data.id_tempoh)
        .text("Tidak Aktif")
        .removeClass("badge-success")
        .addClass("badge-danger");
    }
    saveLog(
      window.sessionStorage.id,
      "Change Record Status for [id_tempoh = " +
        result.data.id_tempoh +
        "] at Tetapan Tempoh Media.",
      window.sessionStorage.browser
    );
  });
}
