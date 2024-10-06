import React,{useEffect,useState} from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

//this is the format that would be used for importing props for like the user infromation itslef 
interface User {
  email:string;
  username:string;
}


export default function UserDashboardHeader() {
  const navigate = useNavigate();
  const [user,setUser] = useState<User | null>(null);

  //get user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try{
        const token = localStorage.getItem('token')
        if(!token){
          throw new Error("No token found")
        }
        const decoded: any = jwtDecode(token);
        const userId = decoded.id

        const res = await axios.get(`http://localhost:8000/users/${userId}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setUser(res.data);
      }catch(error){
        console.error("failed to fetch user information: ",error)
      }
    }

    fetchUserInfo();
  },[])


  // you need to take into account if there is no user so you won't get a case just in case it is possibly null
  if(!user){
    return <div>Loading</div>
  }




    return (
      
        <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <div className="flex items-center">
            <span className="ml-3 font-medoum text-gray-900">{user.username}</span>
          </div>
        </div>
      </header>
      
    )
}