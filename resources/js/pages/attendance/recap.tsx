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

interface AttendanceRecord {
    id: number;
    student_id: number;
    date: string;
    status: string;
    notes: string | null;
}

interface StudentStatistics {
    student: Student;
    hadir: number;
    sakit: number;
    izin: number;
    alfa: number;
    total: number;
}

interface Props {
    teacherSubject: TeacherSubject;
    attendancesByDate: Record<string, AttendanceRecord[]>;
    statistics: StudentStatistics[];
    dateRange: {
        start: string;
        end: string;
    };
    [key: string]: unknown;
}

export default function AttendanceRecap({ teacherSubject, attendancesByDate, statistics, dateRange }: Props) {
    const statusLabels = {
        hadir: 'Hadir',
        sakit: 'Sakit',
        izin: 'Izin',
        alfa: 'Alfa',
    };

    const statusColors = {
        hadir: 'bg-green-100 text-green-800',
        sakit: 'bg-yellow-100 text-yellow-800',
        izin: 'bg-blue-100 text-blue-800',
        alfa: 'bg-red-100 text-red-800',
    };

    const getAttendancePercentage = (stat: StudentStatistics) => {
        if (stat.total === 0) return 0;
        return Math.round((stat.hadir / stat.total) * 100);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/attendance" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
                            ← Kembali ke Daftar Absensi
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            📊 Rekap Absensi - {teacherSubject.subject.name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelas {teacherSubject.schoolClass.name} • 
                            {new Date(dateRange.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - 
                            {new Date(dateRange.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                                    Kelas {teacherSubject.schoolClass.name} • {statistics.length} siswa • 
                                    {Object.keys(attendancesByDate).length} hari pembelajaran
                                </p>
                            </div>
                        </div>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                            {teacherSubject.subject.code}
                        </span>
                    </div>
                </Card>

                {/* Overall Statistics */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">📈 Statistik Keseluruhan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(statusLabels).map(([status, label]) => {
                            const total = statistics.reduce((sum, stat) => {
                                const value = stat[status as keyof StudentStatistics];
                                return sum + (typeof value === 'number' ? value : 0);
                            }, 0);
                            return (
                                <div key={status} className={`p-4 rounded-lg ${statusColors[status as keyof typeof statusColors]}`}>
                                    <p className="text-3xl font-bold">{total}</p>
                                    <p className="text-sm">{label}</p>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Student Statistics */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">👥 Statistik per Siswa</h2>
                    
                    {statistics.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-4">📊</div>
                            <p>Belum ada data absensi untuk periode ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg font-semibold text-sm text-gray-700">
                                <div className="col-span-4">Nama Siswa</div>
                                <div className="col-span-1 text-center">Hadir</div>
                                <div className="col-span-1 text-center">Sakit</div>
                                <div className="col-span-1 text-center">Izin</div>
                                <div className="col-span-1 text-center">Alfa</div>
                                <div className="col-span-1 text-center">Total</div>
                                <div className="col-span-3 text-center">Persentase Kehadiran</div>
                            </div>

                            {/* Table Body */}
                            {statistics
                                .sort((a, b) => a.student.name.localeCompare(b.student.name))
                                .map((stat) => {
                                    const percentage = getAttendancePercentage(stat);
                                    return (
                                        <div key={stat.student.id} className="grid grid-cols-12 gap-4 p-3 border rounded-lg hover:bg-gray-50">
                                            <div className="col-span-4">
                                                <h4 className="font-semibold">{stat.student.name}</h4>
                                                <p className="text-gray-500 text-sm">NIS: {stat.student.nis}</p>
                                            </div>
                                            <div className="col-span-1 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                                    {stat.hadir}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                                    {stat.sakit}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                    {stat.izin}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                                    {stat.alfa}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-center font-semibold">
                                                {stat.total}
                                            </div>
                                            <div className="col-span-3 text-center">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${
                                                                percentage >= 90 ? 'bg-green-500' :
                                                                percentage >= 80 ? 'bg-blue-500' :
                                                                percentage >= 70 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-sm font-semibold ${
                                                        percentage >= 90 ? 'text-green-600' :
                                                        percentage >= 80 ? 'text-blue-600' :
                                                        percentage >= 70 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </Card>

                {/* Attendance Performance Categories */}
                <div className="grid md:grid-cols-4 gap-4">
                    {[
                        { label: 'Sangat Baik (≥90%)', min: 90, color: 'bg-green-100 text-green-800 border-green-300' },
                        { label: 'Baik (80-89%)', min: 80, color: 'bg-blue-100 text-blue-800 border-blue-300' },
                        { label: 'Cukup (70-79%)', min: 70, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
                        { label: 'Kurang (<70%)', min: 0, color: 'bg-red-100 text-red-800 border-red-300' },
                    ].map((category) => {
                        const count = statistics.filter(stat => {
                            const percentage = getAttendancePercentage(stat);
                            return category.label.includes('Kurang') 
                                ? percentage < 70 
                                : percentage >= category.min && (
                                    category.label.includes('Sangat') ? percentage >= 90 :
                                    category.label.includes('Baik') && !category.label.includes('Sangat') ? percentage < 90 :
                                    percentage < 80
                                );
                        }).length;

                        return (
                            <Card key={category.label} className={`p-4 border ${category.color}`}>
                                <p className="text-2xl font-bold">{count}</p>
                                <p className="text-sm">{category.label}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <Link href={`/attendance/${teacherSubject.id}`}>
                        <Button>📝 Input Absensi Baru</Button>
                    </Link>
                    <Link href="/attendance">
                        <Button variant="outline">📚 Kelas Lain</Button>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}