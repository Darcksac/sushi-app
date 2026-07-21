<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function login(Request $request)
    {
        $idToken = $request->input('idToken');
        
        if (!$idToken) {
            return response()->json(['error' => 'No token provided'], 400);
        }

        $apiKey = env('FIREBASE_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'Firebase API Key not configured'], 500);
        }

        try {
            // Verificar el idToken a través de la API REST oficial de Firebase
            $response = \Illuminate\Support\Facades\Http::post("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={$apiKey}", [
                'idToken' => $idToken,
            ]);

            $data = $response->json();

            if (!isset($data['users']) || count($data['users']) === 0) {
                return response()->json(['error' => 'Invalid Firebase token'], 401);
            }

            $googleUser = $data['users'][0];
            $googleId = $googleUser['localId'];
            $email = $googleUser['email'];
            $name = $googleUser['displayName'] ?? 'Usuario';

            // Buscar si ya existe el usuario por google_id o por email
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if ($user) {
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleId]);
                }
            } else {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'role' => 'client', // Por defecto cliente
                    'password' => null, 
                ]);
            }

            Auth::login($user);

            // Devolver URL de redirección
            if ($user->role === 'admin' || $user->role === 'subadmin') {
                return response()->json(['redirect' => route('admin.dashboard')]);
            }
            return response()->json(['redirect' => route('dashboard')]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al iniciar sesión: ' . $e->getMessage()], 500);
        }
    }
}
