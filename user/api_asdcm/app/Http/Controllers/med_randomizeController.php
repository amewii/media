<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_format;
use PDO;

class med_randomizeController extends Controller
{

    public function randomize(){

        $dir = '../public/uploads/';
        // $dir = '../public/uploads/';

        $list = [];
        $finalist = [];

        if (is_dir($dir)) {
            if ($dh = opendir($dir)) {

                while (($file = readdir($dh)) !== false) {
                    array_push($list,$file);
                }
                closedir($dh);

            }
        }
        $new_list = [];
        for($i=0;$i<sizeof($list);$i++){
            $file_type = explode('.',$list[$i]);
            if(sizeof($file_type)>1 && !($file_type[0] == trim($file_type[0]) && strpos($file_type[0], ' ') !== false)){
                switch($file_type[1]){
                    case 'JPG': case 'JPEG': case 'PNG': case 'jpg': case 'jpeg': case 'png': 
                        array_push($new_list,$list[$i]);
                        break;
                    default: break;
                }
            }
        }
        $randomize = array_rand($new_list,11);

        $finalist = [$new_list[$randomize[10]],
                    $new_list[$randomize[1]],
                    $new_list[$randomize[2]],
                    $new_list[$randomize[3]],
                    $new_list[$randomize[4]],
                    $new_list[$randomize[5]],
                    $new_list[$randomize[6]],
                    $new_list[$randomize[7]],
                    $new_list[$randomize[8]],
                    $new_list[$randomize[9]]];
                   
        if (!empty($finalist))  {
            return response()->json([
                'success'=>true,
                'message'=>'Pendaftaran Rekod Berjaya!',
                'data'=>$finalist
            ],201);
        }
        
        else    {
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$finalist
            ],400);
        }
        
    }
}
