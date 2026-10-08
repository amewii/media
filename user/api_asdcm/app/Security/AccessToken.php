<?php

namespace App\Security;

use App\Models\med_users;
use RuntimeException;

class AccessToken
{
    private const VERSION = 'v1';

    public function issue(med_users $user): string
    {
        $issuedAt = time();
        $payload = $this->encode(json_encode([
            'sub' => (int) $user->id_users,
            'iat' => $issuedAt,
            'exp' => $issuedAt + $this->ttl(),
        ], JSON_THROW_ON_ERROR));
        $nonce = $this->encode(random_bytes(32));
        $unsigned = self::VERSION.'.'.$payload.'.'.$nonce;
        $token = $unsigned.'.'.$this->sign($unsigned);

        $user->forceFill(['token' => hash('sha256', $token)])->save();

        return $token;
    }

    public function userFromBearer(?string $authorization): ?med_users
    {
        if (!is_string($authorization)
            || !preg_match('/^Bearer\s+([^\s]+)$/i', trim($authorization), $matches)) {
            return null;
        }

        $token = $matches[1];
        $parts = explode('.', $token);

        if (count($parts) !== 4 || $parts[0] !== self::VERSION) {
            return null;
        }

        [$version, $encodedPayload, $nonce, $signature] = $parts;
        $unsigned = $version.'.'.$encodedPayload.'.'.$nonce;

        if (!hash_equals($this->sign($unsigned), $signature)) {
            return null;
        }

        $payload = json_decode($this->decode($encodedPayload), true);
        if (!is_array($payload)
            || !isset($payload['sub'], $payload['iat'], $payload['exp'])
            || !is_int($payload['sub'])
            || !is_int($payload['iat'])
            || !is_int($payload['exp'])
            || $payload['iat'] > time() + 60
            || $payload['exp'] <= time()
            || $payload['exp'] - $payload['iat'] > $this->ttl()) {
            return null;
        }

        return med_users::query()
            ->where('id_users', $payload['sub'])
            ->where('token', hash('sha256', $token))
            ->first();
    }

    private function sign(string $value): string
    {
        return $this->encode(hash_hmac('sha256', $value, $this->key(), true));
    }

    private function ttl(): int
    {
        return max(300, (int) config('security.access_token_ttl', 28800));
    }

    private function key(): string
    {
        $key = (string) config('app.key');

        if (str_starts_with($key, 'base64:')) {
            $decoded = base64_decode(substr($key, 7), true);
            $key = $decoded === false ? '' : $decoded;
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

    private function decode(string $value): string
    {
        $padding = (4 - strlen($value) % 4) % 4;
        $decoded = base64_decode(strtr($value, '-_', '+/').str_repeat('=', $padding), true);

        return $decoded === false ? '' : $decoded;
    }
}
