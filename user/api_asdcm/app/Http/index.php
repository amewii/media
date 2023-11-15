<?php
if($_SERVER["HTTP_HOST"] == "admin.media.intan.my"){
    $host = "https://".$_SERVER["HTTP_HOST"]."/user/unauthorized/";
} else if($_SERVER["HTTP_HOST"] == "media.intan.my"){
    $host = "https://".$_SERVER["HTTP_HOST"]."/unauthorized/";
} else {
    $host = "http://".$_SERVER["HTTP_HOST"]."/media/user/unauthorized/";
}
header('Location: ' . $host);
?>