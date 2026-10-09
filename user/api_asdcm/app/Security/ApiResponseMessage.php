<?php

namespace App\Security;

class ApiResponseMessage
{
    public static function forFailure($request, int $status): string
    {
        $path = trim((string) $request->path(), '/');

        if (in_array($path, ['login', 'loginUser'], true)) {
            return 'Kombinasi No. Kad Pengenalan dan katalaluan tidak tepat.';
        }

        if ($status === 429) {
            return 'Terlalu banyak permintaan. Sila cuba sebentar lagi.';
        }

        if ($status === 422) {
            return 'Maklumat yang diberikan tidak dapat diproses.';
        }

        if ($status >= 500) {
            return 'Permintaan tidak dapat diproses buat masa ini.';
        }

        return 'Permintaan tidak dapat diproses.';
    }
}
