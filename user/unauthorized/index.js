$(function () {
    $.ajaxSetup({
        cache: false
    });
});

$(".go_home").on('click',function(){
    window.location.replace(window.location.protocol+'//'+window.location.hostname);
});