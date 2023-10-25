<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\pen_public_access;

class public_auth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {        
        $apiToken = explode('0L1v3', $request->header('public_access'));
        if(count($apiToken)>1){
            if(pen_public_access::where('token', $apiToken[1])->first()){
                return $next($request);
            }
            else{
                return response('Unauthorized.', 401);
            }
        } else {
            return response('Unauthorized.', 401);
        }
    }
}
