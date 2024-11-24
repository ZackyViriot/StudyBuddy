import axiosInstance from "../../../../axios/axiosSetup";
import {jwtDecode} from 'jwt-decode';
import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UserStudyGroupCard from "./UserStudyGroupCard";

interface StudyGroup {
    _id:string;
    name?:string;
    meetingType:string;
    meetingDays:string[];
    meetingLocation:string;
    major:string;
    memebers:string[];
}

interface UserStudyGroupsProps {
    onCreateGroup: () => void;
}

export default function UserStudyGroups({ onCreateGroup }: UserStudyGroupsProps){
    const [userId,setUserId] = useState("");
    const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
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
    
            const res = await axiosInstance.get(`/studyGroup/user?userId=${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
    
            console.log("Received study groups:", res.data);
    
            if (Array.isArray(res.data)) {
              setStudyGroups(res.data);
            } else {
              console.error("Unexpected response format:", res.data);
              setError("Received unexpected data format from server");
            }
          } catch (error) {
            console.error("Failed to fetch user study groups", error);
            setError("Failed to fetch study groups. Please try again later.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserInfo();
      }, []);

      if(loading){
        return <p>Loading your study groups...</p>
      }

      if(error){
        return <p>Error: {error}</p>
      }
      
      return ( 
        <div>
            <UserStudyGroupCard 
                studyGroups={studyGroups}
                onCreateGroup={onCreateGroup}
            />
        </div>
      )
}