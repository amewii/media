<?php

return [
    // Eight hours by default. A new login revokes the previous token.
    'access_token_ttl' => (int) env('ACCESS_TOKEN_TTL', 28800),
];
