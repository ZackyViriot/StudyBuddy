
import React from 'react';
import { Users, Calendar } from 'lucide-react';

interface StatsGridProps {
    stats: {
        totalGroups: number;
        totalMembers: number;
        activeGroups: number;
        avgGroupSize: number;
    };
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total Groups</h3>
                    <Users className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">{stats.totalGroups}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total Members</h3>
                    <Users className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Active Groups</h3>
                    <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">{stats.activeGroups}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Avg. Group Size</h3>
                    <Users className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">{stats.avgGroupSize}</p>
            </div>
        </div>
    );
}