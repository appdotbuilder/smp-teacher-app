<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TeacherSubject;
use App\Models\Attendance;
use App\Models\Grade;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    /**
     * Display the teacher dashboard.
     */
    public function index()
    {
        $teacherId = auth()->id();
        $currentAcademicYear = '2024/2025';
        
        // Get teacher's subjects and classes
        $teacherSubjects = TeacherSubject::with(['subject', 'schoolClass'])
            ->where('user_id', $teacherId)
            ->where('academic_year', $currentAcademicYear)
            ->get();

        // Get recent attendance statistics
        $recentAttendances = Attendance::where('teacher_id', $teacherId)
            ->whereBetween('date', [now()->subDays(7), now()])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Get total unique students taught
        $classIds = $teacherSubjects->pluck('school_class_id')->unique();
        $totalStudents = \App\Models\Student::whereIn('school_class_id', $classIds)
            ->where('status', 'active')
            ->count();

        // Get recent grades statistics
        $recentGrades = Grade::where('teacher_id', $teacherId)
            ->where('academic_year', $currentAcademicYear)
            ->whereBetween('created_at', [now()->subWeek(), now()])
            ->count();

        $stats = [
            'total_classes' => $teacherSubjects->groupBy('school_class_id')->count(),
            'total_subjects' => $teacherSubjects->groupBy('subject_id')->count(),
            'total_students' => $totalStudents,
            'recent_attendances' => $recentAttendances,
            'recent_grades' => $recentGrades,
        ];

        return Inertia::render('teacher-dashboard', [
            'teacherSubjects' => $teacherSubjects,
            'stats' => $stats,
        ]);
    }
}