window.sessionStorage.clear();

var confirmed = false;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    load_image();
//    student_info(noic,function(){
//   	data = obj_student.data;
//    });
});


$("#login").on('submit', function (e) {
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        let no_kad_pengenalan = $("#no_kad_pengenalan").val();
        let katalaluan = $("#katalaluan").val();
        
        var form = new FormData();
        form.append("no_kad_pengenalan", no_kad_pengenalan);
        form.append("katalaluan", katalaluan);
        var settings = {
            "url": host + "api_auth_asdcm/public/loginUser",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            result = JSON.parse(response);
            console.log(result);
            if (!result.success) {
                sessionStorage.token = result.token;
                // window.location.reload();      
            } else  {
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


function load_image(){

    var dir = '../../api_asdcm/api_media/public/uploads/';

    var settings = {
        "url": host + "api_media/public/randomGambar",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        
        // let list = response.data;
        // console.log(response.data);

        // $.each(list, function(index, value) {

        //     let files = dir +""+ value;
        //     $('#bg-img'+index).css("background-image", "url(" + files + ")");

        //     // $("#load-image").append('<li><a href="#" class="thumb-list-item bg-image" style="background-image:url('+files+')" ></a></li>');
        //     // alert(files);

        // });

        // $('#bg_add').css("background-image", "url(" + dir + "" + list[9] + ")");
        $('#bg-img0').css("background-image", "url(" + dir +""+ response.data[0] + ")");
        $('#bg-img1').css("background-image", "url(" + dir +""+ response.data[1] + ")");
        $('#bg-img2').css("background-image", "url(" + dir +""+ response.data[2] + ")");
        $('#bg-img3').css("background-image", "url(" + dir +""+ response.data[3] + ")");
        $('#bg-img4').css("background-image", "url(" + dir +""+ response.data[4] + ")");
        $('#bg-img5').css("background-image", "url(" + dir +""+ response.data[5] + ")");
        $('#bg-img6').css("background-image", "url(" + dir +""+ response.data[6] + ")");
        $('#bg-img7').css("background-image", "url(" + dir +""+ response.data[7] + ")");
        $('#bg-img8').css("background-image", "url(" + dir +""+ response.data[8] + ")");
        
        
    });

}
