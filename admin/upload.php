<?php

    if ( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    }
    else {
        move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $_FILES['file']['name']);
        // move_uploaded_file($_FILES['file']['tmp_name'], '../api_asdcm/public/uploads/' . $_FILES['file']['name']);
    }


        //      // Define file path 
        // $pathtofile = '../api_asdcm/public/uploads/6_3.jpg'; 

        // // Clear cache to remove result from previous run 
        // clearstatcache(); 

        // // Check if file is present & Returns True or False 
        // echo file_exists($pathtofile); 

        // // How to use this file_exists in If condition 
        // if (file_exists($pathtofile)) { 
        //     echo "File found in directory path";
        // } else { 
        //     echo "File not found in the path"; 
        // } 

?>