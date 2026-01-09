'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Dashboard', href: '/candidate/dashboard' },
    { name: 'Upload Resume & JD', href: '/candidate/upload' },
    { name: 'Skill Gap Analysis', href: '/candidate/skill-gap' },
    { name: 'Learning Roadmap', href: '/candidate/learning-roadmap' },
    { name: 'Resume Builder', href: '/candidate/resume-builder' },
    { name: 'Resume Feedback', href: '#' },
    { name: 'Resume History', href: '#' },
    { name: 'Notifications', href: '#' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-10">
                Resume<span className="text-blue-600">EZ</span>
            </h1>

            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`block rounded-lg px-4 py-2 text-sm font-medium transition
                            ${pathname === item.href
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="mt-12 border-t pt-4">
                <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                >
                    Logout
                </Link>
            </div>
        </aside>
    );
}
