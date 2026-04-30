<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminUserSeeder extends Seeder
{
    /**
     * Seed the initial super admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'eric@ikonoverde.com'],
            [
                'name' => 'Eric',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
