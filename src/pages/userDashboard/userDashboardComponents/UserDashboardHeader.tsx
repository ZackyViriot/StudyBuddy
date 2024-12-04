import React, { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserDashboardHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="px-4 lg:px-6 h-16">
                <div className="container mx-auto h-full flex justify-between items-center">
                    {/* Logo */}
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
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-black" />
                        ) : (
                            <Menu className="h-6 w-6 text-black" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="container mx-auto py-2">
                        <nav className="flex flex-col space-y-1">
                            <a 
                                href="/userDashboard" 
                                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </a>
                            <a 
                                href="/plannerPage" 
                                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Planner
                            </a>
                            <a 
                                href="/myStudyGroups" 
                                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Study Groups
                            </a>
                            <a 
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
                            >
                                Logout
                            </a>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}