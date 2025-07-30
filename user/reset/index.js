const queryString = window.location.search;
if (queryString != "") {
  const urlParams = new URLSearchParams(queryString);
  const temp = urlParams.get("temp");
  var obj = new get(host+`usersResetKatalaluan/`+temp,window.sessionStorage.token).execute();
  if(obj.success){
    $("#no_kad_pengenalan_final").val(obj.data.no_kad_pengenalan);
    if (typeof obj.data.no_kad_pengenalan !== "undefined") {
      $("#checkic").hide();
      $("#backtologin").hide();
      $("#checkic3").show();
    } else {
      swal({
        title: "Lupa Katalaluan",
        text: "",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: "Pautan ini telah luput.",
      }).then(function () {
        window.location.replace("../login/");
      });
    }
  } else {

  }
}
var confirmed = false;
document.getElementById("no_kad_pengenalan_semak").focus();
if (typeof window.sessionStorage.no_kad_pengenalan !== "undefined") {
  $("#checkic").hide();
  $("#checkic2").show();
  $("#no_kad_pengenalan_daftar").val(window.sessionStorage.no_kad_pengenalan);
}

if (
  typeof window.sessionStorage.no_kad_pengenalan !== "undefined" &&
  typeof window.sessionStorage.emel !== "undefined"
) {
  $("#checkic").hide();
  $("#checkic2").hide();
  $("#checkic3").show();
  $("#no_kad_pengenalan_final").val(window.sessionStorage.no_kad_pengenalan);
  $("#emel_final").val(window.sessionStorage.emel);
}

$("#checkusers").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let no_kad_pengenalan = $("#no_kad_pengenalan_semak").val();

    var form = new FormData();
    form.append("no_kad_pengenalan", no_kad_pengenalan);
    form.append("masa", new Date());
    form.append("landing_page", "/reset");
    // console.log(nama_user)
    var obj = new post(host+`usersResetToEmail`,form,window.sessionStorage.token).execute();
    if(obj.success){
      swal({
        title: "Lupa Katalaluan",
        text: "",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: obj.message,
      }).then(function () {
        sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
        window.location.replace("../login/");
      });
    } else {
      swal({
        title: "Lupa Katalaluan",
        text:
          "Permintaan set semula katalaluan akan dihantar ke emel anda sekiranya wujud.",
        type: "warning",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.replace("../");
      });
    }
  }
});

$("#checkusers2").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let no_kad_pengenalan = $("#no_kad_pengenalan_daftar").val();
    let emel = $("#emel_semak").val();

    var form = new FormData();
    form.append("no_kad_pengenalan", no_kad_pengenalan);
    form.append("emel", emel);

    var obj = new post(host+`usersIcEmel`,form,window.sessionStorage.token).execute();
    if(obj.success){
      swal({
        title: "Lupa Katalaluan",
        text: "Sila Masukkan Katalaluan Baharu",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        sessionStorage.no_kad_pengenalan = no_kad_pengenalan;
        sessionStorage.emel = emel;
        window.location.reload();
      });
    } else {
      swal({
        title: "Lupa Katalaluan",
        text: "Rekod tidak sah.",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        sessionStorage.token = result.token;
        window.location.reload();
      });
    }
  }
});

$("#ckatalaluan").blur(function () {
  if ($("#katalaluan").val() !== $("#ckatalaluan").val()) {
    alert("Katalaluan tidak sepadan.");
  } else {
    $("#hantar").prop("disabled", false);
  }
});

$("#checkusers3").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let no_kad_pengenalan = $("#no_kad_pengenalan_final").val();
    let katalaluan = $("#katalaluan").val();

    var form = new FormData();
    form.append("no_kad_pengenalan", no_kad_pengenalan);
    form.append("katalaluan", katalaluan);

    var obj = new post(host+`usersReset`,form,window.sessionStorage.token).execute();
    if(obj.success){
      swal({
        title: "Lupa Katalaluan",
        text: "Katalaluan telah disetsemula. Sila log masuk menggunakan katalaluan baharu.",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.sessionStorage.removeItem("no_kad_pengenalan");
        window.sessionStorage.removeItem("emel");
        window.location.replace("../login/");
      });
    } else {
      swal({
        title: "Lupa Katalaluan",
        text: "Gagal.",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        sessionStorage.token = result.token;
        window.location.reload();
      });
    }
  }
});
