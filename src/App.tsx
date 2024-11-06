import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// all pages with my routed through here. 
import Home from "./pages/Home";
import LandingPage from "./pages/landingPage/LandingPage";
import UserDashboard from "./pages/userDashboard/UserDashboard";
import CreateStudyGroupPage from "./pages/createStudyGroupPage/CreateStudyGroupPage";
// need to make some protected routes that are only avilable if you have user token. 
import PrivateRoute from "./PrivateRoute";
import StudyGroupChat from "./pages/chatRoom/ChatComponent";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='/UserDashboard' element={<UserDashboard />} />
          <Route path = '/createGroup' element = {<CreateStudyGroupPage/>}/>
          <Route path='/chat/:studyGroupId' element = {<StudyGroupChat/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App