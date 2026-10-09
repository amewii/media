<?php

namespace App\Http\Middleware;

use App\Security\ApiResponseMessage;
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
        if (!is_array($payload)) {
            return $response;
        }

        if ($this->isFailure($payload, $response->getStatusCode())) {
            $message = ApiResponseMessage::forFailure($request, $response->getStatusCode());

            unset(
                $payload['errors'],
                $payload['error'],
                $payload['exception'],
                $payload['trace'],
                $payload['file'],
                $payload['line'],
                $payload['token']
            );

            $payload['message'] = $message;
            if (array_key_exists('messages', $payload)) {
                $payload['messages'] = $message;
            }
            $payload['data'] = $message;
        } elseif (array_key_exists('data', $payload)) {
            // Authentication tokens at the response root are intentional.
            // Database attributes nested under data are never allowed through.
            $payload['data'] = $this->sanitize($payload['data']);
        }

        $response->setData($payload);

        return $response;
    }

    private function isFailure(array $payload, int $status): bool
    {
        if ($status >= 400) {
            return true;
        }

        if (!array_key_exists('success', $payload)) {
            return false;
        }

        return filter_var($payload['success'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) !== true;
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
