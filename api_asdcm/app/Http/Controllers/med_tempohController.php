<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_tempoh;

class med_tempohController extends Controller
{
    // public function __construct()
    // {
    //     $this -> middleware('auth');
    // }

    public function register(Request $request) {
        $tempoh = $request->input('tempoh');
        $created_by = $request->input('created_by'); // Pakai IC
        $updated_by = $request->input('updated_by'); // Pakai IC
        $statusrekod = $request->input('statusrekod');

        $register = med_tempoh::create([
            'tempoh' => $tempoh,
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
                'message'=>'Register Failed!',
                'data'=>$register
            ],400);
        }
    }

    public function show(Request $request)  {
        $id = $request->input('id');

        $med_tempoh = med_tempoh::where('id_tempoh',$id)->first();

        if ($med_tempoh)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_tempoh
            ],200);
        }
    }

    public function showGet(Request $request, $id)  {
        // $id = $request->input('id');

        $med_tempoh = med_tempoh::where('id_tempoh',$id)->first();

        if ($med_tempoh)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_tempoh
            ],200);
        }
    }

    public function list()  {
        $med_tempoh = med_tempoh::where('statusrekod','1') -> get();

        if ($med_tempoh)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_tempoh
            ],200);
        }
        
    }

    public function listAll()  {
        $med_tempoh = med_tempoh::select('*') -> get();

        if ($med_tempoh)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_tempoh
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id_tempoh');
        $tempoh = $request->input('tempoh');
        $updated_by = $request->input('updated_by');

        $med_tempoh_check = med_tempoh::where('tempoh',$tempoh) -> first(); 

        if ($med_tempoh_check)  {
            return response()->json([
                'success'=>false,
                'message'=>"Gagal! Data Telah Wujud.",
                'data'=>''
            ],200);
        } else  {
            $med_tempoh = med_tempoh::where('id_tempoh',$id) -> update([
                'tempoh' => $tempoh,
                'updated_by' => $updated_by
            ]);
    
            if ($med_tempoh)  {
                return response()->json([
                    'success'=>true,
                    'message'=>"Kemaskini Berjaya!",
                    'data' => $med_tempoh
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
        $id = $request->input('id_tempoh');

        $med_status_search = med_tempoh::where('id_tempoh',$id) -> first(); 

        switch($med_status_search->statusrekod)    {
            case 0: $med_format = med_tempoh::where('id_tempoh', $id) -> update([
                        'statusrekod' => '1',
                        'tempoh' => $med_status_search->tempoh_prev,
                        'tempoh_prev' => '0',
                    ]);
                    break;
            case 1: $med_format = med_tempoh::where('id_tempoh', $id) -> update([
                        'statusrekod' => '0',
                        'tempoh_prev' => $med_status_search->tempoh,
                        'tempoh' => '0',
                    ]);
                    break;
        }

        $med_status_search = med_tempoh::where('id_tempoh',$id) -> first(); 

        if ($med_format)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Ubah!",
                'data' => $med_status_search
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
