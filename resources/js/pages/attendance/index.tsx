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

export default function AttendanceIndex({ teacherSubjects }: Props) {
    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">✅ Manajemen Absensi</h1>
                        <p className="text-gray-600 mt-1">
                            Kelola absensi siswa untuk semua kelas dan mata pelajaran yang Anda ampu
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
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
                                <span className="text-2xl">📅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Date().toLocaleDateString('id-ID', { 
                                        day: 'numeric', 
                                        month: 'short' 
                                    })}
                                </p>
                                <p className="text-gray-600">Hari Ini</p>
                            </div>
                        </div>
                    </Card>
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
                                        <Link href={`/attendance/${ts.id}`}>
                                            <Button className="w-full">
                                                📝 Input Absensi Hari Ini
                                            </Button>
                                        </Link>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href={`/attendance/${ts.id}?view=recap`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    📊 Rekap
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="sm" className="w-full" disabled>
                                                🖨️ PDF
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Instructions */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">💡 Petunjuk Penggunaan</h3>
                    <div className="space-y-2 text-blue-800">
                        <div className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <p className="text-sm">Pilih kelas dan mata pelajaran untuk mulai input absensi</p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <p className="text-sm">Status absensi: <strong>Hadir</strong>, <strong>Sakit</strong>, <strong>Izin</strong>, <strong>Alfa</strong></p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <p className="text-sm">Gunakan fitur rekap untuk melihat statistik kehadiran siswa</p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <p className="text-sm">Laporan PDF dapat dicetak untuk dokumentasi (segera hadir)</p>
                        </div>
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}