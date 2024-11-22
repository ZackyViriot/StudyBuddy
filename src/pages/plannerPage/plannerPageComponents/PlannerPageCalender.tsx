import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios/axiosSetup";
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
    onDateSelect: (date: Date) => void;
    selectedDate: Date;
}

const PlannerPageCalender: React.FC<CalendarProps> = ({
    initialDate = new Date(),
    onAddEventClick,
    onDateSelect,
    selectedDate
}) => {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
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

                const res = await axiosInstance.get(`/Event/user?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setEvents(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setError("Failed to fetch events. Please try again later.");
                setLoading(false);
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
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1);
        setCurrentDate(newDate);
        onDateSelect(newDate);
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
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            onDateSelect(newDate);
        }
    };

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="p-3">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-3 bg-black text-white p-3 rounded-lg">
                <button 
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-lg font-bold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button 
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Weekday Headers */}
                {weekdays.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
                
                {/* Calendar Days */}
                {generateDays().map((day, index) => {
                    const dayEvents = day ? getEventsForDay(day) : [];
                    const isSelected = selectedDate && 
                                     day === selectedDate.getDate() && 
                                     currentDate.getMonth() === selectedDate.getMonth() && 
                                     currentDate.getFullYear() === selectedDate.getFullYear();
                    return (
                        <div
                            key={index}
                            onClick={() => handleDateClick(day)}
                            className={`
                                min-h-[80px] relative p-1 rounded-lg transition-colors cursor-pointer
                                ${day === null ? 'text-gray-300 cursor-default' : 
                                    isSelected ? 'bg-black text-white' : 
                                    isToday(day as number) ? 'bg-gray-100' :
                                    'hover:bg-gray-100'
                                }
                            `}
                        >
                            <span className="text-sm font-medium">{day}</span>
                            {/* Events for this day */}
                            <div className="mt-1 space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div
                                        key={event._id}
                                        className={`text-xs p-1 rounded truncate ${
                                            isSelected ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="text-xs text-gray-500">
                                        +{dayEvents.length - 2} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Event Button */}
            <div className="mt-3 flex justify-end">
                <button
                    onClick={onAddEventClick}
                    className="bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-xs"
                >
                    Add Event
                </button>
            </div>
        </div>
    );
};

export default PlannerPageCalender;