<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_gelaran;

class med_gelaranController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }
    
    public function register(Request $request) {
        $nama_gelaran = $request->input('nama_gelaran');
        $created_by = $request->input('created_by');
        $updated_by = $request->input('updated_by');

        $gelarans = med_gelaran::where('nama_gelaran',$nama_gelaran)->first();

        if ($gelarans)   {
            return response()->json([
                'success'=>false,
                'message'=>'Gagal!',
                'data'=>'Maklumat telah didaftarkan'
            ],201);
        } else {
            $register = med_gelaran::create([
                'nama_gelaran' => $nama_gelaran,
                'created_by' => $created_by,
                'updated_by' => $updated_by
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
                    'message'=>'Register Failed!',
                    'data'=>$register
                ],405);
            }
        } 
    }

    public function show(Request $request)  {
        $id = $request->input('id_gelaran');

        $gelarans = med_gelaran::where('id_gelaran',$id)->first();

        if ($gelarans)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$gelarans
            ],201);
        }
    }

    public function showHrmis(Request $request)  {
        $nama_gelaran = $request->input('nama_gelaran');

        $gelarans = med_gelaran::where('nama_gelaran',$nama_gelaran)->first();

        if ($gelarans)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$gelarans
            ],201);
        }
    }

    public function list()  {
        $gelarans = med_gelaran::where('statusrekod','1') -> get(); // list all data

        if ($gelarans)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$gelarans
            ],200);
        }
        
    }

    public function listall()  {
        $gelarans = med_gelaran::get(); // list all data

        if ($gelarans)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$gelarans
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id_gelaran');
        $nama_gelaran = $request->input('nama_gelaran');
        $updated_by = $request->input('updated_by');

        $gelarans = med_gelaran::where('nama_gelaran',$nama_gelaran)->first();

        if ($gelarans)   {
            return response()->json([
                'success'=>false,
                'message'=>'Gagal!',
                'data'=>'Maklumat telah didaftarkan'
            ],201);
        } else {
            $gelarans = med_gelaran::find($id); 

            $gelarans -> update([
                'nama_gelaran' => $nama_gelaran,
                'updated_by' => $updated_by
            ]);

            if ($gelarans)  {
                return response()->json([
                    'success'=>true,
                    'message'=>"Kemaskini Berjaya!",
                    'data' => $gelarans
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

    public function delete(Request $request)    {
        $id = $request->input('id_gelaran');

        $gelarans = med_gelaran::find($id); 

        switch($gelarans->statusrekod)    {
            case 0: $gelarans -> update([
                        'statusrekod' => '1',
                    ]);
                    break;
            case 1: $gelarans -> update([
                        'statusrekod' => '0',
                    ]);
                    break;
        }

        if ($gelarans)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Padam!",
                'data' => $gelarans
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
}
