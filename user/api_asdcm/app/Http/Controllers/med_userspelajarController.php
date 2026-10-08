<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_userspelajar;

class med_userspelajarController extends Controller
{

    public function register(Request $request) {
        $FK_users = $request->input('FK_users');
        if (!$this->canActForUser($request, $FK_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $nama_sekolah = $request->input('nama_sekolah');
        $statusrekod = $request->input('statusrekod');

        $register = med_userspelajar::create([
            'FK_users' => $FK_users,
            'nama_sekolah' => $nama_sekolah,
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
        $id = $request->input('id_userspelajar');

        $med_userspelajar = med_userspelajar::where('id_userspelajar',$id)
            ->first($this->responseFields());

        if ($med_userspelajar)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_userspelajar
            ],200);
        }
    }

    public function list()  {
        $med_userspelajar = med_userspelajar::get($this->responseFields());

        if ($med_userspelajar)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_userspelajar
            ],200);
        }
        
    }
    
    public function editprofile(Request $request)    {
        $id = $request->input('id_userspelajar');
        $profile = med_userspelajar::where('id_userspelajar', $id)
            ->first(['id_userspelajar', 'FK_users']);
        if (!$profile || !$this->canActForUser($request, $profile->FK_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $nama_sekolah = $request->input('nama_sekolah');
        $updated_by = $request->input('updated_by');

        $med_userspelajar = med_userspelajar:: where('id_userspelajar', $id) -> update([
            'nama_sekolah' => $nama_sekolah,
            'updated_by' => $updated_by
        ]);
        if ($med_userspelajar)  {
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

    private function responseFields(): array
    {
        return [
            'id_userspelajar', 'FK_users', 'FK_kategori_pengguna',
            'alamat1_rumah', 'alamat2_rumah', 'poskod_rumah', 'daerah_rumah',
            'negeri_rumah', 'negara_rumah', 'nama_sekolah', 'alamat1_sekolah',
            'alamat2_sekolah', 'poskod_sekolah', 'daerah_sekolah',
            'negeri_sekolah', 'statusrekod',
        ];
    }
}
