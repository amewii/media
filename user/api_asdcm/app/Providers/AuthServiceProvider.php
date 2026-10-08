<?php

namespace App\Providers;

use App\Security\AccessToken;
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
        $this->app['auth']->viaRequest('api', function ($request) {
            return $this->app->make(AccessToken::class)
                ->userFromBearer($request->header('Authorization'));
        });
    }
}
