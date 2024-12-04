import React, { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlannerPageHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };  

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 lg:px-6 h-16 flex items-center">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-black"/>
                    <span className="ml-2 text-2xl font-bold text-black">StudyBuddy</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-4">
                    <a href="/userDashboard" className="text-sm font-medium hover:text-blue-600">Dashboard</a>
                    <a href="/plannerPage" className="text-sm font-medium hover:text-blue-600">Planner</a>
                    <a href="/myStudyGroups" className="text-sm font-medium hover:text-blue-600">Study Groups</a>
                    <a onClick={handleLogout} className="text-sm font-medium hover:text-blue-600">Logout</a>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden animate-fade-down">
                        <nav className="flex flex-col p-4">
                            <a href="/userDashboard" 
                               className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg">
                                Dashboard
                            </a>
                            <a href="/plannerPage" 
                               className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg">
                                Planner
                            </a>
                            <a href="/myStudyGroups" 
                               className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg">
                                Study Groups
                            </a>
                            <a onClick={handleLogout} 
                               className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg">
                                Logout
                            </a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}