<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireJsonRequests
{
    public function handle(Request $request, Closure $next): Response
{
    // Permitir acceso sin JSON a Swagger y su documentación
    if ($request->is('api/documentation') || 
        $request->is('api/documentation/*') || 
        $request->is('docs') || 
        $request->is('docs/*') || 
        $request->is('api-docs.json')) {
        return $next($request);
    }

    if (!$request->expectsJson()) {
        return response()->json(['message' => 'Only JSON requests are allowed.'], 406);
    }

    return $next($request);
}

}
