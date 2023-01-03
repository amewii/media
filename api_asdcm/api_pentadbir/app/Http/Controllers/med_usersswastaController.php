<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_usersswasta;

class med_usersswastaController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    public function register(Request $request) {
        $FK_users = $request->input('FK_users');
        $jawatan = $request->input('jawatan');
        $nama_majikan = $request->input('nama_majikan');
        $statusrekod = $request->input('statusrekod');

        $register = med_usersswasta::create([
            'FK_users' => $FK_users,
            'jawatan' => $jawatan,
            'nama_majikan' => $nama_majikan,
            'statusrekod' => $statusrekod,
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

    public function show(Request $request)  {
        $id = $request->input('id_usersswasta');

        $med_usersswasta = med_usersswasta::where('id_usersswasta',$id)->first();

        if ($med_usersswasta)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_usersswasta
            ],200);
        }
    }

    public function list()  {
        $med_usersswasta = med_usersswasta::all();

        if ($med_usersswasta)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_usersswasta
            ],200);
        }
        
    }
    
    public function editprofile(Request $request)    {
        $id = $request->input('id_usersswasta');
        $nama_majikan = $request->input('nama_majikan');
        $jawatan = $request->input('jawatan');
        $updated_by = $request->input('updated_by');

        $med_usersswasta = med_usersswasta:: where('id_usersswasta', $id) -> update([
            'nama_majikan' => $nama_majikan,
            'jawatan' => $jawatan,
            'updated_by' => $updated_by
        ]);

        if ($med_usersswasta)  {
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
}
