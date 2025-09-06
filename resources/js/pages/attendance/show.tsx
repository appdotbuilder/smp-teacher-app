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

interface TodayAttendance {
    id: number;
    student_id: number;
    status: string;
    notes: string | null;
}

interface Props {
    teacherSubject: TeacherSubject;
    students: Student[];
    todayAttendances: Record<number, TodayAttendance>;
    today: string;
    [key: string]: unknown;
}

export default function AttendanceShow({ teacherSubject, students, todayAttendances, today }: Props) {
    const [attendanceData, setAttendanceData] = useState<Record<number, { status: string; notes: string }>>(() => {
        const initial: Record<number, { status: string; notes: string }> = {};
        students.forEach(student => {
            const existing = todayAttendances[student.id];
            initial[student.id] = {
                status: existing?.status || 'hadir',
                notes: existing?.notes || '',
            };
        });
        return initial;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { value: 'hadir', label: 'Hadir', color: 'bg-green-100 text-green-800 border-green-300' },
        { value: 'sakit', label: 'Sakit', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
        { value: 'izin', label: 'Izin', color: 'bg-blue-100 text-blue-800 border-blue-300' },
        { value: 'alfa', label: 'Alfa', color: 'bg-red-100 text-red-800 border-red-300' },
    ];

    const updateAttendance = (studentId: number, field: 'status' | 'notes', value: string) => {
        setAttendanceData(prev => ({
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

        const attendances = students.map(student => ({
            student_id: student.id,
            status: attendanceData[student.id].status,
            notes: attendanceData[student.id].notes,
        }));

        router.post('/attendance', {
            teacher_subject_id: teacherSubject.id,
            date: today,
            attendances,
        }, {
            preserveState: true,
            onFinish: () => setIsSubmitting(false),
        });
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
                            ✅ Absensi - {teacherSubject.subject.name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelas {teacherSubject.schoolClass.name} • {new Date(today).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
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
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                            {teacherSubject.subject.code}
                        </span>
                    </div>
                </Card>

                {/* Attendance Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">👥 Daftar Kehadiran Siswa</h2>
                            <div className="flex space-x-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                        const newData = { ...attendanceData };
                                        students.forEach(student => {
                                            newData[student.id].status = 'hadir';
                                        });
                                        setAttendanceData(newData);
                                    }}
                                >
                                    ✅ Semua Hadir
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '💾 Menyimpan...' : '💾 Simpan Absensi'}
                                </Button>
                            </div>
                        </div>

                        {/* Status Legend */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">Status Kehadiran:</p>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map(option => (
                                    <span 
                                        key={option.value} 
                                        className={`px-3 py-1 rounded-full text-sm border ${option.color}`}
                                    >
                                        {option.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Students List */}
                        <div className="space-y-4">
                            {students.map((student, index) => (
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

                                        {/* Status Buttons */}
                                        <div className="md:col-span-5">
                                            <div className="grid grid-cols-4 gap-2">
                                                {statusOptions.map(option => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => updateAttendance(student.id, 'status', option.value)}
                                                        className={`px-3 py-2 rounded text-sm border-2 transition-all ${
                                                            attendanceData[student.id].status === option.value
                                                                ? option.color + ' font-semibold'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="md:col-span-3">
                                            <input
                                                type="text"
                                                placeholder="Catatan (opsional)"
                                                value={attendanceData[student.id].notes}
                                                onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">📊 Ringkasan Kehadiran</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {statusOptions.map(option => {
                                    const count = students.filter(student => 
                                        attendanceData[student.id].status === option.value
                                    ).length;
                                    return (
                                        <div key={option.value} className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                                            <p className="text-sm text-gray-600">{option.label}</p>
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