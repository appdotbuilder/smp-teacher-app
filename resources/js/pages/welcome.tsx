import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome() {
    const { auth } = usePage<Props>().props;

    if (auth.user) {
        // Redirect authenticated users to dashboard
        window.location.href = '/dashboard';
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">📚</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">SiAbsen SMP</h1>
                            </div>
                        </div>
                        <div className="space-x-4">
                            <Link href="/login">
                                <Button variant="ghost">Masuk</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Daftar</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        📊 Sistem Absensi & Penilaian 
                        <br />
                        <span className="text-blue-600">SMP Digital</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Platform digital untuk guru SMP dalam mengelola absensi dan penilaian siswa secara efisien dan terintegrasi.
                        Kelola seluruh data akademik dengan mudah dan profesional.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">✅</div>
                            <h3 className="text-lg font-semibold mb-2">Absensi Digital</h3>
                            <p className="text-gray-600 text-sm">Catat kehadiran siswa per mata pelajaran dengan status lengkap (Hadir, Sakit, Izin, Alfa)</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-lg font-semibold mb-2">Penilaian Komprehensif</h3>
                            <p className="text-gray-600 text-sm">Input nilai harian, UTS, UAS dengan perhitungan otomatis nilai akhir</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-lg font-semibold mb-2">Laporan & Statistik</h3>
                            <p className="text-gray-600 text-sm">Rekap otomatis data absensi dan nilai per kelas dan mata pelajaran</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">🖨️</div>
                            <h3 className="text-lg font-semibold mb-2">Cetak PDF</h3>
                            <p className="text-gray-600 text-sm">Export laporan dalam format PDF yang siap untuk dokumentasi</p>
                        </div>
                    </div>

                    {/* Features Detail */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Fitur Unggulan</h2>
                        
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Attendance Features */}
                            <div className="text-left">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-3">📋</span>
                                    <h3 className="text-xl font-semibold">Manajemen Absensi</h3>
                                </div>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        Rekam absensi per mata pelajaran untuk semua kelas yang diampu
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        Status lengkap: Hadir, Sakit, Izin, Alfa dengan catatan
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        Rekap statistik kehadiran per siswa dan per kelas
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        Cetak laporan absensi dalam format PDF
                                    </li>
                                </ul>
                            </div>

                            {/* Grading Features */}
                            <div className="text-left">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-3">🎯</span>
                                    <h3 className="text-xl font-semibold">Sistem Penilaian</h3>
                                </div>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Tiga jenis nilai: Harian, UTS, dan UAS
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Perhitungan otomatis nilai akhir dengan bobot seimbang
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Input nilai dalam format daftar siswa yang praktis
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Rekap lengkap dengan konversi ke huruf (A, B, C, D, E)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Mock Screenshots */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-gray-100 rounded-xl p-8 h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-4">📊</div>
                                <h4 className="font-semibold">Dashboard Guru</h4>
                                <p className="text-sm text-gray-600 mt-2">Ringkasan kelas dan mata pelajaran yang diampu</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-100 rounded-xl p-8 h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-4">✏️</div>
                                <h4 className="font-semibold">Input Absensi</h4>
                                <p className="text-sm text-gray-600 mt-2">Interface sederhana untuk mencatat kehadiran siswa</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-100 rounded-xl p-8 h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-4">📋</div>
                                <h4 className="font-semibold">Rekap Nilai</h4>
                                <p className="text-sm text-gray-600 mt-2">Laporan komprehensif nilai siswa dan statistik</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-blue-600 text-white rounded-2xl p-12">
                        <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Bergabunglah dengan guru-guru modern yang telah menggunakan sistem digital untuk mengelola absensi dan penilaian siswa.
                        </p>
                        <div className="space-x-4">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                                    📝 Daftar Sekarang
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-blue-700">
                                    🚀 Masuk ke Akun
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">📚</span>
                            </div>
                            <h3 className="text-xl font-bold">SiAbsen SMP</h3>
                        </div>
                        <p className="text-gray-400">
                            Platform digital untuk manajemen absensi dan penilaian siswa SMP
                        </p>
                        <p className="text-gray-500 mt-4 text-sm">
                            © 2024 SiAbsen SMP. Dibuat untuk mendukung pendidikan digital Indonesia.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}