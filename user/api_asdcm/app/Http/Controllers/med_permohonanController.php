<?php

namespace App\Http\Controllers;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\med_permohonan;
use App\Models\med_users;
use App\Models\med_tetapan;
use Illuminate\Support\Facades\File;
use ZipArchive;
use Carbon\Carbon;
use PDO;

class med_permohonanController extends Controller
{
    public function register(Request $request) {
        $FK_users = $request->input('FK_users');
        $sebab = $request->input('sebab');
        $FK_program = $request->input('FK_program');
        $status_permohonan = $request->input('status_permohonan');
        $tarikh_permohonan = $request->input('tarikh_permohonan');
        $media_list = $request->input('media_list');
        $created_by = $request->input('created_by'); 
        $updated_by = $request->input('updated_by'); 
        $statusrekod = $request->input('statusrekod');
        $flag_vip = $request->input('flag_vip');

        $register = med_permohonan::create([
            'FK_users' => $FK_users,
            'sebab' => $sebab,
            'FK_program' => $FK_program,
            'status_permohonan' => $status_permohonan,
            'tarikh_permohonan' => $tarikh_permohonan,
            'media_list' => $media_list,
            'created_by' => $created_by,
            'updated_by' => $updated_by,
            'statusrekod' => $statusrekod,
            'flag_vip' => $flag_vip,
        ]);
        if ($register)  {
            // $med_permohonan_search = med_permohonan::join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
            //                                         join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') ->
            //                                         orderBy('med_permohonan.id_permohonan','desc') ->
            //                                         first();
            // if ($flag_vip == 1) {
            //     $pelulus = med_users::join('med_capaian', 'med_capaian.FK_users', '=', 'med_users.id_users') -> 
            //                             where('med_capaian.FK_peranan','3') -> get();
            // } else  {
            //     $pelulus = med_users::join('med_capaian', 'med_capaian.FK_users', '=', 'med_users.id_users') -> 
            //                             join('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') ->
            //                             where('med_capaian.FK_peranan','2') -> 
            //                             where('med_usersgov.FK_kluster',$med_permohonan_search->FK_kluster) -> get();
            // }
            // $tetapan_mail = med_tetapan::first();
            // $success = "";
            // foreach($pelulus AS $peluluses) {
            //     $emelreceiver = $peluluses->emel;
            //     $mail = new PHPMailer();
            //     // $mail->SMTPAuth = true;
            //     $mail->SMTPDebug = 0;
            //     $mail->isSMTP();
            //     $mail->Host       = $tetapan_mail->mail_gateway;
            //     // $mail->SMTPAuth   = true;
            //     // $mail->Username   = $tetapan_mail->mail_username;
            //     // $mail->Password   = $tetapan_mail->mail_password;
            //     // $mail->SMTPSecure = $tetapan_mail->mail_smtp_secure;
            //     $mail->Port       = $tetapan_mail->mail_port;
                
            //     $mail->setFrom('media@intanbk.intan.my', 'Admin Galeri INTAN');
            //     $mail->addAddress($emelreceiver);
            //     $mail->isHTML(true);                                  
            //     $mail->Subject = 'PENGURUSAN MEDIA - PERMOHONAN MUAT TURUN MEDIA';
            //     $mail->Body    = '<b>Permohonan Muat Turun Media</b><br><br>
            //                         Assalamualaikum dan salam sejahtera<br>
            //                         '.$peluluses->nama.'<br><br>
            //                         Permohonan memuat turun media di Sistem Galeri INTAN <br>
            //                         Nama Pemohon: '. $med_permohonan_search->nama .'<br>
            //                         Nama Program: '. $med_permohonan_search->nama_program .'<br><br>
            //                         <a href="'.$tetapan_mail->link_sistem.'/admin">Galeri Media INTAN Malaysia (Admin)</a><br><br>
            //                         Terima kasih.';
            //     $mail->AltBody = 'Alternate Message';
            //     if ($mail->send())  {
            //         $success = "success";
            //     } else  {
            //         $success = "Mailer Error: " . $mail->ErrorInfo;
            //     }
            // }
            // if($success != "success") {
            //     dd($success);
            //     return response()->json([
            //         'success'=>'true',
            //         'message'=>'Konfigurasi Emel Sistem Tidak Tepat. Superadmin perlu set di bahagian Pentadbir Sistem -> Tetapan Sistem',
            //         'data'=>''
            //     ],200);
            //     // exit;
            // }
            // else {
            //     // dd("Mailer Error: " . $mail->ErrorInfo);
            //     return response()->json([
            //         'success'=>'true',
            //         'message'=>'Permohonan Berjaya!',
            //         'data'=>''
            //     ],200);
            // }
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

    public function show(Request $request)  {
        $id = $request->input('id_permohonan');

        $med_permohonan = med_permohonan::where('id_permohonan',$id)->first();

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_permohonan
            ],200);
        }
    }

    public function showGet($id)  {

        $med_permohonan = med_permohonan::  join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                            where('med_permohonan.id_permohonan',$id)->first();

                                            // dd( $med_permohonan);

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_permohonan
            ],200);
        }
    }

    public function showGetUsers($FK_users)  {

        $med_permohonan = med_permohonan::  join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                            join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                            where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.FK_users',$FK_users)->
                                            orderBy('id_permohonan', 'desc') -> get();

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_permohonan
            ],200);
        }
    }

    public function showGetUsersNotification($FK_users)  {
        $med_permohonan = med_permohonan::  join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                            join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                            join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                            where('med_permohonan.FK_users',$FK_users) -> where('med_permohonan.status_permohonan','2') -> orwhere('med_permohonan.status_permohonan','3') -> 
                                            orderBy('id_permohonan', 'desc') ->
                                            get(); // list all data

                                            

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function list()  {
        $med_permohonan = med_permohonan::  leftjoin('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
                                            leftjoin('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                            leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                            leftjoin('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                            where('med_users.statusrekod','1') -> where('med_permohonan.statusrekod','1') -> 
                                            orderBy('id_permohonan', 'desc') ->
                                            get(); // list all data

                                            

        if (sizeof($med_permohonan)>0)   {
            for($i=0;$i<sizeof($med_permohonan);$i++){
                $obj_created_by = med_users::where('id_users',$med_permohonan[$i]->created_by)->first();
                if($obj_created_by){
                    $med_permohonan[$i]->created_by_users = $obj_created_by;
                }
            }
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function listStatistik()  {
        $med_permohonan = med_permohonan::  select(med_permohonan::raw("count(id_permohonan) as bil_permohonan"), med_permohonan::raw("substr(tarikh_permohonan,6,2) as bulan")) ->
                                            groupBy('bulan')->
                                            orderBy('bulan', 'asc') ->
                                            get(); // list all data

                                            

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function listPermohonanGraf($bulan)  {
        $med_permohonan = med_permohonan::  select(med_permohonan::raw("count(id_permohonan) as bil_permohonan"), med_permohonan::raw("substr(tarikh_permohonan,9,2) as hb")) ->
                                            where(med_permohonan::raw("substr(tarikh_permohonan,6,2)"), '=', $bulan)->
                                            groupBy('hb')->
                                            orderBy('hb', 'asc') ->
                                            get(); // list all data

                                            

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function listFilter($FK_peranan,$FK_kluster)  {

        $med_permohonan = '';
        if($FK_peranan == 2){
            $med_permohonan = med_permohonan::  join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
                                                join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                                join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                                where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.statusrekod','1') -> 
                                                where('med_program.FK_kluster',$FK_kluster) ->
                                                where('med_permohonan.flag_vip',0) ->
                                                orderBy('id_permohonan', 'desc') ->
                                                get(); // list all data
        }else if($FK_peranan == 3){
            $med_permohonan = med_permohonan::  join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
                                                join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                                join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                                where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.statusrekod','1') -> 
                                                // where('med_permohonan.flag_vip',1) ->
                                                orderBy('id_permohonan', 'desc') ->
                                                get(); // list all data
        }
        

        if (sizeof($med_permohonan)>0)   {
            for($i=0;$i<sizeof($med_permohonan);$i++){
                $obj_created_by = med_users::where('id_users',$med_permohonan[$i]->created_by)->first();
                if($obj_created_by){
                    $med_permohonan[$i]->created_by_users = $obj_created_by;
                }
            }
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        } else {
            return response()->json([
                'success'=>false,
                'message'=>"List Failed!",
                'data'=>''
            ],400);
        }
        
    }

    public function listtahun()  {
        $med_programs = med_permohonan::select(med_permohonan::raw("substr(tarikh_permohonan,1,4) as tahun")) -> 
                        groupBy('tahun')->
                        get(); // list all data

        if ($med_programs)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_programs
            ],200);
        }
        
    }

    public function listStatus($status_permohonan)  {
        $med_permohonan = med_permohonan::  join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                            join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                            where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.statusrekod','1') -> 
                                            where('med_permohonan.status_permohonan',$status_permohonan) -> 
                                            orderBy('id_permohonan', 'desc') ->
                                            get(); // list all data

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id_permohonan');
        $status_permohonan = $request->input('status_permohonan');
        $catatan_permohonan = $request->input('catatan_permohonan');
        $tarikh_pengesahan = $request->input('tarikh_pengesahan');
        $tarikh_luput = $request->input('tarikh_luput');
        $tempoh = $request->input('tempoh');
        $pegawai_pelulus = $request->input('pegawai_pelulus');
        $updated_by = $request->input('updated_by');

        $med_permohonan = med_permohonan::where('id_permohonan',$id)-> update([
            'status_permohonan' => $status_permohonan,
            'catatan_permohonan' => $catatan_permohonan,
            'tarikh_pengesahan' => $tarikh_pengesahan,
            'tarikh_luput' => $tarikh_luput,
            'pegawai_pelulus' => $pegawai_pelulus,
            'updated_by' => $updated_by
        ]);
        $date = Carbon::createFromFormat('Y-m-d', $tarikh_luput);
        $tarikh_luput = $date->addDays($tempoh);
        
        $med_permohonan = med_permohonan::where('id_permohonan',$id)-> update([
            'tarikh_luput' => $tarikh_luput,
        ]);

        if ($med_permohonan)  {
            // $med_permohonan_search = med_permohonan::join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') -> 
            //                                   join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
            //                                   join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
            //                                   where('id_permohonan',$id) -> first();
            // $tetapan_mail = med_tetapan::first();
            // $emelreceiver = $med_permohonan_search->emel;
            // $mail = new PHPMailer();
            // // $mail->SMTPAuth = true;
            // $mail->SMTPDebug = 0;
            // $mail->isSMTP();
            // $mail->Host       = $tetapan_mail->mail_gateway;
            // // $mail->SMTPAuth   = true;
            // // $mail->Username   = $tetapan_mail->mail_username;
            // // $mail->Password   = $tetapan_mail->mail_password;
            // // $mail->SMTPSecure = $tetapan_mail->mail_smtp_secure;
            // $mail->Port       = $tetapan_mail->mail_port;
            
            // $mail->setFrom('media@intanbk.intan.my', 'Admin Galeri INTAN');
            // $mail->addAddress($emelreceiver);
            // if ($med_permohonan_search->status_permohonan == '2')  {
            //     $sahsehingga = 'Sah Sehingga: '. $date;
            // } else {
            //     $sahsehingga = '';
            // }
            // $mail->isHTML(true);                                  
            // $mail->Subject = 'PENGURUSAN MEDIA - PERMOHONAN MUAT TURUN MEDIA';
            // $mail->Body    = '<b>Permohonan Muat Turun Media</b><br><br>
            //                     Assalamualaikum dan salam sejahtera<br>
            //                     '.$med_permohonan_search->nama.'<br><br>
            //                     Permohonan memuat turun media di Sistem Galeri INTAN <br>
            //                     Nama Program: '. $med_permohonan_search->nama_program .'<br>
            //                     Status: '. $med_permohonan_search->nama_status .'<br>'. 
            //                     $sahsehingga .'<br><br>
            //                     <a href="'.$tetapan_mail->link_sistem.'/user">Galeri Media INTAN Malaysia</a><br><br>
            //                     Terima kasih.';
            // $mail->AltBody = 'Alternate Message';
            // if(!$mail->send()) {
            //     dd("Mailer Error: " . $mail->ErrorInfo);
            //     return response()->json([
            //         'success'=>'true',
            //         'message'=>'Konfigurasi Emel Sistem Tidak Tepat. Superadmin perlu set di bahagian Pentadbir Sistem -> Tetapan Sistem',
            //         'data'=>''
            //     ],200);
            //     // exit;
            // }
            // if(!$mail->send()) {
            //     dd("Mailer Error: " . $mail->ErrorInfo);
            //     return response()->json([
            //         'success'=>'true',
            //         'message'=>'Konfigurasi Emel Sistem Tidak Tepat. Superadmin perlu set di bahagian Pentadbir Sistem -> Tetapan Sistem',
            //         'data'=>''
            //     ],200);
            // } 
            // else {
            //     // dd("Mailer Error: " . $mail->ErrorInfo);
            //     return response()->json([
            //         'success'=>'true',
            //         'message'=>'Berjaya Menghantar Emel.',
            //         'data'=>''
            //     ],200);
            // }
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_permohonan
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],400);
        }
    }

    public function updatePermohonan(Request $request)    {
        $id = $request->input('id_permohonan');
        $sebab = $request->input('sebab');
        // $FK_users = $request->input('FK_users');
        $updated_by = $request->input('updated_by');

        $med_permohonan = med_permohonan::where('id_permohonan',$id)-> update([
            'sebab' => $sebab,
            // 'catatan_permohonan' => $FK_users,
            'updated_by' => $updated_by
        ]);


        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_permohonan
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

    public function updateLuput(Request $request)    {
        $id = $request->input('id_permohonan');
        $status_permohonan = $request->input('status_permohonan');

        $med_permohonan = med_permohonan::where('id_permohonan',$id) -> update([
            'status_permohonan' => $status_permohonan
        ]);

        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_permohonan
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],400);
        }
    }

    public function delete(Request $request)    {
        $id = $request->input('id_permohonan');

        $med_permohonan = med_permohonan::where('id_permohonan',$id) -> update([
            'statusrekod' => '0',
        ]);

        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Padam!",
                'data' => $med_permohonan
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Gagal Padam!",
                'data'=>''
            ],404);
        }
    }

    public function cancel(Request $request)    {
        $id = $request->input('id_permohonan');

        $med_permohonan = med_permohonan::where('id_permohonan',$id) -> update([
            'status_permohonan' => '4',
        ]);

        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Batal!",
                'data' => $med_permohonan
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Gagal Batal!",
                'data'=>''
            ],404);
        }
    }

    //MIMI : ZIP & DOWNLOAD SELECTED FILE START
    public function download (Request $request){
        
        $count = 0;
        $id_permohonan = $request->input('id_permohonan');
        // $FK_users = $request->input('FK_users');
        // $FK_program = $request->input('FK_program');
        $tarikh_muatturun = $request->input('tarikh_muatturun');

        $med_muatturun = med_permohonan::select('*')->where('id_permohonan',$id_permohonan)->first();
        $FK_program = $med_muatturun->FK_program;
        $FK_users = $med_muatturun->FK_users;
        $media_list = $med_muatturun->media_list;
        $media_item = explode(",", $media_list);

        $zip = new ZipArchive;

        $fileName = $tarikh_muatturun.'_'.$FK_program.'_'.$FK_users.'.zip';
        if($zip->open('uploads/'.$fileName,ZipArchive::CREATE) === TRUE)
        // if($zip->open(public_path($fileName),ZipArchive::CREATE) === TRUE)
        {
            
            $files = File::files('uploads');
            // $files = File::files(public_path('uploads'));
            foreach($files as $key => $value){
                
                foreach($media_item as $key_item => $value_item){
                
                    $relativeNameInZipFile = basename($value);
                    
                    if(strcmp($value_item,$relativeNameInZipFile) == '0'){
                    // if($value_item == $relativeNameInZipFile){
                    
                        $zip->addFile($value,$relativeNameInZipFile);
                        ++$count;
                    }
                }

            }
            
            $zip->close();
            
        }
        
        if ($count > 0)  {
        // if ($zip->numFiles > 0)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Muatturun!",
                'data' => $fileName
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Gagal Padam!",
                'data'=>$fileName
            ],200);
        }
    }
    //MIMI : ZIP & DOWNLOAD SELECTED FILE END

    //MIMI : REMOVE ZIP FILE START
    public function remove (Request $request){
        
        $file_name = $request->input('file_name');

        // if(File::exists('/var/www/html/api_asdcm/api_media/public/uploads/'.$file_name)){
        if(File::exists(public_path($file_name))){
            // File::delete('/var/www/html/api_asdcm/api_media/public/uploads/'.$file_name);
            File::delete(public_path($file_name));
        }else{
            dd('File does not exists.');
        }

        return response()->json([
            'success'=>true,
            'message'=>"Berjaya Muatturun!",
        ],200);
        
    }
    //MIMI : REMOVE ZIP FILE END
}
