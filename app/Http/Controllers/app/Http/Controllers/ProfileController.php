<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->isStudent()) {
            $data = $request->validate([
                'name'    => 'sometimes|string|max:100',
                'filiere' => 'sometimes|string',
                'niveau'  => 'sometimes|string',
            ]);
        } elseif ($user->isCompany()) {
            $data = $request->validate([
                'name'         => 'sometimes|string|max:100',
                'company_name' => 'sometimes|string|max:150',
                'sector'       => 'sometimes|string',
                'city'         => 'sometimes|string',
                'description'  => 'sometimes|string',
            ]);
        } else {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $user->update($data);

        return response()->json(['message' => 'Profil mis à jour.', 'user' => $user]);
    }

    public function uploadCv(Request $request)
    {
        $user = $request->user();

        if (! $user->isStudent()) {
            return response()->json(['message' => 'Réservé aux étudiants.'], 403);
        }

        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:5120',
        ]);

        $path = $request->file('cv')->store("cvs/user_{$user->id}", 'public');
        $url  = asset("storage/$path");

        $user->update(['cv_path' => $url]);

        return response()->json(['message' => 'CV mis à jour.', 'cv_path' => $url]);
    }
}