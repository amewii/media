$(function () {
  $.ajaxSetup({
    cache: false,
  });
  tablePermohonan();
  kategoriList();
  statusList();
  tahunList();

});
var confirmed = false;

$("#carian_permohonan").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let FK_jenis_pengguna = $("#FK_jenis_pengguna").val();
    let FK_status = $("#FK_status").val();
    let tahun_permohonan = $("#tahun_permohonan").val();
    let tarikh_permohonan = $("#tarikh_permohonan").val();


    var form = new FormData();
    form.append("FK_jenis_pengguna", FK_jenis_pengguna);
    form.append("FK_status", FK_status);
    form.append("tahun_permohonan", tahun_permohonan);
    form.append("tarikh_permohonan", tarikh_permohonan);

    carianPermohonan(form);
  }
});


function kategoriList() {
  //Dropdown Kategori List
  var settings = {
    url: host + "jenispenggunasList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_jenis_pengguna").empty();
    $("#FK_jenis_pengguna").append(
      $("<option>", {
        value: "",
        text: "Pilih Kategori Pengguna",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_jenis_pengguna").append(
        $("<option>", {
          value: item.id_jenispengguna,
          text: item.jenis_pengguna,
        })
      );
    });
  });
  // END Dropdown Kategori List
}

function statusList() {
  //Dropdown Kampus List
  var settings = {
    url: host + "statusList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_status").empty();
    $("#FK_status").append(
      $("<option>", {
        value: "",
        text: "Pilih Status",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_status").append(
        $("<option>", {
          value: item.id_status,
          text: item.nama_status,
        })
      );
    });
  });
  // END Dropdown Kampus List
}

function tahunList() {
  //Dropdown Kluster List
  var settings = {
    url: host + "permohonanListTahun",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#tahun_permohonan").empty();
    $("#tahun_permohonan").append(
      $("<option>", {
        value: "",
        text: "Pilih Tahun",
      })
    );
    $.each(response.data, function (i, item) {
      $("#tahun_permohonan").append(
        $("<option>", {
          value: item.tahun,
          text: item.tahun,
        })
      );
    });
  });
  // END Dropdown Kluster List
}

function tablePermohonan() {
  var columns = [
    { name: "bil", title: "Bil" },
    { name: "nama_program", title: "Nama Program" },
    { name: "t_program", title: "Tarikh Program", breakpoints: "md sm xs" },
    { name: "nama_pemohon", title: "Nama Pemohon" },
    { name: "status_pemohon", title: "Kategori Pemohon" },
    { name: "tarikh_mohon", title: "Tarikh Permohonan" },
    { name: "status", title: "Status" },
  ];
  var obj = new get(host+`permohonanList`,window.sessionStorage.token).execute();
  if(obj.success){
    let convertList = JSON.stringify(obj.data);
    $("#dataList").val(convertList);
    var list = [];
    let bil = 1;

    $.each(obj.data, function (i, field) {
      t_program = new Date(field.tarikh_program);
      tarikh_mohon = new Date(field.tarikh_permohonan);

      var checked;
      if (field.programstatusrekod == "1") {
        checked = "checked";
        badge = "badge-success";
        text_statusrekod = "Aktif";
      } else {
        badge = "badge-danger";
        text_statusrekod = "Tidak Aktif";
      }
      list.push({
        id: field.id_program,
        nama_pemohon: field.nama,
        status_pemohon: field.jenis_pengguna,

        tarikh_mohon:
        tarikh_mohon.getDate() +
        "/" +
        (tarikh_mohon.getMonth() + 1) +
        "/" +
        tarikh_mohon.getFullYear(),

        t_program:
          t_program.getDate() +
          "/" +
          (t_program.getMonth() + 1) +
          "/" +
          t_program.getFullYear(),
        nama_program: field.nama_program,
        status: field.nama_status,
        bil: bil++,
      });
    });

    $(".listPermohonan").html(list.length);
    $(".listPermohonan-length").html(list.length);
    $("#listPermohonan").footable({
      columns: columns,
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
  } else {

  }
}

function carianPermohonan(form){

  var columns = [
    { name: "bil", title: "Bil" },
    { name: "nama_program", title: "Nama Program" },
    { name: "t_program", title: "Tarikh Program", breakpoints: "md sm xs" },
    { name: "nama_pemohon", title: "Nama Pemohon" },
    { name: "status_pemohon", title: "Kategori Pemohon" },
    { name: "tarikh_mohon", title: "Tarikh Permohonan" },
    { name: "status", title: "Status" },
  ];


  var obj = new post(host+`permohonanLaporan`,form,window.sessionStorage.token).execute();

  if(obj.success){

    let convertList = JSON.stringify(obj.data);
    $("#dataListPermohonan").val(convertList);
    var list = [];
    let bil = 1;

    $.each(obj.data, function (i, field) {

      t_program = new Date(field.tarikh_program);
      tarikh_mohon = new Date(field.tarikh_permohonan);

      var checked;
      if (field.programstatusrekod == "1") {
        checked = "checked";
        badge = "badge-success";
        text_statusrekod = "Aktif";
      } else {
        badge = "badge-danger";
        text_statusrekod = "Tidak Aktif";
      }
      list.push({
        id: field.id_program,
        nama_pemohon: field.nama,
        status_pemohon: field.jenis_pengguna,

        tarikh_mohon:
        tarikh_mohon.getDate() +
        "/" +
        (tarikh_mohon.getMonth() + 1) +
        "/" +
        tarikh_mohon.getFullYear(),

        t_program:
          t_program.getDate() +
          "/" +
          (t_program.getMonth() + 1) +
          "/" +
          t_program.getFullYear(),
        nama_program: field.nama_program,
        status: field.nama_status,
        bil: bil++,
      });
    });

    $("#listPermohonan").empty();
    $(".listPermohonan-length").html(list.length);
    $("#listPermohonan").footable({
      columns: columns,
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
  } else {

  }


}
