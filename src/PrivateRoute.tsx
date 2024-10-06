// this should make that the user has a token 
import React from "react";
import { Navigate,Outlet } from "react-router-dom";


const PrivateRoute: React.FC = () => {
    const isAuthenticated = Boolean(localStorage.getItem('token'));


    return isAuthenticated ? <Outlet /> : <Navigate to ='/' />;
}



export default PrivateRoute;