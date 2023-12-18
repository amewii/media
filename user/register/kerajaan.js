$(function () {
  $.ajaxSetup({
    cache: false,
  });
  $("#loading_modal").modal("show");
  // kampusList(function(){
  //     $('#FK_kampus').empty();
  //     $('#FK_kampus').append($('<option>', {
  //         value: "",
  //         text : "Pilih Kampus"
  //     }));
  //     if(obj_kampusList.success){
  //         $.each(obj_kampusList.data,function(i,item){
  //             $('#FK_kampus').append($('<option>', {
  //                 value: item.id_kampus,
  //                 text : item.nama_kampus
  //             }));
  //         });
  //     }
  // });
  // klusterList(function(){
  //     $('#FK_kluster').empty();
  //     $('#FK_kluster').append($('<option>', {
  //         value: "",
  //         text : "Pilih kluster"
  //     }));
  //     if(obj_klusterList.success){
  //         $.each(obj_klusterList.data,function(i,item){
  //             $('#FK_kluster').append($('<option>', {
  //                 value: item.id_kluster,
  //                 text : item.nama_kluster
  //             }));
  //         });
  //     }
  // });
  // subklusterList(function(){
  //     $('#FK_subkluster').empty();
  //     $('#FK_subkluster').append($('<option>', {
  //         value: "",
  //         text : "Pilih Subkluster"
  //     }));
  //     if(obj_subklusterList.success){
  //         console.log(obj_subklusterList)
  //         $.each(obj_subklusterList.data,function(i,item){
  //             $('#FK_subkluster').append($('<option>', {
  //                 value: item.id_subkluster,
  //                 text : item.nama_subkluster
  //             }));
  //         });
  //     }
  // });
  // unitList(function(){
  //     $('#FK_unit').empty();
  //     $('#FK_unit').append($('<option>', {
  //         value: "",
  //         text : "Pilih unit"
  //     }));
  //     if(obj_unitList.success){
  //         $.each(obj_unitList.data,function(i,item){
  //             $('#FK_unit').append($('<option>', {
  //                 value: item.id_unit,
  //                 text : item.nama_unit
  //             }));
  //         });
  //     }
  // });
  gelaranList(function () {
    $("#FK_gelaran").empty();
    $("#FK_gelaran").append(
      $("<option>", {
        value: "",
        text: "Pilih gelaran",
      })
    );
    if (obj_gelaranList.success) {
      $.each(obj_gelaranList.data, function (i, item) {
        $("#FK_gelaran").append(
          $("<option>", {
            value: item.id_gelaran,
            text: item.nama_gelaran,
          })
        );
      });
    }
  });
  // skimList(function(){
  //     $('#skim').empty();
  //     $('#skim').append($('<option>', {
  //         value: "",
  //         text : "Pilih Skim"
  //     }));
  //     if(obj_skimList.success){
  //         $.each(obj_skimList.data,function(i,item){
  //             $('#skim').append($('<option>', {
  //                 value: item.id_skim,
  //                 text : item.kod_skim + " - " + item.nama_skim
  //             }));
  //         });
  //     }
  // });
  // gredList(function(){
  //     $('#gred').empty();
  //     $('#gred').append($('<option>', {
  //         value: "",
  //         text : "Pilih Gred"
  //     }));
  //     if(obj_gredList.success){
  //         $.each(obj_gredList.data,function(i,item){
  //             $('#gred').append($('<option>', {
  //                 value: item.id_gred,
  //                 text : item.item.nama_gred
  //             }));
  //         });
  //     }
  // });
  kategoriperkhidmatanList(function () {
    $("#kategori_perkhidmatan").empty();
    $("#kategori_perkhidmatan").append(
      $("<option>", {
        value: "",
        text: "Pilih Kategori Perkhidmatan",
      })
    );
    if (obj_kategoriperkhidmatanList.success) {
      $.each(obj_kategoriperkhidmatanList.data, function (i, item) {
        $("#kategori_perkhidmatan").append(
          $("<option>", {
            value: item.id_kategoriperkhidmatan,
            text: item.nama_kategoriperkhidmatan,
          })
        );
      });
    }
  });
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
            text: item.nama_kementerian,
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
            text: item.nama_agensi,
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
            text: item.nama_bahagian,
          })
        );
      });
    }
  });
  ilaList(function () {
    $("#FK_ila").empty();
    $("#FK_ila").append(
      $("<option>", {
        value: "",
        text: "Pilih ILA",
      })
    );
    if (obj_ilaList.success) {
      $.each(obj_ilaList.data, function (i, item) {
        $("#FK_ila").append(
          $("<option>", {
            value: item.kod_ila,
            text: item.nama_ila,
          })
        );
      });
    }
  });
  // document.getElementById("no_kad_pengenalan").value = window.sessionStorage.no_kad_pengenalan;
  let noic = window.sessionStorage.no_kad_pengenalan;
  check_hrmis(noic, function () {
    if (obj_hrmis == "2") {
      $("#no_kad_pengenalan").val(noic);
      $("#usersluar").show();
      $("#loading_modal").modal("hide");
    } else {
      hrmisGelaran(obj_hrmis.peribadi.Title, function () {
        $("#FK_gelaran").val(objhrmisGelaran.data.id_gelaran);
      });
      hrmisKategoriPerkhidmatan(obj_hrmis.peribadi.ArmyPolice, function () {
        $("#kategori_perkhidmatan").val(
          objhrmisKategoriPerkhidmatan.data.id_kategoriperkhidmatan
        );
      });
      $("#nama_jawatan")
        .val(obj_hrmis.perkhidmatan.schmofservtitle)
        .attr("readonly", true);
      // $("#FK_gelaran").val(6);
      $("#nama").val(obj_hrmis.peribadi.nama).attr("readonly", true);
      // $("#emel").val(obj_hrmis.peribadi.COEmail);
      $("#no_kad_pengenalan").val(obj_hrmis.peribadi.icno);
      $("#notel").val(obj_hrmis.peribadi.COOffTelNo);
      $("#emel_kerajaan")
        .val(obj_hrmis.peribadi.COEmail)
        .attr("readonly", true);
      $("#notel_kerajaan")
        .val(obj_hrmis.peribadi.COHPhoneNo)
        .attr("readonly", true);
      $("#skim").val(obj_hrmis.perkhidmatan.SalGrd);
      $("#usersluar").show();
      $("#no_kad_pengenalan_semak").val("");
      hrmisKementerian(obj_hrmis.perkhidmatan.Kementerian, function () {
        // alert(objhrmisKementerian.data.id_kementerian)
        $("#FK_kementerian").val(objhrmisKementerian.data.kod_kementerian);
        $("#FK_agensi").val(obj_hrmis.perkhidmatan.AgcyGrpCd);
        hrmisBahagian(
          $("#FK_kementerian").val(),
          $("#FK_agensi").val(),
          function () {
            //LIST OPTION
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
                    text: item.nama_bahagian,
                  })
                );
              });
            }
          }
        );
      });
      check_usersIntan(noic, function () {
        if (obj_usersIntan == "") {
          $("#users_intan").val(0).attr("style", "pointer-events: none;");
        } else {
          $("#users_intan").val(1).attr("style", "pointer-events: none;");
        }
        $("#loading_modal").modal("hide");
      });
    }
  });
});

$("#registergov").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    $("#loading_modal").modal("show");
    $("#daftar").prop("disabled", true);
    let nama = $("#nama").val();
    let emel = $("#emel").val();
    let no_kad_pengenalan = $("#no_kad_pengenalan").val();
    let katalaluan = $("#katalaluan").val();
    let notel = $("#notel").val();
    let FK_jenis_pengguna = "1";
    let FK_gelaran = $("#FK_gelaran").val();
    // let ucreate = window.sessionStorage.noanggota;
    // var param = {
    //     twmTitle: no_kad_pengenalan,
    //     twmDescription: nama,
    //     a: FK_jantina,
    //     b: emel,
    //     c: tarikh_lahir,
    // }
    // console.log(param)
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
      // console.log(response);
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
        // console.log(response);
        result = JSON.parse(response);
        let FK_users = result.data.id_users;
        let emel_kerajaan = $("#emel_kerajaan").val();
        let notel_kerajaan = $("#notel_kerajaan").val();
        let nama_jawatan = $("#nama_jawatan").val();
        let kategori_perkhidmatan = $("#kategori_perkhidmatan").val();
        let skim = $("#skim").val();
        let gred = $("#gred").val();
        let users_intan = $("#users_intan").val();
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
          // console.log(response);
          result = JSON.parse(response);
          $("#loading_modal").modal("hide");
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

$("#users_intan").change(function () {
  if ($("#users_intan").val() == 1) {
    $("#usersintan").show();
    $("#divFK_kampus").show();
    $("#usersluar").hide();
    $("#FK_kampus").prop("required", true);
    $("FK_kementerian").prop("required", false);
    $("FK_agensi").prop("required", false);
    $("FK_bahagian").prop("required", false);
    $("alamat1_pejabat").prop("required", false);
    $("alamat2_pejabat").prop("required", false);
    $("poskod_pejabat").prop("required", false);
    $("daerah_pejabat").prop("required", false);
    $("negeri_pejabat").prop("required", false);
  } else if ($("#users_intan").val() == 0) {
    $("#usersintan").hide();
    $("#usersluar").show();
    $("FK_kampus").prop("required", false);
    $("FK_kluster").prop("required", false);
    $("FK_kementerian").prop("required", true);
    $("FK_agensi").prop("required", true);
    $("FK_bahagian").prop("required", true);
    $("alamat1_pejabat").prop("required", true);
    $("alamat2_pejabat").prop("required", true);
    $("poskod_pejabat").prop("required", true);
    $("daerah_pejabat").prop("required", true);
    $("negeri_pejabat").prop("required", true);
  }
});

$("#FK_kampus").change(function () {
  if ($("#FK_kampus").val() == 11) {
    $("#divFK_kluster").show();
    $("#divFK_subkluster").show();
    $("#divFK_unit").show();
    $("#divFK_kluster").prop("required", true);
    $("#divFK_subkluster").prop("required", true);
    // $("#divFK_unit").prop('required', true);
  } else {
    $("#divFK_kluster").hide();
    $("#divFK_subkluster").show();
    $("#divFK_kluster").prop("required", true);
    $("#divFK_subkluster").prop("required", true);
    $("#divFK_unit").show();
    // $("#divFK_unit").prop('required', true);
  }
});

$("#poskod_pejabat").blur(function () {
  var settings = {
    url: host + "sysposkod/" + $("#poskod_pejabat").val(),
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    document.getElementById("daerah_pejabat").value = response.data.bandar;
    document.getElementById("negeri_pejabat").value = response.data.nama;
  });
});

$("#FK_kampus").change(function () {
  var settings = {
    url: host + "klusters/" + $("#FK_kampus").val(),
    method: "GET",
    timeout: 0,
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
      if ($("#FK_kampus").val() != "11") {
        var selected = "selected";
        $("#FK_kluster").append(
          $("<option>", {
            value: item.id_kluster,
            text: item.nama_kluster,
          }).attr(selected, true)
        );
        subklusterListNonKiara();
        // alert(selected)
      } else {
        var selected = "selected";
        $("#FK_kluster").append(
          $("<option>", {
            value: item.id_kluster,
            text: item.nama_kluster,
          })
        );
      }
    });
  });
});

$("#FK_kluster").change(function () {
  //Dropdown Subkluster List
  var settings = {
    url: host + "subklusters/" + $("#FK_kluster").val(),
    method: "GET",
    timeout: 0,
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
  });
  // END Dropdown Subkluster List
});

$("#FK_subkluster").change(function () {
  //Dropdown Unit List
  var settings = {
    url:
      host +
      "units/" +
      $("#FK_kluster").val() +
      "/" +
      $("#FK_subkluster").val(),
    method: "GET",
    timeout: 0,
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
  });
  // END Dropdown Unit List
});

$("#FK_agensi").change(function () {
  var settings = {
    url:
      host +
      "bahagians/" +
      $("#FK_kementerian").val() +
      "/" +
      $("#FK_agensi").val(),
    method: "GET",
    timeout: 0,
  };
  // console.log(settings);

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_bahagian").empty();
    $("#FK_bahagian").append(
      $("<option>", {
        value: "",
        text: "Pilih Bahagian",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_bahagian").append(
        $("<option>", {
          value: item.kod_bahagian,
          text: item.nama_bahagian + " (" + item.kod_bahagian + ")",
        })
      );
    });
  });
  // END Dropdown Sub Modul List
});

$("#FK_bahagian").change(function () {
  var settings = {
    url: host + "ilawams/" + $("#FK_bahagian").val(),
    method: "GET",
    timeout: 0,
  };
  // console.log(settings);

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    $("#FK_ila").empty();
    $("#FK_ila").append(
      $("<option>", {
        value: "",
        text: "Pilih ILA",
      })
    );
    $.each(response.data, function (i, item) {
      $("#FK_ila").append(
        $("<option>", {
          value: item.kod_ila,
          text: item.nama_ila + " (" + item.kod_ila + ")",
        })
      );
    });
  });
  // END Dropdown Sub Modul List
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
  $("#FK_subkluster").empty();
  $("#FK_subkluster").append(
    $("<option>", {
      value: "",
      text: "Pilih Subkluster",
    })
  );

  //Dropdown Subkluster List
  var settings = {
    url: host + "subklusters/" + $("#FK_kluster").val(),
    method: "GET",
    timeout: 0,
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

function gelaranList(returnValue) {
  //Dropdown Gelaran List
  var settings = {
    url: host + "gelaransList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_gelaranList = response;
    returnValue();
  });
  // END Dropdown Gelaran List
}

function skimList(returnValue) {
  //Dropdown Skim List
  var settings = {
    url: host + "skimsList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_skimList = response;
    returnValue();
  });
  // END Dropdown Skim List
}

function gredList(returnValue) {
  //Dropdown Gred List
  var settings = {
    url: host + "gredsList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_gredList = response;
    returnValue();
  });
  // END Dropdown Gred List
}

function kategoriperkhidmatanList(returnValue) {
  //Dropdown Kategori Perkhidmatan List
  var settings = {
    url: host + "kategoriperkhidmatansList",
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_kategoriperkhidmatanList = response;
    returnValue();
  });
  // END Dropdown Kategori Perkhidmatan List
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

function ilaList(returnValue) {
  var settings = {
    url: host + "ilawamsList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_ilaList = response;
    returnValue();
    //LIST OPTION
  });
}

function check_users(noic, returnValue) {
  var form = new FormData();
  form.append("no_kad_pengenalan", noic);

  var settings = {
    url: host + "users",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };
  $.ajax(settings).done(function (response) {
    obj_users = response;
    returnValue();
  });
}

function check_hrmis(noic, returnValue) {
  var settings = {
    url: "https://admin.dtims.intan.my/api/hrmis/check/" + noic,
    // "url": "http://10.1.3.152/ezxs_webservice/index.php?ic="+noic,
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_hrmis = JSON.parse(response);

    returnValue();
  });
}

function check_usersIntan(noic, returnValue) {
  var settings = {
    url: "https://admin.dtims.intan.my/api/ezxs/check/" + noic,
    // "url": "http://10.1.3.152/ezxs_webservice/index.php?ic="+noic,
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings).done(function (response) {
    obj_usersIntan = response.posts;
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
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    result = JSON.parse(response);
    $("#FK_kampus").empty();
    $.each(result.data, function (i, item) {
      $("#FK_kampus").append(
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
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };

  $.ajax(settings).done(function (response) {
    //LIST OPTION
    result = JSON.parse(response);
    $("#FK_kluster").empty();
    $.each(result.data, function (i, item) {
      $("#FK_kluster").append(
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
    // "header":{
    //     "Authentication": "ASDCM"+window.sessionStorage.token
    //   }
  };
  $.ajax(settings).done(function (response) {
    //LIST OPTION
    result = JSON.parse(response);
    $("#FK_subkluster").empty();
    $.each(result.data, function (i, item) {
      $("#FK_subkluster").append(
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

function hrmisKementerianList(nama_kementerian) {
  //Dropdown Kementerian List
  var form = new FormData();
  form.append("nama_kementerian", nama_kementerian);
  var settings = {
    url: host + "kementeriansName",
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
    objhrmisKementerian = result;
    $("#FK_kementerian").empty();
    $.each(result.data, function (i, item) {
      $("#FK_kementerian").append(
        $("<option>", {
          value: item.kod_kementerian,
          text: item.nama_kementerian + " (" + item.kod_kementerian + ")",
        })
      );
    });
  });
  // END Dropdown Kementerian List
}

function hrmisAgensiList(kod_agensi) {
  //Dropdown Agensi List
  var form = new FormData();
  form.append("kod_agensi", kod_agensi);
  var settings = {
    url: host + "agensisKod",
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
    $("#FK_agensi").empty();
    $.each(result.data, function (i, item) {
      $("#FK_agensi").append(
        $("<option>", {
          value: item.kod_agensi,
          text: item.nama_agensi + " (" + item.kod_agensi + ")",
        })
      );
      hrmisBahagianList();
    });
  });
  // END Dropdown Agensi List
}

function hrmisBahagianList() {
  //Dropdown Bahagian List
  $("#FK_bahagian").empty();
  $("#FK_bahagian").append(
    $("<option>", {
      value: "",
      text: "Pilih Bahagian",
    })
  );

  $("#FK_agensi").change(function () {
    var settings = {
      url:
        host +
        "bahagians/" +
        $("#FK_kementerian").val() +
        "/" +
        $("#FK_agensi").val(),
      method: "GET",
      timeout: 0,
    };
    // console.log(settings);

    $.ajax(settings).done(function (response) {
      //LIST OPTION
      $("#FK_bahagian").empty();
      $("#FK_bahagian").append(
        $("<option>", {
          value: "",
          text: "Pilih Bahagian",
        })
      );
      $.each(response.data, function (i, item) {
        $("#FK_bahagian").append(
          $("<option>", {
            value: item.kod_bahagian,
            text: item.nama_bahagian + " (" + item.kod_bahagian + ")",
          })
        );
      });
    });
    // END Dropdown Sub Modul List
  });
}

function hrmisGelaran(nama_gelaran, returnValue) {
  var form = new FormData();
  form.append("nama_gelaran", nama_gelaran);
  var settings = {
    url: host + "gelaransHrmis",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };
  $.ajax(settings).done(function (response) {
    objhrmisGelaran = JSON.parse(response);
    returnValue();
  });
}

function hrmisKategoriPerkhidmatan(nama_kategoriperkhidmatan, returnValue) {
  var form = new FormData();
  form.append("nama_kategoriperkhidmatan", nama_kategoriperkhidmatan);
  var settings = {
    url: host + "kategoriperkhidmatansHrmis",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };
  $.ajax(settings).done(function (response) {
    objhrmisKategoriPerkhidmatan = JSON.parse(response);
    returnValue();
  });
}

function hrmisKementerian(nama_kementerian, returnValue) {
  //Dropdown Kementerian List
  var form = new FormData();
  form.append("nama_kementerian", nama_kementerian);
  var settings = {
    url: host + "kementeriansHrmis",
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
    objhrmisKementerian = result;
    returnValue();
  });
  // END Dropdown Kementerian List
}

function hrmisAgensi(kod_agensi, returnValue) {
  //Dropdown Agensi List
  var form = new FormData();
  form.append("kod_agensi", kod_agensi);
  var settings = {
    url: host + "agensisKod",
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
    objhrmisAgensi = result;
    returnValue();
  });
  // END Dropdown Agensi List
}

function hrmisBahagian(kod_kementerian, kod_agensi, returnValue) {
  var settings = {
    url: host + "bahagians/" + kod_kementerian + "/" + kod_agensi,
    method: "GET",
    timeout: 0,
  };
  // console.log(settings);

  $.ajax(settings).done(function (response) {
    obj_bahagianList = response;
    console.log(obj_bahagianList);
    returnValue();
  });
  // END Dropdown Sub Modul List
}
