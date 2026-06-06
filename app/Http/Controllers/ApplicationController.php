<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationStatusChanged;
use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        if (! $user->isStudent()) {
            return response()->json(['message' => 'Réservé aux étudiants.'], 403);
        }

        $data = $request->validate([
            'offer_id'   => 'required|exists:offers,id',
            'cv'         => 'required|file|mimes:pdf|max:5120',
            'motivation' => 'nullable|string|max:1000',
        ]);

        $alreadyApplied = Application::where('offer_id', $data['offer_id'])
                                     ->where('user_id', $user->id)
                                     ->exists();

        if ($alreadyApplied) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 422);
        }

        $offer = Offer::findOrFail($data['offer_id']);

        if ($offer->status !== 'active') {
            return response()->json(['message' => 'Cette offre n\'est plus disponible.'], 422);
        }

        $cvPath = $this->uploadCv($request->file('cv'), $user->id);

        $application = Application::create([
            'offer_id'   => $data['offer_id'],
            'user_id'    => $user->id,
            'cv_path'    => $cvPath,
            'motivation' => $data['motivation'] ?? null,
            'status'     => 'pending',
        ]);

        return response()->json([
            'message' => 'Candidature envoyée avec succès.',
            'id'      => $application->id,
        ], 201);
    }

    public function myApplications(Request $request)
    {
        $applications = Application::where('user_id', $request->user()->id)
            ->with('offer.company:id,company_name')
            ->latest()
            ->get()
            ->map(fn($a) => [
                'id'           => $a->id,
                'offer_id'     => $a->offer_id,
                'offer_title'  => $a->offer?->title,
                'company_name' => $a->offer?->company?->company_name,
                'status'       => $a->status,
                'cv_path'      => $a->cv_path,
                'motivation'   => $a->motivation,
                'created_at'   => $a->created_at,
            ]);

        return response()->json($applications);
    }

    public function received(Request $request)
    {
        $user = $request->user();

        if (! $user->isCompany()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $applications = Application::whereHas('offer', fn($q) => $q->where('user_id', $user->id))
            ->with(['offer:id,title', 'student:id,name,email,filiere,niveau'])
            ->latest()
            ->get()
            ->map(fn($a) => [
                'id'            => $a->id,
                'offer_id'      => $a->offer_id,
                'offer_title'   => $a->offer?->title,
                'student_name'  => $a->student?->name,
                'student_email' => $a->student?->email,
                'filiere'       => $a->student?->filiere,
                'niveau'        => $a->student?->niveau,
                'cv_path'       => $a->cv_path,
                'motivation'    => $a->motivation,
                'status'        => $a->status,
                'internal_note' => $a->internal_note,
                'created_at'    => $a->created_at,
            ]);

        return response()->json($applications);
    }

    public function updateStatus($id, Request $request)
    {
        $user = $request->user();

        if (! $user->isCompany()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $data = $request->validate([
            'status'        => 'required|in:pending,interview,accepted,rejected',
            'internal_note' => 'nullable|string|max:1000',
        ]);

        $application = Application::whereHas(
            'offer', fn($q) => $q->where('user_id', $user->id)
        )->with(['student', 'offer.company'])->findOrFail($id);

        $application->update($data);

        Mail::to($application->student->email)
            ->send(new ApplicationStatusChanged($application));

        return response()->json(['message' => 'Statut mis à jour.']);
    }

    public function withdraw($id, Request $request)
    {
        $application = Application::where('id', $id)
                                  ->where('user_id', $request->user()->id)
                                  ->firstOrFail();

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'Vous ne pouvez plus retirer cette candidature.'], 422);
        }

        $application->delete();

        return response()->json(['message' => 'Candidature retirée.']);
    }

    private function uploadCv($file, int $userId): string
    {
        $path = $file->store("cvs/user_{$userId}", 'public');
        return asset("storage/$path");
    }
}