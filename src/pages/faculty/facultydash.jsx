import React, { useState } from "react";  // 
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ui/ProfileContext"; // 
import FacultyNavbar from "../ui/facultynavbar";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { openProfile } = useProfile(); // 
  const [showModal, setShowModal] = useState(false); // 


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <FacultyNavbar />
      
      {/* Welcome Text */}
      <h1 className="text-2xl font-bold mt-16 px-16">Welcome Sir Bolo!</h1>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

