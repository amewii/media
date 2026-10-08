<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;

class AuthenticationThrottle
{
    public function __construct(private RateLimiter $limiter)
    {
    }

    public function handle($request, Closure $next, $maxAttempts = 5, $decaySeconds = 60)
    {
        // Follow the Fasiliti login throttle: one counter for each IP and
        // endpoint. This keeps the admin and public login counters separate.
        $key = 'throttle:'.$request->ip().':'.$request->path();

        if ($this->limiter->tooManyAttempts($key, (int) $maxAttempts)) {
            $retryAfter = $this->limiter->availableIn($key);

            return response()->json([
                'success' => false,
                'message' => 'Terlalu banyak percubaan. Sila cuba sebentar lagi.',
                'messages' => 'Log Masuk Gagal',
                'data' => 'Akaun Anda Disekat Sementara. Sila cuba semula selepas '.$retryAfter.' saat.',
                'lock' => true,
                'retry_after' => $retryAfter,
            ], 429, [
                'Retry-After' => $retryAfter,
            ]);
        }

        $this->limiter->hit($key, (int) $decaySeconds);

        return $next($request);
    }
}
