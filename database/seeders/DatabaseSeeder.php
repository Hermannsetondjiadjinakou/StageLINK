<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'      => 'Admin StageLink',
            'email'     => 'admin@stagelink.bj',
            'password'  => Hash::make('admin1234'),
            'role'      => 'admin',
            'validated' => true,
        ]);

        // Entreprise validée
        $company = User::create([
            'name'         => 'RH Nextmux',
            'email'        => 'rh@nextmux.bj',
            'password'     => Hash::make('password'),
            'role'         => 'company',
            'company_name' => 'Nextmux SARL',
            'sector'       => 'Informatique',
            'city'         => 'Cotonou',
            'validated'    => true,
        ]);

        // Entreprise non validée
        User::create([
            'name'         => 'RH BeniFinance',
            'email'        => 'rh@benifinance.bj',
            'password'     => Hash::make('password'),
            'role'         => 'company',
            'company_name' => 'BeniFinance SA',
            'sector'       => 'Finance',
            'city'         => 'Cotonou',
            'validated'    => false,
        ]);

        // Étudiants
        $student = User::create([
            'name'     => 'Hermann Adjinakou',
            'email'    => 'hermann@etudiant.bj',
            'password' => Hash::make('password'),
            'role'     => 'student',
            'filiere'  => 'Informatique',
            'niveau'   => 'Licence 3',
        ]);

        User::create([
            'name'     => 'Istianath Dissou',
            'email'    => 'istia@etudiant.bj',
            'password' => Hash::make('password'),
            'role'     => 'student',
            'filiere'  => 'Gestion',
            'niveau'   => 'Master 1',
        ]);

        // Offres
        $offer = Offer::create([
            'user_id'     => $company->id,
            'title'       => 'Stagiaire Développeur Web',
            'description' => 'Vous participerez au développement de nos applications web avec Laravel et React.',
            'profile'     => "Étudiant en informatique\nBonnes notions de PHP et JavaScript",
            'city'        => 'Cotonou',
            'sector'      => 'Informatique',
            'duration'    => 3,
            'type'        => 'Stage académique',
            'start_date'  => now()->addMonth(),
            'status'      => 'active',
        ]);

        Offer::create([
            'user_id'     => $company->id,
            'title'       => 'Stagiaire Data / BI',
            'description' => 'Mission orientée analyse de données et reporting avec Power BI.',
            'city'        => 'Cotonou',
            'sector'      => 'Informatique',
            'duration'    => 2,
            'type'        => 'Stage professionnel',
            'status'      => 'active',
        ]);

        // Candidature
        Application::create([
            'offer_id'   => $offer->id,
            'user_id'    => $student->id,
            'cv_path'    => 'https://example.com/cv-placeholder.pdf',
            'motivation' => 'Je suis très motivé par ce poste.',
            'status'     => 'pending',
        ]);
    }
}