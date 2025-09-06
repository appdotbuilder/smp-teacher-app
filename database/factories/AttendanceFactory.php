<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
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
            'date' => fake()->dateTimeBetween('-3 months', 'now'),
            'status' => fake()->randomElement(['hadir', 'sakit', 'izin', 'alfa']),
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
        ];
    }

    /**
     * Indicate that the student is present.
     */
    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'hadir',
        ]);
    }

    /**
     * Indicate that the student is sick.
     */
    public function sick(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sakit',
            'notes' => 'Sakit demam',
        ]);
    }

    /**
     * Indicate that the student has permission.
     */
    public function permitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'izin',
            'notes' => 'Izin keperluan keluarga',
        ]);
    }

    /**
     * Indicate that the student is absent without permission.
     */
    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'alfa',
        ]);
    }
}