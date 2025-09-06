import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TeacherSubject {
    id: number;
    subject: {
        id: number;
        name: string;
        code: string;
    };
    schoolClass: {
        id: number;
        name: string;
        grade_level: number;
    };
    academic_year: string;
}

interface Stats {
    total_classes: number;
    total_subjects: number;
    total_students: number;
    recent_attendances: Record<string, number>;
    recent_grades: number;
}

interface Props {
    teacherSubjects: TeacherSubject[];
    stats: Stats;
    [key: string]: unknown;
}

export default function TeacherDashboard({ teacherSubjects, stats }: Props) {
    const attendanceStatusLabels = {
        hadir: 'Hadir',
        sakit: 'Sakit',
        izin: 'Izin',
        alfa: 'Alfa',
    };

    const attendanceStatusColors = {
        hadir: 'bg-green-100 text-green-800',
        sakit: 'bg-yellow-100 text-yellow-800',
        izin: 'bg-blue-100 text-blue-800',
        alfa: 'bg-red-100 text-red-800',
    };

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8">
                    <h1 className="text-3xl font-bold mb-2">📚 Selamat Datang di SiAbsen SMP</h1>
                    <p className="text-blue-100 text-lg">
                        Kelola absensi dan penilaian siswa dengan mudah dan efisien
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">🏫</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">{stats.total_classes}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{stats.total_subjects}</p>
                                <p className="text-gray-600">Mata Pelajaran</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
                                <p className="text-gray-600">Total Siswa</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">{stats.recent_grades}</p>
                                <p className="text-gray-600">Nilai Minggu Ini</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="p-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold mb-2">Kelola Absensi</h3>
                            <p className="text-gray-600 mb-6">
                                Catat kehadiran siswa per mata pelajaran dan kelas
                            </p>
                            <Link href="/attendance">
                                <Button className="w-full">Buka Absensi</Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="p-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold mb-2">Kelola Penilaian</h3>
                            <p className="text-gray-600 mb-6">
                                Input nilai harian, UTS, dan UAS siswa
                            </p>
                            <Link href="/grades">
                                <Button className="w-full">Buka Penilaian</Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Recent Attendance Summary */}
                {Object.keys(stats.recent_attendances).length > 0 && (
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">📊 Ringkasan Absensi (7 Hari Terakhir)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(stats.recent_attendances).map(([status, count]) => (
                                <div key={status} className={`p-4 rounded-lg ${attendanceStatusColors[status as keyof typeof attendanceStatusColors]}`}>
                                    <p className="text-2xl font-bold">{count}</p>
                                    <p className="text-sm">{attendanceStatusLabels[status as keyof typeof attendanceStatusLabels]}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Teacher Subjects List */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">📚 Kelas & Mata Pelajaran yang Diampu</h3>
                    <div className="grid gap-4">
                        {teacherSubjects.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-4">📖</div>
                                <p>Belum ada kelas dan mata pelajaran yang ditugaskan.</p>
                                <p className="text-sm mt-2">Hubungi administrator untuk penugasan kelas.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {teacherSubjects.map((ts) => (
                                    <div key={ts.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-900">
                                                Kelas {ts.schoolClass.name}
                                            </h4>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                {ts.subject.code}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            {ts.subject.name}
                                        </p>
                                        <div className="flex space-x-2">
                                            <Link href={`/attendance/${ts.id}`}>
                                                <Button size="sm" variant="outline" className="flex-1">
                                                    Absensi
                                                </Button>
                                            </Link>
                                            <Link href={`/grades/${ts.id}`}>
                                                <Button size="sm" variant="outline" className="flex-1">
                                                    Nilai
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}