<?php

namespace App\Providers;

use App\Models\pen_calon_soalan;
use App\Models\med_users;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.
        // error_reporting(0);
        $this->app['auth']->viaRequest('api', function ($request) {
            if ($request->header('Authorization')) {
                $apiToken = explode('0L1v3', $request->header('Authorization'));
                return med_users::where('token', $apiToken[1])->first();
            }
        });
    }
}
