import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../ui/studentnavbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const storedFullName = localStorage.getItem("userFullName");
    console.log("🟢 Retrieved Full Name in Dashboard:", storedFullName);

    if (storedFullName) {
      setFullName(storedFullName);
    } else {
      console.warn("⚠ Full Name not found in localStorage.");
    }
  }, []);

  const handleLogout = () => {
    navigate("/"); // Redirect to home
  };

  const handleHome = () => {
    navigate("/Dashboard");
  };

  const handleRequest = () => {
    navigate("/Request");
  };

  const handleProfile = () => {
    navigate("/Profile");
  };

  const handleAccept = () => {
    console.log("Session Accepted");
  };

  const handleCancel = () => {
    console.log("Session Cancelled");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <StudentNavbar />

      {/* Welcome Text */}
      <h1 className="text-2xl font-bold mt-16 px-16">Welcome {fullName || "Guest"}</h1>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-6 mt-6 px-16">
        {/* Schedule Card */}
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Schedule</h2>
        </div>

        {/* Notifications Card */}
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="flex items-start gap-3 mt-4">
            <div className="w-6 h-6 bg-[#340013] rounded-md"></div>
            <div>
              <p className="font-semibold">Rescheduled Session</p>
              <p className="text-gray-600 text-sm">
                Rescheduled for November 12, 2024 <br />
                Time: 3:00 PM
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleAccept}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
