<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'offer_id', 'user_id', 'cv_path', 'motivation', 'status', 'internal_note',
    ];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}