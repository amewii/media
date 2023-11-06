<?php

//nama file sebelum gabung (lain api)
/// masalah yang tak dapat dikenalpasti

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('key', function () {
    return MD5('ASDCM-PROTIGAT');
});

//Daripada api_auth_asdm

$router->post('/login','authController@login');
$router->post('/loginUser','authController@loginUser');
$router->post('/checkUsers', 'authController@show');
$router->post('/registerSiteAwam', 'authController@register');


//Daripada api_pentadbir

// med_users api

$router->post('/addUsers', 'med_usersController@register');
$router->post('/users', 'med_usersController@show');
$router->post('/usersIcEmel', 'med_usersController@showIcEmel');
$router->post('/usersSemakKatalaluan', 'med_usersController@checkpassword');
$router->post('/usersReset', 'med_usersController@resetpassword');
$router->post('/usersResetToEmail', 'med_usersController@resetpasswordtomail');
$router->get('/usersResetKatalaluan/{resetkatalaluan}', 'med_usersController@showGetResetKatalaluan');
$router->post('/usersResetPassword', 'med_usersController@resetpassword');
$router->get('/usersSiteAdmin/{no_kad_pengenalan}', 'med_usersController@showSiteAdmin');
$router->get('/usersGetIc/{no_kad_pengenalan}', 'med_usersController@showGetIc');
$router->get('/usersList', 'med_usersController@list');
$router->get('/usersgovsIntanList', 'med_usersController@listIntan');
$router->get('/usersgovsIntan/{no_kad_pengenalan}', 'med_usersController@listIntanGetIc');
$router->get('/usersgovsLuarList', 'med_usersController@listLuar');
$router->get('/usersswastaList', 'med_usersController@listSwasta');
$router->get('/userspelajarList', 'med_usersController@listPelajar');
$router->get('/usersListAll', 'med_usersController@listAll');
$router->get('/usersListPentadbir', 'med_usersController@listPentadbir');
$router->get('/usersListPentadbir/byPeranan/{peranan}', 'med_usersController@listPentadbirbyPeranan');
$router->get('/usersListKerajaan', 'med_usersController@listKerajaan');
$router->get('/usersListKerajaan/{FK_users}', 'med_usersController@listKerajaanSingle');
$router->get('/usersEditProfile/{FK_users}', 'med_usersController@listUsersEditProfile');
$router->get('/usersListSwasta', 'med_usersController@listSwasta');
$router->get('/usersListPelajar', 'med_usersController@listPelajar');
$router->post('/usersUpdate', 'med_usersController@update'); //setting tambah baru
$router->post('/usersEditProfile', 'med_usersController@editprofile'); //setting tambah baru
$router->post('/usersDelete', 'med_usersController@delete');

// med_usersgov api

$router->post('/addUsersgovs', 'med_usersgovController@register');
$router->post('/usersgovs', 'med_usersgovController@show');
$router->get('/usersgovsList', 'med_usersgovController@list');
$router->post('/usersgovsUpdate', 'med_usersgovController@update'); //setting tambah baru
$router->post('/usersgovsEditProfile', 'med_usersgovController@editprofile'); //setting tambah baru
$router->post('/usersgovsDelete', 'med_usersgovController@delete');

// med_usersswastas api

$router->post('/addUserswastas', 'med_usersswastaController@register');
$router->post('/userswastas', 'med_usersswastaController@show');
$router->get('/userswastasList', 'med_usersswastaController@list');
$router->post('/userswastasUpdate', 'med_usersswastaController@update'); //setting tambah baru
$router->post('/userswastasEditProfile', 'med_usersswastaController@editprofile'); //setting tambah baru
$router->post('/userswastasDelete', 'med_usersswastaController@delete');

// med_userspelajar api

$router->post('/addUserspelajars', 'med_userspelajarController@register');
$router->post('/userspelajars', 'med_userspelajarController@show');
$router->get('/userspelajarsList', 'med_userspelajarController@list');
$router->post('/userspelajarsUpdate', 'med_userspelajarController@update'); //setting tambah baru
$router->post('/userspelajarsEditProfile', 'med_userspelajarController@editprofile'); //setting tambah baru
$router->post('/userspelajarsDelete', 'med_userspelajarController@delete');

// med_kategoriperkhidmatan api

$router->post('/addKategoriperkhidmatans', 'med_kategoriperkhidmatanController@register');
$router->post('/kategoriperkhidmatans', 'med_kategoriperkhidmatanController@show');
$router->post('/kategoriperkhidmatansHrmis', 'med_kategoriperkhidmatanController@showHrmis');
$router->get('/kategoriperkhidmatansList', 'med_kategoriperkhidmatanController@list');
$router->post('/kategoriperkhidmatansUpdate', 'med_kategoriperkhidmatanController@update'); //setting tambah baru
$router->post('/kategoriperkhidmatansDelete', 'med_kategoriperkhidmatanController@delete');

// med_skim api

$router->post('/addSkims', 'med_skimController@register');
$router->post('/skims', 'med_skimController@show');
$router->get('/skimsList', 'med_skimController@list');
$router->post('/skimsUpdate', 'med_skimController@update'); //setting tambah baru
$router->post('/skimsDelete', 'med_skimController@delete');

// med_gred api

$router->post('/addGreds', 'med_gredController@register');
$router->post('/greds', 'med_gredController@show');
$router->get('/gredsList', 'med_gredController@list');
$router->post('/gredsUpdate', 'med_gredController@update'); //setting tambah baru
$router->post('/gredsDelete', 'med_gredController@delete');

// med_tarafjawatan api

$router->post('/addTarafjawatans', 'med_tarafjawatanController@register');
$router->post('/tarafjawatans', 'med_tarafjawatanController@show');
$router->get('/tarafjawatansList', 'med_tarafjawatanController@list');
$router->post('/tarafjawatansUpdate', 'med_tarafjawatanController@update'); //setting tambah baru
$router->post('/tarafjawatansDelete', 'med_tarafjawatanController@delete');

// med_jenispengguna api

$router->post('/addJenispenggunas', 'med_jenispenggunaController@register');
$router->post('/jenispenggunas', 'med_jenispenggunaController@show');
$router->get('/jenispenggunasList', 'med_jenispenggunaController@list');
$router->post('/jenispenggunasUpdate', 'med_jenispenggunaController@update'); //setting tambah baru
$router->post('/jenispenggunasDelete', 'med_jenispenggunaController@delete');

// med_jenisperkhidmatan api

$router->post('/addJenisperkhidmatans', 'med_jenisperkhidmatanController@register');
$router->post('/jenisperkhidmatans', 'med_jenisperkhidmatanController@show');
$router->get('/jenisperkhidmatansList', 'med_jenisperkhidmatanController@list');
$router->post('/jenisperkhidmatansUpdate', 'med_jenisperkhidmatanController@update'); //setting tambah baru
$router->post('/jenisperkhidmatansDelete', 'med_jenisperkhidmatanController@delete');

// med_tetapan api

$router->post('/addTetapans', 'med_tetapanController@register');
$router->post('/tetapans', 'med_tetapanController@show');
$router->get('/tetapansList', 'med_tetapanController@list');
$router->post('/tetapansUpdate', 'med_tetapanController@update'); //setting tambah baru
$router->post('/tetapansDelete', 'med_tetapanController@delete');

// med_peranan api

$router->post('/addPeranan', 'med_perananController@register');
$router->post('/peranan', 'med_perananController@show');
$router->get('/perananList', 'med_perananController@list');
$router->post('/perananUpdate', 'med_perananController@update'); //setting tambah baru
$router->post('/perananDelete', 'med_perananController@delete');

// med_capaian api

$router->post('/addCapaian', 'med_capaianController@register');
$router->post('/capaian', 'med_capaianController@show');
$router->get('/capaian/{FK_users}', 'med_capaianController@showGet');
$router->get('/capaianList', 'med_capaianController@list');
$router->post('/capaianUpdate', 'med_capaianController@update'); //setting tambah baru
$router->post('/capaianDelete', 'med_capaianController@delete');
$router->get('/showbyID/{idcapaian}', 'med_capaianController@showbyID');

//Daripada api_public


// med_kampus api

$router->post('/addKampus', 'med_kampusController@register');
$router->post('/kampus', 'med_kampusController@show');
$router->get('/kampusList', 'med_kampusController@list');
$router->get('/kampusListAll', 'med_kampusController@listall');
$router->post('/kampusUpdate', 'med_kampusController@update'); //setting tambah baru
$router->post('/kampusDelete', 'med_kampusController@delete');

// med_gelaran api

$router->post('/addGelarans', 'med_gelaranController@register');
$router->post('/gelarans', 'med_gelaranController@show');
$router->post('/gelaransHrmis', 'med_gelaranController@showHrmis');
$router->get('/gelaransList', 'med_gelaranController@list');
$router->get('/gelaransListAll', 'med_gelaranController@listall');
$router->post('/gelaransUpdate', 'med_gelaranController@update'); //setting tambah baru
$router->post('/gelaransDelete', 'med_gelaranController@delete');

// med_kluster api

$router->post('/addKlusters', 'med_klusterController@register');
$router->post('/klusters', 'med_klusterController@show');
$router->get('/klusters/{FK_kampus}', 'med_klusterController@showGet');
$router->get('/klustersList', 'med_klusterController@list');
$router->post('/klustersUpdate', 'med_klusterController@update'); //setting tambah baru
$router->post('/klustersDelete', 'med_klusterController@delete');

// med_subkluster api

$router->post('/addSubklusters', 'med_subklusterController@register');
$router->post('/subklusters', 'med_subklusterController@show');
$router->get('/subklusters/{FK_kluster}', 'med_subklusterController@showGet');
$router->get('/subklustersList', 'med_subklusterController@list');
$router->post('/subklustersUpdate', 'med_subklusterController@update'); //setting tambah baru
$router->post('/subklustersDelete', 'med_subklusterController@delete');

// med_modul api

$router->post('/addModuls', 'med_modulController@register');
$router->post('/moduls', 'med_modulController@show');
$router->get('/modulsList', 'med_modulController@list');
$router->post('/modulsUpdate', 'med_modulController@update'); //setting tambah baru
$router->post('/modulsDelete', 'med_modulController@delete');

// med_submodul api

$router->post('/addSubmoduls', 'med_submodulController@register');
$router->post('/submoduls', 'med_submodulController@show');
$router->get('/submoduls/{FK_modul}', 'med_submodulController@showSubmodul');
$router->get('/submodulsList', 'med_submodulController@list');
$router->post('/submodulsUpdate', 'med_submodulController@update'); //setting tambah baru
$router->post('/submodulsDelete', 'med_submodulController@delete');


// med_unit api
$router->post('/addUnits', 'med_unitController@register');
$router->post('/units', 'med_unitController@show');
$router->get('/units/{FK_kluster}/{FK_subkluster}', 'med_unitController@showGet');
$router->get('/unitsList', 'med_unitController@list');
$router->post('/unitsUpdate', 'med_unitController@update'); //setting tambah baru
$router->post('/unitsDelete', 'med_unitController@delete');

// med_vip api
$router->post('/addVips', 'med_vipController@register');
$router->post('/vips', 'med_vipController@show');
$router->get('/vipsList', 'med_vipController@list');
$router->get('/vipsListAll', 'med_vipController@listall');
$router->post('/vipsUpdate', 'med_vipController@update'); //setting tambah baru
$router->post('/vipsDelete', 'med_vipController@delete');


// med_menu api
$router->post('/addMenus', 'med_menuController@register');
$router->post('/menus', 'med_menuController@show');
$router->get('/menusList', 'med_menuController@list');
$router->get('/menusTop', 'med_menuController@top');
$router->get('/menusMid/{FK_parent}', 'med_menuController@mid');
$router->get('/menusBot/{FK_parent}', 'med_menuController@bot');
$router->post('/menusUpdate', 'med_menuController@update'); //setting tambah baru
$router->post('/menusDelete', 'med_menuController@delete');

// med_kementerian api
$router->post('/addKementerians', 'med_kementerianController@register');
$router->post('/kementerians', 'med_kementerianController@show');
$router->post('/kementeriansHrmis', 'med_kementerianController@showHrmis');
$router->post('/kementeriansName', 'med_kementerianController@showName');
$router->get('/kementeriansList', 'med_kementerianController@list');
$router->post('/kementeriansUpdate', 'med_kementerianController@update'); //setting tambah baru
$router->post('/kementeriansDelete', 'med_kementerianController@delete');

// med_agensi api
$router->post('/addAgensis', 'med_agensiController@register');
$router->post('/agensis', 'med_agensiController@show');
$router->post('/agensisKod', 'med_agensiController@showKod');
$router->get('/agensisList', 'med_agensiController@list');
$router->post('/agensisUpdate', 'med_agensiController@update'); //setting tambah baru
$router->post('/agensisDelete', 'med_agensiController@delete');

// med_bahagian api
$router->post('/addBahagians', 'med_bahagianController@register');
$router->post('/bahagians', 'med_bahagianController@show');
$router->get('/bahagians/{kod_kementerian}/{kod_agensi}', 'med_bahagianController@showGet');
$router->get('/bahagiansList', 'med_bahagianController@list');
$router->post('/bahagiansUpdate', 'med_bahagianController@update'); //setting tambah baru
$router->post('/bahagiansDelete', 'med_bahagianController@delete');

// med_ilawam api
$router->post('/addIlawams', 'med_ilawamController@register');
$router->post('/ilawams', 'med_ilawamController@show');
$router->get('/ilawams/{kod_bahagian}', 'med_ilawamController@showGet');
$router->get('/ilawamsList', 'med_ilawamController@list');
$router->post('/ilawamsUpdate', 'med_ilawamController@update'); //setting tambah baru
$router->post('/ilawamsDelete', 'med_ilawamController@delete');

// med_log api
$router->post('/addLogs', 'med_logController@register');
$router->post('/logs', 'med_logController@show');
$router->get('/logsList', 'med_logController@list');

// med_sysposkod api
$router->get('/sysposkod/{poskod}', 'med_sysposkodController@show');
$router->get('/sysposkodList', 'med_sysposkodController@list');

//Daripada api_media

// permohonan api
$router->post('/addPermohonan', 'med_permohonanController@register');
$router->post('/permohonan', 'med_permohonanController@show');
$router->get('/permohonan/{id}', 'med_permohonanController@showGet');
$router->get('/permohonanByUsers/{FK_users}', 'med_permohonanController@showGetUsers');
$router->get('/permohonanByUsersNotification/{FK_users}', 'med_permohonanController@showGetUsersNotification');
$router->get('/permohonanList', 'med_permohonanController@list');
$router->get('/permohonanListStatistik', 'med_permohonanController@listStatistik');
$router->get('/permohonanListPermohonanGraf/{bulan}', 'med_permohonanController@listPermohonanGraf');
$router->get('/permohonanListFilter/{FK_peranan}/{FK_kluster}', 'med_permohonanController@listFilter');
$router->get('/permohonanListTahun', 'med_permohonanController@listtahun');
$router->get('/permohonanStatus/{status_permohonan}', 'med_permohonanController@listStatus');
$router->post('/permohonanUpdate', 'med_permohonanController@update');
$router->post('/permohonanUpdatePemohon', 'med_permohonanController@updatePermohonan');
$router->post('/permohonanLuput', 'med_permohonanController@updateLuput');
$router->post('/permohonanDelete', 'med_permohonanController@delete');
$router->post('/permohonanCancel', 'med_permohonanController@cancel');
$router->post('/permohonanDownload', 'med_permohonanController@download');
$router->post('/permohonanRemove', 'med_permohonanController@remove');

// program api
$router->post('/addProgram', 'med_programController@register');
$router->post('/program', 'med_programController@show');
$router->get('/program/{id}', 'med_programController@showGet');
$router->post('/programMediaRemove/{id}', 'med_programController@removemedia');
$router->post('/programMediaBunchRemove/{id}', 'med_programController@removebunchmedia');
$router->post('/programLaporan', 'med_programController@laporan');
$router->get('/programList', 'med_programController@list');
$router->get('/programListTahun', 'med_programController@listtahun');
$router->get('/programListPdf', 'med_programController@listpdf');
$router->get('/programListBergambar', 'med_programController@listbergambar');
$router->get('/programListVideo', 'med_programController@listvideo');
$router->get('/programListAll', 'med_programController@listall');
$router->get('/programListKluster/{id}', 'med_programController@listallbykluster');
$router->post('/programUpdate', 'med_programController@update');
$router->post('/programTagging', 'med_programController@updateTag');
$router->post('/programUpload/{id}', 'med_programController@upload');
$router->post('/programUpload2/{id}', 'med_programController@upload2');
// $router->post('/programUploadExt/{id}', 'med_programController@extension');
$router->post('/programDelete', 'med_programController@delete');
$router->post('/searchProgram', 'med_programContrller@search');

// kategoriprogram api
$router->post('/addKategoriprogram', 'med_kategoriprogramController@register');
$router->post('/kategoriprogram', 'med_kategoriprogramController@show');
$router->get('/kategoriprogramList', 'med_kategoriprogramController@list');
$router->get('/kategoriprogramListAll', 'med_kategoriprogramController@listall');
$router->post('/kategoriprogramUpdate', 'med_kategoriprogramController@update');
$router->post('/kategoriprogramDelete', 'med_kategoriprogramController@delete');

// status api
$router->post('/addStatus', 'med_statusController@register');
$router->post('/status', 'med_statusController@show');
$router->get('/statusListAll', 'med_statusController@listAll');
$router->get('/statusList', 'med_statusController@list');
$router->get('/statusListKelulusan', 'med_statusController@listkelulusan');
$router->post('/statusUpdate', 'med_statusController@update');
$router->post('/statusDelete', 'med_statusController@delete');

// tempoh api
$router->post('/addTempoh', 'med_tempohController@register');
$router->post('/tempoh', 'med_tempohController@show');
$router->get('/tempoh/{id}', 'med_tempohController@showGet');
$router->get('/tempohListAll', 'med_tempohController@listAll');
$router->get('/tempohList', 'med_tempohController@list');
$router->post('/tempohUpdate', 'med_tempohController@update');
$router->post('/tempohDelete', 'med_tempohController@delete');

// format api
$router->post('/addFormat', 'med_formatController@register');
$router->post('/format', 'med_formatController@show');
$router->get('/formatList', 'med_formatController@list');
$router->get('/formatListAll', 'med_formatController@listall');
$router->post('/formatUpdate', 'med_formatController@update');
$router->post('/formatDelete', 'med_formatController@delete');

$router->get('/randomGambar','med_randomizeController@randomize');