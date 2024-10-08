import React from "react"
import { useNavigate } from "react-router-dom"

interface StudyGroup {
  _id: string
  meetingType: string
  meetingDays: string[]
  meetingLocation: string
  major: string
  name?: string
  members?: number
}

interface MyStudyGroupProps {
  studyGroups: StudyGroup[]
}

export default function UserStudyGroupsCardDashboard({ studyGroups }: MyStudyGroupProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Study Groups</h2>
        <ul className="space-y-4">
          {studyGroups.map((group) => (
            <li key={group._id} className="bg-gray-50 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{group.name || group.major}</h3>
                  <div className="text-sm text-gray-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{group.members || "N/A"} members</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{`${group.meetingType} - ${group.meetingLocation}`}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{group.meetingDays.join(", ")}</span>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {group.major}
                </span>
              </div>
              {/* <div className="mt-4 flex justify-end">
                <button
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
                  onClick={() => navigate(`/study-group/${group._id}`)}
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}