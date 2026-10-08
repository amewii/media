<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;

class SanitizeApiResponse
{
    private const BLOCKED_KEYS = [
        'katalaluan',
        'password',
        'resetkatalaluan',
        'reset_token',
        'remember_token',
        'token',
        'token_hash',
        'api_token',
        'access_token',
        'refresh_token',
        'mail_password',
        'mail_username',
        'smtp_password',
        'secret',
        'secret_key',
        'private_key',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function handle($request, Closure $next)
    {
        $response = $next($request);

        if (!$response instanceof JsonResponse) {
            return $response;
        }

        $payload = $response->getData(true);
        if (is_array($payload) && array_key_exists('data', $payload)) {
            // Authentication tokens at the response root are intentional.
            // Database attributes nested under data are never allowed through.
            $payload['data'] = $this->sanitize($payload['data']);
            $response->setData($payload);
        }

        return $response;
    }

    private function sanitize($value)
    {
        if (!is_array($value)) {
            return $value;
        }

        $sanitized = [];
        foreach ($value as $key => $item) {
            if (is_string($key) && in_array(strtolower($key), self::BLOCKED_KEYS, true)) {
                continue;
            }

            $sanitized[$key] = $this->sanitize($item);
        }

        return $sanitized;
    }
}
