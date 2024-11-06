import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import UserDashboardHeader from "./userDashboardComponents/UserDashboardHeader";
import UserCalendar from "./userDashboardComponents/Calender/UserCalendar";
import AddEventForm from "./userDashboardComponents/Calender/AddEventForm";
import UserStudyGroups from "./userDashboardComponents/StudyGroups/UserStudyGroups";

export default function UserDashboard() {
  const [userId, setUserId] = useState();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <div className="min-h-screen ">
      <div className="w-full bg-black shadow">
        <UserDashboardHeader />
      </div>

      <div className="container mx-auto mt-20 px-2 max-w-4xl">
        {/* Calendar Section - Always at top */}
        <div className="mb-4">
          <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
            isCollapsed ? 'hidden lg:block' : ''
          }`}>
            <div className="p-3">
              <UserCalendar />
            </div>
          </div>
        </div>

        {/* Lower Section - Side by Side */}
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-4">
          {/* Add Event Form */}
          <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
            !isCollapsed ? 'hidden lg:block' : ''
          }`}>
            <div className="p-3">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Add Event</h2>
              <AddEventForm />
            </div>
          </div>

          {/* Study Groups */}
          <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
            !isCollapsed ? 'hidden lg:block' : ''
          }`}>
            <div className="p-3">
              <UserStudyGroups />
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="fixed bottom-3 right-3 lg:hidden bg-black text-white p-2 rounded-full shadow hover:bg-gray-800 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "View Calendar" : "Add Event"}
        </button>
      </div>
    </div>
  );
}