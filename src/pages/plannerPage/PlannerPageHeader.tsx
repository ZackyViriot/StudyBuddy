import React from "react";
import { BookOpen, Users, Calendar, Search, MapPin, Mail, Phone } from "lucide-react"



export default function PlannerPageHeader(){
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 lg:px-6 h-16 flex items-center">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-black"/>
                    <span className="ml-2 text-2xl font-bold text-black">StudyBuddy</span>
                </div>
                <nav className="hidden md:flex space-x-4">
                <a href="/userDashboard" className="text-sm font-medium hover:text-blue-600">Dashboard</a>
                <a href = '/plannerPage' className="text-sm font-medium hover:text-blue-600">Planner</a>
                <a href = '/myStudyGroups' className="text-sm font-medium hover:text-blue-600">Study Groups</a>
                <a href = '/userSetting' className="text-sm font-medium hover:text-blue-600">Settings</a>

                </nav>
            </div>
        </header>
    )
}