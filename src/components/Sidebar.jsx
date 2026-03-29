'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, HelpCircle, Lightbulb, Activity } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Input Hub', path: '/input-hub', icon: FileText },
    { name: 'Smart Summarizer', path: '/summarizer', icon: BookOpen },
    { name: 'Question Generator', path: '/question-generator', icon: HelpCircle },
    { name: 'MemCode', path: '/memcode', icon: Lightbulb },
    { name: 'Weak Area Tracker', path: '/tracker', icon: Activity },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2>Exam Brain</h2>
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
