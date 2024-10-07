import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



// this is a prop component so we are going to pass the information that we got from the the UserStudyGroupsDashboardComponent to it 


interface StudyGroup{
    _id:string;
    meetingType:string;
    meetingDays:string[];
    meetingLocation:string;
    major:string;
}

interface MyStudyGroupProps {
    studyGroup:StudyGroup[]
}

const UserStudyGroupsDashboardComponent: React.FC <MyStudyGroupProps> = ({studyGroup}) => {
    const navigate = useNavigate();





    return (
        <div>

        </div>
    )
}


export default UserStudyGroupsDashboardComponent