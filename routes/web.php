<?php

use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\GradeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', [TeacherDashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
    
    // Attendance routes
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/{teacherSubject}', [AttendanceController::class, 'show'])->name('attendance.show');
    Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');
    
    // Grades routes
    Route::get('/grades', [GradeController::class, 'index'])->name('grades.index');
    Route::get('/grades/{teacherSubject}', [GradeController::class, 'show'])->name('grades.show');
    Route::post('/grades', [GradeController::class, 'store'])->name('grades.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
