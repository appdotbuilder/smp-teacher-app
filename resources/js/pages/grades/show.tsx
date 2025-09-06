import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Student {
    id: number;
    nis: string;
    name: string;
    gender: string;
}

interface Subject {
    id: number;
    name: string;
    code: string;
}

interface SchoolClass {
    id: number;
    name: string;
    grade_level: number;
}

interface TeacherSubject {
    id: number;
    subject: Subject;
    schoolClass: SchoolClass;
    academic_year: string;
}

interface ExistingGrade {
    id: number;
    student_id: number;
    score: number;
    notes: string | null;
}

interface Props {
    teacherSubject: TeacherSubject;
    students: Student[];
    existingGrades: Record<number, ExistingGrade>;
    gradeType: string;
    semester: string;
    [key: string]: unknown;
}

export default function GradesShow({ teacherSubject, students, existingGrades, gradeType, semester }: Props) {
    const [gradesData, setGradesData] = useState<Record<number, { score: string; notes: string }>>(() => {
        const initial: Record<number, { score: string; notes: string }> = {};
        students.forEach(student => {
            const existing = existingGrades[student.id];
            initial[student.id] = {
                score: existing?.score?.toString() || '',
                notes: existing?.notes || '',
            };
        });
        return initial;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const gradeTypeLabels = {
        harian: { label: 'Nilai Harian', icon: '📝' },
        uts: { label: 'Nilai UTS', icon: '📖' },
        uas: { label: 'Nilai UAS', icon: '🎯' },
    };

    const updateGrade = (studentId: number, field: 'score' | 'notes', value: string) => {
        setGradesData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Filter out students with empty scores
        const grades = students
            .filter(student => gradesData[student.id].score.trim() !== '')
            .map(student => ({
                student_id: student.id,
                score: parseFloat(gradesData[student.id].score),
                notes: gradesData[student.id].notes,
            }));

        if (grades.length === 0) {
            alert('Mohon masukkan minimal satu nilai.');
            setIsSubmitting(false);
            return;
        }

        router.post('/grades', {
            teacher_subject_id: teacherSubject.id,
            type: gradeType,
            semester,
            grades,
        }, {
            preserveState: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const getGradeLetter = (score: number): string => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'E';
    };

    const currentGradeType = gradeTypeLabels[gradeType as keyof typeof gradeTypeLabels] || gradeTypeLabels.harian;

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/grades" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
                            ← Kembali ke Daftar Penilaian
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentGradeType.icon} {currentGradeType.label}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {teacherSubject.subject.name} • Kelas {teacherSubject.schoolClass.name} • Semester {semester}
                        </p>
                    </div>
                </div>

                {/* Class Info */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">📚</div>
                            <div>
                                <h3 className="font-semibold text-blue-900">{teacherSubject.subject.name}</h3>
                                <p className="text-blue-700 text-sm">Kelas {teacherSubject.schoolClass.name} • {students.length} siswa</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                {teacherSubject.subject.code}
                            </span>
                            <p className="text-blue-700 text-sm mt-1">Semester {semester}</p>
                        </div>
                    </div>
                </Card>

                {/* Grade Navigation */}
                <div className="flex space-x-2">
                    <Link href={`/grades/${teacherSubject.id}?type=harian&semester=${semester}`}>
                        <Button 
                            variant={gradeType === 'harian' ? 'default' : 'outline'} 
                            size="sm"
                        >
                            📝 Harian
                        </Button>
                    </Link>
                    <Link href={`/grades/${teacherSubject.id}?type=uts&semester=${semester}`}>
                        <Button 
                            variant={gradeType === 'uts' ? 'default' : 'outline'} 
                            size="sm"
                        >
                            📖 UTS
                        </Button>
                    </Link>
                    <Link href={`/grades/${teacherSubject.id}?type=uas&semester=${semester}`}>
                        <Button 
                            variant={gradeType === 'uas' ? 'default' : 'outline'} 
                            size="sm"
                        >
                            🎯 UAS
                        </Button>
                    </Link>
                </div>

                {/* Grades Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">👥 Input Nilai Siswa</h2>
                            <div className="flex space-x-2">
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '💾 Menyimpan...' : '💾 Simpan Nilai'}
                                </Button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start">
                                <span className="text-yellow-600 mr-2">ℹ️</span>
                                <div className="text-sm text-yellow-800">
                                    <p><strong>Petunjuk:</strong></p>
                                    <ul className="mt-2 space-y-1">
                                        <li>• Masukkan nilai antara 0-100</li>
                                        <li>• Kosongkan nilai jika belum ada</li>
                                        <li>• Catatan bersifat opsional</li>
                                        <li>• Sistem akan otomatis menghitung grade huruf</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Students List */}
                        <div className="space-y-4">
                            {students.map((student, index) => {
                                const score = parseFloat(gradesData[student.id].score);
                                const isValidScore = !isNaN(score) && score >= 0 && score <= 100;
                                const gradeLetter = isValidScore ? getGradeLetter(score) : '';

                                return (
                                    <div key={student.id} className="border rounded-lg p-4">
                                        <div className="grid md:grid-cols-12 gap-4 items-center">
                                            {/* Student Info */}
                                            <div className="md:col-span-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{student.name}</h4>
                                                        <p className="text-gray-500 text-sm">NIS: {student.nis}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Score Input */}
                                            <div className="md:col-span-2">
                                                <input
                                                    type="number"
                                                    placeholder="0-100"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={gradesData[student.id].score}
                                                    onChange={(e) => updateGrade(student.id, 'score', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Grade Letter */}
                                            <div className="md:col-span-1 text-center">
                                                {gradeLetter && (
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                                        gradeLetter === 'A' ? 'bg-green-100 text-green-800' :
                                                        gradeLetter === 'B' ? 'bg-blue-100 text-blue-800' :
                                                        gradeLetter === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                                        gradeLetter === 'D' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {gradeLetter}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Notes */}
                                            <div className="md:col-span-5">
                                                <input
                                                    type="text"
                                                    placeholder="Catatan (opsional)"
                                                    value={gradesData[student.id].notes}
                                                    onChange={(e) => updateGrade(student.id, 'notes', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">📊 Statistik Nilai</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {['A', 'B', 'C', 'D', 'E'].map(grade => {
                                    const count = students.filter(student => {
                                        const score = parseFloat(gradesData[student.id].score);
                                        return !isNaN(score) && getGradeLetter(score) === grade;
                                    }).length;
                                    return (
                                        <div key={grade} className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                                            <p className="text-sm text-gray-600">Grade {grade}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </form>
            </div>
        </AppShell>
    );
}