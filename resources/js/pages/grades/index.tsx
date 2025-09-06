import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

interface Props {
    teacherSubjects: TeacherSubject[];
    [key: string]: unknown;
}

export default function GradesIndex({ teacherSubjects }: Props) {
    const gradeTypes = [
        { value: 'harian', label: 'Nilai Harian', icon: '📝', description: 'Input nilai tugas dan kuis harian' },
        { value: 'uts', label: 'Nilai UTS', icon: '📖', description: 'Input nilai ujian tengah semester' },
        { value: 'uas', label: 'Nilai UAS', icon: '🎯', description: 'Input nilai ujian akhir semester' },
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📊 Manajemen Penilaian</h1>
                        <p className="text-gray-600 mt-1">
                            Kelola nilai harian, UTS, dan UAS untuk semua kelas dan mata pelajaran
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">🏫</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Set(teacherSubjects.map(ts => ts.schoolClass.id)).size}
                                </p>
                                <p className="text-gray-600">Kelas Diampu</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <span className="text-2xl">📖</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Set(teacherSubjects.map(ts => ts.subject.id)).size}
                                </p>
                                <p className="text-gray-600">Mata Pelajaran</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <span className="text-2xl">⚖️</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">1:1:1</p>
                                <p className="text-gray-600">Bobot Nilai</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <span className="text-2xl">📅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">Ganjil</p>
                                <p className="text-gray-600">Semester</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Grade Types Info */}
                <div className="grid md:grid-cols-3 gap-6">
                    {gradeTypes.map((type) => (
                        <Card key={type.value} className="p-6">
                            <div className="text-center">
                                <div className="text-4xl mb-4">{type.icon}</div>
                                <h3 className="font-semibold text-lg mb-2">{type.label}</h3>
                                <p className="text-gray-600 text-sm">{type.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Classes and Subjects */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">📚 Pilih Kelas dan Mata Pelajaran</h2>
                    
                    {teacherSubjects.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">📖</div>
                            <p className="text-gray-500 text-lg">Belum ada kelas yang ditugaskan</p>
                            <p className="text-gray-400 mt-2">Hubungi administrator untuk penugasan kelas dan mata pelajaran.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teacherSubjects.map((ts) => (
                                <div key={ts.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                Kelas {ts.schoolClass.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {ts.subject.name}
                                            </p>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {ts.subject.code}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-2">
                                            <Link href={`/grades/${ts.id}?type=harian`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    📝 Harian
                                                </Button>
                                            </Link>
                                            <Link href={`/grades/${ts.id}?type=uts`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    📖 UTS
                                                </Button>
                                            </Link>
                                            <Link href={`/grades/${ts.id}?type=uas`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    🎯 UAS
                                                </Button>
                                            </Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href={`/grades/${ts.id}?view=recap`}>
                                                <Button className="w-full">
                                                    📊 Rekap Nilai
                                                </Button>
                                            </Link>
                                            <Button variant="outline" className="w-full" disabled>
                                                🖨️ PDF
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Grade Calculation Info */}
                <Card className="p-6 bg-green-50 border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3">📐 Cara Perhitungan Nilai Akhir</h3>
                    <div className="space-y-2 text-green-800">
                        <div className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <p className="text-sm"><strong>Nilai Harian</strong>: Rata-rata dari semua nilai tugas dan kuis (Bobot: 33.3%)</p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <p className="text-sm"><strong>Nilai UTS</strong>: Nilai ujian tengah semester (Bobot: 33.3%)</p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <p className="text-sm"><strong>Nilai UAS</strong>: Nilai ujian akhir semester (Bobot: 33.3%)</p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <p className="text-sm"><strong>Nilai Akhir</strong>: (Harian + UTS + UAS) ÷ 3</p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <p className="text-sm"><strong>Grade</strong>: A (≥90), B (80-89), C (70-79), D (60-69), E (&lt;60)</p>
                        </div>
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}