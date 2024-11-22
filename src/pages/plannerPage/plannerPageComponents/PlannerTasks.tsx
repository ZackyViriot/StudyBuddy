import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../axios/axiosSetup';

interface Event {
    _id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    color?: string;
    status: string;
}

interface PlannerTasksProps {
    selectedDate: Date;
    onAddEventClick: () => void;
}

const PlannerTasks: React.FC<PlannerTasksProps> = ({ selectedDate, onAddEventClick }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                // Filter events for the selected date
                const filteredEvents = res.data.filter((event: Event) => {
                    const eventDate = new Date(event.start);
                    return (
                        eventDate.getDate() === selectedDate.getDate() &&
                        eventDate.getMonth() === selectedDate.getMonth() &&
                        eventDate.getFullYear() === selectedDate.getFullYear()
                    );
                });

                setEvents(filteredEvents);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setError("Failed to fetch events. Please try again later.");
                setLoading(false);
            }
        };

        fetchEvents();
    }, [selectedDate]);

    if (loading) return <div className="p-4">Loading events...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    Tasks for {selectedDate.toLocaleDateString('default', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </h2>
                <button
                    onClick={onAddEventClick}
                    className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                    Add Task
                </button>
            </div>

            <div className="space-y-3">
                {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tasks scheduled for this day.</p>
                ) : (
                    events.map((event) => (
                        <div
                            key={event._id}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ borderLeft: `4px solid ${event.color || '#2196f3'}` }}
                        >
                            <h3 className="font-medium">{event.title}</h3>
                            {event.description && (
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                                {new Date(event.start).toLocaleTimeString('default', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                {' - '}
                                {new Date(event.end).toLocaleTimeString('default', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PlannerTasks;