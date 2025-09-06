<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Grade>
 */
class GradeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'subject_id' => Subject::factory(),
            'school_class_id' => SchoolClass::factory(),
            'teacher_id' => User::factory(),
            'type' => fake()->randomElement(['harian', 'uts', 'uas']),
            'score' => fake()->randomFloat(2, 60, 100),
            'academic_year' => '2024/2025',
            'semester' => fake()->randomElement(['ganjil', 'genap']),
            'notes' => fake()->boolean(20) ? fake()->sentence() : null,
        ];
    }

    /**
     * Indicate that the grade is a daily grade.
     */
    public function daily(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'harian',
            'score' => fake()->randomFloat(2, 70, 95),
        ]);
    }

    /**
     * Indicate that the grade is a mid-term exam grade.
     */
    public function midterm(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'uts',
            'score' => fake()->randomFloat(2, 65, 90),
        ]);
    }

    /**
     * Indicate that the grade is a final exam grade.
     */
    public function final(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'uas',
            'score' => fake()->randomFloat(2, 60, 85),
        ]);
    }
}