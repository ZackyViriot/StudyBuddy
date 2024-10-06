import React from "react";
import { useNavigate } from "react-router-dom";



export default function SideNavigationBar() {

    const navigate = useNavigate();

    //function to handle the logout it will remove the token and navigate back to the landing page 
    const handleLogout = () => {
        // going to clear the local storage getting rid of the user token and then go to the homepage
        localStorage.clear()
        navigate('/')
    }



    return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 hover:scale-105 transition-transform duration-200">
                <div className="flex flex-col md:flex-row">
                    <nav className="md:w-64   bg-white shadow rounded-lg p-6 mr-6 mb-6 md:mb-0">
                        <ul>
                            <li className="mb-3">
                                <a href="#" className="text-blue-600 hover:text-blue-800">Dashboard</a>
                            </li>
                            <li className="mb-3">
                                <a href="#" className="text-gray-600 hover:text-gray-800">My Groups</a>
                            </li>
                            <li className="mb-3">
                                <a href="#" className="text-gray-600 hover:text-gray-800">Find Groups</a>
                            </li>
                            <li className="mb-3">
                                <a href='/createGroup' className="text-gray-600 hover:text-gray-800">Create Group</a>
                            </li>
                            <li>
                                <a href="#" onClick ={handleLogout} className="text-gray-600 hover:text-gray-800">Logout</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

    )
}