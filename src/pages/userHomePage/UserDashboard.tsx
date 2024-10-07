import React, {useState,useEffect} from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import UserDashboardHeader from "./UserDashboardHeader";
import SideNavigationBar from "./sideNavigation/SideNavigationBar";
import UserStudyGroupsDashboardComponent from "./userStudyGroups/UserStudyGroupsDashboardComponent";

interface User {
    email:string;
    username:string;
}


export default function UserDashboard(){
    const navigate = useNavigate();
    const [user,setUser] = useState<User | null>(null);

    //need to get the user information 
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token){
                    throw new Error("No token found")
                }
                const decoded: any = jwtDecode(token);
                const userId = decoded.id;

                const res = await axios.get(`http://localhost:8000/users/${userId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(res.data)
            }catch(error){
                console.error("Failed to fetch user information: ",error)
            }
        }

        fetchUserInfo();
    },[])


    // in case that there isn't a token 
    if(!user){
        return <div>Loading</div>
    }

    
    return ( 
        <div className="min-h-screen bg-gray-100">
            <UserDashboardHeader/>
            <SideNavigationBar/>
            <UserStudyGroupsDashboardComponent/>
        </div>
    )
}