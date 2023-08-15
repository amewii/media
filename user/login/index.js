window.sessionStorage.clear();

var confirmed = false;

$(function () {
  $.ajaxSetup({
    cache: false,
  });

  load_image();
  //    student_info(noic,function(){
  //   	data = obj_student.data;
  //    });
});

$("#login").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let no_kad_pengenalan = $("#no_kad_pengenalan").val();
    let katalaluan = $("#katalaluan").val();

    var form = new FormData();
    form.append("no_kad_pengenalan", no_kad_pengenalan);
    form.append("katalaluan", katalaluan);
    var settings = {
      url: host + "public/loginUser",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      // console.log(response);
      result = JSON.parse(response);
      console.log(result);
      if (!result.success) {
        swal({
          title: "Log Masuk",
          text: result.data,
          type: "error",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false,
        }).then(function () {
          sessionStorage.token = result.token;
          window.location.reload();
        });
      } else {
        // alert(result.data.PK);
        sessionStorage.id = result.data.id_users;
        sessionStorage.token = result.data.token;
        sessionStorage.no_kad_pengenalan = result.data.no_kad_pengenalan;
        sessionStorage.nama = result.data.nama;
        sessionStorage.emel = result.data.emel;
        window.location.replace("../");
      }
    });
  }
});

function load_image() {
  var dir = "../../api_asdcm/public/uploads/";
  // var dir = 'var/www/html/api_asdcm/public/uploads/';

  var settings = {
    url: host + "public/randomGambar",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    let list = response.data;

    $("#bg_add").css("background-image", "url(" + dir + "" + list[9] + ")");
    $("#bg-img0").css(
      "background-image",
      "url(" + dir + "" + response.data[0] + ")"
    );
    $("#bg-img1").css(
      "background-image",
      "url(" + dir + "" + response.data[1] + ")"
    );
    $("#bg-img2").css(
      "background-image",
      "url(" + dir + "" + response.data[2] + ")"
    );
    $("#bg-img3").css(
      "background-image",
      "url(" + dir + "" + response.data[3] + ")"
    );
    $("#bg-img4").css(
      "background-image",
      "url(" + dir + "" + response.data[4] + ")"
    );
    $("#bg-img5").css(
      "background-image",
      "url(" + dir + "" + response.data[5] + ")"
    );
    $("#bg-img6").css(
      "background-image",
      "url(" + dir + "" + response.data[6] + ")"
    );
    $("#bg-img7").css(
      "background-image",
      "url(" + dir + "" + response.data[7] + ")"
    );
    $("#bg-img8").css(
      "background-image",
      "url(" + dir + "" + response.data[8] + ")"
    );
  });
}
