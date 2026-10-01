$(function () {
  $.ajaxSetup({
    cache: false,
  });
  cekCapaian();
  onPageLoad();
});

function cekCapaian() {
  //TETAPAN MEDIA (ID:1)
  if (window.sessionStorage.control_program_media_C2 == 1) {
    $("#control_program_media_C2").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_R2 == 1) {
    $("#control_program_media_R2").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_U2 == 1) {
    $(".control_program_media_U2").removeClass("hidden");
  }
  if (window.sessionStorage.control_program_media_D2 == 1) {
    $("#control_program_media_D2").removeClass("hidden");
  }
}

var bil = 0;
var bil_upload = 0;

function getStoredMediaList() {
  var value = $("#dataList").val();
  if (!value) return [];

  try {
    var parsed = JSON.parse(value);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function setStoredMediaList(mediaList) {
  $("#dataList").val(JSON.stringify(JSON.stringify(mediaList)));
}

$.fileup({
  // url: 'file/upload',
  inputID: "upload-2",
  dropzoneID: "upload-2-dropzone",
  queueID: "upload-2-queue",
  lang: "en",
  onSelect: function (file) {
    let ext = file.name.split(".").pop();
    let kod_format = $("#disp_kod_format").text();
    let format = kod_format.toLowerCase().split(",");
    let formatupper = kod_format.toUpperCase().split(",");
    let bil_file = $("#disp_bilangan_fail").text();
    let img_list = getStoredMediaList().length;
    let bal_file = bil_file - img_list;

    let size = $("#disp_saiz_fail").text() * 1048576;
    let size_file = file.size;

    if (bil < bal_file) {
      // if ($.inArray(ext, format) == 1){
      if (format.includes(ext) == true || formatupper.includes(ext) == true) {
        if (size_file < size) {
          $("#multiple button").show();
          ++bil;
        } else {
          return false;
        }
      } else {
        swal({
          title: "Muat Naik Media",
          text: "Hanya format fail " + kod_format + " sahaja dibenarkan!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {});
        return false;
      }
    } else {
      swal({
        title: "Muat Naik Media",
        text:
          img_list +
          " media daripada " +
          bil_file +
          " media telah disimpan. Hanya " +
          bal_file +
          " media dibenarkan untuk dimuat naik!",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {});
      return false;
    }
  },
  onRemove: function (file, total) {
    if (file === "*" || total === 1) {
      $("#multiple button").hide();
    }
    if (file === "*") {
      bil = 0;
      bil_upload = 0;
    } else {
      bil = Math.max(0, bil - 1);
      if (file.status === "loaded") {
        bil_upload = Math.max(0, bil_upload - 1);
      }
    }
  },
  onSuccess: function (response, file_number, file) {
    var file_data = file;
    var form_data = new FormData();
    form_data.append("file", file_data);
    form_data.append("updated_by", window.sessionStorage.id);
    var obj = new post(host+`programUpload/`+window.sessionStorage.med_program_id,form_data,window.sessionStorage.token).execute();
    if(obj.success){
      ++bil_upload;
      var imglist = getStoredMediaList();
      imglist.push({
        images: obj.file,
      });
      setStoredMediaList(imglist);
      saveImgList(JSON.stringify(imglist));

      if (bil > 0 && bil_upload >= bil) {
        $("#finishButton")
          .attr("data-dismiss", "modal")
          .prop("disabled", false)
          .removeClass("button-dark button-danger")
          .addClass("button-primary")
          .html('<i class="ti-check"></i>Selesai');

        swal({
          title: "Muat Naik Rekod Berjaya",
          text: "Semua fail berjaya dimuat naik.",
          type: "success",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          onPageLoad();
        });
      }
    } else {
      var input = document.getElementById("upload-2");
      if (input && input.fileup && input.fileup.files[file_number]) {
        input.fileup.files[file_number].status = "stand_by";
      }
      $("#fileup-upload-2-" + file_number)
        .find(".fileup-upload")
        .show()
        .end()
        .find(".fileup-result")
        .removeClass("fileup-success")
        .addClass("fileup-error")
        .text("Gagal. Cuba semula.");
    }
  },
  onError: function (event, file, file_number) {
    $("#loading_modal").modal("hide");
  },
  onFinish: function (e) {
  },
});

function reload_page() {
  window.location.reload();
}

function saveImgList(varImg) {
  var form_upload = new FormData();
  form_upload.append("file", varImg);
  form_upload.append("updated_by", window.sessionStorage.id);
  var obj = new post(host+`programUpload2/`+window.sessionStorage.med_program_id,form_upload,window.sessionStorage.token).execute();
}


function getMediaType(fileName) {
  var extension = String(fileName || "")
    .split(".")
    .pop()
    .toLowerCase();
  return ["mp4", "mov", "webm", "m4v"].includes(extension) ? 2 : 1;
}

function getMediaUrl(fileName) {
  return "user/api_asdcm/public/uploads/" + encodeURIComponent(fileName);
}

function createMediaCard(field, index) {
  var fileName = String(field.images || "");
  var mediaType = getMediaType(fileName);
  var vip = String(field.FK_vip || "");
  var checkboxID = "media-select-" + index;
  var $item = $("<article>", {
    class: "media-list-item",
  }).data({
    mediaName: fileName,
    mediaType: mediaType,
    mediaVip: vip,
  });

  var $select = $("<label>", {
    class: "media-item-select",
    for: checkboxID,
    title: "Pilih " + fileName,
  });
  var $checkbox = $("<input>", {
    type: "checkbox",
    id: checkboxID,
    name: "media_selected[]",
    value: fileName,
    "aria-label": "Pilih " + fileName,
  });
  $select.append($checkbox, $("<span>", { class: "media-checkbox-mark" }));

  var $trigger = $("<button>", {
    type: "button",
    class: "media-preview-trigger",
    "aria-label": "Lihat " + fileName,
  });
  if (mediaType === 2) {
    $trigger.append(
      $("<video>", {
        src: getMediaUrl(fileName),
        muted: true,
        preload: "metadata",
      }),
      $("<span>", { class: "media-video-badge" }).append(
        $("<i>", { class: "fa fa-play" })
      )
    );
  } else {
    $trigger.append(
      $("<img>", {
        src: getMediaUrl(fileName),
        alt: fileName,
        loading: "lazy",
      })
    );
  }

  var $details = $("<div>", { class: "media-item-details" }).append(
    $("<strong>", {
      class: "media-item-type",
      text: mediaType === 2 ? "Video" : "Gambar",
    })
  );

  return $item.append($select, $trigger, $details);
}

function setMediaPreview($item) {
  if (!$item || !$item.length) return;

  var fileName = $item.data("mediaName");
  var mediaType = Number($item.data("mediaType"));
  var vip = String($item.data("mediaVip") || "");
  var $stage = $("#mediaPreviewStage").empty();

  $("#listImages .media-list-item").removeClass("is-previewing");
  $item.addClass("is-previewing");

  if (mediaType === 2) {
    $stage.append(
      $("<video>", {
        src: getMediaUrl(fileName),
        controls: true,
        preload: "metadata",
      })
    );
  } else {
    $stage.append(
      $("<img>", {
        src: getMediaUrl(fileName),
        alt: fileName,
      })
    );
  }

  $("#mediaPreviewName").text(mediaType === 2 ? "Video" : "Gambar");
  $("#mediaPreviewOpen")
    .prop("disabled", false)
    .data({ mediaName: fileName, mediaType: mediaType, mediaVip: vip });
}

function applyMediaView(view) {
  var allowedViews = ["list", "thumbnail", "filmstrip"];
  if (!allowedViews.includes(view)) view = "thumbnail";

  window.sessionStorage.mediaProgramView = view;
  $("#listImages")
    .removeClass("media-view-list media-view-thumbnail media-view-filmstrip")
    .addClass("media-view-" + view);
  $(".media-view-button")
    .removeClass("active")
    .attr("aria-pressed", "false")
    .filter('[data-media-view="' + view + '"]')
    .addClass("active")
    .attr("aria-pressed", "true");

  var showPreview = view === "filmstrip";
  $("#mediaPreviewPanel").toggleClass("hidden", !showPreview);
  if (showPreview) {
    var $current = $("#listImages .media-list-item.is-previewing").first();
    setMediaPreview(
      $current.length ? $current : $("#listImages .media-list-item").first()
    );
  }
}

function updateMediaSelection() {
  var $checkboxes = $('#listImages input[name="media_selected[]"]');
  var selected = $checkboxes.filter(":checked").length;
  var total = $checkboxes.length;
  var checkAll = document.getElementById("checkAll");

  $("#mediaSelectedCount").text(selected + " dipilih");
  if (checkAll) {
    checkAll.checked = total > 0 && selected === total;
    checkAll.indeterminate = selected > 0 && selected < total;
  }
  $("#hapusgambar").prop("disabled", selected === 0);
}

function onPageLoad() {
  var useLoadingModal = !$("#reg-media").hasClass("show");
  if (useLoadingModal) {
    $("#loading_modal").modal("show");
  }
  var obj = new get(host+`program/`+window.sessionStorage.med_program_id,window.sessionStorage.token).execute();
  if(obj.success){
    $("#listImages .media-list-item").remove();
    $("#mediaPreviewStage").empty();
    $("#mediaPreviewName").text("Pilih media untuk dipratonton");
    $("#mediaPreviewOpen").prop("disabled", true).removeData();
    response = obj;
    t_program = new Date(response.data.tarikh_program);

    vip = response.data.FK_vip;
    vip = vip.replace(/;/gi, " ,");

    $("#disp_id").val(response.data.id_program);
    $("#upt_id").val(response.data.id_program);
    $("#disp_nama_program").text(response.data.nama_program);
    $("#disp_tarikh_program").text(
      t_program.getDate() +
        "/" +
        (t_program.getMonth() + 1) +
        "/" +
        t_program.getFullYear()
    );
    $("#disp_nama_kampus").text(response.data.nama_kampus);
    $("#disp_nama_kluster").text(response.data.nama_kluster);
    $("#disp_nama_unit").text(response.data.nama_unit);
    $("#disp_vip").text(vip);
    $("#disp_nama_kategori").text(response.data.nama_kategori);
    $("#disp_bilangan_fail").text(response.data.bilangan_fail);
    $("#disp_kod_format").text(response.data.kod_format);
    $("#disp_saiz_fail").text(response.data.saiz_fail);
    $("#uptid").val(response.data.id_program);
    let convertList = JSON.stringify(response.data.media_path);
    $("#dataList").val(convertList);

    if (convertList == "null") {
      $("#dataList").val("");
    }
    images = getStoredMediaList();
    $.each(images, function (i, field) {
      $("#listImages").append(createMediaCard(field, i));
    });
    applyMediaView(window.sessionStorage.mediaProgramView || "thumbnail");
    updateMediaSelection();
    $("#finishButton").removeClass("button-dark");
    $("#finishButton").addClass("button-primary");
    $("#finishButton").prop("disabled", false);
  }
  if (useLoadingModal) {
    $("#loading_modal").modal("hide");
  }
}

$("#reg-media").on("hidden.bs.modal", function () {
  $.fileup("upload-2", "remove", "*");
  bil = 0;
  bil_upload = 0;
  $("#finishButton")
    .attr("data-dismiss", "modal")
    .prop("disabled", false)
    .removeClass("button-dark button-primary")
    .addClass("button-danger")
    .html('<i class="ti-close"></i>Tutup');
});

function loadData(indexs, varType, vip) {
  let data = JSON.parse($("#dataList").val());

  vip = String(vip || "").replace(/;/gi, " ,");
  $("#imgTags").empty();

  if (varType == 1) {
    var img = new Image();
    img.src = "user/api_asdcm/public/uploads/" + indexs;
  } else {
    var img = document.createElement("video");
    img.src = "user/api_asdcm/public/uploads/" + indexs;
    img.width = 450;
    img.autoplay = false;
    img.controls = true;
    $("#video").bind("contextmenu", function () {
      return false;
    });
  }

  $("#imgText").val(indexs);

  document.getElementById("imgTags").appendChild(img);
  $("#FK_users").val("");
  if (vip != "undefined") $("#FK_users").val(vip);

  $("#tag-gambar").modal("show");
}

$("#closeButton").click(function () {
  const list = document.getElementById("imgTags");
  list.removeChild(list.firstElementChild);
});

$("#back").click(function () {
  if (window.sessionStorage.med_permohonan_id == 0) {
    window.sessionStorage.content = "html/med_program";
    $("#content").load("html/med_program.html");
  } else {
    window.sessionStorage.content = "html/med_permohonan";
    $("#content").load("html/med_permohonan.html");
  }
});

var confirmed = false;
$("#taggambar").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Tag VIP",
      text: "Anda Pasti Untuk Simpan?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      $("#tag-gambar").modal("hide");

      let id = $("#upt_id").val();
      let imgText = $("#imgText").val();
      let FK_users = $("#FK_users").val();

      var form = new FormData();
      form.append("id_program", id);
      form.append("imgText", imgText);
      form.append("FK_users", FK_users);
      form.append("updated_by", window.sessionStorage.id);

      var obj = new post(host+`programTagging`,form,window.sessionStorage.token).execute();
      if(obj.success){
        swal({
          title: "Tagging Media",
          text: "Berjaya!",
          type: "success",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          sessionStorage.token = result.token;
          window.location.reload();
        });
      } else {
        swal({
          title: "Daftar Program",
          text: "Gagal!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          window.location.reload();
        });
      }
    });
  }
});

$("#reg-permohonan").click(function () {
  swal({
    title: "Muat Turun Media",
    text: "Anda Pasti Untuk Membuat Permohonan Muat Turun?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    $("#reg-permohonan").modal("hide");
    t_program = new Date();
    let FK_users = window.sessionStorage.id;
    let FK_program = $("#disp_id").val();
    let status_permohonan = "1";
    let tarikh_permohonan =
      t_program.getFullYear() +
      "-" +
      (t_program.getMonth() + 1) +
      "-" +
      t_program.getDate();
    let statusrekod = "1";

    var form = new FormData();
    form.append("FK_users", FK_users);
    form.append("FK_program", FK_program);
    form.append("status_permohonan", status_permohonan);
    form.append("tarikh_permohonan", tarikh_permohonan);
    form.append("created_by", window.sessionStorage.id);
    form.append("updated_by", window.sessionStorage.id);
    form.append("statusrekod", "1");

    var obj = new post(host+`addPermohonan`,form,window.sessionStorage.token).execute();
    if(obj.success){
      swal({
        title: "Muat Turun Media",
        text: "Permohonan Berjaya Direkod!",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        sessionStorage.token = result.token;
        window.location.reload();
      });
    } else {
      swal({
        title: "Muat Turun Media",
        text: "Permohonan Gagal!",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    }
  });
});


//Dropdown User List
var settings = {
  url: host + "vipsList",
  method: "GET",
  timeout: 0,
};

$.ajax(settings).done(function (response) {
  //LIST OPTION
  $("#FK_userss").empty();
  $.each(response.data, function (i, item) {
    $("#FK_userss").append(
      $("<option>", {
        value:
          item.nama_gelaran +
          " " +
          item.nama_vip +
          " (" +
          item.jawatan_vip +
          ")",
        text:
          item.nama_gelaran +
          " " +
          item.nama_vip +
          " (" +
          item.jawatan_vip +
          ")",
      })
    );
  });
});
// END Dropdown User List

$("#listvip").change(function () {
  var text = $(this).val();
  var listvip = $("#FK_users").val().split(",");

  listvip.forEach((vip, index) => {
    if (vip.trim() == text) {
      listvip.splice(index, 1);
    }
  });

  if (listvip != "") {
    listvip = listvip + "," + text;
  } else {
    listvip = text;
  }

  $("#FK_users").val(listvip);
});

function del_media() {
  swal({
    title: "Kemaskini Media",
    text: "Anda Pasti Untuk Hapus Media?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    $("#tag-gambar").modal("hide");
    let FK_users = window.sessionStorage.id;
    let FK_program = $("#disp_id").val();
    let imgText = $("#imgText").val();

    var form = new FormData();

    form.append("updated_by", FK_users);
    form.append("imgText", imgText);

    var settings = {
      url: host + "programMediaRemove/" + FK_program,
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
          title: "Kemaskini Media",
          text: "Hapus Media Gagal!",
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          window.location.reload();
        });
      }
      swal({
        title: "Hapus Media Media",
        text: "Hapus Media Berjaya!",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    });
  });
}

function del_media_multiple() {
  swal({
    title: "Hapus Media",
    text: "Anda Pasti Untuk Hapus Media Yang Dipilih?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    let media_list = $('#listImages [type="checkbox"]:checked')
      .map(function () {
        image = this.value.split(";");
        return image[0];
      })
      .get();
    del_media_multi(media_list);

    swal({
      title: "Hapus Media",
      text: "Hapus Media Berjaya!",
      type: "success",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      window.location.reload();
    });
  });
}

function del_media_multi(value) {
  let FK_users = window.sessionStorage.id;
  let FK_program = $("#disp_id").val();
  let imgText = value;

  var form = new FormData();

  form.append("updated_by", FK_users);
  form.append("imgText", imgText);
  var settings = {
    url: host + "programMediaBunchRemove/" + FK_program,
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

$(document)
  .off("click.mediaLibrary", ".media-view-button")
  .on("click.mediaLibrary", ".media-view-button", function () {
    applyMediaView($(this).data("mediaView"));
  })
  .off("click.mediaLibrary", "#listImages .media-preview-trigger")
  .on("click.mediaLibrary", "#listImages .media-preview-trigger", function () {
    var $item = $(this).closest(".media-list-item");
    if ($("#listImages").hasClass("media-view-filmstrip")) {
      setMediaPreview($item);
      return;
    }
    loadData(
      $item.data("mediaName"),
      Number($item.data("mediaType")),
      String($item.data("mediaVip") || "")
    );
  })
  .off("click.mediaLibrary", "#mediaPreviewOpen")
  .on("click.mediaLibrary", "#mediaPreviewOpen", function () {
    loadData(
      $(this).data("mediaName"),
      Number($(this).data("mediaType")),
      String($(this).data("mediaVip") || "")
    );
  })
  .off("change.mediaLibrary", "#checkAll")
  .on("change.mediaLibrary", "#checkAll", function () {
    $('#listImages input[name="media_selected[]"]')
      .prop("checked", this.checked);
    updateMediaSelection();
  })
  .off("change.mediaLibrary", '#listImages input[name="media_selected[]"]')
  .on(
    "change.mediaLibrary",
    '#listImages input[name="media_selected[]"]',
    updateMediaSelection
  );

function publish(){
  swal({
    title: "Siar Program",
    text: "Anda Pasti Untuk Siar?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    var form = new FormData();
    form.append('id_program',window.sessionStorage.med_program_id);
    form.append('updated_by',id_users_master);
    var obj = new post(host+`program/publish`,form,window.sessionStorage.token).execute();
    if(obj.success){
      swal({
        title: "Siar Program",
        text: "Program Berjaya Disiarkan.",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    } else {
      swal({
        title: "Daftar Program",
        text: "Program Gagal Disiarkan.",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    }
  });
}

function batal_publish(){
  swal({
    title: "Batal Siar Program",
    text: "Anda Pasti Untuk Batal Siar?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    var form = new FormData();
    form.append('id_program',window.sessionStorage.med_program_id);
    form.append('updated_by',id_users_master);
    var obj = new post(host+`program/unpublish`,form,window.sessionStorage.token).execute();
    if(obj.success){
      swal({
        title: "Batal Siar Program",
        text: "Program Berjaya Dibatalkan dari siar.",
        type: "success",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    } else {
      swal({
        title: "Daftar Program",
        text: "Program Gagal Disiarkan.",
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    }
  });
}
