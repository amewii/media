$(function () {
  $.ajaxSetup({
    cache: false,
  });
  tablePengguna();
  tablePeranan();
  kampusList(function () {
    $("#FK_kampus_add").empty();
    $("#FK_kampus_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Kampus",
      })
    );
    $("#FK_kampus").empty();
    $("#FK_kampus").append(
      $("<option>", {
        value: "",
        text: "Pilih Kampus",
      })
    );
    $("#upt_FK_kampus").empty();
    $("#upt_FK_kampus").append(
      $("<option>", {
        value: "",
        text: "Pilih Kampus",
      })
    );

    if (obj_kampusList.success) {
      $.each(obj_kampusList.data, function (i, item) {
        $("#FK_kampus_add").append(
          $("<option>", {
            value: item.id_kampus,
            text: item.nama_kampus,
          })
        );
        $("#FK_kampus").append(
          $("<option>", {
            value: item.id_kampus,
            text: item.nama_kampus,
          })
        );
        $("#upt_FK_kampus").append(
          $("<option>", {
            value: item.id_kampus,
            text: item.nama_kampus,
          })
        );
      });
    }
  });
  klusterList(function () {
    $("#FK_kluster_add").empty();
    $("#FK_kluster_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Kluster",
      })
    );
    $("#FK_kluster").empty();
    $("#FK_kluster").append(
      $("<option>", {
        value: "",
        text: "Pilih Kluster",
      })
    );

    if (obj_klusterList.success) {
      $.each(obj_klusterList.data, function (i, item) {
        $("#FK_kluster_add").append(
          $("<option>", {
            value: item.id_kluster,
            text: item.nama_kluster,
          })
        );
        $("#FK_kluster").append(
          $("<option>", {
            value: item.id_kluster,
            text: item.nama_kluster,
          })
        );
        $("#upt_FK_kluster").append(
          $("<option>", {
            value: item.id_kluster,
            text: item.nama_kluster,
          })
        );
      });
    }
  });
  subklusterList(function () {
    $("#FK_subkluster_add").empty();
    $("#FK_subkluster_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Subkluster",
      })
    );
    $("#FK_subkluster").empty();
    $("#FK_subkluster").append(
      $("<option>", {
        value: "",
        text: "Pilih Subkluster",
      })
    );

    if (obj_subklusterList.success) {
      $.each(obj_subklusterList.data, function (i, item) {
        $("#FK_subkluster_add").append(
          $("<option>", {
            value: item.id_subkluster,
            text: item.nama_subkluster,
          })
        );
        $("#FK_subkluster").append(
          $("<option>", {
            value: item.id_subkluster,
            text: item.nama_subkluster,
          })
        );
        $("#upt_FK_subkluster").append(
          $("<option>", {
            value: item.id_subkluster,
            text: item.nama_subkluster,
          })
        );
      });
    }
  });
  unitList(function () {
    $("#FK_unit_add").empty();
    $("#FK_unit_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Unit",
      })
    );
    $("#FK_unit").empty();
    $("#FK_unit").append(
      $("<option>", {
        value: "",
        text: "Pilih Unit",
      })
    );

    if (obj_unitList.success) {
      $.each(obj_unitList.data, function (i, item) {
        $("#FK_unit_add").append(
          $("<option>", {
            value: item.id_unit,
            text: item.nama_unit,
          })
        );
        $("#FK_unit").append(
          $("<option>", {
            value: item.id_unit,
            text: item.nama_unit,
          })
        );
        $("#upt_FK_unit").append(
          $("<option>", {
            value: item.id_unit,
            text: item.nama_unit,
          })
        );
      });
    }
  });
  perananList(function () {
    $("#FK_peranan_add").empty();
    $("#FK_peranan_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Peranan",
      })
    );
    $("#FK_peranan").empty();
    $("#FK_peranan").append(
      $("<option>", {
        value: "",
        text: "Pilih Peranan",
      })
    );
    $("#upt_FK_peranan").empty();
    $("#upt_FK_peranan").append(
      $("<option>", {
        value: "",
        text: "Pilih Peranan",
      })
    );

    if (obj_perananList.success) {
      $.each(obj_perananList.data, function (i, item) {
        $("#FK_peranan_add").append(
          $("<option>", {
            value: item.id_peranan,
            text: item.nama_peranan,
          })
        );
        $("#FK_peranan").append(
          $("<option>", {
            value: item.id_peranan,
            text: item.nama_peranan,
          })
        );
        $("#upt_FK_peranan").append(
          $("<option>", {
            value: item.id_peranan,
            text: item.nama_peranan,
          })
        );
      });
    }
  });

  if (window.sessionStorage.noic != null) {
    check_users(window.sessionStorage.noic, function () {
      if (obj_users.success) {
        $("#noic_check").val("");
        $("#check_noic").modal("hide");
        $("#nama_pegawai").html(
          '<i class="fa fa-user"></i> ' + obj_users.data.nama
        );
        $("#FK_users").val(window.sessionStorage.noic);
        $("#FK_user").val(obj_users.data.id_users);
        $("#FK_kampus").val(obj_users.data.FK_kampus);
        $("#FK_kluster").val(obj_users.data.FK_kluster);
        $("#FK_subkluster").val(obj_users.data.FK_subkluster);
        $("#FK_unit").val(obj_users.data.FK_unit);
        window.sessionStorage.removeItem("noic");
        $("#reg-capaian").modal("show");
      }
    });
  }
});

$("#capaian").click(function () {
  $("#buttonCapaian").removeClass("hidden");
  $("#buttonPeranan").addClass("hidden");
  $("#buttonPengguna").addClass("hidden");
});
$("#peranan").click(function () {
  $("#buttonPeranan").removeClass("hidden");
  $("#buttonCapaian").addClass("hidden");
  $("#buttonPengguna").addClass("hidden");
});
$("#pengguna").click(function () {
  $("#buttonPengguna").removeClass("hidden");
  $("#buttonPeranan").addClass("hidden");
  $("#buttonCapaian").addClass("hidden");
});

$("#dftr_users").click(function () {
  $("#check_noic").modal("show");
});

var confirmed = false;

$("#send_noic").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let noic = $("#noic_check").val();
    check_users(noic, function () {
      if (obj_users.success) {
        $("#noic_check").val("");
        $("#check_noic").modal("hide");
        $("#nama_pegawai").html(
          '<i class="fa fa-user"></i> ' + obj_users.data.nama
        );
        $("#FK_users").val(noic);
        $("#FK_user").val(obj_users.data.id_users);
        $("#FK_kampus").val(obj_users.data.FK_kampus);
        $("#FK_kluster").val(obj_users.data.FK_kluster);
        $("#FK_subkluster").val(obj_users.data.FK_subkluster);
        $("#FK_unit").val(obj_users.data.FK_unit);

        $("#reg-capaian").modal("show");
      } else {
        $("#noic_check").prop("disabled", true);
        $("#semak_btn").prop("disabled", true);
        $("#icon_semak").prop("class", "fa fa-cog fa-spin");
        check_hrmis(noic, function () {
          if (obj_hrmis == "2") {
            $("#noic_check").prop("disabled", false);
            $("#semak_btn").prop("disabled", false);
            $("#icon_semak").prop("class", "fa fa-search");
          } else {
            check_usersIntan(noic, function () {
              if (obj_usersIntan == "") {
                $("#noic_check").prop("disabled", false);
                $("#semak_btn").prop("disabled", false);
                $("#icon_semak").prop("class", "fa fa-search");
                swal({
                  title: "Daftar Pengguna",
                  text: "Bukan Pengguna Dalaman INTAN",
                  confirmButtonText: "OK",
                  closeOnConfirm: true,
                  allowOutsideClick: false,
                  html: false,
                }).then(function () {
                  $("#check_noic").modal("hide");
                  $("#noic_check").val("");
                });
              } else {
                $("#nama_text_add").text(obj_hrmis.peribadi.nama);
                $("#noic_text_add").text(obj_hrmis.peribadi.icno);
                $("#notel_text_add").text(obj_hrmis.peribadi.COHPhoneNo);
                $("#emel_text_add").html(obj_hrmis.peribadi.COEmail);
                $("#nama_jawatan_add").val(
                  obj_hrmis.perkhidmatan.schmofservtitle
                );
                $("#nama_add").val(obj_hrmis.peribadi.nama);
                $("#emel_add").val(obj_hrmis.peribadi.COEmail);
                $("#no_kad_pengenalan_add").val(obj_hrmis.peribadi.icno);
                $("#notel_add").val(obj_hrmis.peribadi.COHPhoneNo);
                $("#emel_kerajaan_add").val(obj_hrmis.peribadi.COEmail);
                $("#notel_kerajaan_add").val(obj_hrmis.peribadi.COOffTelNo);
                $("#noic_check").val("");
                $("#check_noic").modal("hide");
                $("#register_users").modal("show");
                $("#noic_check").prop("disabled", false);
                $("#semak_btn").prop("disabled", false);
                $("#icon_semak").prop("class", "fa fa-search");

              }
            });
          }
        });
      }
    });
  }
});

$("#registergov").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    $("#daftar").prop("disabled", true);
    let nama = $("#nama_add").val();
    let emel = $("#emel_add").val();
    let no_kad_pengenalan = $("#no_kad_pengenalan_add").val();
    let katalaluan = makeid(12);
    let notel = $("#notel_add").val();
    let FK_jenis_pengguna = "1";
    let FK_gelaran = "6";
    var form = new FormData();
    form.append("no_kad_pengenalan", no_kad_pengenalan);
    form.append("nama", nama);
    form.append("emel", emel);
    form.append("notel", notel);
    form.append("FK_jenis_pengguna", FK_jenis_pengguna);
    form.append("FK_gelaran", FK_gelaran);
    form.append("katalaluan", katalaluan);
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
        result = JSON.parse(response);
        let FK_users = result.data.id_users;
        let emel_kerajaan = $("#emel_kerajaan_add").val();
        let notel_kerajaan = $("#notel_kerajaan_add").val();
        let nama_jawatan = $("#nama_jawatan_add").val();
        let kategori_perkhidmatan = "1";
        let skim = $("#skim").val();
        let gred = $("#gred").val();
        let users_intan = "1";
        let FK_kampus = $("#FK_kampus_add").val();
        let FK_kluster = $("#FK_kluster_add").val();
        let FK_subkluster = $("#FK_subkluster_add").val();
        let FK_unit = $("#FK_unit_add").val();
        let FK_kementerian = $("#FK_kementerian").val();
        let FK_agensi = $("#FK_agensi").val();
        let FK_bahagian = $("#FK_bahagian").val();
        let FK_ila = $("#FK_ila").val();
        let bahagian = $("#bahagian").val();
        let alamat1_pejabat = $("#alamat1_pejabat").val();
        let alamat2_pejabat = $("#alamat2_pejabat").val();
        let poskod_pejabat = $("#poskod_pejabat").val();
        let daerah_pejabat = $("#daerah_pejabat").val();
        let negeri_pejabat = $("#negeri_pejabat").val();

        var formgov = new FormData();
        formgov.append("FK_users", FK_users);
        formgov.append("emel_kerajaan", emel_kerajaan);
        formgov.append("notel_kerajaan", notel_kerajaan);
        formgov.append("nama_jawatan", nama_jawatan);
        formgov.append("kategori_perkhidmatan", kategori_perkhidmatan);
        formgov.append("skim", skim);
        formgov.append("gred", gred);
        formgov.append("users_intan", users_intan);
        formgov.append("FK_kampus", FK_kampus);
        formgov.append("FK_kluster", FK_kluster);
        formgov.append("FK_subkluster", FK_subkluster);
        formgov.append("FK_unit", FK_unit);
        formgov.append("FK_kementerian", FK_kementerian);
        formgov.append("FK_agensi", FK_agensi);
        formgov.append("FK_bahagian", FK_bahagian);
        formgov.append("FK_ila", FK_ila);
        formgov.append("bahagian", bahagian);
        formgov.append("alamat1_pejabat", alamat1_pejabat);
        formgov.append("alamat2_pejabat", alamat2_pejabat);
        formgov.append("poskod_pejabat", poskod_pejabat);
        formgov.append("daerah_pejabat", daerah_pejabat);
        formgov.append("negeri_pejabat", negeri_pejabat);
        formgov.append("statusrekod", "1");

        var settingsregusersgovs = {
          url: host + "addUsersgovs",
          method: "POST",
          timeout: 0,
          processData: false,
          mimeType: "multipart/form-data",
          contentType: false,
          data: formgov,
        };

        $.ajax(settingsregusersgovs).done(function (response) {
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
            result = JSON.parse(response);
            sessionStorage.noic = result.data.no_kad_pengenalan;
            window.location.reload();
          });

        });
      });
    });
  }
});

function check_users(noic, returnValue) {
  var settings = {
    url: host + "usersgovsIntan/" + noic,
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_users = response;
    returnValue();
  });
}

function check_usersIntan(noic, returnValue) {
  var settings = {
    url: "https://admin.dtims.intan.my/api/ezxs/check/" + noic,
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_usersIntan = response.posts;
    returnValue();
  });
}

function check_hrmis(noic, returnValue) {
  var settings = {
    url: "https://admin.dtims.intan.my/api/hrmis/check/" + noic,
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_hrmis = JSON.parse(response);

    returnValue();
  });
}

function tablePeranan() {
  var columsPeranan = [
    { name: "bil", title: "Bil" },
    { name: "nama_peranan", title: "Nama Peranan" },
    { name: "nama_senarai", title: "Senarai Capaian", breakpoints: "md sm xs" },
    { name: "upt_btn", title: "Tindakan", breakpoints: "md sm xs" },
  ];
  var settings = {
    url: host + "perananList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    let convertList = JSON.stringify(response.data);
    $("#dataListPeranan").val(convertList);
    var list = [];
    var senarai_capaian = "";
    let bil = 1;
    let nama_submodul = "";
    $.each(response.data, function (i, field) {
      senarai_capaian = "";
      let inc = 1;
      while (inc <= 7) {
        switch (inc) {
          case 1:
            nama_submodul = "<b>Tetapan</b>: ";
            break;
          case 2:
            nama_submodul = "<b>Senarai Program</b>: ";
            break;
          case 3:
            nama_submodul = "<b>Senarai Permohonan</b>: ";
            break;
          case 4:
            nama_submodul = "<b>Laporan</b>: ";
            break;
          case 5:
            nama_submodul = "<b>Senarai Pengguna</b>: ";
            break;
          case 6:
            nama_submodul = "<b>Peranan & Capaian</b>: ";
            break;
          case 7:
            nama_submodul = "<b>Jejak Audit</b>: ";
            break;
        }
        senarai_capaian = senarai_capaian + nama_submodul;
        if (field.FK_capaian.indexOf("C" + inc) >= 0)
          senarai_capaian = senarai_capaian + "Create, ";
        if (field.FK_capaian.indexOf("R" + inc) >= 0)
          senarai_capaian = senarai_capaian + "Read, ";
        if (field.FK_capaian.indexOf("U" + inc) >= 0)
          senarai_capaian = senarai_capaian + "Update, ";
        if (field.FK_capaian.indexOf("D" + inc) >= 0)
          senarai_capaian = senarai_capaian + "Delete, ";
        senarai_capaian = senarai_capaian + "<br>";
        inc++;
      }
      list.push({
        id: field.id_peranan,
        nama_peranan: field.nama_peranan,
        nama_senarai:
          '<p style="white-space: pre-line">' + senarai_capaian + "</p>",
        bil: bil++,
        upt_btn:
          '<button class="button button-box button-sm button-primary" onclick="loadData(\'' +
          i +
          '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ti-pencil-alt"></i></button> ',
      });
    });

    $("#listPeranan").footable({
      columns: columsPeranan,
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
  });
}

function tablePengguna() {
  var colums = [
    { name: "bil", title: "Bil" },
    { name: "nama", title: "Nama" },
    { name: "jenis_pengguna", title: "Sektor" },
    { name: "nama_peranan", title: "Peranan" },
    { name: "emel", title: "Emel", breakpoints: "md sm xs" },
    { name: "no_kad_pengenalan", title: "No. K/P", breakpoints: "md sm xs" },
    { name: "status_rekod", title: "Status", breakpoints: "lg md sm xs" },
    { name: "upt_btn", title: "Tindakan", breakpoints: "lg md sm xs" },
  ];
  var settings = {
    url: host + "usersListAll",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    let convertList = JSON.stringify(response.data);
    $("#dataListPengguna").val(convertList);
    var list = [];
    let bil = 1;

    $.each(response.data, function (i, field) {
      t_lahir = new Date(field.tarikh_lahir);
      var checked;
      if (field.statusrekod_capaian == "1") {
        checked = "checked";
        badge = "badge-success";
        text_statusrekod = "Aktif";
      } else {
        badge = "badge-danger";
        text_statusrekod = "Tidak Aktif";
      }

      list.push({
        id: field.id_users,
        nama: field.nama,
        emel: field.emel,
        no_kad_pengenalan: field.no_kad_pengenalan,
        notel: field.notel,
        jenis_pengguna: field.jenis_pengguna,
        nama_peranan: field.nama_peranan,
        bil: bil++,
        status_rekod:
          '<label class="adomx-switch-2 success "><input type="checkbox" id="status_sistem" class="form-control mb-20" ' +
          checked +
          " onclick=\"del_rekod('" +
          field.id_capaian +
          "','" +
          field.statusrekod_capaian +
          '\')"> <i class="lever"></i> <span id="text_statusrekod' +
          i +
          '" class="badge ' +
          badge +
          '">' +
          text_statusrekod +
          "</span></label>",
        upt_btn:
          '<button class="button button-box button-sm button-primary" onclick="loadDataCapaian(\'' +
          i +
          '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ti-pencil-alt"></i></button> ',
      });
    });

    $("#listPengguna").footable({
      columns: colums,
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
  });
}

function loadData(indexs) {
  let data = JSON.parse($("#dataListPeranan").val());

  $("#upt_id").val(data[indexs].id_peranan);
  $("#upt_nama_peranan").val(data[indexs].nama_peranan);

  saveLog(
    window.sessionStorage.id,
    "View Data of [id = " +
      data[indexs].id_peranan +
      "] at Tetapan Admin Pengguna.",
    window.sessionStorage.browser
  );

  $("#update-peranan").modal("show");

  $("input[type=checkbox]").prop("checked", false);
  var upt_FK_capaian = [];

  listmodul = sessionStorage.listsubmodule.split(",");
  listcapaian = data[indexs].FK_capaian.split(",");
  listproses = ["C", "R", "U", "D"];

  for (var c = 0; c < listcapaian.length; c++) {
    for (var m = 0; m < listmodul.length; m++) {
      for (var p = 0; p < listproses.length; p++) {
        var curprocess = listproses[p] + "" + listmodul[m];

        if (listcapaian[c].indexOf(curprocess) >= 0) {
          $("#upt_" + curprocess).prop("checked", true);
        }
      }
    }
  }
}

function loadDataCapaian(indexs) {
  let data = JSON.parse($("#dataListPengguna").val());

  $("#upt_FK_users").val(data[indexs].no_kad_pengenalan);
  $("#upt_FK_user_capaian").val(data[indexs].id_users);
  $("#upt_id_capaian").val(data[indexs].id_capaian);
  $("#upt_FK_kampus").val(data[indexs].id_kampus);
  $("#upt_FK_kluster").val(data[indexs].FK_kluster);
  $("#upt_FK_subkluster").val(data[indexs].FK_subkluster);
  $("#upt_FK_unit").val(data[indexs].FK_unit);
  $("#upt_FK_peranan").val(data[indexs].FK_peranan);

  saveLog(
    window.sessionStorage.id,
    "View Data of [id = " +
      data[indexs].id_peranan +
      "] at Tetapan Admin Pengguna.",
    window.sessionStorage.browser
  );

  $("#update-capaian").modal("show");

}

$("#FK_users").change(function () {
  var settings = {
    url: host + "usersgovsIntan/" + $("#FK_users").val(),
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    $("#FK_user").val(response.data.id_users);
    $("#FK_kampus").val(response.data.FK_kampus);
    $("#FK_kluster").val(response.data.FK_kluster);
    $("#FK_subkluster").val(response.data.FK_subkluster);
    $("#FK_unit").val(response.data.FK_unit);
  });
});

// FUNCTION REGISTER

$("#registerPeranan").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Daftar Peranan Pengguna",
      text: "Anda Pasti Untuk Simpan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      $("#reg-peranan").modal("hide");
      let FK_capaian = [];
      let nama_peranan = $("#nama_peranan").val();
      $.each(jQuery("input[name='crud']:checked"), function () {
        FK_capaian.push({ FK_capaian: jQuery(this).val() });
      });
      var stringFK_capaian = JSON.stringify(FK_capaian);

      var form = new FormData();
      form.append("nama_peranan", nama_peranan);
      form.append("FK_submodul", "0");
      form.append("FK_capaian", stringFK_capaian);
      form.append("created_by", window.sessionStorage.id);
      form.append("updated_by", window.sessionStorage.id);

      var settings = {
        url: host + "addPeranan",
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
            title: "Daftar Peranan Pengguna",
            text: result.message,
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            sessionStorage.token = result.token;
            window.location.reload();
          });
        } else {
          saveLog(
            window.sessionStorage.id,
            "Register Data [nama_peranan: " +
              nama_peranan +
              "], [FK_capaian: " +
              FK_capaian +
              "],  at Tetapan Peranan & Capaian.",
            window.sessionStorage.browser
          );
          window.location.reload();
        }
      });
    });
  }
});

$("#updatePeranan").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Kemaskini Peranan Pengguna",
      text: "Anda Pasti Untuk Simpan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      $("#reg-peranan").modal("hide");
      let FK_capaian = [];
      let upt_id = $("#upt_id").val();
      let nama_peranan = $("#upt_nama_peranan").val();
      $.each(jQuery("input[name='upt_crud']:checked"), function () {
        FK_capaian.push({ FK_capaian: jQuery(this).val() });
      });
      var stringFK_capaian = JSON.stringify(FK_capaian);

      var form = new FormData();
      form.append("id_peranan", upt_id);
      form.append("nama_peranan", nama_peranan);
      form.append("FK_submodul", "0");
      form.append("FK_capaian", stringFK_capaian);
      form.append("created_by", window.sessionStorage.id);
      form.append("updated_by", window.sessionStorage.id);

      var settings = {
        url: host + "perananUpdate",
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
            title: "Kemaskini Peranan Pengguna",
            text: result.message,
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            sessionStorage.token = result.token;
            window.location.reload();
          });
        } else {
          saveLog(
            window.sessionStorage.id,
            "Update Data [nama_peranan: " +
              nama_peranan +
              "], [FK_capaian: " +
              FK_capaian +
              "],  at Tetapan Peranan & Capaian.",
            window.sessionStorage.browser
          );
          window.location.reload();
        }
      });
    });
  }
});

$("#registerCapaian").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Daftar Capaian Pengguna",
      text: "Anda Pasti Untuk Simpan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let FK_peranan = $("#FK_peranan").val();
      let FK_users = $("#FK_user").val();
      let FK_kampus = $("#FK_kampus").val();
      let FK_kluster = $("#FK_kluster").val();
      let FK_subkluster = $("#FK_subkluster").val();
      let FK_unit = $("#FK_unit").val();

      var form = new FormData();
      form.append("FK_users", FK_users);
      form.append("FK_peranan", FK_peranan);
      form.append("FK_kampus", FK_kampus);
      form.append("FK_kluster", FK_kluster);
      form.append("FK_subkluster", FK_subkluster);
      form.append("FK_unit", FK_unit);
      form.append("created_by", window.sessionStorage.id);
      form.append("updated_by", window.sessionStorage.id);

      var param = {
        twmTitle: FK_users,
        twmDescription: FK_peranan,
      };

      var settings = {
        url: host + "addCapaian",
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
            title: "Daftar Capaian Pengguna",
            text: result.data,
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            sessionStorage.token = result.token;
            $("#reg-capaian").modal("hide");
            tablePengguna();
          });
        } else {
          saveLog(
            window.sessionStorage.id,
            "Register Data [FK_peranan: " +
              FK_peranan +
              "], [FK_users: " +
              FK_users +
              "],  at Tetapan Peranan & Capaian.",
            window.sessionStorage.browser
          );
          $("#reg-capaian").modal("hide");
          tablePengguna();
        }
      });
    });
  }
});

$("#updateCapaian").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Kemaskini Capaian Pengguna",
      text: "Anda Pasti Untuk Simpan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      $("#update-capaian").modal("hide");
      let FK_capaian = $("#upt_id_capaian").val();
      let FK_peranan = $("#upt_FK_peranan").val();
      let FK_users = $("#upt_FK_user_capaian").val();

      var form = new FormData();
      form.append("id_capaian", FK_capaian);
      form.append("FK_peranan", FK_peranan);
      form.append("FK_users", FK_users);
      form.append("created_by", window.sessionStorage.id);
      form.append("updated_by", window.sessionStorage.id);

      var param = {
        twmTitle: FK_users,
        twmDescription: FK_peranan,
      };

      var settings = {
        url: host + "capaianUpdate",
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
            title: "Kemaskini Capaian Pengguna",
            text: result.data,
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
          }).then(function () {
            sessionStorage.token = result.token;
            $("#update-capaian").modal("hide");
            tablePengguna();
          });
        } else {
          saveLog(
            window.sessionStorage.id,
            "Update Data [FK_peranan: " +
              FK_peranan +
              "], [FK_users: " +
              FK_users +
              "],  at Tetapan Peranan & Capaian.",
            window.sessionStorage.browser
          );
          $("#update-capaian").modal("hide");
          tablePengguna();
        }
      });
    });
  }
});

// FUNCTION DELETE

function del_rekod(i, status) {
  let statusrekod = "DEL";
  let id = i;

  if (status == 0) statuscapaian = 1;
  else statuscapaian = 0;

  var form = new FormData();
  form.append("id_capaian", id);
  form.append("status", statuscapaian);

  swal({
    title: "Kemaskini Status Capaian",
    text: "Anda Pasti Untuk Simpan?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    var settings = {
      url: host + "capaianDelete",
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
          title: "Kemaskini Status Capaian",
          text: "Gagal!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          sessionStorage.token = result.token;
          window.location.reload();
        });
      }
      saveLog(
        window.sessionStorage.id,
        "Update Data for [id = " +
          id +
          "], [FK_users = " +
          FK_users +
          "], [FK_modul = " +
          upt_FK_modul +
          "] at Tetapan Admin Pengguna.",
        window.sessionStorage.browser
      );
      window.location.reload();
    });
  });
}

$("#FK_kampus_add").change(function () {
  var settings = {
    url: host + "klusters/" + $("#FK_kampus_add").val(),
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_kluster_add").empty();
    $("#FK_kluster_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Kluster",
      })
    );
    $.each(response.data, function (i, item) {
      if ($("#FK_kampus_add").val() != "11") {
        var selected = "selected";
        $("#FK_kluster_add").append(
          $("<option>", {
            value: item.id_kluster,
            text: item.nama_kluster,
          }).attr(selected, true)
        );
        subklusterListNonKiara();
        // alert(selected)
      } else {
        var selected = "selected";
        $("#FK_kluster_add").append(
          $("<option>", {
            value: item.id_kluster,
            text: item.nama_kluster,
          })
        );
      }
    });
  });
});

$("#FK_kluster_add").change(function () {
  //Dropdown Subkluster List
  var settings = {
    url: host + "subklusters/" + $("#FK_kluster_add").val(),
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_subkluster_add").empty();
    $("#FK_subkluster_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Subkluster",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_subkluster_add").append(
        $("<option>", {
          value: item.id_subkluster,
          text: item.nama_subkluster,
        })
      );
    });
  });
  // END Dropdown Subkluster List
});

$("#FK_subkluster_add").change(function () {
  //Dropdown Unit List
  var settings = {
    url:
      host +
      "units/" +
      $("#FK_kluster_add").val() +
      "/" +
      $("#FK_subkluster_add").val(),
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_unit_add").empty();
    $("#FK_unit_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Unit",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_unit_add").append(
        $("<option>", {
          value: item.id_unit,
          text: item.nama_unit,
        })
      );
    });
  });
  // END Dropdown Unit List
});

function kampusList(returnValue) {
  //Dropdown Kampus List
  var settings = {
    url: host + "kampusList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_kampusList = response;
    returnValue();
  });
  // END Dropdown Kampus List
}

function klusterList(returnValue) {
  //Dropdown Kluster List
  var settings = {
    url: host + "klustersList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_klusterList = response;
    returnValue();
  });
  // END Dropdown Kluster List
}

function subklusterListNonKiara() {
  //Dropdown Subkluster List
  $("#FK_subkluster_add").empty();
  $("#FK_subkluster_add").append(
    $("<option>", {
      value: "",
      text: "Pilih Subkluster",
    })
  );

  //Dropdown Subkluster List
  var settings = {
    url: host + "subklusters/" + $("#FK_kluster_add").val(),
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_subkluster_add").empty();
    $("#FK_subkluster_add").append(
      $("<option>", {
        value: "",
        text: "Pilih Subkluster",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_subkluster_add").append(
        $("<option>", {
          value: item.id_subkluster,
          text: item.nama_subkluster,
        })
      );
    });
  });
  // END Dropdown Subkluster List
}

function subklusterList(returnValue) {
  var settings = {
    url: host + "subklustersList",
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_subklusterList = response;
    returnValue();
  });
  //Dropdown Subkluster List
}

function unitList(returnValue) {
  var settings = {
    url: host + "unitsList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_unitList = response;
    returnValue();
  });
}

function ezxsKampus(id_kampus) {
  //Dropdown Kluster List
  var form = new FormData();
  form.append("id_kampus", id_kampus);
  var settings = {
    url: host + "kampus",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    result = JSON.parse(response);
    $("#FK_kampus_add").empty();
    $.each(result.data, function (i, item) {
      $("#FK_kampus_add").append(
        $("<option>", {
          value: item.id_kampus,
          text: item.nama_kampus,
        })
      );
    });
  });
  // END Dropdown Kampus List
}

function ezxsKluster(id_kluster) {
  //Dropdown Kluster List
  var form = new FormData();
  form.append("id_kluster", id_kluster);
  var settings = {
    url: host + "klusters",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    result = JSON.parse(response);
    $("#FK_kluster_add").empty();
    $.each(result.data, function (i, item) {
      $("#FK_kluster_add").append(
        $("<option>", {
          value: item.id_kluster,
          text: item.nama_kluster,
        })
      );
      ezxsKampus(item.FK_kampus);
    });
  });
  // END Dropdown Kluster List
}

function ezxsSubKluster(id_subkluster) {
  //Dropdown Subkluster List
  var form = new FormData();
  form.append("id_subkluster", id_subkluster);
  var settings = {
    url: host + "subklusters",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };
  $.ajax(settings).done(function (response) {
    //LIST OPTION
    result = JSON.parse(response);
    $("#FK_subkluster_add").empty();
    $.each(result.data, function (i, item) {
      $("#FK_subkluster_add").append(
        $("<option>", {
          value: item.id_subkluster,
          text: item.nama_subkluster,
        })
      );
      ezxsKluster(item.FK_kluster);
    });
  });
  // END Dropdown Subkluster List
}

function perananList(returnValue) {
  var settings = {
    url: host + "perananList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_perananList = response;
    returnValue();
  });
}

// END Dropdown Peranan List

//Checkbox Submodul List
sessionStorage.listsubmodule = [];
var listsubmodule = [];
var settings = {
  url: host + "submodulsList",
  method: "GET",
  timeout: 0,
};
$.ajax(settings).done(function (response) {
  //LIST OPTION
  $.each(response.data, function (i, item) {
    $("#FK_capaian").append(
      $(
        '<table width="100%">' +
          "<tbody>" +
          "<tr>" +
          '<td width="30%"><label class="adomx-checkbox">' +
          item.nama_submodul +
          "</label></td>" +
          '<td width="10%"><label class="adomx-checkbox"><input class="form-control" type="checkbox" name="crud" value="C' +
          item.id_submodul +
          '" id="c' +
          item.id_submodul +
          '"/> <i class="icon"></i> Create</label></td>' +
          '<td width="10%"><label class="adomx-checkbox"><input class="form-control" type="checkbox" name="crud" value="R' +
          item.id_submodul +
          '" id="r' +
          item.id_submodul +
          '"/> <i class="icon"></i> Read</label></td>' +
          '<td width="10%"><label class="adomx-checkbox"><input class="form-control" type="checkbox" name="crud" value="U' +
          item.id_submodul +
          '" id="u' +
          item.id_submodul +
          '"/> <i class="icon"></i> Update</label></td>' +
          '<td width="10%"><label class="adomx-checkbox"><input class="form-control" type="checkbox" name="crud" value="D' +
          item.id_submodul +
          '" id="d' +
          item.id_submodul +
          '"/> <i class="icon"></i> Delete</label></td>' +
          "</tr>" +
          "</tbody>" +
          "</table>"
      )
    );

    $("#upt_FK_capaian").append(
      $(
        '<table width="100%">' +
          "<tbody>" +
          "<tr>" +
          '<td width="30%"><label class="adomx-checkbox">' +
          item.nama_submodul +
          "</label></td>" +
          '<td width="10%"><label class="adomx-checkbox" id="tc' +
          item.id_submodul +
          '"><input class="form-control" type="checkbox" name="upt_crud" value="C' +
          item.id_submodul +
          '" id="upt_C' +
          item.id_submodul +
          '"/> <i class="icon"></i> Create</label></td>' +
          '<td width="10%"><label class="adomx-checkbox" id="tr' +
          item.id_submodul +
          '"><input class="form-control" type="checkbox" name="upt_crud" value="R' +
          item.id_submodul +
          '" id="upt_R' +
          item.id_submodul +
          '"/> <i class="icon"></i> Read</label></td>' +
          '<td width="10%"><label class="adomx-checkbox" id="tu' +
          item.id_submodul +
          '"><input class="form-control" type="checkbox" name="upt_crud" value="U' +
          item.id_submodul +
          '" id="upt_U' +
          item.id_submodul +
          '"/> <i class="icon"></i> Update</label></td>' +
          '<td width="10%"><label class="adomx-checkbox" id="td' +
          item.id_submodul +
          '"><input class="form-control" type="checkbox" name="upt_crud" value="D' +
          item.id_submodul +
          '" id="upt_D' +
          item.id_submodul +
          '"/> <i class="icon"></i> Delete</label></td>' +
          "</tr>" +
          "</tbody>" +
          "</table>"
      )
    );
    listsubmodule.push(item.id_submodul);
  });
  sessionStorage.listsubmodule = listsubmodule;
});
// END Checkbox Format List

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
