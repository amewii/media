<?php

namespace App\Security;

class Passwords
{
    // Kept only to transparently migrate existing accounts at their next login.
    private const LEGACY_SALT = 'RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ';

    public function make(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public function verify(string $password, string $storedHash): bool
    {
        if ($this->isModern($storedHash)) {
            return password_verify($password, $storedHash);
        }

        return hash_equals($storedHash, hash('sha256', $password.self::LEGACY_SALT));
    }

    public function needsUpgrade(string $storedHash): bool
    {
        return !$this->isModern($storedHash)
            || password_needs_rehash($storedHash, PASSWORD_DEFAULT);
    }

    private function isModern(string $storedHash): bool
    {
        return (password_get_info($storedHash)['algo'] ?? null) !== null;
    }
}
