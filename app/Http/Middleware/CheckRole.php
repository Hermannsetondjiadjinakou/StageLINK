<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Usage in routes: middleware('role:admin') or middleware('role:company,admin')
     */
    public function handle(Request $request, Closure $next, string $roles = null)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        if (! $roles) {
            return $next($request);
        }

        $allowed = preg_split('/[\s,|]+/', $roles, -1, PREG_SPLIT_NO_EMPTY);

        if (! in_array($user->role, $allowed, true)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $next($request);
    }
}