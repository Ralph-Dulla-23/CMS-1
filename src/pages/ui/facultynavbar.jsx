import React from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./ProfileContext"; 

export default function FacultyNavbar() {
  const navigate = useNavigate();
  const { openProfile } = useProfile(); // 

  return (
    <div className="w-full bg-white pt-10 px-16 flex justify-between items-center" style={{ height: "72px" }}>
      <img src="/src/assets/img/cmslogo.png" alt="Logo" className="w-16 h-16" />
      <nav className="flex items-center gap-6">
        <div className="flex gap-6">
          <a href="#" onClick={() => navigate("/Facultydash")} className="text-gray-700 font-medium hover:text-[#3A0323] transition-colors">
            Home
          </a>
          <a href="#" onClick={() => navigate("/Forms")} className="text-gray-700 font-medium hover:text-[#3A0323] transition-colors">
            Request
          </a>
          <a href="#" onClick={openProfile} className="text-gray-700 font-medium hover:text-[#3A0323] transition-colors">
            Profile
          </a>
        </div>
        <button onClick={() => navigate("/")} className="bg-[#3A0323] hover:bg-[#2a021a] text-white px-6 py-3 rounded-md transition-colors">
          Logout
        </button>
      </nav>
    </div>
  );
}

