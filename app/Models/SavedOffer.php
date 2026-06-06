<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedOffer extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'offer_id'];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }
}
