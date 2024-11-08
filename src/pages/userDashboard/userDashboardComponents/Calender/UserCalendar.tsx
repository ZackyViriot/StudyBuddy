import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  status: string;
}

interface CalendarProps {
  initialDate?: Date;
  onAddEventClick?: () => void;
}

const UserCalendar: React.FC<CalendarProps> = ({ initialDate = new Date(), onAddEventClick }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No Token found");
        }
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;
        
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const res = await axios.get(`http://localhost:8000/Event/user?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setEvents(res.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError("Failed to fetch events. Please try again later.");
      }
    };

    fetchEvents();
  }, [currentDate]);

  const daysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateDays = (): (number | null)[] => {
    const days: (number | null)[] = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    setSelectedDate(increment > 0 ? 1 : daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)));
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (day: number): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleDateClick = (day: number | null) => {
    if (day !== null) {
      setSelectedDate(day);
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todaysEvents = getEventsForDay(selectedDate);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white overflow-hidden">
      <div className="grid grid-cols-12 divide-x divide-gray-200">
        {/* Calendar Section */}
        <div className="col-span-8 p-6">
          <div className="flex justify-between items-center mb-6 bg-black text-white p-4 rounded-lg">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {generateDays().map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isSelected = day === selectedDate;
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    relative text-center p-4 rounded-lg transition-colors cursor-pointer
                    ${day === null ? 'text-gray-300 cursor-default' : 
                      isSelected ? 'bg-black text-white font-bold' : 
                      isToday(day as number) ? 'bg-gray-100' :
                      'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <span className="text-sm">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className={`h-1 w-1 ${isSelected ? 'bg-white' : 'bg-blue-500'} rounded-full`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Section */}
        <div className="col-span-4 p-6 bg-gray-50 flex flex-col h-full">
          <div className="flex-grow flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedDate === new Date().getDate() && 
               currentDate.getMonth() === new Date().getMonth() && 
               currentDate.getFullYear() === new Date().getFullYear() 
                ? "Today's Events" 
                : `Events for ${currentDate.toLocaleString('default', { month: 'short' })} ${selectedDate}`}
            </h3>
            
            {/* Scrollable events container */}
            <div className="flex-grow overflow-hidden">
              <div className="h-full max-h-[400px] overflow-y-auto pr-2 space-y-3">
                {todaysEvents.length > 0 ? (
                  todaysEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white p-4 rounded-lg shadow-sm"
                      style={{ borderLeft: `4px solid ${event.color || '#2196f3'}` }}
                    >
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No events scheduled for this day.</p>
                )}
              </div>
            </div>

            {/* Add Event Button */}
            <div className="pt-6">
              <button
                onClick={onAddEventClick}
                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;