<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gradeLevel = fake()->randomElement([7, 8, 9]);
        $classLetter = fake()->randomElement(['A', 'B', 'C', 'D']);
        
        return [
            'name' => $gradeLevel . $classLetter,
            'grade_level' => $gradeLevel,
            'academic_year' => '2024/2025',
        ];
    }

    /**
     * Indicate that the class is for grade 7.
     */
    public function grade7(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade_level' => 7,
            'name' => '7' . fake()->randomElement(['A', 'B', 'C']),
        ]);
    }

    /**
     * Indicate that the class is for grade 8.
     */
    public function grade8(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade_level' => 8,
            'name' => '8' . fake()->randomElement(['A', 'B', 'C']),
        ]);
    }

    /**
     * Indicate that the class is for grade 9.
     */
    public function grade9(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade_level' => 9,
            'name' => '9' . fake()->randomElement(['A', 'B', 'C']),
        ]);
    }
}