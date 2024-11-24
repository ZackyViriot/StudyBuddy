import React from 'react';
import { Users, Calendar } from 'lucide-react';

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
}

export default function StudyGroupCard({ group }: StudyGroupCardProps) {
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
            </div>
        </div>
    );
}