$(function () {
  $.ajaxSetup({
    cache: false,
  });
  $("#no_kad_pengenalan").val(window.sessionStorage.no_kad_pengenalan);
});
$("#katalaluansemasa").change(function () {
  let katalaluan = $("#katalaluansemasa").val();
  let no_kad_pengenalan = $("#no_kad_pengenalan").val();
  // let katalaluan = $("#katalaluan").val();

  var form = new FormData();
  form.append("no_kad_pengenalan", no_kad_pengenalan);
  form.append("katalaluan", katalaluan);

  var settings = {
    url: host + "usersSemakKatalaluan",
    method: "POST",
    timeout: 0,
    processData: false,
    headers: {
        Authorization: window.sessionStorage.token
    },
    contentType: false,
    data: form,
  };
  $.ajax(settings).done(function (response) {
    // console.log(response.success);
    if (response.success !== "true") {
      swal({
        title: "Ubah Katalaluan",
        text: "Katalaluan Semasa Tidak Tepat.",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      });
    } else {
      $("#katalaluanbaharu").attr("disabled", false);
      $("#sahkankatalaluan").attr("disabled", false);
      $("#kemaskini").show();
    }
  });
});
$("#sahkankatalaluan").change(function () {
  if ($("#katalaluanbaharu").val() == $("#sahkankatalaluan").val()) {
    $("#kemaskini").attr("disabled", false);
  } else {
    swal({
      title: "Ubah Katalaluan",
      text: "Pengesahan katalaluan gagal. ",
      type: "error",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    });
  }
});
var confirmed = false;
$("#update").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Ubah Katalaluan",
      text: "Anda Pasti Untuk Kemaskini Katalaluan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let no_kad_pengenalan = $("#no_kad_pengenalan").val();
      let katalaluanbaharu = $("#katalaluanbaharu").val();
      // let katalaluan = $("#katalaluan").val();
      // console.log(katalaluanbaharu);
      // console.log(no_kad_pengenalan);
      var form = new FormData();
      form.append("no_kad_pengenalan", no_kad_pengenalan);
      form.append("katalaluan", katalaluanbaharu);
      // form.append("katalaluan", katalaluan);
      // formData.append("token",window.sessionStorage.token);
      var settings = {
        url: host + "usersReset",
        method: "POST",
        timeout: 0,
        processData: false,
        contentType: false,
        data: form,
      };
      $.ajax(settings).done(function (response) {
        // console.log(response.success);
        if (response.success !== "true") {
          swal({
            title: "Ubah Katalaluan",
            text: result.message,
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            sessionStorage.token = result.token;
            // window.location.reload();
          });
        } else {
          // saveLog(window.sessionStorage.id,"Update Data [nama_peranan: "+ nama_peranan +"], [FK_capaian: "+ FK_capaian +"],  at Tetapan Peranan & Capaian.",window.sessionStorage.browser);
          window.location.reload();
        }
      });
    });
  }
});

function users_info(id, returnValue) {
  var settings = {
    url: host + "usersEditProfile/" + id,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    result = response;
    if (result.success) {
      // console.log(response.data)
      returnValue();
    } else {
      swal(response.message, "Tiada Data", "warning");
    }
  });
}
