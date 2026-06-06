<?php

use App\Models\Offer;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    Offer::where('status', 'active')
         ->whereNotNull('deadline')
         ->where('deadline', '<', now())
         ->update(['status' => 'archived']);
})->daily();