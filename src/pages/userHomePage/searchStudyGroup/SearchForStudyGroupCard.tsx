import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

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
  const [userId,setUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState("");
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 3;

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
    setCurrentPage(1);
  }, [searchTerm, studyGroups]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudyGroup = () => {
    navigate('/createGroup');
  };

 
  const handleJoinGroup = async (groupId: string) => {
    try {
      // Get the current user's ID from wherever you store it (e.g., local storage, context)
        const token = localStorage.getItem("token")
        if(!token){
            throw new Error("No token found")

        }
        const decoded: any = jwtDecode(token);
        const userId = decoded.id
        setUserId(userId)

      // Make the API call to join the group
      await axios.post(`http://localhost:8000/studyGroup/${groupId}/join`, { userId });
      
      // Update the local state to reflect the change
      setStudyGroups(prevGroups =>
        prevGroups.map(group =>
          group._id === groupId
            ? { ...group, members: (group.members || 0) + 1 }
            : group
        )
      );

      window.location.reload()
    } catch (error) {
      console.error("Error joining study group:", error);
      alert("Failed to join the group. Please try again.");
    }
  };
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);

  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleGoToChat = (groupId: string) => {
    navigate(`/chat/${groupId}`);
  };

  const groupsToRender = Array(3).fill(null).map((_, index) => currentGroups[index] || null);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto  h-[600px]">
    <div className="p-4 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Search Study Groups</h2>
      <input
        type="text"
        placeholder="Search study groups..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <ul className="space-y-2">
        {groupsToRender.map((group, index) => (
          <li
            key={group?._id || `empty-${index}`}
            className="bg-gray-50 rounded-lg p-3 transition-all hover:shadow-md w-[320px] h-[120px] flex flex-col justify-between"
          >
            {group ? (
              <div className="flex justify-between items-start h-full">
                <div className="overflow-hidden">
                  <h3 className="text-md font-semibold text-gray-800 mb-1 truncate">{group.name || group.major}</h3>
                  <div className="text-xs text-gray-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{`${group.meetingType} - ${group.meetingLocation}`}</span>
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{group.meetingDays.join(", ")}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded mb-2">
                    {group.major}
                  </span>
                  <button
                    onClick={() => handleJoinGroup(group._id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded"
                  >
                    Join Group
                  </button>
                  <button
                      onClick={() => handleGoToChat(group._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded"
                    >
                      Go to Chat
                    </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No study group
              </div>
            )}
          </li>
        ))}
      </ul>
      {filteredGroups.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-2">No study groups found</p>
          <button
            onClick={handleAddStudyGroup}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Study Group
          </button>
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
  
  );
}