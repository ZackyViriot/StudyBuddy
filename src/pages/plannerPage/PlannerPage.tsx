import React, { useState } from "react";
import PlannerPageHeader from "./plannerPageComponents/PlannerPageHeader";
import PlannerPageCalender from "./plannerPageComponents/PlannerPageCalender";
import PlannerTasks from "./plannerPageComponents/PlannerTasks";
import Timer from "./plannerPageComponents/Timer";
import NotesCanvas from "./plannerPageComponents/NoteCanvas";
import AddEventForm from "../userDashboard/userDashboardComponents/Calender/AddEventForm";
import { X } from "lucide-react";

export default function PlannerPage() {
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleEventAdded = () => {
        setShowEventModal(false);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PlannerPageHeader/>
            
            <main className="pt-16 px-4 pb-4">
                <div className="max-w-[1400px] mx-auto space-y-4">
                    {/* Timer Section */}
                    <div className="animate-fade-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
                        <div className="bg-white rounded-xl shadow-lg">
                            <Timer />
                        </div>
                    </div>

                    {/* Calendar and Tasks Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        {/* Calendar Section */}
                        <div className="xl:col-span-2 h-full animate-fade-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
                            <div className="bg-white rounded-xl shadow-lg h-full">
                                <PlannerPageCalender 
                                    onAddEventClick={() => setShowEventModal(true)}
                                    onDateSelect={handleDateSelect}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="xl:col-span-1 h-full animate-fade-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
                            <div className="bg-white rounded-xl shadow-lg h-full">
                                <PlannerTasks 
                                    selectedDate={selectedDate}
                                    onAddEventClick={() => setShowEventModal(true)}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Notes Section */}
                    <div className="animate-fade-up opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
                        <div className="bg-white rounded-xl shadow-lg">
                            <NotesCanvas selectedDate={selectedDate} />
                        </div>
                    </div>
                </div>

                {/* Event Modal */}
                {showEventModal && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowEventModal(false);
                            }
                        }}
                    >
                        <div className="bg-white rounded-xl w-full max-w-lg relative shadow-lg animate-scale-up">
                            <button 
                                onClick={() => setShowEventModal(false)}
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>
                                <AddEventForm 
                                    onEventAdded={handleEventAdded}
                                    onClose={() => setShowEventModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}