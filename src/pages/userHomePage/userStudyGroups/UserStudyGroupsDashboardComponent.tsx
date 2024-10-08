import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import UserStudyGroupsCardDashboard from './UserStudyGroupCardDashboard';




export default function UserStudyGroupsDashboardComponent(){
    const [userId,setUserId] = useState("");
    const [studyGroup,setStudyGroup] = useState<any[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        //need to fetch the infromation about the study groups as well
        const fetchUserInfo = async () => {
            try{
                const token = localStorage.getItem("token")
                if(!token){
                    throw new Error("No Token found");
                }
                const decoded: any = jwtDecode(token);
                const userId = decoded.id;
                setUserId(userId)
                // this is where we make the call to receive the information.
                const res = await axios.get(`http://localhost:8000/studyGroup/getUserStudyGroups?userId=${userId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setStudyGroup(res.data);
                console.log(studyGroup)


            }catch(error){
                console.error("Failed to fetch user infromation")
            }
           
        }

        fetchUserInfo();
    },[])

    //some things that we are going to have to do we are going to have to get the user information and fetch the studygroups and we should do this at the beginging of the page render 




    return ( 
        <div>
            <UserStudyGroupsCardDashboard studyGroups = {studyGroup}/>
        </div>
    )
}