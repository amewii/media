<?php

namespace App\Http\Middleware;

use App\Models\med_capaian;
use Closure;

class EnsureAdministrator
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();
        $isAdministrator = $user && med_capaian::query()
            ->where('FK_users', $user->id_users)
            ->where('statusrekod', '1')
            ->exists();

        if (!$isAdministrator) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden.',
            ], 403);
        }

        return $next($request);
    }
}
