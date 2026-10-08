<?php

namespace App\Http\Controllers;

use App\Security\AdministratorAccess;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    private const USER_ACTIONS = [
        authController::class => ['logout'],
        med_usersController::class => [
            'show', 'checkpassword', 'showGetIc', 'listUsersEditProfile', 'editprofile',
        ],
        med_usersgovController::class => ['register', 'editprofile'],
        med_usersswastaController::class => ['register', 'editprofile'],
        med_userspelajarController::class => ['register', 'editprofile'],
        med_permohonanController::class => [
            'register', 'showGet', 'showGetUsers', 'showGetUsersNotification',
            'updatePermohonan', 'updateLuput', 'cancel', 'download', 'remove',
        ],
    ];

    /**
     * Authentication is deny-by-default. Only actions required before login or
     * for the public gallery are listed here.
     */
    private const PUBLIC_ACTIONS = [
        authController::class => [
            'register', 'login', 'loginUser', 'show', 'resetpasswordtomail',
            'showGetResetKatalaluan', 'resetpassword',
        ],
        med_usersController::class => ['register'],
        med_kampusController::class => ['show', 'list'],
        med_gelaranController::class => ['showHrmis', 'list'],
        med_klusterController::class => ['show', 'showGet', 'list'],
        med_subklusterController::class => ['show', 'showGet', 'list'],
        med_unitController::class => ['show', 'showGet', 'list'],
        med_skimController::class => ['list'],
        med_gredController::class => ['list'],
        med_kategoriperkhidmatanController::class => ['showHrmis', 'list'],
        med_jenispenggunaController::class => ['list'],
        med_kementerianController::class => ['showHrmis', 'showName', 'list'],
        med_agensiController::class => ['showKod', 'list'],
        med_bahagianController::class => ['showGet', 'list'],
        med_ilawamController::class => ['showGet', 'list'],
        med_sysposkodController::class => ['show'],
        med_programController::class => [
            'showGet', 'list_publish', 'listbergambar', 'listvideo',
            'listdokumen', 'search',
        ],
        med_kategoriprogramController::class => ['list'],
        med_vipController::class => ['list'],
        med_randomizeController::class => ['randomize'],
    ];

    public function __construct()
    {
        $publicActions = self::PUBLIC_ACTIONS[static::class] ?? [];
        $userActions = self::USER_ACTIONS[static::class] ?? [];

        $this->middleware('auth', [
            'except' => $publicActions,
        ]);
        $this->middleware('admin', [
            'except' => array_values(array_unique(array_merge($publicActions, $userActions))),
        ]);
    }

    protected function canActForUser($request, $targetUserId): bool
    {
        $user = $request->user();
        if (!$user) {
            return false;
        }

        if ((int) $user->id_users === (int) $targetUserId) {
            return true;
        }

        return $this->isAdministrator($request);
    }

    protected function isAdministrator($request): bool
    {
        $user = $request->user();
        if (!$user) {
            return false;
        }

        return app(AdministratorAccess::class)->allows($user);
    }
}
