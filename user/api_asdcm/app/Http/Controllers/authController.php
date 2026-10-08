<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailResetPassword;
use App\Jobs\SendRegistrationEmail;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\med_users;
use App\Models\med_tetapan;
use Illuminate\Support\Facades\Queue;
use App\Security\AccessToken;
use App\Security\AdministratorAccess;
use App\Security\PasswordResetToken;
use App\Security\Passwords;

class authController extends Controller
{
    public function __construct(
        private AccessToken $accessToken,
        private AdministratorAccess $administratorAccess,
        private PasswordResetToken $passwordResetToken,
        private Passwords $passwords
    )
    {
        parent::__construct();
        $this->middleware('auth.throttle:5,60', [
            'only' => ['login', 'loginUser', 'resetpasswordtomail'],
        ]);
    }

    public function getToken($id)  {
        $user = med_users::find($id);

        return $user ? $this->accessToken->issue($user) : false;
    }

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'nama'                 => 'required|string|max:255|not_regex:/<[^>]*script/',
            'no_kad_pengenalan'    => 'required|string|max:20|unique:med_users,no_kad_pengenalan',
            'emel'                 => 'required|email|max:255',
            'notel'                => 'nullable|string|max:20|not_regex:/<[^>]*script/',
            'FK_jenis_pengguna'    => 'required|integer',
            'FK_gelaran'           => 'nullable|integer',
            'nama_majikan' => 'required_if:FK_jenis_pengguna,2|nullable|string|max:255|not_regex:/<[^>]*script/',
            'jawatan' => 'required_if:FK_jenis_pengguna,2|nullable|string|max:255|not_regex:/<[^>]*script/',
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
        $enc_katalaluan = $this->passwords->make($katalaluan);
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
                'success'=>'true',
                'message'=>'Berjaya Mendaftar Akaun! Sila log masuk menggunakan No. Kad Pengenalan & Katalaluan yang didaftarkan.',
                'data'=>['id_users' => $register->id_users],
                'token'=>$token,
            ], 200);
        } else {
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }
    
    public function logout(Request $request, $no_kad_pengenalan = null){
        $request->user()->forceFill(['token' => null])->save();

        return response()->json(['success' => true], 200, ['Cache-Control' => 'no-store']);
    }

    public function login(Request $request){
        $no_kad_pengenalan = (string) $request->input('no_kad_pengenalan');
        $katalaluan = (string) $request->input('katalaluan');
        $userS = med_users::query()
            ->where('med_users.no_kad_pengenalan', $no_kad_pengenalan)
            ->where('med_users.FK_jenis_pengguna', '1')
            ->first([
                'med_users.id_users',
                'med_users.katalaluan',
                'med_users.FK_jenis_pengguna',
                'med_users.statusrekod',
            ]);
        if($userS && $this->administratorAccess->allows($userS)){
            if ($this->passwords->verify($katalaluan, (string) $userS->katalaluan)) {
                $this->upgradePasswordIfNeeded($userS, $katalaluan);
                $token = $this->getToken($userS->id_users);

                if($token){
                    return response()->json([
                        'success'=>true,
                        'token'=>$token,
                        'messages'=>'Log Masuk Berjaya',
                        'data'=>[
                            'id_users' => $userS->id_users,
                        ],
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
                    'data'=>'Log masuk gagal. Sila cuba lagi.',
                ],400);
            }
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Log Masuk Gagal',
                'data'=>'Log masuk gagal. Sila cuba lagi.',
            ],400);
        }
    }

    public function loginUser(Request $request){
        $no_kad_pengenalan = (string) $request->input('no_kad_pengenalan');
        $katalaluan = (string) $request->input('katalaluan');

        $userS = med_users::where('no_kad_pengenalan', $no_kad_pengenalan)
            ->first([
                'id_users',
                'nama',
                'emel',
                'katalaluan',
            ]);
        if($userS){
            if ($this->passwords->verify($katalaluan, (string) $userS->katalaluan)) {
                $this->upgradePasswordIfNeeded($userS, $katalaluan);
                $token = $this->getToken($userS->id_users);

                if($token){
                    return response()->json([
                        'success'=>true,
                        'token'=>$token,
                        'messages'=>'Log Masuk Berjaya',
                        'data'=>[
                            'id_users' => $userS->id_users,
                            'nama' => $userS->nama,
                            'emel' => $userS->emel,
                        ],
                    ],200);
                }
                else {
                    return response()->json([
                        'success'=>false,
                        'token'=>$token,
                        'messages'=>'Log Masuk Gagal',
                        'data'=>'',
                    ],500);
                }
            }
            else{
                return response()->json([
                    'success'=>false,
                    'messages'=>'Log Masuk Gagal',
                    'data'=>'Log masuk gagal. Sila cuba lagi.',
                ],401);
            }
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Log Masuk Gagal',
                'data'=>'Log masuk gagal. Sila cuba lagi.',
            ],401);
        }
    }

    public function show(Request $request)  {
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');

        $med_users = med_users::where('no_kad_pengenalan', $no_kad_pengenalan)
            ->first(['id_users']);

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
        $landing_page = '/reset';

        $med_users_search = med_users::leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') ->
                                        where('med_users.no_kad_pengenalan',$no_kad_pengenalan)->first([
                                            'med_users.id_users',
                                            'med_users.no_kad_pengenalan',
                                            'med_users.emel',
                                            'med_users.nama',
                                            'med_usersgov.emel_kerajaan',
                                        ]);
        if ($med_users_search) {
            $resetToken = $this->passwordResetToken->issue($med_users_search);
            Queue::push(new SendEmailResetPassword([
                'no_kad_pengenalan' => $no_kad_pengenalan,
                'landing_page' => $landing_page,
                'reset_token' => $resetToken,
                'emel_kerajaan' => $med_users_search->emel_kerajaan,
                'emel' => $med_users_search->emel,
                'nama' => $med_users_search->nama
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Permintaan set semula katalaluan akan dihantar ke emel anda sekiranya wujud.',
                // 'message' => 'Permintaan set semula katalaluan telah dihantar ke<br><br>Emel Rasmi ['.$med_users_search->emel_kerajaan.']<br>Emel Peribadi ['.$med_users_search->emel.']<br><br>Sekiranya Emel Rasmi tidak tepat sila kemaskini di <br><span style="font-weight: bold;">Sistem HRMIS</span>',
                'data' => '',
            ], 200);
        }

        return response()->json([
            'success' => true,
            'message' => 'Permintaan set semula katalaluan akan dihantar ke emel anda sekiranya wujud.',
            'data' => '',
        ], 200);
    }

    public function showGetResetKatalaluan($resetkatalaluan)  {

        $med_users = $this->passwordResetToken->userFromToken($resetkatalaluan);

        if ($med_users)   {
            return response()->json([
                'success'=>true,
                'message'=>'Show Success!',
                'data'=>['valid' => true]
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
        $katalaluan = (string) $request->input('katalaluan');

        $validator = Validator::make(['katalaluan' => $katalaluan], [
            'katalaluan' => ['required', 'string', 'min:8', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Katalaluan baharu tidak memenuhi syarat keselamatan.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $med_users_search = $request->user();

        if (!$med_users_search) {
            $med_users_search = $this->passwordResetToken
                ->userFromToken($request->input('reset_token'));
        }

        if (!$med_users_search) {
            return response()->json([
                'success' => false,
                'message' => 'Pautan set semula tidak sah atau telah luput.',
                'data' => '',
            ], 403);
        }

        $enc_katalaluan = $this->passwords->make($katalaluan);
        
        if ($med_users_search)  {
            $med_users = med_users::where('id_users', $med_users_search->id_users)->update([
                'katalaluan' => $enc_katalaluan,
                'resetkatalaluan' => null,
                'token' => null,
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

    private function upgradePasswordIfNeeded(med_users $user, string $password): void
    {
        if ($this->passwords->needsUpgrade($user->katalaluan)) {
            med_users::where('id_users', $user->id_users)->update([
                'katalaluan' => $this->passwords->make($password),
            ]);
        }
    }
}
