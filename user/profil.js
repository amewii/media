$(function () {
  $.ajaxSetup({
    cache: false,
  });
  // $("#loading_modal").modal('show');
  if(window.sessionStorage.token && window.sessionStorage.no_kad_pengenalan){
    users(function(){
      if(objUsers.success){
        $("#displayno_kad_pengenalan").val(window.sessionStorage.no_kad_pengenalan);
        $("#displayemel").val(emel_master);
        $("#displaytarikhlahir").val(objUsers.data.tarikh_lahir);
        $("#notel").val(notel_master);
        $("#FK_jenis_pengguna").val(FK_jenis_pengguna_master);
        $("#id_users").val(id_users_master);

        if (id_usersgov_master != null) {
          $("#divKerajaan").show();
          $("#id_usersgov").val(id_usersgov_master);
          $("#emel_kerajaan").val(emel_kerajaan_master);
          $("#notel_kerajaan").val(notel_kerajaan_master);
          $("#nama_jawatan").val(nama_jawatan_master);
          if(objUsers.data.detail_pengguna.kategori_perkhidmatan.nama_kategoriperkhidmatan){
            $("#kategori_perkhidmatan").val(objUsers.data.detail_pengguna.kategori_perkhidmatan.nama_kategoriperkhidmatan);
            $("#skim").val(objUsers.data.detail_pengguna.skim.kod_skim + objUsers.data.detail_pengguna.gred);
          }
          // $("#gred").val(objUsers.data.gred);
          $("#users_intan").val(objUsers.data.detail_pengguna.users_intan);
          $("#usersluar").show();
          $("#FK_kementerian").val(objUsers.data.detail_pengguna.FK_kementerian);
          $("#FK_agensi").val(objUsers.data.detail_pengguna.FK_agensi);
          $("#FK_bahagian").val(objUsers.data.detail_pengguna.FK_bahagian);
          // if (result.data.users_intan == 1)   {
          //     $('#usersintan').show();
          //     $('#FK_kampus').val(result.data.id_kampus);
          //     $('#FK_kluster').val(result.data.id_kluster);
          //     $('#FK_subkluster').val(result.data.id_subkluster);
          //     $('#FK_unit').val(result.data.id_unit);
          // } else {
          //     $('#usersluar').show();
          //     $('#FK_kementerian').val(result.data.FK_kementerian);
          //     $('#FK_agensi').val(result.data.FK_agensi);
          //     $('#FK_bahagian').val(result.data.FK_bahagian);
          //     $('#FK_ila').val(result.data.id_ilawam);
          //     $('#alamat1_pejabat').val(result.data.alamat1_pejabat);
          //     $('#alamat2_pejabat').val(result.data.alamat2_pejabat);
          //     $('#poskod_pejabat').val(result.data.poskod_pejabat);
          //     $('#daerah_pejabat').val(result.data.daerah_pejabat);
          //     $('#negeri_pejabat').val(result.data.negeri_pejabat);
          // }
        } else if (objUsers.data.id_usersswasta != null) {
          $("#divSwasta").show();
          $("#divNotel_kerajaan").hide();
          $("#divEmel_kerajaan").hide();
          $("#divNotel").show();
          $("#id_usersswasta").val(id_usersswasta_master);
          $("#nama_majikan").val(objUsers.data.nama_majikan);
          $("#jawatan").val(objUsers.data.jawatan);
        } else if (objUsers.data.id_userspelajar != null) {
          $("#divPelajar").show();
          $("#divNotel_kerajaan").hide();
          $("#divEmel_kerajaan").hide();
          $("#divNotel").show();
          $("#id_userspelajar").val(objUsers.data.id_userspelajar);
          $("#nama_sekolah").val(objUsers.data.nama_sekolah);
        }

      }
      kampusList();
      klusterList();
      subklusterList();
      unitList();
      kementerianList(function () {
        $("#FK_kementerian").empty();
        $("#FK_kementerian").append(
          $("<option>", {
            value: "",
            text: "Pilih Kementerian",
          })
        );
        if (obj_kementerianList.success) {
          $.each(obj_kementerianList.data, function (i, item) {
            $("#FK_kementerian").append(
              $("<option>", {
                value: item.kod_kementerian,
                text: item.nama_kementerian + " (" + item.kod_kementerian + ")",
              })
            );
          });
        }
      });
      agensiList(function () {
        $("#FK_agensi").empty();
        $("#FK_agensi").append(
          $("<option>", {
            value: "",
            text: "Pilih Agensi",
          })
        );
        if (obj_agensiList.success) {
          $.each(obj_agensiList.data, function (i, item) {
            $("#FK_agensi").append(
              $("<option>", {
                value: item.kod_agensi,
                text: item.nama_agensi + " (" + item.kod_agensi + ")",
              })
            );
          });
        }
      });
      bahagianList(function () {
        $("#FK_bahagian").empty();
        $("#FK_bahagian").append(
          $("<option>", {
            value: "",
            text: "Pilih Bahagian",
          })
        );
        if (obj_bahagianList.success) {
          $.each(obj_bahagianList.data, function (i, item) {
            $("#FK_bahagian").append(
              $("<option>", {
                value: item.kod_bahagian,
                text: item.nama_bahagian + " (" + item.kod_bahagian + ")",
              })
            );
          });
        }
      });
      skimList();
      gredList();
    });
  }
  $("#loading_modal").modal("hide");
});
var confirmed = false;
$("#update").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let id_users = $("#id_users").val();
    let emel = $("#displayemel").val();
    let notel = $("#notel_kerajaan").val();
    // let katalaluan = $("#katalaluan").val();

    var form = new FormData();
    form.append("id_users", id_users);
    form.append("emel", emel);
    form.append("notel", notel);
    form.append("updated_by", window.sessionStorage.id);
    // form.append("katalaluan", katalaluan);
    // formData.append("token",window.sessionStorage.token);
    var settingseditprofileusers = {
      url: host + "usersEditProfile",
      method: "POST",
      headers: {
        'Authorization' : window.sessionStorage.token
      },
      timeout: 0,
      processData: false,
      contentType: false,
      data: form,
    };
    $.ajax(settingseditprofileusers).done(function (response) {
      if (response.success == false) {
        // swal(response.message, response.data, "error");
        return;
      }
    });
    if ($("#FK_jenis_pengguna").val() == 1) {
      let id_usersgov = $("#id_usersgov").val();
      let nama_jawatan = $("#nama_jawatan").val();
      let notel_kerajaan = $("#notel_kerajaan").val();
      let emel_kerajaan = $("#emel_kerajaan").val();
      let skim = $("#skim").val();
      let gred = $("#gred").val();
      let FK_kampus = $("#FK_kampus").val();
      let FK_kluster = $("#FK_kluster").val();
      let FK_subkluster = $("#FK_subkluster").val();
      let FK_unit = $("#FK_unit").val();
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
      formgov.append("id_usersgov", id_usersgov);
      formgov.append("nama_jawatan", nama_jawatan);
      formgov.append("notel_kerajaan", notel_kerajaan);
      formgov.append("emel_kerajaan", emel_kerajaan);
      formgov.append("skim", skim);
      formgov.append("gred", gred);
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
      formgov.append("updated_by", window.sessionStorage.id);

      var settingseditprofileusersgovs = {
        url: host + "usersgovsEditProfile",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: formgov,
      };

      $.ajax(settingseditprofileusersgovs).done(function (response) {
        if (response.success == false) {
          // swal(response.message, response.data, "error");
          return;
        }
        swal({
          title: "Edit Profile",
          text: "Berjaya Kemaskini Profile!",
          type: "success",
          showConfirmButton: false,
          allowOutsideClick: false,
          html: false,
          timer: 1000,
        }).then(
          function () {},
          function (dismiss) {
            if (dismiss === "timer") {
              $("#data_load").load("profil.html");
            }
          }
        );
        // swal({
        //     title: "Edit Profile",
        //     text: "Anda Pasti Untuk Kemaskini?",
        //     type: "warning",
        //     showCancelButton: true,
        //     confirmButtonText: "Kemaskini",
        //     closeOnConfirm: true,
        //     allowOutsideClick: false,
        //     html: false
        // }).then(function () {
        //     $('#data_load').load('profil.html');
        // });
      });
    } else if ($("#FK_jenis_pengguna").val() == 2) {
      let id_usersswasta = $("#id_usersswasta").val();
      let nama_majikan = $("#nama_majikan").val();
      let jawatan = $("#jawatan").val();

      var formgov = new FormData();
      formgov.append("id_usersswasta", id_usersswasta);
      formgov.append("nama_majikan", nama_majikan);
      formgov.append("jawatan", jawatan);
      formgov.append("updated_by", window.sessionStorage.id);

      var settingseditprofileusersswastas = {
        url: host + "userswastasEditProfile",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: formgov,
      };

      $.ajax(settingseditprofileusersswastas).done(function (response) {
        if (response.success == false) {
          // swal(response.message, response.data, "error");
          return;
        }
        swal({
          title: "Edit Profile",
          text: "Berjaya Kemaskini Profile!",
          type: "success",
          showConfirmButton: false,
          allowOutsideClick: false,
          html: false,
          timer: 1000,
        }).then(
          function () {},
          function (dismiss) {
            if (dismiss === "timer") {
              $("#data_load").load("profil.html");
            }
          }
        );
      });
    } else if ($("#FK_jenis_pengguna").val() == 3) {
      let id_userspelajar = $("#id_userspelajar").val();
      let nama_sekolah = $("#nama_sekolah").val();

      var formgov = new FormData();
      formgov.append("id_userspelajar", id_userspelajar);
      formgov.append("nama_sekolah", nama_sekolah);
      formgov.append("updated_by", window.sessionStorage.id);

      var settingseditprofileuserspelajars = {
        url: host + "userspelajarsEditProfile",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: formgov,
      };

      $.ajax(settingseditprofileuserspelajars).done(function (response) {
        if (response.success == false) {
          // swal(response.message, response.data, "error");
          return;
        }
        swal({
          title: "Edit Profile",
          text: "Berjaya Kemaskini Profile!",
          type: "success",
          showConfirmButton: false,
          allowOutsideClick: false,
          html: false,
          timer: 1000,
        }).then(
          function () {},
          function (dismiss) {
            if (dismiss === "timer") {
              $("#data_load").load("profil.html");
            }
          }
        );
      });
    }
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
      // swal(response.message,"Tiada Data",'warning');
    }
  });
}

$("#ubahkatalaluan").click(function () {
  $("#step-3").show();
  $("#divubahkatalaluan").addClass("hidden");
});
$("#tutupubahkatalaluan").click(function () {
  $("#step-3").addClass("hidden");
});

function kampusList() {
  //Dropdown Kampus List
  var settings = {
    url: host + "kampusList",
    method: "GET",
    timeout: 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_kampus").empty();
    $("#FK_kampus").append(
      $("<option>", {
        value: "",
        text: "Pilih Kampus",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_kampus").append(
        $("<option>", {
          value: item.id_kampus,
          text: item.nama_kampus,
        })
      );
    });

    //LIST OPTION UPDATE
    $("#upt_FK_kampus").empty();
    $("#upt_FK_kampus").append(
      $("<option>", {
        value: "",
        text: "Pilih Kluster",
      })
    );
    $.each(response.data, function (i, item) {
      $("#upt_FK_kampus").append(
        $("<option>", {
          value: item.id_kampus,
          text: item.nama_kampus,
        })
      );
    });
  });
  // END Dropdown Kampus List
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
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
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

function klusterList() {
  //Dropdown Kluster List
  var settings = {
    url: host + "klustersList",
    method: "GET",
    timeout: 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_kluster").empty();
    $("#FK_kluster").append(
      $("<option>", {
        value: "",
        text: "Pilih Kluster",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_kluster").append(
        $("<option>", {
          value: item.id_kluster,
          text: item.nama_kluster,
        })
      );
    });

    //LIST OPTION UPDATE
    $("#upt_FK_kluster").empty();
    $("#upt_FK_kluster").append(
      $("<option>", {
        value: "",
        text: "Pilih Kluster",
      })
    );
    $.each(response.data, function (i, item) {
      $("#upt_FK_kluster").append(
        $("<option>", {
          value: item.id_kluster,
          text: item.nama_kluster,
        })
      );
    });
  });
  // END Dropdown Kluster List
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
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
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

function subklusterList() {
  //Dropdown Subkluster List
  var settings = {
    url: host + "subklustersList",
    method: "GET",
    timeout: 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_subkluster").empty();
    $("#FK_subkluster").append(
      $("<option>", {
        value: "",
        text: "Pilih Subkluster",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_subkluster").append(
        $("<option>", {
          value: item.id_subkluster,
          text: item.nama_subkluster,
        })
      );
    });

    //LIST OPTION UPDATE
    $("#upt_FK_subkluster").empty();
    $("#upt_FK_subkluster").append(
      $("<option>", {
        value: "",
        text: "Pilih Subkluster",
      })
    );
    $.each(response.data, function (i, item) {
      $("#upt_FK_subkluster").append(
        $("<option>", {
          value: item.id_subkluster,
          text: item.nama_subkluster,
        })
      );
    });
  });
  // END Dropdown Subkluster List
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
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
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

function unitList() {
  //Dropdown Unit List
  var settings = {
    url: host + "unitsList",
    method: "GET",
    timeout: 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_unit").empty();
    $("#FK_unit").append(
      $("<option>", {
        value: "",
        text: "Pilih Unit",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_unit").append(
        $("<option>", {
          value: item.id_unit,
          text: item.nama_unit,
        })
      );
    });

    //LIST OPTION UPDATE
    $("#upt_FK_unit").empty();
    $("#upt_FK_unit").append(
      $("<option>", {
        value: "",
        text: "Pilih Unit",
      })
    );
    $.each(response.data, function (i, item) {
      $("#upt_FK_unit").append(
        $("<option>", {
          value: item.id_unit,
          text: item.nama_unit,
        })
      );
    });
  });
  // END Dropdown Unit List
}

function skimList() {
  //Dropdown Skim List
  var settings = {
    url: host + "skimsList",
    method: "GET",
    timeout: 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#skim").empty();
    $("#skim").append(
      $("<option>", {
        value: "",
        text: "Pilih Skim",
      })
    );
    $.each(response.data, function (i, item) {
      $("#skim").append(
        $("<option>", {
          value: item.id_skim,
          text: item.kod_skim + " - " + item.nama_skim,
        })
      );
    });
  });
  // END Dropdown Skim List
}

function gredList() {
  //Dropdown Gred List
  var settings = {
    url: host + "gredsList",
    method: "GET",
    timeout: 0,
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#gred").empty();
    $("#gred").append(
      $("<option>", {
        value: "",
        text: "Pilih Gred",
      })
    );
    $.each(response.data, function (i, item) {
      $("#gred").append(
        $("<option>", {
          value: item.id_gred,
          text: item.nama_gred,
        })
      );
    });
  });
  // END Dropdown Gred List
}

function kementerianList(returnValue) {
  //Dropdown Kementerian List
  var settings = {
    url: host + "kementeriansList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_kementerianList = response;
    returnValue();
  });
  // END Dropdown Kementerian List
}

function agensiList(returnValue) {
  //Dropdown Agensi List
  var settings = {
    url: host + "agensisList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_agensiList = response;
    returnValue();
  });
  // END Dropdown Agensi List
}

function bahagianList(returnValue) {
  var settings = {
    url: host + "bahagiansList",
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_bahagianList = response;
    returnValue();
  });
}
