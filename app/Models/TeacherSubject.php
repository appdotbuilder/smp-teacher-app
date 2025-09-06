<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\TeacherSubject
 *
 * @property int $id
 * @property int $user_id
 * @property int $subject_id
 * @property int $school_class_id
 * @property string $academic_year
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read \App\Models\User $teacher
 * @property-read \App\Models\Subject $subject
 * @property-read \App\Models\SchoolClass $schoolClass
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject query()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereAcademicYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereSchoolClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereUserId($value)
 * @method static \Database\Factories\TeacherSubjectFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class TeacherSubject extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'subject_id',
        'school_class_id',
        'academic_year',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'integer',
        'subject_id' => 'integer',
        'school_class_id' => 'integer',
    ];

    /**
     * Get the teacher that owns the teacher subject.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the subject that owns the teacher subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the school class that owns the teacher subject.
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }
}