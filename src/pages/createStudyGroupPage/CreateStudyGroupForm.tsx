import { jwtDecode } from "jwt-decode";
import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axios/axiosSetup";

type MeetingType = 'online' | 'in-person' | 'both';

interface StudyGroup {
    name: string;
    meetingType: MeetingType;
    meetingDays: string[];
    meetingLocation: string
    major: string;
}


export default function CreateStudyGroupForm() {
    const navigate = useNavigate();
    const [userId,setUserId] = useState('');
    const [studyGroup, setStudyGroup] = useState<StudyGroup>({
        name: '',
        meetingType: 'online',
        meetingDays: [],
        meetingLocation: '',
        major: '',
    });
    // need to get the user information for when we submit the data.
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token){
                    throw new Error("No token found");
                }

                const decoded: any = jwtDecode(token);
                const userId = decoded.id;
                setUserId(userId)
            }catch(error){
                    console.error("failed to fetch user information")
            }
        }
        fetchUserInfo();
    },[])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStudyGroup(prev => ({ ...prev, [name]: value }));
    };
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setStudyGroup(prev => ({
            ...prev,
            meetingDays: checked
                ? [...prev.meetingDays, value]
                : prev.meetingDays.filter(day => day !== value),
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            ...studyGroup,
            userId
        };

        try {
            console.log("Sending data:", data);
            const res = await axiosInstance.post('/studyGroup', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
                },
            });
            console.log("Response:", res.data);
            navigate('/userDashboard');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error response:", err.response?.data);
                console.error("Error status:", err.response?.status);
            } else {
                console.error("Unexpected error:", err);
            }
            // Optionally, set an error state here to display to the user
        }
    };




    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">Add Study Group</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        placeholder="Study Group Name"
                                        value={studyGroup.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="name" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                        Study Group Name
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
                                        id="meetingType"
                                        name="meetingType"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        value={studyGroup.meetingType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="online">Online</option>
                                        <option value="in-person">In-person</option>
                                        <option value="both">Both</option>
                                    </select>
                                    <label htmlFor="meetingType" className="absolute left-0 -top-3.5 text-gray-600 text-sm">
                                        Meeting Type
                                    </label>
                                </div>
                                <div className="relative">
                                    <fieldset>
                                        <legend className="text-sm text-gray-600 mb-2">Meeting Days</legend>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                            <label key={day} className="inline-flex items-center mr-4 mb-2">
                                                <input
                                                    type="checkbox"
                                                    name="meetingDays"
                                                    value={day}
                                                    checked={studyGroup.meetingDays.includes(day)}
                                                    onChange={handleCheckboxChange}
                                                    className="form-checkbox h-5 w-5 text-rose-600"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{day}</span>
                                            </label>
                                        ))}
                                    </fieldset>
                                </div>
                                <div className="relative">
                                    <input
                                        id="meetingLocation"
                                        name="meetingLocation"
                                        type="text"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        placeholder="Meeting Location"
                                        value={studyGroup.meetingLocation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="meetingLocation" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                        Meeting Location
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        id="major"
                                        name="major"
                                        type="text"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        placeholder="Major"
                                        value={studyGroup.major}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="major" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                        Major
                                    </label>
                                </div>
                                <div className="relative">
                                    <button type="submit" className="bg-rose-500 text-white rounded-md px-4 py-2 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-opacity-50">
                                        Add Study Group
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}