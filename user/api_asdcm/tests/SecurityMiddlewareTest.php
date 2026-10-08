<?php

class SecurityMiddlewareTest extends TestCase
{
    public function testControllerReadQueriesDoNotUseWildcardSelections(): void
    {
        $controllerFiles = glob(__DIR__.'/../app/Http/Controllers/*.php');

        $this->assertNotEmpty($controllerFiles);

        foreach ($controllerFiles as $controllerFile) {
            $source = file_get_contents($controllerFile);
            $name = basename($controllerFile);

            $this->assertDoesNotMatchRegularExpression(
                '/select(?:Raw)?\s*\(\s*[\'\"][^\'\"]*\*/i',
                $source,
                $name.' must explicitly list the fields returned by read queries.'
            );
            $this->assertDoesNotMatchRegularExpression(
                '/::all\s*\(/i',
                $source,
                $name.' must not retrieve every column implicitly.'
            );
        }
    }

    public function testControllersAreProtectedByDefaultWithExplicitPublicExceptions(): void
    {
        $program = $this->app->make(App\Http\Controllers\med_programController::class);
        $auth = $this->app->make(App\Http\Controllers\authController::class);
        $applications = $this->app->make(App\Http\Controllers\med_permohonanController::class);

        $this->assertContains('auth', $program->getMiddlewareForMethod('listall'));
        $this->assertContains('admin', $program->getMiddlewareForMethod('listall'));
        $this->assertNotContains('auth', $program->getMiddlewareForMethod('list_publish'));
        $this->assertNotContains('admin', $program->getMiddlewareForMethod('list_publish'));
        $this->assertContains('auth', $auth->getMiddlewareForMethod('logout'));
        $this->assertNotContains('admin', $auth->getMiddlewareForMethod('logout'));
        $this->assertNotContains('auth', $auth->getMiddlewareForMethod('login'));
        $this->assertContains('auth.throttle:5,60', $auth->getMiddlewareForMethod('login'));
        $this->assertContains('auth.throttle:5,60', $auth->getMiddlewareForMethod('loginUser'));
        $this->assertContains('auth', $applications->getMiddlewareForMethod('register'));
        $this->assertNotContains('admin', $applications->getMiddlewareForMethod('register'));
    }

    public function testAdministratorPolicyKeepsLegacySuperadminAccessWithoutRelaxingOtherRoles(): void
    {
        $policy = new App\Security\AdministratorAccess();

        $this->assertTrue($policy->allowsAssignment(1, '0', '1'));
        $this->assertTrue($policy->allowsAssignment(1, '1', '1'));
        $this->assertTrue($policy->allowsAssignment(2, '1', '1'));
        $this->assertFalse($policy->allowsAssignment(2, '0', '1'));
        $this->assertFalse($policy->allowsAssignment(3, '0', '1'));
        $this->assertFalse($policy->allowsAssignment(1, '0', '0'));
    }

    public function testLoginThrottleUsesSeparateIpAndPathCounters(): void
    {
        $middleware = $this->app->make(App\Http\Middleware\AuthenticationThrottle::class);
        $limiter = $this->app->make(Illuminate\Cache\RateLimiter::class);
        $ip = '192.0.2.10';
        $adminKey = 'throttle:'.$ip.':login';
        $userKey = 'throttle:'.$ip.':loginUser';
        $next = static fn () => response()->json(['success' => true]);

        $limiter->clear($adminKey);
        $limiter->clear($userKey);

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $request = Illuminate\Http\Request::create(
                '/login',
                'POST',
                ['no_kad_pengenalan' => (string) $attempt],
                [],
                [],
                ['REMOTE_ADDR' => $ip]
            );

            $this->assertSame(200, $middleware->handle($request, $next, 5, 60)->getStatusCode());
        }

        $blockedRequest = Illuminate\Http\Request::create(
            '/login',
            'POST',
            ['no_kad_pengenalan' => 'different-user'],
            [],
            [],
            ['REMOTE_ADDR' => $ip]
        );
        $blocked = $middleware->handle($blockedRequest, $next, 5, 60);
        $blockedPayload = json_decode($blocked->getContent(), true);

        $this->assertSame(429, $blocked->getStatusCode());
        $this->assertTrue($blockedPayload['lock']);
        $this->assertSame('Log Masuk Gagal', $blockedPayload['messages']);
        $this->assertGreaterThan(0, $blockedPayload['retry_after']);
        $this->assertNotNull($blocked->headers->get('Retry-After'));

        $userRequest = Illuminate\Http\Request::create(
            '/loginUser',
            'POST',
            ['no_kad_pengenalan' => 'different-user'],
            [],
            [],
            ['REMOTE_ADDR' => $ip]
        );

        $this->assertSame(200, $middleware->handle($userRequest, $next, 5, 60)->getStatusCode());

        $limiter->clear($adminKey);
        $limiter->clear($userKey);
    }

    public function testNewPasswordsUseAnAdaptiveHash(): void
    {
        $passwords = new App\Security\Passwords();
        $hash = $passwords->make('Correct-Horse-7');

        $this->assertTrue($passwords->verify('Correct-Horse-7', $hash));
        $this->assertFalse($passwords->verify('wrong', $hash));
        $this->assertFalse($passwords->needsUpgrade($hash));
        $this->assertNotSame(hash('sha256', 'Correct-Horse-7'), $hash);
    }

    public function testProtectedEndpointRejectsMissingBearerToken(): void
    {
        $this->get('/usersList');

        $this->assertResponseStatus(401);
        $this->seeJson([
            'success' => false,
            'message' => 'Unauthenticated.',
        ]);
        $this->assertSame('Bearer', $this->response->headers->get('WWW-Authenticate'));
    }

    public function testProtectedEndpointRejectsMalformedBearerToken(): void
    {
        $this->get('/usersList', ['Authorization' => 'Bearer invalid']);

        $this->assertResponseStatus(401);
    }

    public function testSecurityHeadersAreAdded(): void
    {
        $this->get('/');

        $this->assertSame('nosniff', $this->response->headers->get('X-Content-Type-Options'));
        $this->assertSame('DENY', $this->response->headers->get('X-Frame-Options'));
        $this->assertSame('no-referrer', $this->response->headers->get('Referrer-Policy'));
    }

    public function testSensitiveDatabaseAttributesAreRemovedFromJsonData(): void
    {
        $middleware = new App\Http\Middleware\SanitizeApiResponse();
        $request = Illuminate\Http\Request::create('/example', 'GET');
        $next = static fn () => response()->json([
            'success' => true,
            'token' => 'intentional-auth-token',
            'data' => [
                'id_users' => 10,
                'nama' => 'Pengguna',
                'token' => 'stored-database-token',
                'katalaluan' => 'password-hash',
                'resetkatalaluan' => 'reset-hash',
                'mail_password' => 'smtp-secret',
                'created_by' => 1,
                'nested' => [
                    'password' => 'nested-secret',
                    'nama' => 'Selamat',
                ],
            ],
        ]);

        $response = $middleware->handle($request, $next);
        $payload = json_decode($response->getContent(), true);

        $this->assertSame('intentional-auth-token', $payload['token']);
        $this->assertSame(10, $payload['data']['id_users']);
        $this->assertSame('Pengguna', $payload['data']['nama']);
        $this->assertSame('Selamat', $payload['data']['nested']['nama']);
        $this->assertArrayNotHasKey('token', $payload['data']);
        $this->assertArrayNotHasKey('katalaluan', $payload['data']);
        $this->assertArrayNotHasKey('resetkatalaluan', $payload['data']);
        $this->assertArrayNotHasKey('mail_password', $payload['data']);
        $this->assertArrayNotHasKey('created_by', $payload['data']);
        $this->assertArrayNotHasKey('password', $payload['data']['nested']);
    }

    public function testSensitiveModelAttributesAreHiddenBeforeMiddlewareRuns(): void
    {
        $user = new App\Models\med_users();
        $user->setRawAttributes([
            'id_users' => 10,
            'nama' => 'Pengguna',
            'katalaluan' => 'password-hash',
            'token' => 'stored-token',
            'resetkatalaluan' => 'reset-hash',
            'created_by' => 1,
        ]);

        $settings = new App\Models\med_tetapan();
        $settings->setRawAttributes([
            'nama_sistem' => 'Media',
            'mail_username' => 'smtp-user',
            'mail_password' => 'smtp-secret',
        ]);

        $this->assertSame(['id_users' => 10, 'nama' => 'Pengguna'], $user->toArray());
        $this->assertSame(['nama_sistem' => 'Media'], $settings->toArray());
    }
}
