import Button from '@/app/_components/button'
import React from 'react'
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
export default function ActionSection() {
    const Button = ({ children, onClick, className = "", type = "button", ...props }) => {
        return (
            <button
                type={type}
                onClick={onClick}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    };
    return (
        <div className="flex space-x-2">
            <Button
                onClick={() => handleEdit(pos.id)}
                className="inline-flex items-center gap-1 text-blue-600 border border-blue-300 hover:bg-blue-50 px-3 py-1.5 text-sm"
            >
                <Pencil size={14} />
            </Button>
           
        </div>
    )
}
