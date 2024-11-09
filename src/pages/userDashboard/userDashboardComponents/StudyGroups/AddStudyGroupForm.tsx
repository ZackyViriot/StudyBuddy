import React, { useState, FormEvent, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type MeetingType = 'online' | 'in-person' | 'both';

interface StudyGroup {
    name: string;
    meetingType: MeetingType;
    meetingDays: string[];
    meetingLocation: string;
    major: string;
}

interface AddStudyGroupFormProps {
    onClose: () => void;
    onStudyGroupAdded?: () => void;
}

export default function AddStudyGroupForm({ onStudyGroupAdded, onClose }: AddStudyGroupFormProps) {

    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [studyGroup, setStudyGroup] = useState<StudyGroup>({
        name: '',
        meetingType: 'online',
        meetingDays: [],
        meetingLocation: '',
        major: '',
    });

    // time to get the user information 
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token Found")
                }

                const decoded: any = jwtDecode(token);
                const userId = decoded.id;
                setUserId(userId);
            } catch (error) {
                console.error("failed to fetch user information")
            }
        }
        fetchUserInfo();
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            const res = await axios.post('http://localhost:8000/studyGroup', data, {
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
        <div className='bg-white rounded-lg overflow-hiodden'>
            <form onSubmit={handleSubmit} className='space-y-3'>
                <div>
                    <label htmlFor='StudyGroupName' className='block text-sm font-medium text-gray-700'>Study Group Name</label>
                    <input
                        type='text'
                        name='StudyGroupName'
                        id='StudyGroupName'
                        value={studyGroup.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter study group name"
                        className='w-full px-3 py-2 border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black' />
                </div>
                <div>
                    <label htmlFor='MeetingType' className='block text-sm font-medium text-gray-700'>Meetyping Type</label>
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
                </div>
            </form>
        </div>
    )

}