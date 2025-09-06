<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\TeacherSubject;
use App\Models\Attendance;
use App\Models\Grade;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create subjects
        $subjects = [
            ['name' => 'Matematika', 'code' => 'MTK', 'description' => 'Mata pelajaran Matematika'],
            ['name' => 'Bahasa Indonesia', 'code' => 'BIN', 'description' => 'Mata pelajaran Bahasa Indonesia'],
            ['name' => 'Bahasa Inggris', 'code' => 'BIG', 'description' => 'Mata pelajaran Bahasa Inggris'],
            ['name' => 'IPA (Ilmu Pengetahuan Alam)', 'code' => 'IPA', 'description' => 'Mata pelajaran IPA'],
            ['name' => 'IPS (Ilmu Pengetahuan Sosial)', 'code' => 'IPS', 'description' => 'Mata pelajaran IPS'],
            ['name' => 'Pendidikan Agama Islam', 'code' => 'PAI', 'description' => 'Mata pelajaran PAI'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }

        // Create school classes
        $classes = [
            ['name' => '7A', 'grade_level' => 7, 'academic_year' => '2024/2025'],
            ['name' => '7B', 'grade_level' => 7, 'academic_year' => '2024/2025'],
            ['name' => '8A', 'grade_level' => 8, 'academic_year' => '2024/2025'],
            ['name' => '8B', 'grade_level' => 8, 'academic_year' => '2024/2025'],
            ['name' => '9A', 'grade_level' => 9, 'academic_year' => '2024/2025'],
            ['name' => '9B', 'grade_level' => 9, 'academic_year' => '2024/2025'],
        ];

        foreach ($classes as $class) {
            SchoolClass::create($class);
        }

        // Create teachers
        $teachers = [
            ['name' => 'Ibu Sari', 'email' => 'sari@smp.ac.id', 'password' => bcrypt('password')],
            ['name' => 'Pak Budi', 'email' => 'budi@smp.ac.id', 'password' => bcrypt('password')],
            ['name' => 'Ibu Rani', 'email' => 'rani@smp.ac.id', 'password' => bcrypt('password')],
            ['name' => 'Pak Ahmad', 'email' => 'ahmad@smp.ac.id', 'password' => bcrypt('password')],
        ];

        foreach ($teachers as $teacher) {
            User::create($teacher);
        }

        // Create students for each class
        $schoolClasses = SchoolClass::all();
        foreach ($schoolClasses as $schoolClass) {
            Student::factory()->count(25)->create([
                'school_class_id' => $schoolClass->id,
            ]);
        }

        // Assign teachers to subjects and classes
        $subjects = Subject::all();
        $teachers = User::all();
        $classes = SchoolClass::all();

        foreach ($teachers as $teacher) {
            // Each teacher teaches 2-3 subjects to 2-3 classes
            $teacherSubjects = $subjects->random(random_int(2, 3));
            $teacherClasses = $classes->random(random_int(2, 3));

            foreach ($teacherSubjects as $subject) {
                foreach ($teacherClasses as $class) {
                    TeacherSubject::create([
                        'user_id' => $teacher->id,
                        'subject_id' => $subject->id,
                        'school_class_id' => $class->id,
                        'academic_year' => '2024/2025',
                    ]);
                }
            }
        }

        // Create sample attendance records
        $teacherSubjects = TeacherSubject::with(['schoolClass.students'])->get();
        foreach ($teacherSubjects as $teacherSubject) {
            $students = $teacherSubject->schoolClass->students;
            
            // Create attendance for the last 30 days
            for ($i = 0; $i < 30; $i++) {
                $date = now()->subDays($i);
                
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                foreach ($students as $student) {
                    Attendance::create([
                        'student_id' => $student->id,
                        'subject_id' => $teacherSubject->subject_id,
                        'school_class_id' => $teacherSubject->school_class_id,
                        'teacher_id' => $teacherSubject->user_id,
                        'date' => $date->format('Y-m-d'),
                        'status' => fake()->randomElement(['hadir', 'hadir', 'hadir', 'hadir', 'sakit', 'izin', 'alfa']), // Most students are present
                        'notes' => fake()->boolean(10) ? fake()->sentence() : null,
                    ]);
                }
            }
        }

        // Create sample grades
        foreach ($teacherSubjects as $teacherSubject) {
            $students = $teacherSubject->schoolClass->students;
            
            foreach ($students as $student) {
                // Create grades for each type
                $gradeTypes = ['harian', 'uts', 'uas'];
                
                foreach ($gradeTypes as $type) {
                    Grade::create([
                        'student_id' => $student->id,
                        'subject_id' => $teacherSubject->subject_id,
                        'school_class_id' => $teacherSubject->school_class_id,
                        'teacher_id' => $teacherSubject->user_id,
                        'type' => $type,
                        'score' => fake()->randomFloat(2, 70, 95),
                        'academic_year' => '2024/2025',
                        'semester' => 'ganjil',
                        'notes' => fake()->boolean(20) ? fake()->sentence() : null,
                    ]);
                }
            }
        }
    }
}