import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.name) {
      setUserName(user.name);
    } else {
      console.error("No user found in localStorage or missing name field.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome, {userName || "Guest"}!</h1>
        <p className="text-xl">You have successfully logged in.</p>
      </div>
    </div>
  );
};

export default Dashboard;
