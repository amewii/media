<?php

namespace App\Http\Controllers;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\med_users;
use App\Models\med_tetapan;

class authController extends Controller
{

    public function getToken($id)  {
        $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $token     = hash("sha256", Str::random(32).$ajinomoto);
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
        $validator = Validator::make($request->all(), [
            'nama'                 => 'required|string|max:255|not_regex:/<[^>]*script/',
            'no_kad_pengenalan'    => 'required|string|max:20',
            'emel'                 => 'required|email|max:255',
            'notel'                => 'nullable|string|max:20|not_regex:/<[^>]*script/',
            'FK_jenis_pengguna'    => 'required|integer',
            'FK_gelaran'           => 'nullable|integer',
            'katalaluan'           => 'required|string|min:6',
            'katalaluan' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',      // at least one lowercase letter
                'regex:/[A-Z]/',      // at least one uppercase letter
                'regex:/[0-9]/',      // at least one digit
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $katalaluan = $validated['katalaluan'];        
        $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $enc_katalaluan     = hash("sha256", $katalaluan.$ajinomoto);
        $nama = $validated['nama'];    
        $emel = $validated['emel'];  
        $no_kad_pengenalan = $validated['no_kad_pengenalan'];      
        $notel = $validated['notel'];    
        $FK_jenis_pengguna = $validated['FK_jenis_pengguna'];        
        $FK_gelaran = $validated['FK_gelaran'];        

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
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host       = $tetapan_mail->mail_gateway;
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
    
    public function logout($no_kad_pengenalan){
        med_users::query()
            ->where('no_kad_pengenalan', $no_kad_pengenalan)
            ->update([
                'token' => null
            ]);

        return response()->json(['success' => true], 200);
    }

    public function login(Request $request){
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $katalaluan = $request->input('katalaluan');
        $userS = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                        join('med_capaian', 'med_capaian.FK_users', '=', 'med_users.id_users') -> 
                        where('no_kad_pengenalan',$no_kad_pengenalan)->where('FK_jenis_pengguna','1')->first();
        if($userS){
            $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
            $enc_katalaluan     = hash("sha256", $katalaluan.$ajinomoto);
            
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
                    'messages'=>'Log Masuk Gagal',
                    'data'=>'Katalaluan tidak tepat. Sila cuba lagi.',
                ],400);
            }
        }
        else {
            return response()->json([
                'success'=>false,
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
            $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
            $enc_katalaluan     = hash("sha256", $katalaluan.$ajinomoto);
            
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
                    'messages'=>'Log Masuk Gagal',
                    'data'=>'Katalaluan tidak tepat. Sila cuba lagi.',
                ],201);
            }
        }
        else {
            return response()->json([
                'success'=>false,
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

    public function resetpasswordtomail(Request $request)  {
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $masa = $request->input('masa');
        $landing_page = $request->input('landing_page');

        $med_users_search = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                        where('no_kad_pengenalan',$no_kad_pengenalan)->first();
        $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $enc_link     = hash("sha256", $masa.$ajinomoto);
        
        if ($med_users_search)  {
            $med_users = med_users::where('no_kad_pengenalan',$no_kad_pengenalan) -> update([
                'resetkatalaluan' => $enc_link
            ]);
            if ($med_users)   {
                $tetapan_mail = med_tetapan::first();
                $emel = $med_users_search->emel;
                $mail = new PHPMailer();
                $mail->SMTPDebug = 0;
                $mail->isSMTP();
                $mail->Host       = $tetapan_mail->mail_gateway;
                // $mail->SMTPAuth   = true;
                // $mail->Username   = $tetapan_mail->mail_username;
                // $mail->Password   = $tetapan_mail->mail_password;
                // $mail->SMTPSecure = $tetapan_mail->mail_smtp_secure;
                $mail->Port       = $tetapan_mail->mail_port;
                
                $mail->setFrom('media@intanbk.intan.my', 'Admin Galeri INTAN');
                $mail->addAddress($med_users_search->emel_kerajaan);
                $mail->addAddress($med_users_search->emel);
                    
                $mail->isHTML(true);                                  
                $mail->Subject = 'PENGURUSAN MEDIA - SET SEMULA KATALALUAN';
                $mail->Body    = '<b>Set Semula Katalaluan</b><br><br>
                                    Assalamualaikum dan salam sejahtera<br>
                                    '.$med_users_search->nama.'<br><br>
                                    Anda telah membuat permintaan menetapkan semula kata laluan. <br>
                                    Sekiranya anda tidak membuat permintaan ini, silakan abaikan emel ini. <br>
                                    Sekiranya anda membuat permintaan ini, sila klik pautan dibawah untuk tetapkan semula katalaluan anda:<br><br>
                                    <a href="'.$tetapan_mail->link_sistem.$landing_page.'/?temp='.$enc_link.'">Set Semula Katalaluan</a><br><br>
                                    Terima kasih.';
                $mail->AltBody = 'Alternate Message';
                if($tetapan_mail->mail_username == 'localhost'){
                    return response()->json([
                        'success'=>true,
                        'message'=>'LOCALHOST: Permintaan set semula katalaluan telah dihantar ke<br><br>Emel Rasmi ['.$med_users_search->emel_kerajaan.']<br>Emel Peribadi ['.$med_users_search->emel.']<br><br>Sekiranya Emel Rasmi tidak tepat sila kemaskini di <br><span style="font-weight: bold;">Sistem HRMIS</span>',
                        'data'=>'',
                    ],200);
                } else {
                    if(!$mail->send()) {
                        return response()->json([
                            'success'=>true,
                            'message'=>'Konfigurasi Emel Sistem Tidak Tepat. Superadmin perlu set di bahagian Pentadbir Sistem -> Tetapan Sistem',
                            'data'=>'',
                        ],200);
                    } 
                    else {
                        return response()->json([
                            'success'=>true,
                            'message'=>'Permintaan set semula katalaluan telah dihantar ke<br><br>Emel Rasmi ['.$med_users_search->emel_kerajaan.']<br>Emel Peribadi ['.$med_users_search->emel.']<br><br>Sekiranya Emel Rasmi tidak tepat sila kemaskini di <br><span style="font-weight: bold;">Sistem HRMIS</span>',
                            'data'=>'',
                        ],200);
                    }
                }
                return response()->json([
                    'success'=>true,
                    'message'=>'Permintaan set semula katalaluan telah dihantar ke<br><br>Emel Rasmi ['.$med_users_search->emel_kerajaan.']<br>Emel Peribadi ['.$med_users_search->emel.']<br><br>Sekiranya Emel Rasmi tidak tepat sila kemaskini di <br><span style="font-weight: bold;">Sistem HRMIS</span>',
                    'data'=>''
                ],200);
            }
        } else  {
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],400);
        }
    }

    public function showGetResetKatalaluan($resetkatalaluan)  {

        $med_users = med_users::where('resetkatalaluan',$resetkatalaluan)->first();

        if ($med_users)   {
            return response()->json([
                'success'=>true,
                'message'=>'Show Success!',
                'data'=>$med_users
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],400);
        }
    }

    public function resetpassword(Request $request)  {
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $katalaluan = $request->input('katalaluan');

        $med_users_search = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)->first();
        $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $enc_katalaluan     = hash("sha256", $katalaluan.$ajinomoto);
        
        if ($med_users_search)  {
            $med_users = med_users::where('no_kad_pengenalan',$no_kad_pengenalan) -> update([
                'katalaluan' => $enc_katalaluan,
                'resetkatalaluan' => NULL
            ]);
            if ($med_users)   {
                return response()->json([
                    'success'=>true,
                    'message'=>'Show Success!',
                    'data'=>''
                ],200);
            }
        } else  {
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],400);
        }
    }
}
