<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = [
            ['name' => 'Matematika', 'code' => 'MTK'],
            ['name' => 'Bahasa Indonesia', 'code' => 'BIN'],
            ['name' => 'Bahasa Inggris', 'code' => 'BIG'],
            ['name' => 'IPA (Ilmu Pengetahuan Alam)', 'code' => 'IPA'],
            ['name' => 'IPS (Ilmu Pengetahuan Sosial)', 'code' => 'IPS'],
            ['name' => 'Pendidikan Agama Islam', 'code' => 'PAI'],
            ['name' => 'Pendidikan Pancasila dan Kewarganegaraan', 'code' => 'PKN'],
            ['name' => 'Seni Budaya', 'code' => 'SBU'],
            ['name' => 'Pendidikan Jasmani', 'code' => 'PJO'],
            ['name' => 'Prakarya', 'code' => 'PKY'],
        ];

        $subject = fake()->randomElement($subjects);

        return [
            'name' => $subject['name'],
            'code' => $subject['code'],
            'description' => fake()->paragraph(),
        ];
    }
}