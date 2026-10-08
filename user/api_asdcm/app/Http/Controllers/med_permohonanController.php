<?php

namespace App\Http\Controllers;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\med_permohonan;
use App\Models\med_users;
use App\Models\med_tetapan;
use Illuminate\Support\Facades\File;
use ZipArchive;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PDO;

class med_permohonanController extends Controller
{
    public function register(Request $request) {
        $FK_users = $request->input('FK_users');
        if (!$this->canActForUser($request, $FK_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $sebab = $request->input('sebab');
        $FK_program = $request->input('FK_program');
        $status_permohonan = $request->input('status_permohonan');
        $tarikh_permohonan = $request->input('tarikh_permohonan');
        $media_list = $request->input('media_list');
        $created_by = $request->input('created_by'); 
        $updated_by = $request->input('updated_by'); 
        $statusrekod = $request->input('statusrekod');
        $flag_vip = $request->input('flag_vip');

        if (!$this->isAdministrator($request)) {
            $status_permohonan = '1';
            $created_by = $request->user()->id_users;
            $updated_by = $request->user()->id_users;
        }

        $register = med_permohonan::create([
            'FK_users' => $FK_users,
            'sebab' => $sebab,
            'FK_program' => $FK_program,
            'status_permohonan' => $status_permohonan,
            'tarikh_permohonan' => $tarikh_permohonan,
            'media_list' => $media_list,
            'created_by' => $created_by,
            'updated_by' => $updated_by,
            'statusrekod' => $statusrekod,
            'flag_vip' => $flag_vip,
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
        $id = $request->input('id_permohonan');

        $med_permohonan = med_permohonan::where('id_permohonan',$id)
            ->first($this->applicationRecordColumns());

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_permohonan
            ],200);
        }
    }

    public function showGet($id)  {
        if (!$this->canAccessApplication(request(), $id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $med_permohonan = med_permohonan::select($this->applicationListColumns()) ->
                                            join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') ->
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') ->
                                            leftJoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                            leftJoin('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') ->
                                            where('med_permohonan.id_permohonan',$id)->first();


        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_permohonan
            ],200);
        }
    }

    public function showGetUsers($FK_users)  {
        if (!$this->canActForUser(request(), $FK_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $med_permohonan = med_permohonan::select($this->applicationListColumns()) ->
                                            join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') ->
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') ->
                                            leftJoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                            join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') ->
                                            where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.FK_users',$FK_users)->
                                            orderBy('id_permohonan', 'desc') -> get();

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$med_permohonan
            ],200);
        }
    }

    public function showGetUsersNotification($FK_users)  {
        if (!$this->canActForUser(request(), $FK_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $med_permohonan = med_permohonan::select($this->applicationListColumns()) ->
                                            join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') ->
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') -> 
                                            join('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                            join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                            where('med_permohonan.FK_users',$FK_users) ->
                                            whereIn('med_permohonan.status_permohonan', ['2', '3']) ->
                                            orderBy('id_permohonan', 'desc') ->
                                            get(); // list all data

                                            

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function list()  {
        $med_permohonan = med_permohonan::select($this->applicationListColumns())
                                            ->leftjoin('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users')
                                            ->leftJoin('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program')
                                            ->leftJoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus')
                                            ->leftJoin('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan')
                                            ->leftJoin('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna')
                                            ->where('med_users.statusrekod', '1')
                                            ->where('med_permohonan.statusrekod', '1')
                                            ->orderBy('id_permohonan', 'desc')
                                            ->get();
                

        if (sizeof($med_permohonan)>0)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    
    public function laporan_permohonan(Request $request) {
        $FK_jenis_pengguna = $request->input('FK_jenis_pengguna');
        $FK_status = $request->input('FK_status');
        $tahun_permohonan = $request->input('tahun_permohonan');
        $tarikh_permohonan = $request->input('tarikh_permohonan');

    
        $query = med_permohonan::select($this->applicationReportColumns())
                                ->leftJoin('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users')
                                ->leftJoin('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program')
                                ->leftJoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus')
                                ->leftJoin('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan')
                                ->leftJoin('med_jenispengguna', 'med_jenispengguna.id_jenispengguna', '=', 'med_users.FK_jenis_pengguna');
    
        if ($FK_jenis_pengguna) {
            $query->where('med_users.FK_jenis_pengguna', $FK_jenis_pengguna);
        }

        if ($FK_status) {
            $query->where('med_permohonan.status_permohonan', $FK_status);
        }
    
        if ($tahun_permohonan) {
            $query->whereYear('med_permohonan.tarikh_permohonan', $tahun_permohonan);
        }
    
        if ($tarikh_permohonan) {
            $query->whereDate('med_permohonan.tarikh_permohonan', $tarikh_permohonan);
        }
        
        $med_permohonan = $query->where('med_users.statusrekod', '1')
                                ->where('med_permohonan.statusrekod', '1')
                                ->orderBy('med_permohonan.id_permohonan', 'desc')
                                ->get();


        if ($med_permohonan) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $med_permohonan
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No records found.',
                'data' => []
            ], 404);
        }
    }
    



    public function listStatistik()  {
        $med_permohonan = med_permohonan::  select(med_permohonan::raw("count(id_permohonan) as bil_permohonan"), med_permohonan::raw("substr(tarikh_permohonan,6,2) as bulan")) ->
                                            groupBy('bulan')->
                                            orderBy('bulan', 'asc') ->
                                            get(); // list all data

                                            

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function listPermohonanGraf($bulan)  {
        $med_permohonan = med_permohonan::  select(med_permohonan::raw("count(id_permohonan) as bil_permohonan"), med_permohonan::raw("substr(tarikh_permohonan,9,2) as hb")) ->
                                            where(med_permohonan::raw("substr(tarikh_permohonan,6,2)"), '=', $bulan)->
                                            groupBy('hb')->
                                            orderBy('hb', 'asc') ->
                                            get(); // list all data

                                            

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function listFilter($FK_peranan,$FK_kluster)  {

        $med_permohonan = '';
        if($FK_peranan == 2){
            $med_permohonan = med_permohonan::select($this->applicationListColumns()) ->
                                                join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') ->
                                                join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') ->
                                                leftJoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                                join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                                where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.statusrekod','1') -> 
                                                where('med_program.FK_kluster',$FK_kluster) ->
                                                where('med_permohonan.flag_vip',0) ->
                                                orderBy('id_permohonan', 'desc') ->
                                                get(); // list all data
        }else if($FK_peranan == 3){
            $med_permohonan = med_permohonan::select($this->applicationListColumns()) ->
                                                join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') ->
                                                join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') ->
                                                leftJoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                                join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                                where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.statusrekod','1') -> 
                                                // where('med_permohonan.flag_vip',1) ->
                                                orderBy('id_permohonan', 'desc') ->
                                                get(); // list all data
        }
        

        if (sizeof($med_permohonan)>0)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        } else {
            return response()->json([
                'success'=>false,
                'message'=>"List Failed!",
                'data'=>''
            ],400);
        }
        
    }

    public function listtahun()  {
        $med_programs = med_permohonan::select(med_permohonan::raw("substr(tarikh_permohonan,1,4) as tahun")) -> 
                        groupBy('tahun')->
                        get(); // list all data

        if ($med_programs)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_programs
            ],200);
        }
        
    }

    public function listStatus($status_permohonan)  {
        $med_permohonan = med_permohonan::select($this->applicationListColumns()) ->
                                            join('med_users', 'med_users.id_users', '=', 'med_permohonan.FK_users') ->
                                            join('med_program', 'med_program.id_program', '=', 'med_permohonan.FK_program') ->
                                            leftJoin('med_kampus', 'med_kampus.id_kampus', '=', 'med_program.FK_kampus') ->
                                            join('med_status', 'med_status.id_status', '=', 'med_permohonan.status_permohonan') -> 
                                            where('med_permohonan.statusrekod','1') -> where('med_users.statusrekod','1') -> where('med_permohonan.statusrekod','1') -> 
                                            where('med_permohonan.status_permohonan',$status_permohonan) -> 
                                            orderBy('id_permohonan', 'desc') ->
                                            get(); // list all data

        if ($med_permohonan)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$med_permohonan
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $validator = Validator::make($request->all(), [
            'id_permohonan' => 'required',
            'tarikh_luput' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 200);
        }

        $id = $request->input('id_permohonan');
        $status_permohonan = $request->input('status_permohonan');
        $catatan_permohonan = $request->input('catatan_permohonan');
        $tarikh_pengesahan = $request->input('tarikh_pengesahan');
        $tarikh_luput = $request->input('tarikh_luput');
        $tempoh = $request->input('tempoh');
        $pegawai_pelulus = $request->input('pegawai_pelulus');
        $updated_by = $request->input('updated_by');

        $med_permohonan = med_permohonan::where('id_permohonan',$id)-> update([
            'status_permohonan' => $status_permohonan,
            'catatan_permohonan' => $catatan_permohonan,
            'tarikh_pengesahan' => $tarikh_pengesahan,
            'tarikh_luput' => $tarikh_luput,
            'pegawai_pelulus' => $pegawai_pelulus,
            'updated_by' => $updated_by
        ]);
        $date = Carbon::createFromFormat('Y-m-d', $tarikh_luput);
        $tarikh_luput = $date->addDays($tempoh);
        
        $med_permohonan = med_permohonan::where('id_permohonan',$id)-> update([
            'tarikh_luput' => $tarikh_luput,
        ]);

        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_permohonan
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

    public function updatePermohonan(Request $request)    {
        $id = $request->input('id_permohonan');
        if (!$this->canAccessApplication($request, $id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $sebab = $request->input('sebab');
        $updated_by = $request->user()->id_users;

        $med_permohonan = med_permohonan::where('id_permohonan',$id)-> update([
            'sebab' => $sebab,
            'updated_by' => $updated_by
        ]);


        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_permohonan
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

    public function updateLuput(Request $request)    {
        $id = $request->input('id_permohonan');
        if (!$this->canAccessApplication($request, $id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $status_permohonan = $request->input('status_permohonan');
        if (!$this->isAdministrator($request) && (string) $status_permohonan !== '5') {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $med_permohonan = med_permohonan::where('id_permohonan',$id) -> update([
            'status_permohonan' => $status_permohonan
        ]);

        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Kemaskini Berjaya!",
                'data' => $med_permohonan
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
        $id = $request->input('id_permohonan');

        $med_permohonan = med_permohonan::where('id_permohonan',$id) -> update([
            'statusrekod' => '0',
        ]);

        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Padam!",
                'data' => $med_permohonan
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

    public function cancel(Request $request)    {
        $id = $request->input('id_permohonan');
        if (!$this->canAccessApplication($request, $id)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $med_permohonan = med_permohonan::where('id_permohonan',$id) -> update([
            'status_permohonan' => '4',
        ]);

        if ($med_permohonan)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Batal!",
                'data' => $med_permohonan
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Gagal Batal!",
                'data'=>''
            ],404);
        }
    }

    //MIMI : ZIP & DOWNLOAD SELECTED FILE START
    public function download (Request $request){
        
        $count = 0;
        $id_permohonan = $request->input('id_permohonan');
        $tarikh_muatturun = date('Ymd');

        $med_muatturun = med_permohonan::where('id_permohonan',$id_permohonan)
            ->first(['id_permohonan', 'FK_program', 'FK_users', 'media_list']);
        if (!$med_muatturun || !$this->canActForUser($request, $med_muatturun->FK_users)) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $FK_program = $med_muatturun->FK_program;
        $FK_users = $med_muatturun->FK_users;
        $media_list = $med_muatturun->media_list;
        $media_item = explode(",", $media_list);

        $zip = new ZipArchive;

        $fileName = $tarikh_muatturun.'_'.$FK_program.'_'.$FK_users.'.zip';
        if($zip->open('uploads/'.$fileName,ZipArchive::CREATE) === TRUE)
        {
            
            $files = File::files('uploads');
            foreach($files as $key => $value){
                
                foreach($media_item as $key_item => $value_item){
                
                    $relativeNameInZipFile = basename($value);
                    
                    if(strcmp($value_item,$relativeNameInZipFile) == '0'){
                    
                        $zip->addFile($value,$relativeNameInZipFile);
                        ++$count;
                    }
                }

            }
            
            $zip->close();
            
        }
        
        if ($count > 0)  {
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Muatturun!",
                'data' => $fileName
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Gagal Padam!",
                'data'=>$fileName
            ],200);
        }
    }
    //MIMI : ZIP & DOWNLOAD SELECTED FILE END

    //MIMI : REMOVE ZIP FILE START
    public function remove (Request $request){
        
        $file_name = basename((string) $request->input('file_name'));
        if (!preg_match('/_(\d+)\.zip$/', $file_name, $matches)
            || !$this->canActForUser($request, (int) $matches[1])) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }
        $publicPath = base_path('public/uploads/' . $file_name);

        if(File::exists($publicPath)){
            File::delete($publicPath);
        }else{
            return response()->json([
                'success'=>false,
                'message'=>"Muatturun Tidak Berjaya!",
            ],200);
        }

        return response()->json([
            'success'=>true,
            'message'=>"Berjaya Muatturun!",
        ],200);
        
    }

    private function applicationRecordColumns(): array
    {
        return [
            'id_permohonan', 'FK_users', 'sebab', 'media_list', 'FK_program',
            'status_permohonan', 'tarikh_permohonan', 'tarikh_pengesahan',
            'tarikh_luput', 'catatan_permohonan', 'flag_vip', 'statusrekod',
        ];
    }

    private function applicationListColumns(): array
    {
        return [
            'med_permohonan.id_permohonan',
            'med_permohonan.FK_users',
            'med_permohonan.sebab',
            'med_permohonan.media_list',
            'med_permohonan.FK_program',
            'med_permohonan.status_permohonan',
            'med_permohonan.tarikh_permohonan',
            'med_permohonan.tarikh_pengesahan',
            'med_permohonan.tarikh_luput',
            'med_permohonan.catatan_permohonan',
            'med_permohonan.flag_vip',
            'med_users.nama',
            'med_program.id_program',
            'med_program.nama_program',
            'med_program.tarikh_program',
            'med_program.media_path',
            'med_program.FK_vip',
            'med_kampus.nama_kampus',
            'med_status.nama_status',
        ];
    }

    private function applicationReportColumns(): array
    {
        return [
            'med_permohonan.id_permohonan',
            'med_permohonan.tarikh_permohonan',
            'med_users.nama',
            'med_program.id_program',
            'med_program.nama_program',
            'med_program.tarikh_program',
            'med_program.statusrekod AS programstatusrekod',
            'med_status.nama_status',
            'med_jenispengguna.jenis_pengguna',
        ];
    }

    private function canAccessApplication(Request $request, $applicationId): bool
    {
        $application = med_permohonan::where('id_permohonan', $applicationId)
            ->first(['FK_users']);

        return $application
            && $this->canActForUser($request, $application->FK_users);
    }
    //MIMI : REMOVE ZIP FILE END
}
