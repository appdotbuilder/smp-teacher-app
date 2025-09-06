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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('school_class_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['harian', 'uts', 'uas'])->comment('harian=Daily, uts=Mid-term, uas=Final');
            $table->decimal('score', 5, 2)->comment('Grade score (0.00-100.00)');
            $table->string('academic_year')->comment('Academic year (e.g., 2024/2025)');
            $table->string('semester', 10)->comment('Semester (ganjil/genap)');
            $table->text('notes')->nullable()->comment('Additional notes for grade');
            $table->timestamps();
            
            $table->index(['student_id', 'subject_id', 'type']);
            $table->index(['school_class_id', 'subject_id', 'academic_year', 'semester']);
            $table->index(['teacher_id', 'academic_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};