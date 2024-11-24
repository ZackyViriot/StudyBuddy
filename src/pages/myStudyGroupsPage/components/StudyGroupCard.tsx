import React from 'react';
import { Users, Calendar, MessageCircle } from 'lucide-react';

interface StudyGroup {
    _id: string;
    name: string;
    meetingType: string;
    meetingDays: string[];
    meetingLocation: string;
    major: string;
    members: string[];
}

interface StudyGroupCardProps {
    group: StudyGroup;
    variant: 'myGroup' | 'searchResult';
    onJoin?: (groupId: string) => void;
    onChat?: (groupId: string) => void;
}

export default function StudyGroupCard({ group, variant, onJoin, onChat }: StudyGroupCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.major}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{group.members.length} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{group.meetingDays.join(', ')}</span>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    {variant === 'myGroup' ? (
                        <button
                            onClick={() => onChat?.(group._id)}
                            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Go to Chat
                        </button>
                    ) : (
                        <button
                            onClick={() => onJoin?.(group._id)}
                            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Join Group
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}