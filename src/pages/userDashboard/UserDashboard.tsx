import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import UserDashboardHeader from "./userDashboardComponents/UserDashboardHeader";
import UserCalendar from "./userDashboardComponents/Calender/UserCalendar";
import AddEventForm from "./userDashboardComponents/Calender/AddEventForm";
import UserStudyGroups from "./userDashboardComponents/StudyGroups/UserStudyGroups";
import { X } from "lucide-react";

export default function UserDashboard() {
  const [userId, setUserId] = useState();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Failed to fetch user information");
      }
    };
    fetchUserInfo();
  }, []);

  const handleEventAdded = () => {
    setShowEventModal(false);
  };

  return (
    <div className="min-h-screen ">
      <div className="w-full bg-black shadow">
        <UserDashboardHeader />
      </div>

      <div className="container mx-auto mt-20 px-4 max-w-7xl">
        <div className="flex flex-row space-x-6 h-[calc(100vh-12rem)]">
          {/* Study Groups - Left Side */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow-xl hover:shadow-md transition-shadow duration-200 h-full overflow-auto">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Study Groups</h2>
                <UserStudyGroups />
              </div>
            </div>
          </div>

          {/* Calendar Section - Right Side */}
          <div className="w-2/3">
            <div className="bg-white rounded-lg shadow-xl hover:shadow-md transition-shadow duration-200 h-full overflow-auto">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h2>
                <UserCalendar onAddEventClick={() => setShowEventModal(true)} />
              </div>
            </div>
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowEventModal(false);
              }
            }}
          >
            <div className="bg-white rounded-lg w-full max-w-lg relative">
              <button 
                onClick={() => setShowEventModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
                <AddEventForm 
                  onEventAdded={handleEventAdded}
                  onClose={() => setShowEventModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}