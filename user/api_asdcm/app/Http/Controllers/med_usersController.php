<?php

namespace App\Http\Controllers;

use App\Models\med_kategoriperkhidmatan;
use App\Models\med_skim;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\med_users;
use App\Models\med_tetapan;
use App\Models\med_usersgov;
use App\Models\med_userspelajar;
use App\Models\med_usersswasta;
use Illuminate\Support\Facades\Validator;

// require '../api_pentadbir/vendor/autoload.php';

class med_usersController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
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
        $katalaluan = $request->input('katalaluan');
        $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $enc_katalaluan = hash("sha256", $katalaluan.$ajinomoto);
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

    public function checkpassword(Request $request)  {
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $katalaluan = $request->input('katalaluan');

        $ajinomoto = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $enc_katalaluan     = hash("sha256", $katalaluan.$ajinomoto);
        $med_users_search = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)->where('katalaluan',$enc_katalaluan)->first();
        
        if ($med_users_search)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>''
            ],200);
        } else  {
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],400);
        }
    }

    public function showSiteAdmin($no_kad_pengenalan){
        $obj = med_users::
                join('med_capaian','med_capaian.FK_users','med_users.id_users')->
                join('med_peranan','med_peranan.id_peranan','med_capaian.FK_peranan')->
                where('no_kad_pengenalan',$no_kad_pengenalan)->first([
                    'id_users',
                    'med_users.nama',
                    'med_peranan.FK_capaian',
                    'med_peranan.nama_peranan',
                    'med_capaian.FK_peranan',
                    'med_capaian.FK_kluster',
                ]);

        if($obj){
            $token = $this->getToken($obj->id_users);
            return response()->json([
                'success'=>true,
                'message'=>'Show Success!',
                'data'=>$obj,
                'token'=>$token,
            ],200);
        } else {
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],400);
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

    public function showIcEmel(Request $request)  {
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $emel = $request->input('emel');

        $med_users = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)->where('emel',$emel)->first();

        if ($med_users)   {
            $mail = new PHPMailer(true);
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

    public function showGetIc($no_kad_pengenalan)  {
        $med_users = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)->first();

        switch($med_users->FK_jenis_pengguna){
            case 1: 
                $detail_pengguna = med_usersgov::where('FK_users',$med_users->id_users)->first(); 
                $kategori_perkhidmatan = med_kategoriperkhidmatan::where('id_kategoriperkhidmatan',$detail_pengguna->kategori_perkhidmatan)->first();
                $skim = med_skim::where('id_skim',$detail_pengguna->skim)->first();
                $detail_pengguna->kategori_perkhidmatan = $kategori_perkhidmatan;
                $detail_pengguna->skim = $skim;
                break;
            case 2: $detail_pengguna = med_usersswasta::where('FK_users',$med_users->id_users)->first(); break;
            case 3: $detail_pengguna = med_userspelajar::where('FK_users',$med_users->id_users)->first(); break;
        }
        $med_users->detail_pengguna = $detail_pengguna;

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

    public function list()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> get();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listIntan()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                join('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                where('users_intan','1') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listIntanGetIc($no_kad_pengenalan)  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                join('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                where('users_intan','1') -> where('med_users.no_kad_pengenalan',$no_kad_pengenalan) ->
                                first();
        if ($med_users)   {
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        } else {
            return response()->json([
                'success'=>false,
                'message'=>'List Success!',
                'data'=>$med_users
            ],400);
        }
        
    }

    public function listLuar()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> 
                                where('users_intan','0') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listAll()  {
        $med_users = med_users::select('*','med_users.statusrekod AS statusrekod_users')->
                                join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                leftjoin('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> 
                                leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_usersgov.FK_kampus') -> 
                                orderby('med_users.nama', 'ASC') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listPentadbir()  {
        $med_users = med_users::select('*','med_capaian.statusrekod AS statusrekod_capaian','med_users.statusrekod AS statusrekod_users')->
                                join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                leftjoin('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> 
                                join('med_capaian', 'med_capaian.FK_users', '=', 'med_users.id_users') -> 
                                join('med_peranan', 'med_peranan.id_peranan', '=', 'med_capaian.FK_peranan') -> 
                                join('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_usersgov.FK_kampus') -> 
                                leftjoin('med_kluster', 'med_kluster.id_kluster', '=', 'med_usersgov.FK_kluster') -> 
                                leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_usersgov.FK_subkluster') -> 
                                orderby(med_users::raw('ISNULL(med_peranan.id_peranan)', 'ASC')) -> orderby('med_peranan.id_peranan', 'ASC') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'length'=>$med_users->count(),
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listPentadbirbyPeranan($peranan)  {
        $decodedPeranan = urldecode($peranan); //utk buang url pnya         

        $med_users = med_users::select('*','med_capaian.statusrekod AS statusrekod_capaian','med_users.statusrekod AS statusrekod_users')->
                                join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                leftjoin('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> 
                                join('med_capaian', 'med_capaian.FK_users', '=', 'med_users.id_users') -> 
                                join('med_peranan', 'med_peranan.id_peranan', '=', 'med_capaian.FK_peranan') -> 
                                join('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_usersgov.FK_kampus') -> 
                                leftjoin('med_kluster', 'med_kluster.id_kluster', '=', 'med_usersgov.FK_kluster') -> 
                                leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_usersgov.FK_subkluster') ->
                                where('med_peranan.nama_peranan', $decodedPeranan) -> 
                                orderby(med_users::raw('ISNULL(med_peranan.id_peranan)', 'ASC')) -> orderby('med_peranan.id_peranan', 'ASC') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'length'=>$med_users->count()
                ,
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users,
            ],200);
        }
        
    }
    public function listKerajaan()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> 
                                where('FK_jenis_pengguna','1') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listKerajaanSingle($FK_users)  {
        $med_users = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_usersswasta', 'med_usersswasta.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_usersgov.FK_kampus') -> 
                                leftjoin('med_kluster', 'med_kluster.id_kluster', '=', 'med_usersgov.FK_kluster') -> 
                                leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_usersgov.FK_subkluster') -> 
                                leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_usersgov.FK_unit') -> 
                                leftjoin('med_kementerian', 'med_kementerian.id_kementerian', '=', 'med_usersgov.FK_kementerian') -> 
                                leftjoin('med_agensi', 'med_agensi.id_agensi', '=', 'med_usersgov.FK_agensi') -> 
                                leftjoin('med_bahagian', 'med_bahagian.id_bahagian', '=', 'med_usersgov.FK_bahagian') -> 
                                leftjoin('med_ilawam', 'med_ilawam.id_ilawam', '=', 'med_usersgov.FK_ila') -> 
                                where('FK_jenis_pengguna','1') -> where('med_users.id_users',$FK_users) ->
                                first();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listUsersEditProfile($FK_users)  {
        $med_users = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_usersswasta', 'med_usersswasta.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_userspelajar', 'med_userspelajar.FK_users', '=', 'med_users.id_users') -> 
                                leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_usersgov.FK_kampus') -> 
                                leftjoin('med_kategoriperkhidmatan', 'med_kategoriperkhidmatan.id_kategoriperkhidmatan', '=', 'med_usersgov.kategori_perkhidmatan') -> 
                                leftjoin('med_kluster', 'med_kluster.id_kluster', '=', 'med_usersgov.FK_kluster') -> 
                                leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_usersgov.FK_subkluster') -> 
                                leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_usersgov.FK_unit') -> 
                                leftjoin('med_kementerian', 'med_kementerian.id_kementerian', '=', 'med_usersgov.FK_kementerian') -> 
                                leftjoin('med_agensi', 'med_agensi.kod_agensi', '=', 'med_usersgov.FK_agensi') -> 
                                leftjoin('med_bahagian', 'med_bahagian.kod_bahagian', '=', 'med_usersgov.FK_bahagian') -> 
                                leftjoin('med_ilawam', 'med_ilawam.id_ilawam', '=', 'med_usersgov.FK_ila') -> 
                                where('med_users.id_users',$FK_users) ->
                                first();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listSwasta()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> 
                                where('FK_jenis_pengguna','2') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listPelajar()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') -> 
                                join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') -> 
                                where('FK_jenis_pengguna','3') ->
                                get();

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id_users');
        $nama = $request->input('nama');
        $emel = $request->input('emel');
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $notel = $request->input('notel');
        $tarikh_lahir = $request->input('tarikh_lahir');
        $FK_jenis_pengguna = $request->input('FK_jenis_pengguna');
        $FK_gelaran = $request->input('FK_gelaran');
        $FK_negara_lahir = $request->input('FK_negara_lahir');
        $FK_negeri_lahir = $request->input('FK_negeri_lahir');
        $FK_jantina = $request->input('FK_jantina');
        $FK_warganegara = $request->input('FK_warganegara');
        $FK_bangsa = $request->input('FK_bangsa');
        $FK_etnik = $request->input('FK_etnik');
        $FK_agama = $request->input('FK_agama');
        $updated_by = $request->input('updated_by');

        $med_users = med_users::find($id); 

        $med_users -> update([
            'nama' => $nama,
            'emel' => $emel,
            'no_kad_pengenalan' => $no_kad_pengenalan,
            'notel' => $notel,
            'tarikh_lahir' => $tarikh_lahir,
            'FK_jenis_pengguna' => $FK_jenis_pengguna,
            'FK_gelaran' => $FK_gelaran,
            'FK_negara_lahir' => $FK_negara_lahir,
            'FK_negeri_lahir' => $FK_negeri_lahir,
            'FK_jantina' => $FK_jantina,
            'FK_warganegara' => $FK_warganegara,
            'FK_bangsa' => $FK_bangsa,
            'FK_etnik' => $FK_etnik,
            'FK_agama' => $FK_agama,
            'updated_by' => $updated_by
        ]);

        if ($med_users)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_users
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

    public function editprofile(Request $request)    {
        $validator = Validator::make($request->all(), [
            'emel' => 'required|email|max:255',
            'notel' => 'required|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $id = $request->input('id_users');
        $emel = $request->input('emel');
        $notel = $request->input('notel');
        $updated_by = $request->input('updated_by');

        $med_users = med_users::where('id_users', $id)->update([
            'emel' => $emel,
            'notel' => $notel,
            'updated_by' => $updated_by
        ]);

        if ($med_users)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => ''
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

    public function delete(Request $request)    {
        $id = $request->input('id_users');

        $med_users_search = med_users::where('id_users',$id)->first(); 
        switch($med_users_search->statusrekod)    {
            case 0: $med_users = med_users::where('id_users',$id) -> update([
                        'statusrekod' => '1',
                    ]);
                    break;
            case 1: $med_users = med_users::where('id_users',$id) -> update([
                        'statusrekod' => '0',
                    ]);
                    break;
        }
        $med_users_search = med_users::where('id_users',$id)->first(); 
        
        if ($med_users)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Padam!",
                'data' => $med_users_search
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

    function sendmail($to, $nameto, $subject, $message, $altmess) {
        echo $subject;
        $from = 'muhammadamri@protigatech.com';
        $namefrom = 'Amri';
        $mail = new PHPMailer();
        $mail->SMTPDebug = 0;
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->Host = "mail.protigatech.com";
        $mail->Port = 465;
        $mail->Username = $from;
        $mail->Password = 'Amewii-0123';
        $mail->SMTPSecure = "ssl";
        $mail->setFrom($from, $namefrom);
        $mail->addCC($from, $namefrom);
        $mail->Subject = $subject;
        $mail->isHTML();
        $mail->Body = $message;
        $mail->AltBody = $altmess;
        $mail->addAddress($to, $nameto);
        return $mail->send();
    }
    
}
