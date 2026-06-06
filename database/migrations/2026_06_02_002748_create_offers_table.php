<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->text('profile')->nullable();
            $table->text('missions')->nullable();
            $table->string('city');
            $table->string('sector');
            $table->unsignedTinyInteger('duration');
            $table->enum('type', ['Stage académique', 'Stage professionnel']);
            $table->date('start_date')->nullable();
            $table->date('deadline')->nullable();
            $table->string('salary')->nullable();
            $table->enum('status', ['active', 'paused', 'archived'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};