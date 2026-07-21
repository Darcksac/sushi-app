<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Admin Usuario',
            'email' => 'admin@sushi.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Cliente Prueba',
            'email' => 'cliente@sushi.com',
            'password' => bcrypt('password'),
            'role' => 'client',
        ]);

        \App\Models\Dish::create([
            'name' => 'Sushi Roll Clásico',
            'description' => 'Roll de salmón, aguacate y queso crema.',
            'price' => 120.00,
            'is_available' => true,
        ]);
        
        \App\Models\Dish::create([
            'name' => 'Nigiri de Atún',
            'description' => 'Corte fino de atún sobre arroz de sushi.',
            'price' => 85.00,
            'is_available' => true,
        ]);
    }
}
