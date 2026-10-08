<?php

namespace App\Http\Middleware;

use App\Security\AdministratorAccess;
use Closure;

class EnsureAdministrator
{
    public function __construct(private AdministratorAccess $administratorAccess)
    {
    }

    public function handle($request, Closure $next)
    {
        $user = $request->user();

        if (!$this->administratorAccess->allows($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden.',
            ], 403);
        }

        return $next($request);
    }
}
