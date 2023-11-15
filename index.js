$(function () {
  $.ajaxSetup({
    cache: false,
  });
  var obj = new get(host+`usersSiteAdmin/`+window.sessionStorage.no_kad_pengenalan,window.sessionStorage.token).execute();
  if(obj.success){
    window.sessionStorage.token = obj.token;
    var data = obj.data;
    id_users_master = data.id_users;
    FK_capaian_master = data.FK_capaian;
    nama_master = data.nama;
    nama_peranan_master = data.nama_peranan;
    FK_peranan_master = data.FK_peranan;
    FK_kluster_master = data.FK_kluster;
  } else {
    // console.log(obj);
    // window.location.replace('login/');
  }
  if (window.sessionStorage.content == null) {
    statBilProgram();
    $("#chart").html(
      '<script src="assets/js/plugins/chartjs/chartjs.active.js"></script>'
    );
  }
  settingCapaian();
  $('#user_nama').innerHTML = nama_master;
  var str = nama_master;
  var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
  var acronym = matches.join(""); // JSON
  $("#nama_pendek").text(acronym);
  $(".user_nama").text(nama_master);
  $("#user_nama").text(nama_master);
  $("#user_namas").text(nama_master);
  $("#nama_peranan").text(nama_peranan_master);
  // $('#content').load(content+'.html');
  $("body").show();
});

function settingCapaian() {
  var obj = new get(host+`capaian/`+id_users_master,window.sessionStorage.token).execute();
  if(obj.success){
    //TETAPAN MEDIA
    let med_tetapan = 0;
    let C1 = 0;
    let R1 = 0;
    let U1 = 0;
    let D1 = 0;
    if (FK_capaian_master.indexOf("C1") >= 0) {
      //CREATE TETAPAN MEDIA
      C1 = 1;
      sessionStorage.control_tetapan_media_C1 = 1;
    }
    if (FK_capaian_master.indexOf("R1") >= 0) {
      //READ TETAPAN MEDIA
      R1 = 1;
      sessionStorage.control_tetapan_media_R1 = 1;
    }
    if (FK_capaian_master.indexOf("U1") >= 0) {
      //UPDATE TETAPAN MEDIA
      U1 = 1;
      sessionStorage.control_tetapan_media_U1 = 1;
    }
    if (FK_capaian_master.indexOf("D1") >= 0) {
      //DELETE TETAPAN MEDIA
      D1 = 1;
      sessionStorage.control_tetapan_media_D1 = 1;
    }

    if (C1 == 1 || R1 == 1 || U1 == 1 || D1 == 1) {
      med_tetapan = 1;
      $("#control_media").removeClass("hidden");
      $("#control_tetapan_media").removeClass("hidden");
    }

    //SENARAI PROGRAM
    let med_program = 0;
    let C2 = 0;
    let R2 = 0;
    let U2 = 0;
    let D2 = 0;
    if (FK_capaian_master.indexOf("C2") >= 0) {
      //CREATE TETAPAN MEDIA
      C2 = 1;
      sessionStorage.control_program_media_C2 = 1;
    }
    if (FK_capaian_master.indexOf("R2") >= 0) {
      //READ TETAPAN MEDIA
      R2 = 1;
      sessionStorage.control_program_media_R2 = 1;
    }
    if (FK_capaian_master.indexOf("U2") >= 0) {
      //UPDATE TETAPAN MEDIA
      U2 = 1;
      sessionStorage.control_program_media_U2 = 1;
    }
    if (FK_capaian_master.indexOf("D2") >= 0) {
      //DELETE TETAPAN MEDIA
      D2 = 1;
      sessionStorage.control_program_media_D2 = 1;
    }

    if (C2 == 1 || R2 == 1 || U2 == 1 || D2 == 1) {
      med_program = 1;
      $("#control_media").removeClass("hidden");
      $("#control_med_program").removeClass("hidden");
    }

    //SENARAI PROGRAM
    let med_permohonan = 0;
    let C3 = 0;
    let R3 = 0;
    let U3 = 0;
    let D3 = 0;
    if (FK_capaian_master.indexOf("C3") >= 0) {
      //CREATE TETAPAN MEDIA
      C3 = 1;
      sessionStorage.control_program_media_C3 = 1;
    }
    if (FK_capaian_master.indexOf("R3") >= 0) {
      //READ TETAPAN MEDIA
      R3 = 1;
      sessionStorage.control_program_media_R3 = 1;
    }
    if (FK_capaian_master.indexOf("U3") >= 0) {
      //UPDATE TETAPAN MEDIA
      U3 = 1;
      sessionStorage.control_program_media_U3 = 1;
    }
    if (FK_capaian_master.indexOf("D3") >= 0) {
      //DELETE TETAPAN MEDIA
      D3 = 1;
      sessionStorage.control_program_media_D3 = 1;
    }

    if (C3 == 1 || R3 == 1 || U3 == 1 || D3 == 1) {
      med_permohonan = 1;
      $("#control_media").removeClass("hidden");
      $("#control_med_permohonan").removeClass("hidden");
    }

    // if(FK_capaian_master.indexOf('R1') >= 0){
    //     $('#control_media').removeClass('hidden');
    //     $('#control_tetapan_media').removeClass('hidden');
    // }
    // if (FK_capaian_master.indexOf('R2') >= 0)    {
    //     $('#control_media').removeClass('hidden');
    //     $('#control_med_program').removeClass('hidden');
    // }
    // if (FK_capaian_master.indexOf('R3') >= 0)    {
    //     $('#control_media').removeClass('hidden');
    //     $('#control_med_permohonan').removeClass('hidden');
    // }
    if (FK_capaian_master.indexOf("R4") >= 0) {
      $("#control_media").removeClass("hidden");
      $("#control_laporan_media").removeClass("hidden");
    }
    if (FK_capaian_master.indexOf("R5") >= 0) {
      $("#control_sysadmin").removeClass("hidden");
      $("#control_pentadbir_sistem").removeClass("hidden");
      $("#control_ttpn_sistem").removeClass("hidden");
    }
    if (FK_capaian_master.indexOf("R6") >= 0) {
      $("#control_sysadmin").removeClass("hidden");
      $("#control_pentadbir_sistem").removeClass("hidden");
      $("#control_ttpn_peranancapaian").removeClass("hidden");
    }
    if (FK_capaian_master.indexOf("R7") >= 0) {
      $("#control_sysadmin").removeClass("hidden");
      $("#control_pentadbir_sistem").removeClass("hidden");
      $("#control_log").removeClass("hidden");
    }
  } else {
    console.log(obj);
  }
}

$(document).ready(function () {
  let content = window.sessionStorage.content;
  let token = window.sessionStorage.token;
  if (content != null && token != null) {
    $("#content").load(content + ".html");
  } else if (token == null) {
    window.location.replace("login/");
  }
});

var settings = {
  url: host + "permohonanStatus/1",
  method: "GET",
  timeout: 0,
};

$.ajax(settings).done(function (response) {
  let bil = 0;
  $.each(response.data, function (i, field) {
    t_permohonan = new Date(field.tarikh_permohonan);
    if (field.flag_vip > 0 && window.sessionStorage.id_peranan == "3") {
      bil++;
      document.getElementById("badge").classList.add("badge");
      data_notication =
        " <li>" +
        '<a id="view_permohonan" onclick="viewPermohonan()">' +
        '<i class="zmdi zmdi-notifications-none"></i>' +
        "<p>Permohonan Muat Turun Media oleh " +
        field.nama +
        "<br>Nama Program: <b>" +
        field.nama_program +
        "</b>.</p>" +
        "<span>" +
        t_permohonan.getDate() +
        "/" +
        (t_permohonan.getMonth() + 1) +
        "/" +
        t_permohonan.getFullYear() +
        "</span>" +
        "</a>" +
        '<button class="delete"><i class="zmdi zmdi-close-circle-o"></i></button>' +
        "</li>";
      $("#notificationlist").html(data_notication);
    } else if (
      field.flag_vip == "0" &&
      window.sessionStorage.id_peranan == "2" &&
      window.sessionStorage.FK_kluster == field.FK_kluster
    ) {
      bil++;
      document.getElementById("badge").classList.add("badge");
      data_notication =
        " <li>" +
        '<a id="view_permohonan" onclick="viewPermohonan()">' +
        '<i class="zmdi zmdi-notifications-none"></i>' +
        "<p>Permohonan Muat Turun Media oleh " +
        field.nama +
        "<br>Nama Program: <b>" +
        field.nama_program +
        "</b>.</p>" +
        "<span>" +
        t_permohonan.getDate() +
        "/" +
        (t_permohonan.getMonth() + 1) +
        "/" +
        t_permohonan.getFullYear() +
        "</span>" +
        "</a>" +
        '<button class="delete"><i class="zmdi zmdi-close-circle-o"></i></button>' +
        "</li>";
      $("#notificationlist").append(data_notication);
    }
  });
  $("#notificationbill").html("Anda mempunyai " + bil + " notifikasi");
});

var settings = {
  url: host + "menusList",
  method: "GET",
  timeout: 0,
};
$.ajax(settings).done(function (response) {
  $.each(response.data, function (i, item) {
    document.getElementById(item.idmenu).innerHTML =
      '<i style="font-size: large;" class="' +
      item.icon +
      '"></i> <span style="font-size: medium;"><p style="white-space: pre-line">' +
      item.menu +
      "</p></span>";
  });
});

$("#home").click(function () {
  window.sessionStorage.removeItem("content");
  window.location.reload();
});

$("#ttpn_agama").click(function () {
  window.sessionStorage.content = "html/ttpn_agama";
  saveLog(
    id_users_master,
    "View Tetapan Agama.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_agama.html");
});

$("#ttpn_bangsa").click(function () {
  window.sessionStorage.content = "html/ttpn_bangsa";
  saveLog(
    id_users_master,
    "View Tetapan Bangsa.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_bangsa.html");
});

$("#ttpn_etnik").click(function () {
  window.sessionStorage.content = "html/ttpn_etnik";
  saveLog(
    id_users_master,
    "View Tetapan Etnik.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_etnik.html");
});

$("#ttpn_gelaran").click(function () {
  window.sessionStorage.content = "html/ttpn_gelaran";
  saveLog(
    id_users_master,
    "View Tetapan Gelaran.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_gelaran.html");
});

$("#ttpn_kampus").click(function () {
  window.sessionStorage.content = "html/ttpn_kampus";
  saveLog(
    id_users_master,
    "View Tetapan Kampus.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_kampus.html");
});

$("#ttpn_kluster").click(function () {
  window.sessionStorage.content = "html/ttpn_kluster";
  saveLog(
    id_users_master,
    "View Tetapan Kluster.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_kluster.html");
});

$("#ttpn_modul").click(function () {
  window.sessionStorage.content = "html/ttpn_modul";
  saveLog(
    id_users_master,
    "View Tetapan Modul.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_modul.html");
});

$("#ttpn_negara").click(function () {
  window.sessionStorage.content = "html/ttpn_negara";
  saveLog(
    id_users_master,
    "View Tetapan Negara.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_negara.html");
});

$("#ttpn_negeri").click(function () {
  window.sessionStorage.content = "html/ttpn_negeri";
  saveLog(
    id_users_master,
    "View Tetapan Negeri.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_negeri.html");
});

$("#ttpn_unit").click(function () {
  window.sessionStorage.content = "html/ttpn_unit";
  saveLog(
    id_users_master,
    "View Tetapan Unit.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_unit.html");
});

$("#ttpn_warganegara").click(function () {
  window.sessionStorage.content = "html/ttpn_warganegara";
  saveLog(
    id_users_master,
    "View Tetapan Warganegara.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_warganegara.html");
});

$("#ttpn_useradmin").click(function () {
  window.sessionStorage.content = "html/ttpn_useradmin";
  saveLog(
    id_users_master,
    "View Tetapan Admin Pengguna.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_useradmin.html");
});

$("#ttpn_peranancapaian").click(function () {
  window.sessionStorage.content = "html/ttpn_peranancapaian";
  saveLog(
    id_users_master,
    "View Tetapan Peranan & Capaian.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_peranancapaian.html");
});

$("#log").click(function () {
  window.sessionStorage.content = "html/log";
  saveLog(
    id_users_master,
    "View Log Sistem.",
    window.sessionStorage.browser
  );
  $("#content").load("html/log.html");
});

$("#ttpn_usersubmodul").click(function () {
  window.sessionStorage.content = "html/ttpn_usersubmodul";
  saveLog(
    id_users_master,
    "View Tetapan Capaian.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_usersubmodul.html");
});

$("#ttpn_capaian").click(function () {
  window.sessionStorage.content = "html/ttpn_capaian";
  saveLog(
    id_users_master,
    "View Tetapan Capaian.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_capaian.html");
});

$("#senarai_pengguna").click(function () {
  window.sessionStorage.content = "html/senarai_pengguna";
  saveLog(
    id_users_master,
    "View Senarai Pengguna.",
    window.sessionStorage.browser
  );
  $("#content").load("html/senarai_pengguna.html");
});

$("#ttpn_nama_menu").click(function () {
  window.sessionStorage.content = "html/ttpn_nama_menu";
  saveLog(
    id_users_master,
    "View Senarai Menu.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_nama_menu.html");
});

$("#ttpn_sistem").click(function () {
  window.sessionStorage.content = "html/ttpn_sistem";
  saveLog(
    id_users_master,
    "View Tetapan Sistem.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_sistem.html");
});

$("#ttpn_med_format").click(function () {
  window.sessionStorage.content = "html/ttpn_med_format";
  saveLog(
    id_users_master,
    "View Tetapan Format Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_med_format.html");
});

$("#ttpn_med_kategori").click(function () {
  window.sessionStorage.content = "html/ttpn_med_kategori";
  saveLog(
    id_users_master,
    "View Tetapan Kategori Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_med_kategori.html");
});

$("#ttpn_med_status").click(function () {
  window.sessionStorage.content = "html/ttpn_med_status";
  saveLog(
    id_users_master,
    "View Tetapan Status Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_med_status.html");
});

$("#ttpn_med_tempoh").click(function () {
  window.sessionStorage.content = "html/ttpn_med_tempoh";
  saveLog(
    id_users_master,
    "View Tetapan Tempoh Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_med_tempoh.html");
});

$("#ttpn_vip").click(function () {
  window.sessionStorage.content = "html/ttpn_vip";
  saveLog(
    id_users_master,
    "View Tetapan VIP Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ttpn_vip.html");
});

$("#med_program").click(function () {
  window.sessionStorage.content = "html/med_program";
  saveLog(
    id_users_master,
    "View Program Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/med_program.html");
});

$("#med_permohonan").click(function () {
  window.sessionStorage.content = "html/med_permohonan";
  saveLog(
    id_users_master,
    "View Permohonan Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/med_permohonan.html");
});

$("#editprofile").click(function () {
  window.sessionStorage.content = "html/editprofile";
  saveLog(
    id_users_master,
    "View Profile.",
    window.sessionStorage.browser
  );
  $("#content").load("html/editprofile.html");
});

$("#ubahkatalaluan").click(function () {
  window.sessionStorage.content = "html/ubahkatalaluan";
  saveLog(
    id_users_master,
    "Ubah Katalaluan.",
    window.sessionStorage.browser
  );
  $("#content").load("html/ubahkatalaluan.html");
});

$("#med_laporan_program").click(function () {
  window.sessionStorage.content = "html/med_laporan_program";
  saveLog(
    id_users_master,
    "View Laporan Program.",
    window.sessionStorage.browser
  );
  $("#content").load("html/med_laporan_program.html");
});

$("#med_laporan_permohonan").click(function () {
  window.sessionStorage.content = "html/med_laporan_permohonan";
  saveLog(
    id_users_master,
    "View Laporan Permohonan.",
    window.sessionStorage.browser
  );
  $("#content").load("html/med_laporan_permohonan.html");
});

function viewPermohonan() {
  window.sessionStorage.content = "html/med_permohonan";
  saveLog(
    id_users_master,
    "View Permohonan Media.",
    window.sessionStorage.browser
  );
  $("#content").load("html/med_permohonan.html");
}

$("#logKeluar").click(function () {
  document.getElementById("menu-kanan").classList.remove("show");
  swal({
    title: "Log Keluar",
    text: "Anda Pasti Untuk Log Keluar?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    saveLog(id_users_master, "Logout.", window.sessionStorage.browser);
    window.sessionStorage.clear();
    window.location.replace("login/");
  });
});

function saveLog(FK_users, action_made, browser_name) {
  var form = new FormData();
  form.append("FK_users", FK_users);
  form.append("action_made", action_made);
  form.append("browser_name", browser_name);
  var settings = {
    url: host + "addLogs",
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

function statBilProgram() {
  var settings = {
    url: host + "programListAll",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    let jumProgram = 0;
    let program_media = 0;
    $.each(response.data, function (i, field) {
      if (field.media_path != null && field.media_path != "[]") {
        program_media++;
      }
      jumProgram++;
    });
    $("#bil_program").html(jumProgram);
    $("#program_media").html(
      ((program_media / jumProgram) * 100).toFixed(2) + "% Mempunyai Media"
    );
    $("#progress_bar").width(
      ((program_media / jumProgram) * 100).toFixed(2) + "%"
    );
  });
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

function resetForm() {
  document.getElementById("register").reset();
}
