import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
    const [dark, setDark] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });

    const toggle = () => {
        const newDark = !dark;
        setDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors mt-0.1"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
