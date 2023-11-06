sessionStorage.url = "../../admin/login";
window.sessionStorage.removeItem("no_kad_pengenalan");
window.sessionStorage.removeItem("FK_jenis_pengguna");
window.sessionStorage.removeItem("content");
document.getElementById("no_kad_pengenalan").focus();

var confirmed = false;

$("#login").on("submit", function (e) {
  let $this = $(this);
  if (!confirmed) {
    e.preventDefault();
    let no_kad_pengenalan = $("#no_kad_pengenalan").val();
    let katalaluan = $("#katalaluan").val();

    var form = new FormData();
    form.append("no_kad_pengenalan", no_kad_pengenalan);
    form.append("katalaluan", katalaluan);
    var obj = new post(host+`login`,form,'').execute();
    if(obj.success){
      var data = obj.data;
      window.sessionStorage.token = obj.token;
      window.sessionStorage.no_kad_pengenalan = data.no_kad_pengenalan;
      sessionStorage.browser = getBrowser();
      saveLog(data.id_users, "Login.", window.sessionStorage.browser);
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

function getBrowser() {
  var browserName = (function (agent) {
    switch (true) {
      case agent.indexOf("edge") > -1:
        return "MS Edge";
      case agent.indexOf("edg/") > -1:
        return "Edge ( chromium based)";
      case agent.indexOf("opr") > -1 && !!window.opr:
        return "Opera";
      case agent.indexOf("chrome") > -1 && !!window.chrome:
        return "Chrome";
      case agent.indexOf("trident") > -1:
        return "MS IE";
      case agent.indexOf("firefox") > -1:
        return "Mozilla Firefox";
      case agent.indexOf("safari") > -1:
        return "Safari";
      default:
        return "other";
    }
  })(window.navigator.userAgent.toLowerCase());
  return browserName;
}
