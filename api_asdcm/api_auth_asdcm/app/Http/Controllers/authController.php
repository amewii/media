<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\med_users;

class authController extends Controller
{
    
    public function login(Request $request){
        $no_kad_pengenalan = $request->input('no_kad_pengenalan');
        $katalaluan = $request->input('katalaluan');

        $userS = med_users::select('*', 'med_usersgov.FK_kluster AS kluster') ->
                        leftjoin('med_usersgov', 'med_usersgov.FK_users', '=', 'med_users.id_users') -> 
                        join('med_capaian', 'med_capaian.FK_users', '=', 'med_users.id_users') -> 
                        leftjoin('med_peranan', 'med_peranan.id_peranan', '=', 'med_capaian.FK_peranan') -> 
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
}
