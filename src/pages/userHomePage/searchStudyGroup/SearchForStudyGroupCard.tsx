import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

interface StudyGroup {
  _id: string;
  meetingType: string;
  meetingDays: string[];
  meetingLocation: string;
  major: string;
  name?: string;
  members?: number;
}

export default function SearchStudyGroupsCard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);

  useEffect(() => {
    const fetchStudyGroups = async () => {
      try {
        const response = await axios.get('http://localhost:8000/studyGroup/all');
        if (Array.isArray(response.data)) {
          setStudyGroups(response.data);
          setFilteredGroups(response.data);
        }
      } catch (error) {
        console.error("Error fetching study groups:", error);
      }
    };

    fetchStudyGroups();
  }, []);

  useEffect(() => {
    const results = studyGroups.filter(group =>
      group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.major.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(results);
  }, [searchTerm, studyGroups]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudyGroup = () => {
    // Navigate to add study group page
    navigate('/add-study-group');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Search Study Groups</h2>
        <input
          type="text"
          placeholder="Search study groups..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <ul className="space-y-2">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <li key={group._id} className="bg-gray-50 rounded-lg p-3 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-1">{group.name || group.major}</h3>
                    <div className="text-xs text-gray-600 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{group.members || "N/A"} members</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{`${group.meetingType} - ${group.meetingLocation}`}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{group.meetingDays.join(", ")}</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {group.major}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center py-4">
              <p className="text-gray-500 mb-2">No study groups found</p>
              <button
                onClick={handleAddStudyGroup}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Add Study Group
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}