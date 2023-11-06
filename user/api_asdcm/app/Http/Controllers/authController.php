<?php

namespace App\Http\Controllers;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\med_users;
use App\Models\med_tetapan;

class authController extends Controller
{

    public function getToken($id)  {
        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $token     = hash("sha256", Str::random(32).$salt);
        $obj = med_users::where('id_users',$id)->update([
            'token' => $token
        ]);

        $token = false;

        if($obj){
            $obj = med_users::where('id_users',$id)->first(['token']);
            $random = hash("sha256", Str::random(32)).'0L1v3';
            $token = $random.$obj->token;
        }

        return $token;
    }

    public function register(Request $request) {
        $katalaluan = $request->input('katalaluan');
        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $enc_katalaluan     = hash("sha256", $katalaluan.$salt);
        // dd($enc_katalaluan);
        $nama = $request->input('nama');
        $emel = $request->input('emel');
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $notel = $request->input('notel');
        $FK_jenis_pengguna = $request->input('FK_jenis_pengguna');
        $FK_gelaran = $request->input('FK_gelaran');


        $register = med_users::create([
            'nama' => $nama,
            'emel' => $emel,
            'no_kad_pengenalan' => $no_kad_pengenalan,
            'katalaluan' => $enc_katalaluan,
            'notel' => $notel,
            'FK_jenis_pengguna' => $FK_jenis_pengguna,
            'FK_gelaran' => $FK_gelaran,
        ]);

        if ($register)  {
            $tetapan_mail = med_tetapan::first();
            $emelreceiver = $emel;
            $mail = new PHPMailer();
        // mail('amriamewii@gmail.com', '[TEST MESSAGE]', 'This is the body message', 'From: muhammadamri@protigatech.com');
            // $mail->SMTPAuth = true;
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host       = $tetapan_mail->mail_gateway;
            // $mail->SMTPAuth   = true;
            // $mail->Username   = $tetapan_mail->mail_username;
            // $mail->Password   = $tetapan_mail->mail_password;
            // $mail->SMTPSecure = $tetapan_mail->mail_smtp_secure;
            $mail->Port       = $tetapan_mail->mail_port;
            
            $mail->setFrom('media@intanbk.intan.my', 'Admin Galeri INTAN');
            $mail->addAddress($emelreceiver);
                
            $mail->isHTML(true);                                  
            $mail->Subject = 'PENGURUSAN MEDIA - PENDAFTARAN AKAUN PENGGUNA';
            $mail->Body    = '<b>Pendaftaran Akaun Pengguna</b><br><br>
                                Assalamualaikum dan salam sejahtera<br>
                                '.$nama.'<br><br>
                                Tahniah! Anda berjaya mendaftar akaun. <br>
                                Sekiranya anda tidak membuat permintaan ini, silakan abaikan emel ini. <br>
                                Sekiranya anda membuat permintaan ini, Sila klik pautan dibawah untuk masuk ke dalam sistem:<br><br>
                                No. Kad Pengenalan: '. $no_kad_pengenalan .'<br>
                                Katalaluan: '. $katalaluan .'<br><br>
                                <a href="'.$tetapan_mail->link_sistem.'/user">Galeri Media INTAN Malaysia</a><br><br>
                                Terima kasih.';
            $mail->AltBody = 'Alternate Message';
            if(!$mail->send()) {
                dd("Mailer Error: " . $mail->ErrorInfo);
                return response()->json([
                    'success'=>'true',
                    'message'=>'Konfigurasi Emel Sistem Tidak Tepat. Superadmin perlu set di bahagian Pentadbir Sistem -> Tetapan Sistem',
                    'data'=>''
                ],200);
                // exit;
            }
            if(!$mail->send()) {
                dd("Mailer Error: " . $mail->ErrorInfo);
                return response()->json([
                    'success'=>'true',
                    'message'=>'Konfigurasi Emel Sistem Tidak Tepat. Superadmin perlu set di bahagian Pentadbir Sistem -> Tetapan Sistem',
                    'data'=>''
                ],200);
            } 
            else {
                // dd("Mailer Error: " . $mail->ErrorInfo);
                return response()->json([
                    'success'=>'true',
                    'message'=>'Berjaya Mendaftar Akaun! Sila log masuk menggunakan No. Kad Pengenalan & Katalaluan yang didaftarkan.',
                    'data'=>''
                ],200);
            }
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
    
    public function login(Request $request){
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $katalaluan = $request->input('katalaluan');
        $userS = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                        join('med_capaian', 'med_capaian.FK_users', '=', 'med_users.id_users') -> 
                        where('no_kad_pengenalan',$no_kad_pengenalan)->where('FK_jenis_pengguna','1')->first();
        if($userS){
            $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
            $enc_katalaluan     = hash("sha256", $katalaluan.$salt);
            
            // dd($enc_katalaluan);
            if($userS->katalaluan === $enc_katalaluan){
                $token = Str::random(32);
    
                $user = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)->update([
                    'token' => $token
                ]);
    
                if($user){
                    $token = $this->getToken($userS->id_users);
                    return response()->json([
                        'success'=>true,
                        'token'=>$token,
                        'no_kad_pengenalan' => $no_kad_pengenalan,
                        'messages'=>'Log Masuk Berjaya',
                        'data'=>$userS,
                    ],200);
                }
                else {
                    return response()->json([
                        'success'=>false,
                        'token'=>$token,
                        'messages'=>'Log Masuk Gagal',
                        'data'=>'',
                    ],400);
                }
            }
            else{
                return response()->json([
                    'success'=>false,
                    // 'token'=>$token,
                    'messages'=>'Log Masuk Gagal',
                    'data'=>'Katalaluan tidak tepat. Sila cuba lagi.',
                ],400);
            }
        }
        else {
            return response()->json([
                'success'=>false,
                // 'token'=>$token,
                'messages'=>'Log Masuk Gagal',
                'data'=>'Sila hubungi pihak pentadbir sistem untuk maklumat lanjut.',
            ],400);
        }
    }

    public function loginUser(Request $request){
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $katalaluan = $request->input('katalaluan');

        $userS = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                        where('no_kad_pengenalan',$no_kad_pengenalan)->first();
        if($userS){
            $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
            $enc_katalaluan     = hash("sha256", $katalaluan.$salt);
            
            // dd($enc_katalaluan);
            if($userS->katalaluan === $enc_katalaluan){
                $token = Str::random(32);
    
                $user = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)->update([
                    'token' => $token
                ]);
    
                if($user){
    
                    return response()->json([
                        'success'=>true,
                        'token'=>$token,
                        'no_kad_pengenalan' => $no_kad_pengenalan,
                        'messages'=>'Log Masuk Berjaya',
                        'data'=>$userS,
                    ],201);
                }
                else {
                    return response()->json([
                        'success'=>false,
                        'token'=>$token,
                        'messages'=>'Log Masuk Gagal',
                        'data'=>'',
                    ],201);
                }
            }
            else{
                return response()->json([
                    'success'=>false,
                    // 'token'=>$token,
                    'messages'=>'Log Masuk Gagal',
                    'data'=>'Katalaluan tidak tepat. Sila cuba lagi.',
                ],201);
            }
        }
        else {
            return response()->json([
                'success'=>false,
                // 'token'=>$token,
                'messages'=>'Log Masuk Gagal',
                'data'=>'Sila hubungi pihak pentadbir sistem untuk maklumat lanjut.',
            ],201);
        }
    }

    public function show(Request $request)  {
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');

        $med_users = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_usersswasta', 'med_usersswasta.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_userspelajar', 'med_userspelajar.FK_users', '=', 'med_users.id_users') -> 
                                where('no_kad_pengenalan',$no_kad_pengenalan)->first();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_users
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ]);
        }
    }
}
