window.sessionStorage.clear();

var confirmed = false;

$(function () {
  $.ajaxSetup({
    cache: false,
  });

  load_image();
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

    var obj = new post(host+`loginUser`,form,'').execute();
    console.log(obj);
    if(obj.success){
        // alert(result.data.PK);
        var data = obj.data;
        sessionStorage.id = data.id_users;
        sessionStorage.token = obj.token;
        sessionStorage.no_kad_pengenalan = data.no_kad_pengenalan;
        sessionStorage.nama = data.nama;
        sessionStorage.emel = data.emel;
        window.location.replace("../");
    } else {
      swal({
        title: "Log Masuk",
        text: obj.data,
        type: "error",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        sessionStorage.token = obj.token;
        window.location.reload();
      });
    }
  }
});

function load_image() {
  var dir = "../api_asdcm/public/uploads/";
  // var dir = 'var/www/html/api_asdcm/public/uploads/';
  var obj = new get(host+`randomGambar`,window.sessionStorage.token).execute();
  console.log(obj);
  if(obj.success){
    let data = obj.data;
    console.log(data);
    $("#bg_add").css("background-image", "url(" + dir + "" + data[9] + ")");
    $("#bg-img0").css(
      "background-image",
      "url(" + dir + "" + data[0] + ")"
    );
    $("#bg-img1").css(
      "background-image",
      "url(" + dir + "" + data[1] + ")"
    );
    $("#bg-img2").css(
      "background-image",
      "url(" + dir + "" + data[2] + ")"
    );
    $("#bg-img3").css(
      "background-image",
      "url(" + dir + "" + data[3] + ")"
    );
    $("#bg-img4").css(
      "background-image",
      "url(" + dir + "" + data[4] + ")"
    );
    $("#bg-img5").css(
      "background-image",
      "url(" + dir + "" + data[5] + ")"
    );
    $("#bg-img6").css(
      "background-image",
      "url(" + dir + "" + data[6] + ")"
    );
    $("#bg-img7").css(
      "background-image",
      "url(" + dir + "" + data[7] + ")"
    );
    $("#bg-img8").css(
      "background-image",
      "url(" + dir + "" + data[8] + ")"
    );
    
  } else {

  }
}
