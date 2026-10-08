<?php

namespace App\Security;

use App\Models\med_users;
use RuntimeException;

class PasswordResetToken
{
    private const TTL = 3600;

    public function issue(med_users $user): string
    {
        $payload = $user->id_users.'.'.(time() + self::TTL).'.'.$this->encode(random_bytes(32));
        $token = $payload.'.'.$this->sign($payload);
        $user->forceFill(['resetkatalaluan' => hash('sha256', $token)])->save();

        return $token;
    }

    public function userFromToken(?string $token): ?med_users
    {
        if (!is_string($token) || strlen($token) > 512) {
            return null;
        }

        $parts = explode('.', $token);
        if (count($parts) !== 4) {
            return null;
        }

        [$userId, $expiresAt, $nonce, $signature] = $parts;
        $payload = $userId.'.'.$expiresAt.'.'.$nonce;

        if (!ctype_digit($userId)
            || !ctype_digit($expiresAt)
            || (int) $expiresAt <= time()
            || (int) $expiresAt > time() + self::TTL + 60
            || !hash_equals($this->sign($payload), $signature)) {
            return null;
        }

        return med_users::query()
            ->where('id_users', (int) $userId)
            ->where('resetkatalaluan', hash('sha256', $token))
            ->first();
    }

    private function sign(string $value): string
    {
        return $this->encode(hash_hmac('sha256', $value, $this->key(), true));
    }

    private function key(): string
    {
        $key = (string) config('app.key');
        if (str_starts_with($key, 'base64:')) {
            $key = base64_decode(substr($key, 7), true) ?: '';
        }

        if (strlen($key) < 32) {
            throw new RuntimeException('APP_KEY must contain at least 32 bytes.');
        }

        return $key;
    }

    private function encode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
