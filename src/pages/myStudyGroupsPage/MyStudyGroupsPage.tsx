import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import MyStudyGroupsHeader from "./components/MyStudyGroupsHeader";
import StudyGroupCard from "./components/StudyGroupCard";
import StatsGrid from "./components/StatsGrid";
import { jwtDecode } from "jwt-decode";
import { Calendar, Plus, Search, Users } from 'lucide-react';
import axiosInstance from "../../axios/axiosSetup";
import CreateStudyGroupForm from "../userDashboard/userDashboardComponents/StudyGroups/CreateStudyGroupForm";
import { X } from "lucide-react";

interface StudyGroup {
    _id: string;
    name: string;
    meetingType: string;
    meetingDays: string[];
    meetingLocation: string;
    major: string;
    members: string[];
}

interface Stats {
    totalGroups: number;
    totalMembers: number;
    activeGroups: number;
    avgGroupSize: number;
}

export default function MyStudyGroupsPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>();
    const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
    const [allStudyGroups, setAllStudyGroups] = useState<StudyGroup[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState('myGroups'); // 'myGroups' or 'search'
    const [stats, setStats] = useState<Stats>({
        totalGroups: 0,
        totalMembers: 0,
        activeGroups: 0,
        avgGroupSize: 0
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("No token found");
                const decoded: any = jwtDecode(token);
                setUserId(decoded.id);

                const response = await axiosInstance.get(`/studyGroup/user?userId=${decoded.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudyGroups(response.data);

                // Calculate stats
                const totalGroups = response.data.length;
                const totalMembers = response.data.reduce((sum: number, group: StudyGroup) => sum + group.members.length, 0);
                const avgGroupSize = totalGroups > 0 ? Math.round(totalMembers / totalGroups) : 0;
                
                setStats({
                    totalGroups,
                    totalMembers,
                    activeGroups: totalGroups,
                    avgGroupSize
                });

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch user information");
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchAllStudyGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("No token found");
                
                const response = await axiosInstance.get('/studyGroup/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllStudyGroups(response.data);
            } catch (error) {
                console.error("Failed to fetch all study groups", error);
            }
        };

        if (activeTab === 'search') {
            fetchAllStudyGroups();
        }
    }, [activeTab]);

    const handleStudyGroupCreated = () => {
        setShowCreateModal(false);
        // Refresh study groups list
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get(`/studyGroup/user?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudyGroups(response.data);

                // Recalculate stats
                const totalGroups = response.data.length;
                const totalMembers = response.data.reduce((sum: number, group: StudyGroup) => sum + group.members.length, 0);
                const avgGroupSize = totalGroups > 0 ? Math.round(totalMembers / totalGroups) : 0;
                
                setStats({
                    totalGroups,
                    totalMembers,
                    activeGroups: totalGroups,
                    avgGroupSize
                });
            } catch (error) {
                console.error("Failed to refresh study groups");
            }
        };
        fetchGroups();
    };

    const handleChat = (groupId: string) => {
        navigate(`/chat/${groupId}`);
    };

    const handleJoinGroup = async (groupId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found");

            await axiosInstance.post(`/studyGroup/${groupId}/join`, {
                userId: userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh both all study groups and user's study groups
            const allGroupsResponse = await axiosInstance.get('/studyGroup/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllStudyGroups(allGroupsResponse.data);

            const userGroupsResponse = await axiosInstance.get(`/studyGroup/user?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudyGroups(userGroupsResponse.data);

            // Recalculate stats
            const totalGroups = userGroupsResponse.data.length;
            const totalMembers = userGroupsResponse.data.reduce(
                (sum: number, group: StudyGroup) => sum + group.members.length, 
                0
            );
            const avgGroupSize = totalGroups > 0 ? Math.round(totalMembers / totalGroups) : 0;
            
            setStats({
                totalGroups,
                totalMembers,
                activeGroups: totalGroups,
                avgGroupSize
            });

        } catch (error) {
            console.error("Failed to join group:", error);
        }
    };

    const filteredStudyGroups = allStudyGroups.filter(group => {
        const searchLower = searchTerm.toLowerCase();
        return (
            group.name.toLowerCase().includes(searchLower) ||
            group.major.toLowerCase().includes(searchLower) ||
            group.meetingType.toLowerCase().includes(searchLower) ||
            group.meetingLocation.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full bg-black shadow">
                <MyStudyGroupsHeader />
            </div>

            <main className="container mx-auto px-4 py-8 mt-20">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('myGroups')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'myGroups' 
                            ? 'bg-black text-white' 
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                    >
                        My Study Groups
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'search' 
                            ? 'bg-black text-white' 
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                    >
                        Find Groups
                    </button>
                </div>

                {/* My Groups Tab Content */}
                {activeTab === 'myGroups' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Study Groups</h2>
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Group
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="mb-6">
                            <StatsGrid stats={stats} />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {loading ? (
                                <p>Loading study groups...</p>
                            ) : studyGroups.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <h3 className="text-lg font-semibold mb-2">No Study Groups Yet</h3>
                                    <p className="text-gray-600 mb-4">Create or join a study group to get started!</p>
                                    <button 
                                        onClick={() => setShowCreateModal(true)}
                                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Group
                                    </button>
                                </div>
                            ) : (
                                studyGroups.map((group) => (
                                    <StudyGroupCard
                                        key={group._id}
                                        group={group}
                                        variant="myGroup"
                                        onChat={handleChat}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Search Tab Content */}
                {activeTab === 'search' && (
                    <div>
                        <div className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="search"
                                    placeholder="Search for study groups..."
                                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {allStudyGroups.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-600">Loading study groups...</p>
                                </div>
                            ) : filteredStudyGroups.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-600">No study groups found matching your search.</p>
                                </div>
                            ) : (
                                filteredStudyGroups.map((group) => (
                                    <StudyGroupCard
                                        key={group._id}
                                        group={group}
                                        variant="searchResult"
                                        onChat={handleChat}
                                        onJoin={handleJoinGroup}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Create Study Group Modal */}
                {showCreateModal && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowCreateModal(false);
                            }
                        }}
                    >
                        <div className="bg-white rounded-lg w-full max-w-lg relative">
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Create Study Group</h2>
                                <CreateStudyGroupForm 
                                    onStudyGroupCreated={handleStudyGroupCreated}
                                    onClose={() => setShowCreateModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}