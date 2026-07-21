<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && in_array(auth()->user()->role, ['admin', 'subadmin'])) {
            return $next($request);
        }
        
        return redirect('/')->with('error', 'No tienes acceso a esta sección.');
    }
}
