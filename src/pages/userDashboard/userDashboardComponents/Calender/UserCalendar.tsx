import React, { useState, useEffect } from "react";

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
}

const UserCalendar: React.FC<CalendarProps> = ({ initialDate = new Date() }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const response = await fetch('/api/events/range', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
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

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todaysEvents = getEventsForDay(new Date().getDate());

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-12 divide-x divide-gray-200">
        {/* Calendar Section */}
        <div className="col-span-8 p-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              return (
                <div
                  key={index}
                  className={`
                    relative text-center p-4 rounded-lg transition-colors
                    ${day === null ? 'text-gray-300' : 
                      isToday(day as number) ? 'bg-black text-white font-bold' : 
                      'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <span className="text-sm">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Section */}
        <div className="col-span-4 p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Today's Events</h3>
          <div className="space-y-3">
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
              <p className="text-gray-500">No events scheduled for today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;