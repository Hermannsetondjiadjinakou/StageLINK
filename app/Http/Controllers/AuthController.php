<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ── Inscription ─────────────────────────────────────────────────────────
    public function register(Request $request)
    {
        $role = $request->input('role', 'student');

        $base = [
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:student,company',
        ];

        $studentRules = [
            'filiere' => 'required|string',
            'niveau'  => 'required|string',
        ];

        $companyRules = [
            'company_name' => 'required|string|max:150',
            'sector'       => 'required|string',
            'city'         => 'required|string',
        ];

        $rules = array_merge(
            $base,
            $role === 'student' ? $studentRules : $companyRules
        );

        $data = $request->validate($rules);
        $data['password'] = Hash::make($data['password']);

        if ($role === 'company') {
            $data['validated'] = false;
        }

        $user = User::create($data);
        $token = $user->createToken('stagelink')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->formatUser($user),
        ], 201);
    }

    // ── Connexion ───────────────────────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        // Supprime les anciens tokens pour ne garder qu'une session active
        $user->tokens()->delete();
        $token = $user->createToken('stagelink')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->formatUser($user),
        ]);
    }

    // ── Déconnexion ─────────────────────────────────────────────────────────
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // ── Profil de l'utilisateur connecté (GET /me) ──────────────────────────
    public function me(Request $request)
    {
        return response()->json($this->formatUser($request->user()));
    }

    // ── Formatage de la réponse utilisateur ────────────────────────────────
    // Les champs retournés dépendent du rôle pour ne pas exposer des données inutiles
    private function formatUser(User $user): array
    {
        $base = [
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'role'      => $user->role,
            'validated' => $user->validated,
        ];

        if ($user->isStudent()) {
            $base['filiere'] = $user->filiere;
            $base['niveau']  = $user->niveau;
            $base['cv_path'] = $user->cv_path;
        }

        if ($user->isCompany()) {
            $base['company_name'] = $user->company_name;
            $base['sector']       = $user->sector;
            $base['city']         = $user->city;
            $base['description']  = $user->description;
        }

        return $base;
    }
}
