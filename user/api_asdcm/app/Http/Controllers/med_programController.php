<?php

namespace App\Http\Controllers;

// use File;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_program;
use App\Models\med_users;

class med_programController extends Controller
{
    public function register(Request $request) {
        $nama_program = $request->input('nama_program');
        $tarikh_program = $request->input('tarikh_program');
        $FK_kategori = $request->input('FK_kategori');
        $FK_kluster = $request->input('FK_kluster');
        $FK_subkluster = $request->input('FK_subkluster');
        $FK_kampus = $request->input('FK_kampus');
        $FK_unit = $request->input('FK_unit');
        $FK_vip = $request->input('FK_vip');
        $created_by = $request->input('created_by'); // Pakai IC
        $updated_by = $request->input('updated_by'); // Pakai IC
        $statusrekod = $request->input('statusrekod');

        $register = med_program::create([
            'nama_program' => $nama_program,
            'tarikh_program' => $tarikh_program,
            'FK_kategori' => $FK_kategori,
            'FK_kluster' => $FK_kluster,
            'FK_subkluster' => $FK_subkluster,
            'FK_kampus' => $FK_kampus,
            'FK_unit' => $FK_unit,
            'FK_vip' => $FK_vip,
            'created_by' => $created_by,
            'updated_by' => $updated_by,
            'statusrekod' => $statusrekod
        ]);

        if ($register)  {
            return response()->json([
                'success'=>'true',
                'message'=>'Pendaftaran Rekod Berjaya!',
                'data'=>$register
            ],201);
        }

        else    {
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }

    public function laporan(Request $request)  {
        $FK_kategori = $request->input('FK_kategori');
        $nama_program = $request->input('nama_program');
        $tarikh_mula = $request->input('tarikh_mula');
        $tarikh_akhir = $request->input('tarikh_akhir');
        $FK_kampus = $request->input('FK_kampus');
        $FK_kluster = $request->input('FK_kluster');
        $tahun_program = $request->input('tahun_program');

        $med_program = med_program::select("*", med_program::raw("substr(tarikh_program,1,4) as tahun")) -> 
                                        join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                        join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                        join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                        join('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster');
                                        // join('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit');        

        if($FK_kategori != '') {
            $med_program = $med_program -> where('FK_kategori',$FK_kategori);
        }
        if($nama_program != '') {
            $med_program = $med_program -> where('nama_program',$nama_program);
        }
        if($tarikh_mula != '') {
            $med_program = $med_program -> where('tarikh_program','>=',date('Y-m-d',strtotime($tarikh_mula)));
        }
        if($tarikh_akhir != '') {
            $med_program = $med_program -> where('tarikh_program','<=',date('Y-m-d',strtotime($tarikh_akhir)));
        }
        if($FK_kampus != '') {
            $med_program = $med_program -> where('med_program.FK_kampus',$FK_kampus);
        }
        if($FK_kluster != '') {
            $med_program = $med_program -> where('med_program.FK_kluster',$FK_kluster);
        }
        if($tahun_program != '') {
            $med_program = $med_program->whereRaw('YEAR(tarikh_program) = ?', [$tahun_program]);
        }
        
        $med_program = $med_program -> get();

        if ($med_program)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_program
            ],200);
        }
    }

    public function show(Request $request)  {
        $id = $request->input('id_program');

        $med_program = med_program::select("*", "med_program.id AS PK") ->
                                        where('id_program',$id)->first();

        if ($med_program)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_program
            ],200);
        }
    }

    public function showGet(Request $request, $id)  {
        $med_program = med_program::join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    where('med_program.id_program',$id)->first();

        if ($med_program)   {
            $dir = '../public/uploads/';
    
            $list = [];
    
            if (is_dir($dir)) {
                if ($dh = opendir($dir)) {
    
                    while (($file = readdir($dh)) !== false) {
                        array_push($list,$file);
                    }
                    closedir($dh);
    
                }
            }
            $new_file = array();
            if($med_program->media_path){
                $file = json_decode($med_program->media_path);
                if(sizeof($file)>0){
                    for($j=0;$j<sizeof($file);$j++){
                        for($k=0;$k<sizeof($list);$k++){
                            if($list[$k] == $file[$j]->images){
                                array_push($new_file,$file[$j]->images);
                                break;
                            }
                        }
                    }
                }
            }
            $med_program->media_path_2 = $new_file;
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_program
            ],200);
        }
    }

    public function list()  {
        $med_program = med_program::join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    join('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    where('med_program.statusrekod','1') -> where('med_kampus.statusrekod','1') -> where('med_kluster.statusrekod','1') -> where('med_unit.statusrekod','1') -> 
                                    get(); // list all data

        if (sizeof($med_program)>0)   {
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }

        else    {
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$med_program
            ],400);
        }
        
    }

    public function list_publish()  {
        $med_program = med_program::join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    join('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    where('med_program.statusrekod','1') -> where('med_kampus.statusrekod','1') -> where('med_kluster.statusrekod','1') -> where('med_unit.statusrekod','1') -> where('med_program.status_publish','1') -> 
                                    get(); // list all data

        if (sizeof($med_program)>0)   {
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }

        else    {
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$med_program
            ],400);
        }
        
    }

    public function listtahun()  {
        $med_program = med_program::select(med_program::raw("substr(tarikh_program,1,4) as tahun")) ->
                                    where('med_program.statusrekod','1') -> 
                                    groupBy('tahun')->
                                    get(); // list all data

        if ($med_program)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }
        
    }

    public function listpdf()  {
        $med_program = med_program::join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    join('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    where('med_program.statusrekod','1') -> where('med_kampus.statusrekod','1') -> where('med_kluster.statusrekod','1') -> where('med_unit.statusrekod','1') -> 
                                    get(); // list all data
        $html = '<html><body>'
			. '<p>Put your html here, or generate it with your favourite '
			. 'templating system.</p>'
			. '</body></html>';
	// return PDF::load($html, 'A4', 'portrait')->show();
        if ($med_program)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }
        
    }

    public function listbergambar()  {
        // $med_program = med_program::select("*", "med_program.id_program AS PK") ->
        //                             join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
        //                             join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
        //                             join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
        //                             join('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
        //                             where('med_program.statusrekod','1') -> where('med_kampus.statusrekod','1') -> where('med_kluster.statusrekod','1') -> whereNotNull('media_path') ->
        //                             orderBy('tarikh_program', 'desc') ->
        //                             get(); // list all data

        $med_program = med_program::select("*", "med_program.id_program AS PK") ->
                                    join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    where('med_program.status_publish','1') -> 
                                    where(function($q){
                                        $q = $q->where('med_program.statusrekod','1') -> where('med_kampus.statusrekod','1') -> where('med_kluster.statusrekod','1') -> whereNotNull('media_path') ->
                                        where('med_program.media_path','LIKE','%JPEG%')->orWhere('med_program.media_path','LIKE','%JPG%')->orWhere('med_program.media_path','LIKE','%PNG%')->orWhere('med_program.media_path','LIKE','%BMP%')->orWhere('med_program.media_path','LIKE','%GIF%');
                                    })->
                                    orderBy('last_uploaded_at', 'desc') ->
                                    get(); // list all data (MIMI)

        if (sizeof($med_program)>0)   {
            // if($_SERVER['SERVER_PORT'] == "8081"){
            //     $host = "http://localhost:8082/media/user/api_asdcm/public/uploads/";
            // } else {
            //     if($_SERVER["HTTP_HOST"] == "localhost"){
            //         $host = "http://".$_SERVER["HTTP_HOST"]."/media/user/api_asdcm/public/uploads/";
            //     } else if($_SERVER["HTTP_HOST"] == "100.109.228.118"){
            //         $host = "http://".$_SERVER["HTTP_HOST"]."/media/user/api_asdcm/public/uploads/";
            //     } else {
            //         $host = "https://".$_SERVER["HTTP_HOST"]."/api_asdcm/public/uploads/";
            //     }
            // }

            if ($_SERVER['SERVER_PORT'] == "8081") {
                $host = "http://localhost:8082/media/user/api_asdcm/public/uploads/";
            } else {
                if ($_SERVER["HTTP_HOST"] == "localhost") {
                    $host = "http://" . $_SERVER["HTTP_HOST"] . "/media/user/api_asdcm/public/uploads/";
                } else if ($_SERVER["HTTP_HOST"] == "100.109.228.118") {
                    $host = "http://" . $_SERVER["HTTP_HOST"] . "/media/user/api_asdcm/public/uploads/";
                } else {
                    $isHttps = (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off") 
                        || (isset($_SERVER["HTTP_X_FORWARDED_PROTO"]) && $_SERVER["HTTP_X_FORWARDED_PROTO"] === "https");
    
                    $protocol = $isHttps ? "https://" : "http://";
                    $host = $protocol . $_SERVER["HTTP_HOST"] . "/api_asdcm/public/uploads/";
                }
            }
    
            for($i=0;$i<sizeof($med_program);$i++){
                $file = json_decode($med_program[$i]->media_path);
                $new_file = array();
                if(sizeof($file)>0){
                    for($j=0;$j<sizeof($file);$j++){
                        $url = $host.$file[$j]->images;
                        $handle = curl_init($url);
                        curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
                        
                        /* Get the HTML or whatever is linked in $url. */
                        $response = curl_exec($handle);
                        
                        /* Check for 404 (file not found). */
                        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
                        if($httpCode != 404) {
                            array_push($new_file,$file[$j]->images);
                        }
                        
                        curl_close($handle);
                    }
                }
                $med_program[$i]->media_path_2 = $new_file;
            }
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }

        else    {
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$med_program
            ],400);
        }
        
    }

    public function listvideo()  {
        // $med_program = med_program::select("*", "med_program.id_program AS PK") ->
        //                             join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
        //                             join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
        //                             join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
        //                             join('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
        //                             where('med_program.statusrekod','1') -> where('med_kampus.statusrekod','1') -> where('med_kluster.statusrekod','1') -> whereNotNull('media_path') ->
        //                             orderBy('tarikh_program', 'desc') ->
        //                             get(); // list all data

        $med_program = med_program::select("*", "med_program.id_program AS PK") ->
                                    join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    where('med_program.status_publish','1') -> 
                                    where(function($q){
                                        $q = $q->where('med_program.statusrekod','1') -> where('med_kampus.statusrekod','1') -> where('med_kluster.statusrekod','1') -> whereNotNull('media_path') ->
                                        where('med_program.media_path','LIKE','%MP4%')->whereOr('med_program.media_path','LIKE','%MOV%')->whereOr('med_program.media_path','LIKE','%3GP%');
                                    })->
                                    orderBy('last_uploaded_at', 'desc') ->
                                    get(); // list all data (MIMI)

        if (sizeof($med_program)>0)   {
            if($_SERVER['SERVER_PORT'] == "8081"){
                $host = "http://localhost:8082/media/user/api_asdcm/public/uploads/";
            } else {
                if($_SERVER["HTTP_HOST"] == "localhost"){
                    $host = "http://".$_SERVER["HTTP_HOST"]."/media/user/api_asdcm/public/uploads/";
                } else if($_SERVER["HTTP_HOST"] == "100.109.228.118"){
                    $host = "http://".$_SERVER["HTTP_HOST"]."/media/user/api_asdcm/public/uploads/";
                } else {
                    $host = "https://".$_SERVER["HTTP_HOST"]."/api_asdcm/public/uploads/";
                }
            }
            for($i=0;$i<sizeof($med_program);$i++){
                $file = json_decode($med_program[$i]->media_path);
                $new_file = array();
                if(sizeof($file)>0){
                    for($j=0;$j<sizeof($file);$j++){
                        $url = $host.$file[$j]->images;
                        $handle = curl_init($url);
                        curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
                        
                        /* Get the HTML or whatever is linked in $url. */
                        $response = curl_exec($handle);
                        
                        /* Check for 404 (file not found). */
                        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
                        if($httpCode != 404) {
                            array_push($new_file,$file[$j]->images);
                        }
                        
                        curl_close($handle);
                    }
                }
                $med_program[$i]->media_path_2 = $new_file;
            }
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }

        else    {
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$med_program
            ],400);
        }
        
    }

    public function listall()  {
        $med_program = med_program::select("*", "med_program.statusrekod AS programstatusrekod") ->
                                    join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    orderby('id_program','DESC')->
                                    get(); // list all data

        if (sizeof($med_program)>0)   {
            for($i=0;$i<sizeof($med_program);$i++){
                $obj_created_by = med_program::leftjoin('med_users','id_users','med_program.created_by')->where('med_program.id_program',$med_program[$i]->id_program)->first();
                if($obj_created_by){
                    $med_program[$i]->created_by_users = $obj_created_by;
                }
            }
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }

        else    {
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$med_program
            ],400);
        }
        
    }

    public function listallbykluster($id)  {
        $med_program = med_program::select("*", "med_program.statusrekod AS programstatusrekod") ->
                                    join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                                    join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                                    join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                                    leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                                    leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                                    where('med_program.FK_kluster','=',$id)->
                                    orderby('id_program','DESC')->
                                    get(); // list all data

        if (sizeof($med_program)>0)   {
            for($i=0;$i<sizeof($med_program);$i++){
                $obj_created_by = med_program::leftjoin('med_users','id_users','med_program.created_by')->where('med_program.id_program',$med_program[$i]->id_program)->first();
                if($obj_created_by){
                    $med_program[$i]->created_by_users = $obj_created_by;
                }
            }
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_program
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id_program');
        $nama_program = $request->input('nama_program');
        $tarikh_program = $request->input('tarikh_program');
        $FK_kategori = $request->input('FK_kategori');
        $FK_kluster = $request->input('FK_kluster');
        $FK_subkluster = $request->input('FK_subkluster');
        $FK_kampus = $request->input('FK_kampus');
        $FK_unit = $request->input('FK_unit');
        $updated_by = $request->input('updated_by');

        $med_program_search = med_program::where('nama_program',$nama_program) -> 
                                           where('tarikh_program',$tarikh_program) -> 
                                           where('FK_kategori',$FK_kategori) -> 
                                           where('FK_kluster',$FK_kluster) -> 
                                           where('FK_subkluster',$FK_subkluster) -> 
                                           where('FK_kampus',$FK_kampus) -> 
                                           where('FK_unit',$FK_unit) -> 
                                           first(); 

        if ($med_program_search)    {
            return response()->json([
                'success'=>false,
                'message'=>"Gagal! Data Telah Wujud.",
                'data'=>''
            ],200);
        } else {
            $med_program = med_program::where('id_program',$id) -> update([
                'nama_program' => $nama_program,
                'tarikh_program' => $tarikh_program,
                'FK_kategori' => $FK_kategori,
                'FK_kluster' => $FK_kluster,
                'FK_subkluster' => $FK_subkluster,
                'FK_kampus' => $FK_kampus,
                'FK_unit' => $FK_unit,
                'updated_by' => $updated_by
            ]);
    
            if ($med_program)  {
                return response()->json([
                    'success'=>true,
                    'message'=>"Kemaskini Berjaya!",
                    'data' => $med_program
                ],200);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'message'=>"Kemaskini Gagal!",
                    'data'=>''
                ],404);
            }
        }
    }

    public function publish(Request $request)    {
        $id = $request->input('id_program');
        $updated_by = $request->input('updated_by');

        $med_program = med_program::where('id_program',$id) -> update([
            'status_publish' => 1,
            'updated_by' => $updated_by
        ]);

        if ($med_program)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_program
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],404);
        }
    }

    public function unpublish(Request $request)    {
        $id = $request->input('id_program');
        $updated_by = $request->input('updated_by');

        $med_program = med_program::where('id_program',$id) -> update([
            'status_publish' => 0,
            'updated_by' => $updated_by
        ]);

        if ($med_program)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_program
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],404);
        }
    }

    public function search(Request $request){

        $tahun = $request->input('tahun');
        $FK_kategori = $request->input('FK_kategori');
        $nama_program = $request->input('nama_program');
        $Fk_vip = $request->input('Fk_vip');

        $med_program = med_program::select("*", "med_program.statusrekod AS programstatusrekod") ->
                join('med_kategoriprogram', 'med_kategoriprogram.id_kategoriprogram', '=', 'med_program.FK_kategori') -> 
                join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') -> 
                join('med_kluster', 'med_kluster.id_kluster', '=', 'med_program.FK_kluster') -> 
                join('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_program.FK_subkluster') -> 
                leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_program.FK_unit') ->
                where('YEAR(med_program.tarikh_program)','=',$tahun) ->
                orWhere('med_kategoriprogram.id_kategoriprogram','=',$FK_kategori) ->
                orWhere('med_program.nama_program','LIKE','%'.$nama_program.'%') ->
                orWhere('med_program.FK_vip','LIKE','%'.$Fk_vip.'%') ->
                get(); // list all data
                
                if ($med_program)  {
                    return response()->json([
                        'success'=>true,
                        'message'=>"Kemaskini Berjaya!",
                        'data' => $med_program
                    ],200);
                }
                else{
                    return response()->json([
                        'success'=>false,
                        'message'=>"Kemaskini Gagal!",
                        'data'=>''
                    ],404);
                }     
    }

    public function updateTag(Request $request)    {
        
        $imgText = '';
        $append = '';
        $FK_vip = '';

        $FK_userss = str_replace(",",";",$request->input('FK_users'));
        $obj_userss = explode(";",$FK_userss);

        $id = $request->input('id_program');
        $updated_by = $request->input('updated_by');
        
        $med_program = med_program::select('*')->where('id_program',$id)->first();
        
        $media_path = $med_program->media_path;
        $obj_media = json_decode($media_path);
        foreach($obj_media as $val_media){
            
            if($val_media -> images == $request->input('imgText')){
                if(array_key_exists("FK_vip",$val_media)){
                    
                    $imgText = $request->input('imgText') . '","FK_vip":"';
                    $replace = $imgText.$val_media->FK_vip;
                    $append = $imgText.$FK_userss;
                }else{
                    
                    $imgText = $request->input('imgText');
                    $replace = $imgText;
                    $append = $imgText . '","FK_vip":"'.$FK_userss;
                }
            }

        }
        $new_media_path = str_replace($replace, $append, $media_path);

        $FK_vip = $med_program->FK_vip;
        if($FK_vip != '' || $FK_vip != null){
            $obj_vip = explode (";", $med_program->FK_vip);

            foreach($obj_userss as $val_userss){
    
                if(is_int(array_search($val_userss,$obj_vip)) == 0){
    
                    $FK_vip = $FK_vip.';'.$val_userss;
                    
                }
    
            }
        }else{
            $FK_vip = $FK_userss;
        }
        
            
        $med_program = med_program::where('id_program',$id) -> update([
            'FK_vip' => $FK_vip,
            'media_path' => $new_media_path,
            'updated_by' => $updated_by
        ]);

        if ($med_program)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_program
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],404);
        }
    }

    public function upload(Request $request, $id)    {

        $flag_exist = 0;
        $fileName = $request->file('file')->getClientOriginalName();
        $extension = explode('.',$fileName)[1];
        $fileName = $id . '_' . rand() . "." .$extension;

        // $path = 'programUpload';
        // $path = '/uploads';

        // $destinationPath = public_path($path); // upload path
        $destinationPath = 'uploads'; // upload path

        $request->file('file')->move($destinationPath, $fileName);
        // $files = File::files(public_path());
        $files = base_path('public');
        // dd($files);

        // foreach($files as $key => $value){
            
                
        //     $relativeNameInZipFile = basename($value);
            
        //     if($fileName == $relativeNameInZipFile){
            
        //         return ;

        //     }

        // }

        // return 0;
        return response()->json([
            'success'=>true,
            'result'=>$flag_exist,
            'file'=>$fileName
        ],200);
    }

    public function upload2(Request $request, $id)    {
        
        $updated_by = $request->input('updated_by');
        $media_path = $request->input('file');
        $last_uploaded_at = Carbon::now()->toDateTimeString();
        $med_program = med_program::select('*')->where('id_program',$id)->first();
        
        $media_path = $media_path;
        $med_program = med_program::where('id_program',$id) -> update([
            'media_path' => $media_path,
            'last_uploaded_at' => $last_uploaded_at,
            'updated_by' => $updated_by
        ]);


        if ($med_program)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_program
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],404);
        }
    }

    public function delete(Request $request)    {
        $id = $request->input('id_program');

        $med_program_search = med_program::where('id_program',$id) -> first(); 

        switch($med_program_search->statusrekod)    {
            case 0: $med_program = med_program::where('id_program',$id) -> update([
                        'statusrekod' => '1',
                    ]);
                    break;
            case 1: $med_program = med_program::where('id_program',$id) -> update([
                        'statusrekod' => '0',
                    ]);
                    break;
        }

        $med_program_search = med_program::where('id_program',$id) -> first(); 

        if ($med_program)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Ubah!",
                'data' => $med_program_search
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Gagal Ubah!",
                'data'=>''
            ],404);
        }
    }

    public function removemedia(Request $request, $id)    {
        
        $media = 0;
        $media_list = "";
        $updated_by = $request->input('updated_by');
        $imgText = $request->input('imgText');
        
        $med_program = med_program::select('*')->where('id_program',$id)->first();
        
        $media_path = $med_program -> media_path;

        $obj_media = json_decode($media_path);

        foreach($obj_media as $x => $val) {

            if($val->images == $imgText){
                unlink("uploads/".$imgText);
            }else{
                if($media_list != ''){
                    $media_list = $media_list.',';
                }
                $media_list = $media_list.'{"images":"'.$val->images.'"';
                if(array_key_exists("FK_vip",$val)){
                    $media_list = $media_list.',"FK_vip":"'.$val->FK_vip.'"';
                }
                $media_list = $media_list.'}';
            }
            
        }

        // dd($media_list);
        $med_program = med_program::where('id_program',$id) -> update([
            'media_path' => '['.$media_list.']',
            'updated_by' => $updated_by
        ]);

        // $med_kategori = $med_program->FK_kategori;

        if ($med_program)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_program
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],200);
        }
    }

    public function removebunchmedia(Request $request, $id)    {
        
        $media = 0;
        $updated_by = $request->input('updated_by');
        $imgText = $request->input('imgText');
        $obj_media_delete = explode(',',$imgText);
        $bil = 0;

        foreach($obj_media_delete as $val) { 
            $bil++;
            $media_list = "";
            $med_program = med_program::select('*')->where('id_program',$id)->first();            
            $media_path = $med_program -> media_path;
            $obj_media = json_decode($media_path);
            foreach($obj_media as $y => $valdb) {
                // dd($val);
                if($valdb->images == $val){
                    unlink("uploads/".$valdb->images);
                }else{
                    if($media_list != ''){
                        $media_list = $media_list.',';
                    }
                    $media_list = $media_list.'{"images":"'.$valdb->images.'"';
                    if(array_key_exists("FK_vip",$valdb)){
                        $media_list = $media_list.',"FK_vip":"'.$valdb->FK_vip.'"';
                    }
                    $media_list = $media_list.'}';
                }
                
            }
            $med_program = med_program::where('id_program',$id) -> update([
                'media_path' => '['.$media_list.']',
                'updated_by' => $updated_by
            ]);     
        }

        // $med_kategori = $med_program->FK_kategori;

        if ($med_program)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_program
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],200);
        }
    }
}
