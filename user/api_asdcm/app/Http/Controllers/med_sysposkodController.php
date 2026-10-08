<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\med_sysposkod;

class med_sysposkodController extends Controller
{
    public function show(Request $request, $poskod)  {

        $med_sysposkod = med_sysposkod::join('med_sys_negeri', 'med_sys_negeri.id_sys_negeri', '=', 'med_sysposkod.negeri')
            ->where('poskod',$poskod)
            ->first([
                'med_sysposkod.poskod', 'med_sysposkod.bandar',
                'med_sys_negeri.nama', 'med_sys_negeri.kodnegara',
            ]);

        if ($med_sysposkod)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$med_sysposkod
            ],201);
        }
    }

    public function list()  {
        $med_sysposkod = med_sysposkod::join('med_sys_negeri', 'med_sys_negeri.id_sys_negeri', '=', 'med_sysposkod.negeri')
            ->where('med_sysposkod.statusrekod','1')
            ->get([
                'med_sysposkod.id_sysposkod', 'med_sysposkod.poskod', 'med_sysposkod.bandar',
                'med_sys_negeri.nama', 'med_sys_negeri.kodnegara',
            ]);

        if ($med_sysposkod)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Berjaya!',
                'data'=>$med_sysposkod
            ],200);
        }
        
    }
}
