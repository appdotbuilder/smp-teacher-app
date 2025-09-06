<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TeacherSubject;
use App\Models\Student;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display the attendance management page.
     */
    public function index()
    {
        $teacherSubjects = TeacherSubject::with(['subject', 'schoolClass'])
            ->where('user_id', auth()->id())
            ->where('academic_year', '2024/2025')
            ->get();

        return Inertia::render('attendance/index', [
            'teacherSubjects' => $teacherSubjects
        ]);
    }

    /**
     * Show attendance form for a specific class and subject.
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

        $students = Student::where('school_class_id', $teacherSubject->school_class_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        $today = now()->format('Y-m-d');
        
        // Get today's attendance if exists
        $todayAttendances = Attendance::where('subject_id', $teacherSubject->subject_id)
            ->where('school_class_id', $teacherSubject->school_class_id)
            ->where('teacher_id', auth()->id())
            ->where('date', $today)
            ->get()
            ->keyBy('student_id');

        return Inertia::render('attendance/show', [
            'teacherSubject' => $teacherSubject->load(['subject', 'schoolClass']),
            'students' => $students,
            'todayAttendances' => $todayAttendances,
            'today' => $today,
        ]);
    }

    /**
     * Store attendance records.
     */
    public function store(Request $request)
    {
        $request->validate([
            'teacher_subject_id' => 'required|exists:teacher_subjects,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:hadir,sakit,izin,alfa',
            'attendances.*.notes' => 'nullable|string|max:255',
        ]);

        $teacherSubject = TeacherSubject::findOrFail($request->teacher_subject_id);
        if ($teacherSubject->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        foreach ($request->attendances as $attendanceData) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $attendanceData['student_id'],
                    'subject_id' => $teacherSubject->subject_id,
                    'school_class_id' => $teacherSubject->school_class_id,
                    'date' => $request->date,
                ],
                [
                    'teacher_id' => auth()->id(),
                    'status' => $attendanceData['status'],
                    'notes' => $attendanceData['notes'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'Absensi berhasil disimpan.');
    }

    /**
     * Show attendance recap (private helper method).
     */
    protected function showRecap(TeacherSubject $teacherSubject, Request $request)
    {
        $students = Student::where('school_class_id', $teacherSubject->school_class_id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        $attendances = Attendance::where('subject_id', $teacherSubject->subject_id)
            ->where('school_class_id', $teacherSubject->school_class_id)
            ->where('teacher_id', auth()->id())
            ->whereBetween('date', [now()->subMonth(), now()])
            ->orderBy('date')
            ->get();

        // Group attendances by date and student
        $attendancesByDate = $attendances->groupBy('date');
        $attendancesByStudent = $attendances->groupBy('student_id');

        // Calculate attendance statistics for each student
        $statistics = $students->map(function ($student) use ($attendancesByStudent) {
            $studentAttendances = $attendancesByStudent->get($student->id, collect());
            
            return [
                'student' => $student,
                'hadir' => $studentAttendances->where('status', 'hadir')->count(),
                'sakit' => $studentAttendances->where('status', 'sakit')->count(),
                'izin' => $studentAttendances->where('status', 'izin')->count(),
                'alfa' => $studentAttendances->where('status', 'alfa')->count(),
                'total' => $studentAttendances->count(),
            ];
        });

        return Inertia::render('attendance/recap', [
            'teacherSubject' => $teacherSubject->load(['subject', 'schoolClass']),
            'attendancesByDate' => $attendancesByDate,
            'statistics' => $statistics,
            'dateRange' => [
                'start' => now()->subMonth()->format('Y-m-d'),
                'end' => now()->format('Y-m-d'),
            ],
        ]);
    }
}