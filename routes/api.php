<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SavedOfferController;
use App\Http\Controllers\ProfileController;

Route::post('/register',   [AuthController::class, 'register']);
Route::post('/login',      [AuthController::class, 'login']);
Route::get('/offers',      [OfferController::class, 'index']);
Route::get('/offers/{id}', [OfferController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::put('/profile',     [ProfileController::class, 'update']);
    Route::post('/profile/cv', [ProfileController::class, 'uploadCv']);

    Route::middleware('role:company')->group(function () {
        Route::post('/offers',           [OfferController::class, 'store']);
        Route::put('/offers/{id}/pause', [OfferController::class, 'pause']);
        Route::delete('/offers/{id}',    [OfferController::class, 'destroy']);
    });

    Route::post('/applications',            [ApplicationController::class, 'store']);
    Route::get('/applications/my',          [ApplicationController::class, 'myApplications']);
    Route::get('/applications/received',    [ApplicationController::class, 'received']);
    Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
    Route::delete('/applications/{id}',     [ApplicationController::class, 'withdraw']);

    Route::middleware('role:student')->prefix('saved-offers')->group(function () {
        Route::get('/',             [SavedOfferController::class, 'index']);
        Route::post('/',            [SavedOfferController::class, 'store']);
        Route::delete('/{offerId}', [SavedOfferController::class, 'destroy']);
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats',                   [AdminController::class, 'stats']);
        Route::get('/companies',               [AdminController::class, 'allCompanies']);
        Route::get('/companies/pending',       [AdminController::class, 'pendingCompanies']);
        Route::put('/companies/{id}/validate', [AdminController::class, 'validateCompany']);
        Route::put('/companies/{id}/reject',   [AdminController::class, 'rejectCompany']);
        Route::delete('/offers/{id}',          [AdminController::class, 'deleteOffer']);
    });
});