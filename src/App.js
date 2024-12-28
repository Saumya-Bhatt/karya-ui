import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ListJobs from "./pages/ListJobs";
import JobSummary from "./pages/JobSummary";
import SignIn from "./pages/SignIn";
import ScheduleJob from "./pages/ScheduleJob";

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app load
  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(cachedUser);
    }
  }, []);

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleSignOut = () => {
    setUser(null); // Clear user state
  };

  return (
    <Router>
      {user && <Navbar user={user} onSignOut={handleSignOut} />}
      <div style={{ display: "flex", height: "100vh" }}>
        {user ? <Sidebar /> : <></>}
        <div style={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}> {/* Scrollable content area */}
          <Routes>
            <Route path="/" element={user ? <Navigate to="/schedule" /> : <SignIn setUser={setUser} />} />
            <Route path="/schedule" element={user ? <ScheduleJob user={user} /> : <Navigate to="/" />} />
            <Route path="/jobs" element={user ? <ListJobs /> : <Navigate to="/" />} />
            <Route path="/job-summary" element={user ? <JobSummary /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
