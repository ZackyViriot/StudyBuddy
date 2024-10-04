import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// all pages with my routed through here. 
import Home from "./pages/Home";
import LandingPage from "./pages/landingPage/LandingPage";
import UserDashboard from "./pages/userHomePage/UserDashboard";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path = '/UserDashboard' element = {<UserDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App