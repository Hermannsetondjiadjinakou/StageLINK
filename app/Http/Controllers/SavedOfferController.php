<?php

namespace App\Http\Controllers;

use App\Models\SavedOffer;
use Illuminate\Http\Request;

class SavedOfferController extends Controller
{
    public function index(Request $request)
    {
        $saved = SavedOffer::where('user_id', $request->user()->id)
            ->with('offer.company:id,company_name')
            ->latest('created_at')
            ->get()
            ->map(fn($s) => [
                'saved_id'     => $s->id,
                'offer_id'     => $s->offer_id,
                'title'        => $s->offer?->title,
                'company_name' => $s->offer?->company?->company_name,
                'city'         => $s->offer?->city,
                'sector'       => $s->offer?->sector,
                'deadline'     => $s->offer?->deadline?->format('d/m/Y'),
                'status'       => $s->offer?->status,
                'saved_at'     => $s->created_at,
            ]);

        return response()->json($saved);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'offer_id' => 'required|exists:offers,id',
        ]);

        $saved = SavedOffer::firstOrCreate([
            'user_id'  => $request->user()->id,
            'offer_id' => $data['offer_id'],
        ]);

        $status  = $saved->wasRecentlyCreated ? 201 : 200;
        $message = $saved->wasRecentlyCreated ? 'Offre sauvegardée.' : 'Déjà dans vos favoris.';

        return response()->json(['message' => $message, 'id' => $saved->id], $status);
    }

    public function destroy($offerId, Request $request)
    {
        $deleted = SavedOffer::where('user_id', $request->user()->id)
                             ->where('offer_id', $offerId)
                             ->delete();

        if (! $deleted) {
            return response()->json(['message' => 'Favori introuvable.'], 404);
        }

        return response()->json(['message' => 'Offre retirée des favoris.']);
    }
}