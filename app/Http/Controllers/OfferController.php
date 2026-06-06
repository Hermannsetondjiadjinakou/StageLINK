<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    // ── Liste des offres ────────────────────────────────────────────────────
    public function index(Request $request)
    {
        // ?my=true → offres de l'entreprise connectée
        if ($request->boolean('my') && $request->user()) {
            $offers = Offer::where('user_id', $request->user()->id)
                ->with('company:id,company_name')
                ->latest()
                ->get()
                ->map(fn($o) => $this->formatOffer($o));

            return response()->json($offers);
        }

        // Offres publiques actives avec filtres optionnels
        $query = Offer::active()->with('company:id,company_name');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%$s%")
                  ->orWhereHas('company', fn($q2) => $q2->where('company_name', 'like', "%$s%"));
            });
        }

        if ($request->filled('sector')) $query->where('sector', $request->sector);
        if ($request->filled('city'))   $query->where('city',   $request->city);
        if ($request->filled('type'))   $query->where('type',   $request->type);

        $offers = $query->latest()->get()->map(fn($o) => $this->formatOffer($o));

        return response()->json($offers);
    }

    // ── Détail d'une offre ──────────────────────────────────────────────────
    public function show($id)
    {
        $offer = Offer::with('company:id,company_name,city,sector')->findOrFail($id);
        return response()->json($this->formatOffer($offer, detail: true));
    }

    // ── Créer une offre ─────────────────────────────────────────────────────
    // Rôle 'company' déjà vérifié par middleware dans api.php
    public function store(Request $request)
    {
        $user = $request->user();

        if (! $user->validated) {
            return response()->json([
                'message' => 'Votre compte n\'est pas encore validé par l\'administrateur.'
            ], 403);
        }

        $data = $request->validate([
            'title'       => 'required|string|max:150',
            'description' => 'required|string',
            'profile'     => 'nullable|string',
            'missions'    => 'nullable|string',
            'city'        => 'required|string',
            'sector'      => 'required|string',
            'duration'    => 'required|integer|min:1|max:24',
            'type'        => 'required|in:Stage académique,Stage professionnel',
            'start_date'  => 'nullable|date',
            'deadline'    => 'nullable|date|after:today',
            'salary'      => 'nullable|string|max:100',
        ]);

        $offer = $user->offers()->create($data);

        return response()->json($this->formatOffer($offer->load('company')), 201);
    }

    // ── Mettre en pause ─────────────────────────────────────────────────────
    // Rôle 'company' déjà vérifié par middleware dans api.php
    public function pause($id, Request $request)
    {
        $offer = Offer::where('id', $id)
                      ->where('user_id', $request->user()->id)
                      ->firstOrFail();

        $offer->update(['status' => 'paused']);

        return response()->json(['message' => 'Offre mise en pause.']);
    }

    // ── Supprimer une offre ─────────────────────────────────────────────────
    // Rôle 'company' déjà vérifié par middleware dans api.php
    public function destroy($id, Request $request)
    {
        $offer = Offer::where('id', $id)
                      ->where('user_id', $request->user()->id)
                      ->firstOrFail();

        $offer->delete();

        return response()->json(['message' => 'Offre supprimée.']);
    }

    // ── Formatage de la réponse ─────────────────────────────────────────────
    private function formatOffer(Offer $offer, bool $detail = false): array
    {
        $base = [
            'id'           => $offer->id,
            'title'        => $offer->title,
            'company_name' => $offer->company?->company_name,
            'city'         => $offer->city,
            'sector'       => $offer->sector,
            'duration'     => $offer->duration,
            'type'         => $offer->type,
            'status'       => $offer->status,
            'start_date'   => $offer->start_date?->format('d/m/Y'),
            'deadline'     => $offer->deadline?->format('d/m/Y'),
            'salary'       => $offer->salary,
            'description'  => $offer->description,
            'created_at'   => $offer->created_at,
        ];

        if ($detail) {
            $base['profile']  = $offer->profile;
            $base['missions'] = $offer->missions;
        }

        return $base;
    }
}
