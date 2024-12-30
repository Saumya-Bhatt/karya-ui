import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ListPlans from "./pages/listPlans/ListPlans";
import PlanSummary from "./pages/PlanSummary";
import SignIn from "./pages/SignIn";
import ScheduleTasks from "./pages/scheduleTask/ScheduleTasks";
import { KaryaDummyClient } from "karya-client/client/karya-dummy-client.js";

function App() {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(new KaryaDummyClient());

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
    <Router basename="{process.env.PUBLIC_URL}">
      {user && <Navbar user={user} client={client} onSignOut={handleSignOut} />}
      <div style={{ display: "flex", height: "100vh" }}>
        {user ? <Sidebar /> : <></>}
        <div style={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
          {" "}
          {/* Scrollable content area */}
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/schedule" />
                ) : (
                  <SignIn
                    client={client}
                    setClient={setClient}
                    setUser={setUser}
                  />
                )
              }
            />
            <Route
              path="/schedule"
              element={
                user ? (
                  <ScheduleTasks client={client} user={user} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/jobs"
              element={
                user ? (
                  <ListPlans client={client} user={user} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/job-summary"
              element={
                user ? <PlanSummary client={client} /> : <Navigate to="/" />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
