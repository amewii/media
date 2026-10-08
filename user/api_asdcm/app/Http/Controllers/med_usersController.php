<?php

namespace App\Http\Controllers;

use App\Jobs\SendRegistrationEmail;
use App\Jobs\SendEmailResetPassword;
use App\Models\med_kategoriperkhidmatan;
use App\Models\med_skim;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Http\Request;
use App\Models\med_users;
use App\Models\med_tetapan;
use App\Models\med_usersgov;
use App\Models\med_userspelajar;
use App\Models\med_usersswasta;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Validator;
use App\Security\Passwords;
use App\Security\AccessToken;
use App\Security\PasswordResetToken;

// require '../api_pentadbir/vendor/autoload.php';

class med_usersController extends Controller
{
    public function __construct(
        private Passwords $passwords,
        private AccessToken $accessToken,
        private PasswordResetToken $passwordResetToken
    )
    {
        parent::__construct();
    }
    
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255|not_regex:/<[^>]*script/',
            'no_kad_pengenalan' => 'required|string|max:20',
            'emel' => 'required|email|max:255',
            'notel' => 'nullable|string|max:20|not_regex:/<[^>]*script/',
            'FK_jenis_pengguna' => 'required|integer',
            'FK_gelaran' => 'nullable|integer',
            'katalaluan' => [
                'required', 'string', 'min:8', 'regex:/[a-z]/',
                'regex:/[A-Z]/', 'regex:/[0-9]/',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $katalaluan = (string) $request->input('katalaluan');
        $enc_katalaluan = $this->passwords->make($katalaluan);
        $nama = $request->input('nama');
        $emel = $request->input('emel');
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $notel = $request->input('notel');
        $FK_jenis_pengguna = $request->input('FK_jenis_pengguna');
        $FK_gelaran = $request->input('FK_gelaran');


        $register = med_users::where('no_kad_pengenalan', $no_kad_pengenalan)
            ->orderBy('id_users', 'asc')
            ->first(['id_users']);
        if ($register) {
            return response()->json([
                'success' => false,
                'message' => 'Akaun telah wujud.',
                'data' => '',
            ], 409);
        }

        $userData = [
            'nama' => $nama,
            'emel' => $emel,
            'no_kad_pengenalan' => $no_kad_pengenalan,
            'notel' => $notel,
            'FK_jenis_pengguna' => $FK_jenis_pengguna,
            'FK_gelaran' => $FK_gelaran,
        ];

        $userData['katalaluan'] = $enc_katalaluan;
        $register = med_users::create($userData);

        if ($register) {
            $token = $this->accessToken->issue($register);
            $tetapan_mail = med_tetapan::first();

            Queue::push(new SendRegistrationEmail([
                'env' => request()->getHost(),
                'no_kad_pengenalan' => $no_kad_pengenalan,
                'emel' => $emel,
                'nama' => $nama,
                'mail_gateway' => $tetapan_mail->mail_gateway,
                'port' => $tetapan_mail->mail_port,
                'link_sistem' => $tetapan_mail->link_sistem,
            ]));

            return response()->json([
                'success'=>true,
                'message'=>'Berjaya Mendaftar Akaun! Sila log masuk menggunakan No. Kad Pengenalan & Katalaluan yang didaftarkan.',
                'data'=>['id_users' => $register->id_users],
                'created'=>true,
                'token'=>$token,
            ], 200);
        } else    {
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$register
            ], 400);
        }
    }

    public function checkpassword(Request $request)  {
        $no_kad_pengenalan = (string) $request->input('no_kad_pengenalan');
        $katalaluan = (string) $request->input('katalaluan');

        $med_users_search = med_users::where('no_kad_pengenalan', $no_kad_pengenalan)
            ->first(['id_users', 'katalaluan']);
        if ($med_users_search && !$this->canActForUser($request, $med_users_search->id_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $passwordMatches = $med_users_search
            && $this->passwords->verify($katalaluan, (string) $med_users_search->katalaluan);

        if ($passwordMatches)   {
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
        if (!$no_kad_pengenalan) {
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ], 200);
        }

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
            return response()->json([
                'success'=>true,
                'message'=>'Show Success!',
                'data'=>$obj,
            ],200);
        } else {
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],200);
        }
    }

    public function show(Request $request)  {
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');

        $med_users = med_users::where('no_kad_pengenalan', $no_kad_pengenalan)
            ->orderBy('id_users', 'asc')
            ->first(['id_users']);

        if ($med_users && !$this->canActForUser($request, $med_users->id_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>['id_users' => $med_users->id_users]
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

        $med_users = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)
            ->where('emel',$emel)->first(['id_users']);

        if ($med_users)   {
            $mail = new PHPMailer(true);
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>''
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
        $med_users = med_users::where('no_kad_pengenalan',$no_kad_pengenalan)
            ->first($this->userProfileFields());

        if (!$med_users || !$this->canActForUser(request(), $med_users->id_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        switch($med_users->FK_jenis_pengguna){
            case 1: 
                $detail_pengguna = med_usersgov::where('FK_users',$med_users->id_users)
                    ->first($this->governmentProfileFields());
                $kategori_perkhidmatan = med_kategoriperkhidmatan::where('id_kategoriperkhidmatan',$detail_pengguna->kategori_perkhidmatan)
                    ->first(['id_kategoriperkhidmatan', 'nama_kategoriperkhidmatan']);
                $skim = med_skim::where('id_skim',$detail_pengguna->skim)
                    ->first(['id_skim', 'nama_skim', 'kod_skim']);
                $detail_pengguna->kategori_perkhidmatan = $kategori_perkhidmatan;
                $detail_pengguna->skim = $skim;
                break;
            case 2: $detail_pengguna = med_usersswasta::where('FK_users',$med_users->id_users)
                ->first($this->privateProfileFields()); break;
            case 3: $detail_pengguna = med_userspelajar::where('FK_users',$med_users->id_users)
                ->first($this->studentProfileFields()); break;
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
            ], 200);
        }
    }

    public function list()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
            ->join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran')
            ->get($this->basicUserListFields());

        $this->maskIdentificationNumbers($med_users);

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listIntan()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
            ->join('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users')
            ->where('users_intan','1')->get(array_merge($this->basicUserListFields(false), [
                'med_usersgov.users_intan',
            ]));

        $this->maskIdentificationNumbers($med_users);

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listIntanGetIc($no_kad_pengenalan)  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
            ->join('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users')
            ->where('users_intan','1')->where('med_users.no_kad_pengenalan',$no_kad_pengenalan)
            ->first(array_merge($this->basicUserListFields(false), ['med_usersgov.users_intan']));
        if ($med_users) {
            $this->maskIdentificationNumbers([$med_users]);
        }
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
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
            ->join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran')
            ->leftJoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users')
            ->where('med_usersgov.users_intan','0')->get($this->basicUserListFields());

        $this->maskIdentificationNumbers($med_users);

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listAll()  {
        $med_users = med_users::select([
                                'med_users.id_users',
                                'med_users.nama',
                                'med_users.emel',
                                'med_users.no_kad_pengenalan',
                                'med_jenispengguna.jenis_pengguna',
                                'med_usersgov.users_intan',
                                'med_users.statusrekod AS statusrekod_users',
                            ])->
                                join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna') ->
                                leftjoin('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran') ->
                                leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') ->
                                leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_usersgov.FK_kampus') ->
                                orderby('med_users.nama', 'ASC') ->
                                get();

        $this->maskIdentificationNumbers($med_users);

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listPentadbir()  {
        $med_users = med_users::select($this->administratorListColumns())->
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

        $this->maskIdentificationNumbers($med_users);

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

        $med_users = med_users::select($this->administratorListColumns())->
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

        $this->maskIdentificationNumbers($med_users);

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
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
            ->join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran')
            ->where('FK_jenis_pengguna','1')->get($this->basicUserListFields());

        $this->maskIdentificationNumbers($med_users);

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
                                leftjoin('med_userspelajar', 'med_userspelajar.FK_users', '=', 'med_users.id_users') ->
                                leftjoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_usersgov.FK_kampus') ->
                                leftjoin('med_kategoriperkhidmatan', 'med_kategoriperkhidmatan.id_kategoriperkhidmatan', '=', 'med_usersgov.kategori_perkhidmatan') ->
                                leftjoin('med_kluster', 'med_kluster.id_kluster', '=', 'med_usersgov.FK_kluster') -> 
                                leftjoin('med_subkluster', 'med_subkluster.id_subkluster', '=', 'med_usersgov.FK_subkluster') -> 
                                leftjoin('med_unit', 'med_unit.id_unit', '=', 'med_usersgov.FK_unit') -> 
                                leftjoin('med_kementerian', 'med_kementerian.id_kementerian', '=', 'med_usersgov.FK_kementerian') -> 
                                leftjoin('med_agensi', 'med_agensi.id_agensi', '=', 'med_usersgov.FK_agensi') -> 
                                leftjoin('med_bahagian', 'med_bahagian.id_bahagian', '=', 'med_usersgov.FK_bahagian') -> 
                                leftjoin('med_ilawam', 'med_ilawam.id_ilawam', '=', 'med_usersgov.FK_ila') -> 
                                where('FK_jenis_pengguna','1') -> where('med_users.id_users',$FK_users)
                                ->first($this->joinedProfileFields());

        if ($med_users) {
            $this->maskIdentificationNumbers([$med_users]);
        }

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listUsersEditProfile($FK_users)  {
        if (!$this->canActForUser(request(), $FK_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
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
                                where('med_users.id_users',$FK_users)
                                ->first($this->joinedProfileFields());

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listSwasta()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
            ->join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran')
            ->where('FK_jenis_pengguna','2')->get($this->basicUserListFields());

        $this->maskIdentificationNumbers($med_users);

        if ($med_users)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_users
            ],200);
        }
        
    }

    public function listPelajar()  {
        $med_users = med_users::join('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
            ->join('med_gelaran', 'med_gelaran.id_gelaran', '=', 'med_users.FK_gelaran')
            ->where('FK_jenis_pengguna','3')->get($this->basicUserListFields());

        $this->maskIdentificationNumbers($med_users);

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
        if (!$this->canActForUser($request, $id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
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
        if (!$this->canActForUser($request, $id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
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

        $med_users_search = med_users::where('id_users',$id)
            ->first(['id_users', 'statusrekod']);
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
        $med_users_search = med_users::where('id_users',$id)
            ->first(['id_users', 'statusrekod']);
        
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
        $from = (string) config('app.MAIL_USERNAME');
        $namefrom = 'Admin Galeri INTAN';
        $mail = new PHPMailer();
        $mail->SMTPDebug = 0;
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->Host = (string) config('app.MAIL_HOST');
        $mail->Port = (int) config('app.MAIL_PORT');
        $mail->Username = $from;
        $mail->Password = (string) config('app.MAIL_PASSWORD');
        $mail->SMTPSecure = (string) config('app.MAIL_ENCRYPTION', 'tls');
        $mail->setFrom($from, $namefrom);
        $mail->addCC($from, $namefrom);
        $mail->Subject = $subject;
        $mail->isHTML();
        $mail->Body = $message;
        $mail->AltBody = $altmess;
        $mail->addAddress($to, $nameto);
        return $mail->send();
    }

    public function resetpassword(Request $request)
    {
        $userId = (int) $request->input('id_users');
        $user = med_users::query()->find($userId, [
            'id_users',
            'nama',
            'emel',
            'no_kad_pengenalan',
        ]);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemui.',
                'data' => '',
            ], 404);
        }

        $government = med_usersgov::where('FK_users', $user->id_users)
            ->first(['emel_kerajaan']);
        $resetToken = $this->passwordResetToken->issue($user);

        Queue::push(new SendEmailResetPassword([
            'no_kad_pengenalan' => $user->no_kad_pengenalan,
            'landing_page' => '/reset',
            'reset_token' => $resetToken,
            'emel_kerajaan' => $government ? $government->emel_kerajaan : null,
            'emel' => $user->emel,
            'nama' => $user->nama,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Arahan set semula katalaluan telah dihantar ke emel pengguna.',
            'data' => '',
        ], 200);
    }

    private function basicUserListFields(bool $includeTitle = true): array
    {
        $fields = [
            'med_users.id_users',
            'med_users.id_users AS id',
            'med_users.id_users AS PK',
            'med_users.nama',
            'med_users.emel',
            'med_users.no_kad_pengenalan',
            'med_users.notel',
            'med_users.tarikh_lahir',
            'med_users.FK_jenis_pengguna',
            'med_users.FK_gelaran',
            'med_users.statusrekod AS statusrekod_users',
            'med_jenispengguna.jenis_pengguna',
        ];

        if ($includeTitle) {
            $fields[] = 'med_gelaran.nama_gelaran';
        }

        return $fields;
    }

    private function userProfileFields(): array
    {
        return [
            'id_users', 'nama', 'emel', 'no_kad_pengenalan', 'notel', 'tarikh_lahir',
            'FK_jenis_pengguna', 'FK_gelaran', 'FK_negara_lahir', 'FK_negeri_lahir',
            'FK_jantina', 'FK_warganegara', 'FK_bangsa', 'FK_etnik', 'FK_agama',
            'statusrekod',
        ];
    }

    private function governmentProfileFields(): array
    {
        return [
            'id_usersgov', 'FK_users', 'emel_kerajaan', 'notel_kerajaan',
            'FK_kategori_pengguna', 'kod_jawatan', 'nama_jawatan',
            'kategori_perkhidmatan', 'skim', 'gred', 'taraf_jawatan',
            'jenis_perkhidmatan', 'tarikh_lantikan', 'unit_organisasi',
            'users_intan', 'FK_kampus', 'FK_kluster', 'FK_subkluster', 'FK_unit',
            'FK_kementerian', 'FK_agensi', 'FK_bahagian', 'FK_ila',
            'alamat1_pejabat', 'alamat2_pejabat', 'poskod_pejabat',
            'daerah_pejabat', 'negeri_pejabat', 'statusrekod',
        ];
    }

    private function privateProfileFields(): array
    {
        return [
            'id_usersswasta', 'FK_users', 'FK_kategori_pengguna', 'jawatan',
            'alamat1_rumah', 'alamat2_rumah', 'poskod_rumah', 'daerah_rumah',
            'negeri_rumah', 'negara_rumah', 'organisasi', 'alamat1_organisasi',
            'alamat2_organisasi', 'poskod_organisasi', 'daerah_organisasi',
            'negeri_organisasi', 'nama_majikan', 'notel_majikan', 'emel_majikan',
            'statusrekod',
        ];
    }

    private function studentProfileFields(): array
    {
        return [
            'id_userspelajar', 'FK_users', 'FK_kategori_pengguna',
            'alamat1_rumah', 'alamat2_rumah', 'poskod_rumah', 'daerah_rumah',
            'negeri_rumah', 'negara_rumah', 'nama_sekolah', 'alamat1_sekolah',
            'alamat2_sekolah', 'poskod_sekolah', 'daerah_sekolah',
            'negeri_sekolah', 'statusrekod',
        ];
    }

    private function joinedProfileFields(): array
    {
        return [
            'med_users.id_users', 'med_users.nama', 'med_users.emel',
            'med_users.no_kad_pengenalan', 'med_users.notel', 'med_users.tarikh_lahir',
            'med_users.FK_jenis_pengguna', 'med_users.FK_gelaran',
            'med_usersgov.id_usersgov', 'med_usersgov.emel_kerajaan',
            'med_usersgov.notel_kerajaan', 'med_usersgov.FK_kategori_pengguna',
            'med_usersgov.kod_jawatan', 'med_usersgov.nama_jawatan',
            'med_usersgov.kategori_perkhidmatan', 'med_usersgov.skim',
            'med_usersgov.gred', 'med_usersgov.taraf_jawatan',
            'med_usersgov.jenis_perkhidmatan', 'med_usersgov.tarikh_lantikan',
            'med_usersgov.unit_organisasi', 'med_usersgov.users_intan',
            'med_usersgov.FK_kampus', 'med_usersgov.FK_kluster',
            'med_usersgov.FK_subkluster', 'med_usersgov.FK_unit',
            'med_usersgov.FK_kementerian', 'med_usersgov.FK_agensi',
            'med_usersgov.FK_bahagian', 'med_usersgov.FK_ila',
            'med_usersgov.alamat1_pejabat', 'med_usersgov.alamat2_pejabat',
            'med_usersgov.poskod_pejabat', 'med_usersgov.daerah_pejabat',
            'med_usersgov.negeri_pejabat',
            'med_usersswasta.id_usersswasta', 'med_usersswasta.jawatan',
            'med_usersswasta.nama_majikan', 'med_userspelajar.id_userspelajar',
            'med_userspelajar.nama_sekolah',
            'med_kampus.id_kampus', 'med_kampus.nama_kampus',
            'med_kategoriperkhidmatan.id_kategoriperkhidmatan',
            'med_kategoriperkhidmatan.nama_kategoriperkhidmatan',
            'med_kluster.id_kluster', 'med_kluster.nama_kluster',
            'med_subkluster.id_subkluster', 'med_subkluster.nama_subkluster',
            'med_unit.id_unit', 'med_unit.nama_unit',
            'med_kementerian.id_kementerian', 'med_kementerian.nama_kementerian',
            'med_agensi.id_agensi', 'med_agensi.nama_agensi',
            'med_bahagian.id_bahagian', 'med_bahagian.nama_bahagian',
            'med_ilawam.id_ilawam', 'med_ilawam.nama_ila',
        ];
    }

    private function administratorListColumns(): array
    {
        return [
            'med_users.id_users',
            'med_users.nama',
            'med_users.emel',
            'med_users.no_kad_pengenalan',
            'med_jenispengguna.jenis_pengguna',
            'med_capaian.id_capaian',
            'med_capaian.FK_peranan',
            'med_capaian.FK_kampus',
            'med_capaian.FK_kluster',
            'med_capaian.FK_subkluster',
            'med_capaian.FK_unit',
            'med_capaian.statusrekod AS statusrekod_capaian',
            'med_users.statusrekod AS statusrekod_users',
            'med_peranan.id_peranan',
            'med_peranan.nama_peranan',
            'med_kampus.id_kampus',
            'med_kampus.nama_kampus',
        ];
    }

    private function maskIdentificationNumbers($users): void
    {
        foreach ($users as $user) {
            $value = preg_replace('/\D+/', '', (string) $user->no_kad_pengenalan);
            $user->no_kad_pengenalan = strlen($value) > 4
                ? str_repeat('*', strlen($value) - 4).substr($value, -4)
                : str_repeat('*', strlen($value));
        }
    }
    
}
