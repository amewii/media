document.getElementById("no_kad_pengenalan_swasta").value =
  window.sessionStorage.no_kad_pengenalan;

$("#registerswasta").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    $("#loading_modal").modal("show");
    let no_kad_pengenalan = $("#no_kad_pengenalan_swasta").val();
    let nama = $("#nama_swasta").val();
    let emel = $("#emel_swasta").val();
    let notel = $("#notel_swasta").val();
    let FK_jenis_pengguna = "2";
    let FK_gelaran = $("#FK_gelaran_swasta").val();
    let katalaluan = $("#katalaluan").val();
    // alert(katalaluan);

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
      url: host + "addUsers",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settingsregusers).done(function (response) {
      console.log(response);
      result = JSON.parse(response);
      if (!result.success) {
        Swal(result.message, result.data, "error");
        return;
      }

      var settingsfetchusers = {
        url: host + "users",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
      };

      $.ajax(settingsfetchusers).done(function (response) {
        console.log(response);
        result = JSON.parse(response);
        let FK_users = result.data.id_users;
        let nama_majikan = $("#nama_majikan_swasta").val();
        let jawatan = $("#jawatan_swasta").val();

        var formswasta = new FormData();
        formswasta.append("FK_users", FK_users);
        formswasta.append("nama_majikan", nama_majikan);
        formswasta.append("jawatan", jawatan);
        formswasta.append("statusrekod", "1");

        var settingsreguserswastas = {
          url: host + "addUserswastas",
          method: "POST",
          timeout: 0,
          processData: false,
          mimeType: "multipart/form-data",
          contentType: false,
          data: formswasta,
        };

        $.ajax(settingsreguserswastas).done(function (response) {
          console.log(response);
          result = JSON.parse(response);
          $("#loading_modal").modal("hide");
          if (!result.success) {
            swal({
              title: "Daftar Pengguna",
              text: "Pendaftaran gagal! Sila cuba lagi.",
              confirmButtonText: "OK",
              closeOnConfirm: true,
              allowOutsideClick: false,
              html: false,
            }).then(function () {
              window.location.reload();
            });
          }
          swal({
            title: "Daftar Pengguna",
            text: "Pendaftaran berjaya! Sila log masuk ke dalam sistem.",
            confirmButtonText: "OK",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            window.location.replace("../login");
          });
        });
      });
    });
  }
});

$("#poskod_rumah_swasta").blur(function () {
  var settings = {
    url: host + "sysposkod/" + $("#poskod_rumah_swasta").val(),
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    document.getElementById("daerah_rumah_swasta").value = response.data.bandar;
    document.getElementById("negeri_rumah_swasta").value = response.data.nama;
  });
});

$("#poskod_organisasi_swasta").blur(function () {
  var settings = {
    url: host + "sysposkod/" + $("#poskod_organisasi_swasta").val(),
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    document.getElementById("daerah_organisasi_swasta").value =
      response.data.bandar;
    document.getElementById("negeri_organisasi_swasta").value =
      response.data.nama;
  });
});

//Dropdown Gelaran List
var settings = {
  url: host + "gelaransList",
  method: "GET",
  timeout: 0,
  // "header":{
  //     "Authentication": "ASDCM"+window.sessionStorage.token
  //   }
};

$.ajax(settings).done(function (response) {
  //LIST OPTION
  $("#FK_gelaran_swasta").empty();
  $("#FK_gelaran_swasta").append(
    $("<option>", {
      value: "",
      text: "Pilih Gelaran",
    })
  );
  $.each(response.data, function (i, item) {
    $("#FK_gelaran_swasta").append(
      $("<option>", {
        value: item.id_gelaran,
        text: item.nama_gelaran,
      })
    );
  });
});
// END Dropdown Gelaran List
