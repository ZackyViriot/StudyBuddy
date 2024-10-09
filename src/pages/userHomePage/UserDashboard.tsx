import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import UserDashboardHeader from "./UserDashboardHeader";
import SideNavigationBar from "./sideNavigation/SideNavigationBar";
import UserStudyGroupsDashboardComponent from "./userStudyGroups/UserStudyGroupsDashboardComponent";
import SearchForStudyGroupCard from "./searchStudyGroup/SearchForStudyGroupCard";

interface User {
    email: string;
    username: string;
}


export default function UserDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    //need to get the user information 
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found")
                }
                const decoded: any = jwtDecode(token);
                const userId = decoded.id;

                const res = await axios.get(`http://localhost:8000/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(res.data)
            } catch (error) {
                console.error("Failed to fetch user information: ", error)
            }
        }

        fetchUserInfo();
    }, [])


    // in case that there isn't a token 
    if (!user) {
        return <div>Loading</div>
    }


    return (
        <div className="min-h-screen bg-gray-100">
        <UserDashboardHeader />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-x-5  ">
                    <SideNavigationBar />
                    <UserStudyGroupsDashboardComponent />
                    <SearchForStudyGroupCard/>
                </div>
            </div>
        </div>
    )
}