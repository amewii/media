<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_capaian;
use App\Models\med_usersgov;

class med_capaianController extends Controller
{
    public function register(Request $request) {
        $FK_peranan = $request->input('FK_peranan');
        $FK_users = $request->input('FK_users');
        $FK_kampus = $request->input('FK_kampus');
        $FK_kluster = $request->input('FK_kluster');
        $FK_subkluster = $request->input('FK_subkluster');
        $FK_unit = $request->input('FK_unit');
        $created_by = $request->input('created_by');
        $updated_by = $request->input('updated_by');
        $statusrekod = "1";

        $checkexist = med_capaian::where('med_capaian.FK_users',$FK_users)
            ->orderBy('id_capaian', 'asc')
            ->first(['id_capaian']);
        $isNew = !$checkexist;

        if ($isNew)   {
            $register = med_capaian::create([
                'FK_kampus' => $FK_kampus,
                'FK_kluster' => $FK_kluster,
                'FK_subkluster' => $FK_subkluster,
                'FK_unit' => $FK_unit,
                'FK_peranan' => $FK_peranan,
                'FK_users' => $FK_users,
                'created_by' => $created_by,
                'updated_by' => $updated_by,
                'statusrekod' => $statusrekod
            ]);
        } else  {
            med_capaian::where('id_capaian', $checkexist->id_capaian)->update([
                'FK_kampus' => $FK_kampus,
                'FK_kluster' => $FK_kluster,
                'FK_subkluster' => $FK_subkluster,
                'FK_unit' => $FK_unit,
                'FK_peranan' => $FK_peranan,
                'updated_by' => $updated_by,
                'statusrekod' => $statusrekod
            ]);
            $register = med_capaian::where('id_capaian', $checkexist->id_capaian)
                ->first($this->responseColumns());
        }

        if ($register)  {
            return response()->json([
                'success'=>true,
                'message'=>$isNew ? 'Pendaftaran Rekod Berjaya!' : 'Rekod capaian berjaya dikemas kini.',
                'data'=>$register,
                'created'=>$isNew,
            ],201);
        }

        else    {
            return response()->json([
                'success'=>false,
                'message'=>'Register Failed',
                'data'=>$register
            ],406);
        }
    }

    public function show(Request $request)  {
        $id = $request->input('id_capaian');

        $med_capaian = med_capaian::where('id_capaian',$id)
            ->first($this->responseColumns());

        if ($med_capaian)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$med_capaian
            ],201);
        }
    }

    public function showGet($FK_users)  {

        $med_capaian = med_capaian::select(
                            'med_capaian.id_capaian', 'med_capaian.FK_peranan',
                            'med_capaian.FK_kampus', 'med_capaian.FK_kluster',
                            'med_capaian.FK_subkluster', 'med_capaian.FK_unit',
                            'med_capaian.FK_users',
                            'med_capaian.statusrekod AS med_capaianstatusrekod',
                            'med_peranan.nama_peranan'
                        ) ->
                            join('med_peranan', 'med_peranan.id_peranan', '=', 'med_capaian.FK_peranan') -> 
                            where('FK_users',$FK_users)->first();

        if ($med_capaian)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$med_capaian
            ],201);
        }
    }

    public function list()  {
        $med_capaian = med_capaian::select(
                            'med_capaian.id_capaian', 'med_capaian.FK_peranan',
                            'med_capaian.FK_kampus', 'med_capaian.FK_kluster',
                            'med_capaian.FK_subkluster', 'med_capaian.FK_unit',
                            'med_capaian.FK_users',
                            'med_capaian.statusrekod AS med_capaianstatusrekod',
                            'med_users.nama', 'med_peranan.nama_peranan'
                        ) ->
                            join('med_users', 'med_users.id_users', '=', 'med_capaian.FK_users') -> 
                            join('med_peranan', 'med_peranan.id_peranan', '=', 'med_capaian.FK_peranan') -> 
                            where('med_capaian.statusrekod','1') -> get(); // list all data

        if ($med_capaian)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$med_capaian
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id_capaian');
        $FK_peranan = $request->input('FK_peranan');
        $FK_kampus = $request->input('FK_kampus');
        $FK_kluster = $request->input('FK_kluster');
        $FK_subkluster = $request->input('FK_subkluster');
        $FK_unit = $request->input('FK_unit');
        $FK_users = $request->input('FK_users');
        $updated_by = $request->input('updated_by');

        $med_capaian = med_capaian::where('id_capaian',$id) -> update([
            'FK_peranan' => $FK_peranan,
            'FK_users' => $FK_users,
            'updated_by' => $updated_by
        ]);

        $med_usersgov = med_usersgov::where('FK_users', $FK_users) -> update([
            'FK_kampus' => $FK_kampus,
            'FK_kluster' => $FK_kluster,
            'FK_subkluster' => $FK_subkluster,
            'FK_unit' => $FK_unit,
            'updated_by' => $updated_by
        ]);


        if ($med_capaian)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_capaian
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

    public function delete(Request $request)    {
        $id = $request->input('id_capaian');

        $med_capaian_search = med_capaian::where('id_capaian',$id)
            ->first(['id_capaian', 'statusrekod']);
        switch($med_capaian_search->statusrekod)    {
            case 0: $med_capaian = med_capaian::where('id_capaian',$id) -> update([
                        'statusrekod' => '1',
                    ]);
                    break;
            case 1: $med_capaian = med_capaian::where('id_capaian',$id) -> update([
                        'statusrekod' => '0',
                    ]);
                    break;
        }
        $med_capaian_search = med_capaian::where('id_capaian',$id)
            ->first(['id_capaian', 'statusrekod']);
        
        if ($med_capaian)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Padam!",
                'data' => $med_capaian_search
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

    public function showbyID($idcapaian)    {

        $med_capaian = med_capaian::where('id_capaian',$idcapaian)
            ->first($this->responseColumns());
      
        
        if ($med_capaian)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Padam!",
                'data' => $med_capaian
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

    private function responseColumns(): array
    {
        return [
            'id_capaian', 'FK_peranan', 'FK_kampus', 'FK_kluster',
            'FK_subkluster', 'FK_unit', 'FK_users', 'statusrekod',
        ];
    }
}
