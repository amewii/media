<?php

namespace App\Security;

use App\Models\med_capaian;
use App\Models\med_users;

class AdministratorAccess
{
    private const SUPERADMIN_ROLE = 1;

    public function allows(?med_users $user): bool
    {
        if (!$user
            || (int) $user->FK_jenis_pengguna !== 1
            || (string) $user->statusrekod !== '1') {
            return false;
        }

        $assignments = med_capaian::query()
            ->join('med_peranan', 'med_peranan.id_peranan', '=', 'med_capaian.FK_peranan')
            ->where('med_capaian.FK_users', $user->id_users)
            ->get([
                'med_capaian.FK_peranan',
                'med_capaian.statusrekod AS capaian_statusrekod',
                'med_peranan.statusrekod AS peranan_statusrekod',
            ]);

        foreach ($assignments as $assignment) {
            if ($this->allowsAssignment(
                (int) $assignment->FK_peranan,
                (string) $assignment->capaian_statusrekod,
                (string) $assignment->peranan_statusrekod
            )) {
                return true;
            }
        }

        return false;
    }

    public function allowsAssignment(int $roleId, string $accessStatus, string $roleStatus): bool
    {
        if ($roleStatus !== '1') {
            return false;
        }

        // Legacy superadmin records were seeded with statusrekod=0 even though
        // the role itself remains active. Other administrator roles must still
        // have an active access assignment.
        return $roleId === self::SUPERADMIN_ROLE || $accessStatus === '1';
    }
}
