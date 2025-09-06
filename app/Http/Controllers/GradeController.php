<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TeacherSubject;
use App\Models\Student;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    /**
     * Display the grade management page.
     */
    public function index()
    {
        $teacherSubjects = TeacherSubject::with(['subject', 'schoolClass'])
            ->where('user_id', auth()->id())
            ->where('academic_year', '2024/2025')
            ->get();

        return Inertia::render('grades/index', [
            'teacherSubjects' => $teacherSubjects
        ]);
    }

    /**
     * Show grade input form for a specific class and subject.
     */
    public function show(TeacherSubject $teacherSubject, Request $request)
    {
        if ($teacherSubject->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        // Check if this is a recap request
        if ($request->get('view') === 'recap') {
            return $this->showRecap($teacherSubject, $request);
        }

        $gradeType = $request->get('type', 'harian');
        $semester = $request->get('semester', 'ganjil');

        $students = Student::where('school_class_id', $teacherSubject->school_class_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        // Get existing grades for this type
        $existingGrades = Grade::where('subject_id', $teacherSubject->subject_id)
            ->where('school_class_id', $teacherSubject->school_class_id)
            ->where('teacher_id', auth()->id())
            ->where('type', $gradeType)
            ->where('semester', $semester)
            ->where('academic_year', '2024/2025')
            ->get()
            ->keyBy('student_id');

        return Inertia::render('grades/show', [
            'teacherSubject' => $teacherSubject->load(['subject', 'schoolClass']),
            'students' => $students,
            'existingGrades' => $existingGrades,
            'gradeType' => $gradeType,
            'semester' => $semester,
        ]);
    }

    /**
     * Store or update grades.
     */
    public function store(Request $request)
    {
        $request->validate([
            'teacher_subject_id' => 'required|exists:teacher_subjects,id',
            'type' => 'required|in:harian,uts,uas',
            'semester' => 'required|in:ganjil,genap',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.score' => 'required|numeric|min:0|max:100',
            'grades.*.notes' => 'nullable|string|max:255',
        ]);

        $teacherSubject = TeacherSubject::findOrFail($request->teacher_subject_id);
        if ($teacherSubject->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        foreach ($request->grades as $gradeData) {
            Grade::updateOrCreate(
                [
                    'student_id' => $gradeData['student_id'],
                    'subject_id' => $teacherSubject->subject_id,
                    'school_class_id' => $teacherSubject->school_class_id,
                    'teacher_id' => auth()->id(),
                    'type' => $request->type,
                    'semester' => $request->semester,
                    'academic_year' => '2024/2025',
                ],
                [
                    'score' => $gradeData['score'],
                    'notes' => $gradeData['notes'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * Show grade recap (private helper method).
     */
    protected function showRecap(TeacherSubject $teacherSubject, Request $request)
    {
        $semester = $request->get('semester', 'ganjil');

        $students = Student::where('school_class_id', $teacherSubject->school_class_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        $grades = Grade::where('subject_id', $teacherSubject->subject_id)
            ->where('school_class_id', $teacherSubject->school_class_id)
            ->where('teacher_id', auth()->id())
            ->where('semester', $semester)
            ->where('academic_year', '2024/2025')
            ->get();

        // Group grades by student and type
        $gradesByStudent = $grades->groupBy('student_id');

        // Calculate final grades for each student
        $gradesSummary = $students->map(function ($student) use ($gradesByStudent) {
            $studentGrades = $gradesByStudent->get($student->id, collect());
            
            $harian = $studentGrades->where('type', 'harian')->avg('score') ?: 0;
            $uts = $studentGrades->where('type', 'uts')->avg('score') ?: 0;
            $uas = $studentGrades->where('type', 'uas')->avg('score') ?: 0;
            
            // Calculate final grade with equal weights (1/3 each)
            $finalGrade = ($harian + $uts + $uas) / 3;
            
            return [
                'student' => $student,
                'harian' => round($harian, 2),
                'uts' => round($uts, 2),
                'uas' => round($uas, 2),
                'final' => round($finalGrade, 2),
                'grade_letter' => $this->getGradeLetter($finalGrade),
            ];
        });

        return Inertia::render('grades/recap', [
            'teacherSubject' => $teacherSubject->load(['subject', 'schoolClass']),
            'gradesSummary' => $gradesSummary,
            'semester' => $semester,
        ]);
    }

    /**
     * Convert numeric grade to letter grade.
     */
    protected function getGradeLetter(float $score): string
    {
        if ($score >= 90) return 'A';
        if ($score >= 80) return 'B';
        if ($score >= 70) return 'C';
        if ($score >= 60) return 'D';
        return 'E';
    }
}