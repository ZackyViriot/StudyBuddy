import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserStudyGroupsCardDashboard from './UserStudyGroupCardDashboard';

interface StudyGroup {
  _id: string;
  name?: string;
  meetingType: string;
  meetingDays: string[];
  meetingLocation: string;
  major: string;
  members: string[];  // Change this to an array of strings
}

export default function UserStudyGroupsDashboardComponent() {
  const [userId, setUserId] = useState("");
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No Token found");
        }
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;
        setUserId(userId);

        const res = await axios.get(`http://localhost:8000/studyGroup/getUserStudyGroups?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStudyGroups(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch user information", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      {studyGroups.length > 0 ? (
        <UserStudyGroupsCardDashboard studyGroups={studyGroups} />
      ) : (
        <p>You are not part of any study groups yet.</p>
      )}
    </div>
  );
}