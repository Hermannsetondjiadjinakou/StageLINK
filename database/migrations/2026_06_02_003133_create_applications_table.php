<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('cv_path');
            $table->text('motivation')->nullable();
            $table->enum('status', ['pending', 'interview', 'accepted', 'rejected'])
                  ->default('pending');
            $table->text('internal_note')->nullable();
            $table->timestamps();

            // Un étudiant ne peut postuler qu'une seule fois à une offre
            $table->unique(['offer_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};