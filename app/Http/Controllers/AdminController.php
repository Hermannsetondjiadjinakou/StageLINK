<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Offer;
use App\Models\User;

class AdminController extends Controller
{
    // ── Statistiques globales ───────────────────────────────────────────────
    public function stats()
    {
        return response()->json([
            'students'          => User::where('role', 'student')->count(),
            'companies'         => User::where('role', 'company')->count(),
            'companies_pending' => User::where('role', 'company')->where('validated', false)->count(),
            'offers_active'     => Offer::where('status', 'active')->count(),
            'applications'      => Application::count(),
        ]);
    }

    // ── Toutes les entreprises ──────────────────────────────────────────────
    public function allCompanies()
    {
        $companies = User::where('role', 'company')
            ->select('id', 'name', 'email', 'company_name', 'city', 'sector', 'validated', 'created_at')
            ->latest()
            ->get();

        return response()->json($companies);
    }

    // ── Entreprises en attente de validation ────────────────────────────────
    public function pendingCompanies()
    {
        $companies = User::where('role', 'company')
            ->where('validated', false)
            ->select('id', 'name', 'email', 'company_name', 'city', 'sector', 'validated', 'created_at')
            ->latest()
            ->get();

        return response()->json($companies);
    }

    // ── Valider une entreprise ──────────────────────────────────────────────
    public function validateCompany($id)
    {
        $company = User::where('role', 'company')->findOrFail($id);
        $company->update(['validated' => true]);
        return response()->json(['message' => 'Entreprise validée.']);
    }

    // ── Rejeter une entreprise ──────────────────────────────────────────────
    public function rejectCompany($id)
    {
        $company = User::where('role', 'company')->findOrFail($id);
        $company->update(['validated' => false]);
        return response()->json(['message' => 'Entreprise rejetée.']);
    }

    // ── Supprimer une offre (modération) ────────────────────────────────────
    public function deleteOffer($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();
        return response()->json(['message' => 'Offre supprimée par l\'administrateur.']);
    }
}
