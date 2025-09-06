import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Student {
    id: number;
    nis: string;
    name: string;
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

interface GradeSummary {
    student: Student;
    harian: number;
    uts: number;
    uas: number;
    final: number;
    grade_letter: string;
}

interface Props {
    teacherSubject: TeacherSubject;
    gradesSummary: GradeSummary[];
    semester: string;
    [key: string]: unknown;
}

export default function GradesRecap({ teacherSubject, gradesSummary, semester }: Props) {
    const gradeColors = {
        A: 'bg-green-100 text-green-800',
        B: 'bg-blue-100 text-blue-800', 
        C: 'bg-yellow-100 text-yellow-800',
        D: 'bg-orange-100 text-orange-800',
        E: 'bg-red-100 text-red-800',
    };

    const getGradeStats = () => {
        const stats = { A: 0, B: 0, C: 0, D: 0, E: 0 };
        gradesSummary.forEach(grade => {
            stats[grade.grade_letter as keyof typeof stats]++;
        });
        return stats;
    };

    const getAverageScore = (type: 'harian' | 'uts' | 'uas' | 'final') => {
        if (gradesSummary.length === 0) return 0;
        const total = gradesSummary.reduce((sum, grade) => sum + grade[type], 0);
        return Math.round((total / gradesSummary.length) * 100) / 100;
    };

    const gradeStats = getGradeStats();

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
                            📊 Rekap Nilai - {teacherSubject.subject.name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelas {teacherSubject.schoolClass.name} • Semester {semester} • {teacherSubject.academic_year}
                        </p>
                    </div>
                    <Button variant="outline" disabled>
                        🖨️ Cetak PDF
                    </Button>
                </div>

                {/* Class Info */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">📚</div>
                            <div>
                                <h3 className="font-semibold text-blue-900">{teacherSubject.subject.name}</h3>
                                <p className="text-blue-700 text-sm">
                                    Kelas {teacherSubject.schoolClass.name} • {gradesSummary.length} siswa • Semester {semester}
                                </p>
                            </div>
                        </div>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                            {teacherSubject.subject.code}
                        </span>
                    </div>
                </Card>

                {/* Grade Statistics */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Grade Distribution */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">📈 Distribusi Grade</h2>
                        <div className="space-y-3">
                            {Object.entries(gradeStats).map(([grade, count]) => (
                                <div key={grade} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${gradeColors[grade as keyof typeof gradeColors]}`}>
                                            {grade}
                                        </span>
                                        <span className="text-gray-700">Grade {grade}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-lg">{count}</span>
                                        <span className="text-gray-500 text-sm">
                                            ({gradesSummary.length > 0 ? Math.round((count / gradesSummary.length) * 100) : 0}%)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Average Scores */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">📊 Nilai Rata-rata Kelas</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">📝 Nilai Harian</span>
                                <span className="font-semibold text-lg">{getAverageScore('harian')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">📖 Nilai UTS</span>
                                <span className="font-semibold text-lg">{getAverageScore('uts')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">🎯 Nilai UAS</span>
                                <span className="font-semibold text-lg">{getAverageScore('uas')}</span>
                            </div>
                            <hr />
                            <div className="flex items-center justify-between">
                                <span className="text-gray-900 font-semibold">🏆 Nilai Akhir</span>
                                <span className="font-bold text-xl text-blue-600">{getAverageScore('final')}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Student Grades Table */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">👥 Daftar Nilai Siswa</h2>
                    
                    {gradesSummary.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-4">📝</div>
                            <p>Belum ada nilai untuk semester ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg font-semibold text-sm text-gray-700">
                                <div className="col-span-4">Nama Siswa</div>
                                <div className="col-span-2 text-center">Harian</div>
                                <div className="col-span-1 text-center">UTS</div>
                                <div className="col-span-1 text-center">UAS</div>
                                <div className="col-span-2 text-center">Nilai Akhir</div>
                                <div className="col-span-2 text-center">Grade</div>
                            </div>

                            {/* Table Body */}
                            {gradesSummary
                                .sort((a, b) => b.final - a.final) // Sort by final grade descending
                                .map((grade, index) => (
                                    <div key={grade.student.id} className="grid grid-cols-12 gap-4 p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="col-span-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{grade.student.name}</h4>
                                                    <p className="text-gray-500 text-sm">NIS: {grade.student.nis}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className="font-semibold">{grade.harian > 0 ? grade.harian : '-'}</span>
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className="font-semibold">{grade.uts > 0 ? grade.uts : '-'}</span>
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className="font-semibold">{grade.uas > 0 ? grade.uas : '-'}</span>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className="font-bold text-lg text-blue-600">
                                                {grade.final > 0 ? grade.final : '-'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            {grade.grade_letter && (
                                                <span className={`inline-flex items-center justify-center w-12 h-8 rounded-full text-sm font-bold ${gradeColors[grade.grade_letter as keyof typeof gradeColors]}`}>
                                                    {grade.grade_letter}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>

                {/* Performance Analysis */}
                <Card className="p-6 bg-green-50 border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3">📈 Analisis Kinerja Kelas</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-green-800 font-semibold">Performa Terbaik:</p>
                            <p className="text-green-700 text-sm">
                                Grade A & B: {gradeStats.A + gradeStats.B} siswa ({gradesSummary.length > 0 ? Math.round(((gradeStats.A + gradeStats.B) / gradesSummary.length) * 100) : 0}%)
                            </p>
                        </div>
                        <div>
                            <p className="text-green-800 font-semibold">Perlu Bimbingan:</p>
                            <p className="text-green-700 text-sm">
                                Grade D & E: {gradeStats.D + gradeStats.E} siswa ({gradesSummary.length > 0 ? Math.round(((gradeStats.D + gradeStats.E) / gradesSummary.length) * 100) : 0}%)
                            </p>
                        </div>
                        <div>
                            <p className="text-green-800 font-semibold">Nilai Tertinggi:</p>
                            <p className="text-green-700 text-sm">
                                {gradesSummary.length > 0 ? Math.max(...gradesSummary.map(g => g.final)) : 0}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <Link href={`/grades/${teacherSubject.id}?type=harian&semester=${semester}`}>
                        <Button>📝 Edit Nilai Harian</Button>
                    </Link>
                    <Link href={`/grades/${teacherSubject.id}?type=uts&semester=${semester}`}>
                        <Button variant="outline">📖 Edit UTS</Button>
                    </Link>
                    <Link href={`/grades/${teacherSubject.id}?type=uas&semester=${semester}`}>
                        <Button variant="outline">🎯 Edit UAS</Button>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}