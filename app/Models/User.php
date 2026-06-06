<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'filiere', 'niveau', 'cv_path',
        'company_name', 'sector', 'city', 'description', 'validated',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'validated' => 'boolean',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function savedOffers()
    {
        return $this->hasMany(SavedOffer::class);
    }

    public function isStudent(): bool { return $this->role === 'student'; }
    public function isCompany(): bool { return $this->role === 'company'; }
    public function isAdmin(): bool   { return $this->role === 'admin'; }
}