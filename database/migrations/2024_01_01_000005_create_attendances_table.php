<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('school_class_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->date('date')->comment('Attendance date');
            $table->enum('status', ['hadir', 'sakit', 'izin', 'alfa'])->comment('hadir=Present, sakit=Sick, izin=Permitted Leave, alfa=Absent');
            $table->text('notes')->nullable()->comment('Additional notes for attendance');
            $table->timestamps();
            
            $table->unique(['student_id', 'subject_id', 'school_class_id', 'date']);
            $table->index(['school_class_id', 'subject_id', 'date']);
            $table->index(['teacher_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};