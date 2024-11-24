import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Calendar, ArrowLeft, ArrowRight, Plus } from 'lucide-react';

interface StudyGroup {
    _id: string;
    meetingType: string;
    meetingDays: string[];
    meetingLocation: string;
    major: string;
    name?: string;
    memeber?: string[];
}

interface UserStudyGroupCardProps {
    studyGroups: StudyGroup[];
    onCreateGroup: () => void;
}

export default function UserStudyGroupCard({ studyGroups, onCreateGroup }: UserStudyGroupCardProps) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const groupsPerPage = 4;

    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
    const currentGroups = studyGroups.slice(indexOfFirstGroup, indexOfLastGroup);

    const totalPages = Math.ceil(studyGroups.length / groupsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleGoToChat = (groupId: string) => {
        navigate(`/chat/${groupId}`);
    };

    const groupsToRender = Array(4).fill(null).map((_, index) => currentGroups[index] || null);

    return (
        <div className="bg-white rounded-lg w-full h-full flex flex-col">
            <div className="p-4 flex-grow">
                {studyGroups.length > 0 ? (
                    <ul className="space-y-3">
                        {groupsToRender.map((group, index) => (
                            <li 
                                key={group?._id || `empty-${index}`} 
                                className={`rounded-lg transition-all ${
                                    group ? 'bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow' : 'border-2 border-dashed border-gray-200'
                                }`}
                            >
                                {group ? (
                                    <div className="p-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {group.name || group.major}
                                                </h3>
                                                <div className="mt-1 space-y-1">
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin size={14} className="mr-1" />
                                                        <span className="text-xs">{`${group.meetingType} - ${group.meetingLocation}`}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar size={14} className="mr-1" />
                                                        <span className="text-xs">
                                                            {group.meetingDays.join(', ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {group.major}
                                                </span>
                                                <button
                                                    onClick={() => handleGoToChat(group._id)}
                                                    className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
                                                >
                                                    Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[100px] text-gray-400 text-sm">
                                        Empty Slot
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="bg-gray-50 rounded-full p-3 mb-4">
                            <Users size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">No Study Groups Yet</h3>
                        <p className="text-sm text-gray-500 mb-4 max-w-md">
                            Create your first study group to start collaborating with peers!
                        </p>
                    </div>
                )}
            </div>

            {/* Fixed bottom section with create button and pagination */}
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onCreateGroup}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={16} className="mr-1.5" />
                        Create Group
                    </button>
                    
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft size={16} className="mr-1" />
                            </button>
                            <span className="text-sm text-gray-600">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowRight size={16} className="ml-1" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}