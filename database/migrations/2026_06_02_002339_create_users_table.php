<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['student', 'company', 'admin'])->default('student');

            // Champs étudiant
            $table->string('filiere')->nullable();
            $table->string('niveau')->nullable();
            $table->string('cv_path')->nullable();

            // Champs entreprise
            $table->string('company_name')->nullable();
            $table->string('sector')->nullable();
            $table->string('city')->nullable();
            $table->text('description')->nullable();
            $table->boolean('validated')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};