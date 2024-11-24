import React, { useState, FormEvent, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { CalendarIcon, ClockIcon, TagIcon, CheckCircleIcon } from 'lucide-react';
import axiosInstance from "../../../../axios/axiosSetup";

type MeetingType = 'online' | 'in-person' | 'both';

interface StudyGroup {
    name: string;
    meetingType: MeetingType;
    meetingDays: string[];
    meetingLocation: string;
    major: string;
}

interface CreateStudyGroupFormProps {
    onClose: () => void;
    onStudyGroupCreated: () => void;
}

export default function CreateStudyGroupForm({ onStudyGroupCreated, onClose }: CreateStudyGroupFormProps) {
    const [userId, setUserId] = useState('');
    const [studyGroup, setStudyGroup] = useState<StudyGroup>({
        name: "",
        meetingType: "online",
        meetingDays: [],
        meetingLocation: "",
        major: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("No token found");
                const decoded: any = jwtDecode(token);
                setUserId(decoded.id);
            } catch (error) {
                setError("Failed to authenticate user. Please log in again.");
            }
        };
        fetchUserInfo();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStudyGroup(prev => ({ ...prev, [name]: value }));
    };

    const handleDayChange = (day: string) => {
        setStudyGroup(prev => ({
            ...prev,
            meetingDays: prev.meetingDays.includes(day)
                ? prev.meetingDays.filter(d => d !== day)
                : [...prev.meetingDays, day]
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const payload = {
            ...studyGroup,
            userId
        };

        try {
            const res = await axiosInstance.post('/StudyGroup', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            onStudyGroupCreated();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to create study group");
            } else {
                setError("An unexpected error occurred");
                console.error("Unexpected error:", err);
            }
        } finally {
            setIsSubmitting(false);
            window.location.reload();
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Group Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={studyGroup.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter group name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                </div>

                <div>
                    <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700">Meeting Type</label>
                    <select
                        name="meetingType"
                        id="meetingType"
                        value={studyGroup.meetingType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                    >
                        <option value="online">Online</option>
                        <option value="in-person">In Person</option>
                        <option value="both">Both</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Meeting Days</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                        {daysOfWeek.map(day => (
                            <label key={day} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={studyGroup.meetingDays.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                    className="rounded border-gray-300 text-black focus:ring-black"
                                />
                                <span className="text-sm">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="meetingLocation" className="block text-sm font-medium text-gray-700">Meeting Location</label>
                    <input
                        type="text"
                        name="meetingLocation"
                        id="meetingLocation"
                        value={studyGroup.meetingLocation}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter meeting location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                </div>

                <div>
                    <label htmlFor="major" className="block text-sm font-medium text-gray-700">Major</label>
                    <input
                        type="text"
                        name="major"
                        id="major"
                        value={studyGroup.major}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter major"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors duration-200"
                    >
                        Close
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isSubmitting ? 'Creating Group...' : 'Create Group'}
                    </button>
                </div>
            </form>
        </div>
    );
}