import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
}

export default function UserStudyGroupCard({ studyGroups }: UserStudyGroupCardProps) {
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
    <div className="bg-white overflow-hidden max-w-3xl mx-auto w-full h-[400px]">
      <div className="p-3 h-full">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Your Study Groups</h2>
        {studyGroups.length > 0 ? (
          <>
            <ul className="space-y-1.5">
              {groupsToRender.map((group, index) => (
                <li key={group?._id || `empty-${index}`} className="bg-gray-50 rounded-lg p-2 h-[70px] transition-all hover:shadow-md">
                  {group ? (
                    <div className="flex justify-between items-start h-full">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-0.5">{group.name || group.major}</h3>
                        <div className="text-xs text-gray-600 mb-0.5">
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
                      <div className="flex flex-col gap-1.5 items-end">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                          {group.major}
                        </span>
                        <button
                          onClick={() => handleGoToChat(group._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-0.5 px-2 rounded"
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
            {totalPages > 1 && (
              <div className="mt-3 flex justify-between items-center">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-0.5 px-3 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-0.5 px-3 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">No Study Groups Yet</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              You're not part of any study groups at the moment. Join or create one to start collaborating with your peers!
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/createGroup')}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1.5 px-4 border border-gray-400 rounded shadow inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create a Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}