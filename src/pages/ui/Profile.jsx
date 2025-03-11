import React, { useState } from "react";
import { updateUserProfile } from "../../Hooks/updateProfile.js"; // Import the updateUserProfile function// Import the updateUserProfile function

export default function ProfilePage({ onClose }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await updateUserProfile(userData); // Use the imported function to update the profile
      alert("Profile updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message}`);
    }

    setIsLoading(false);
  };

  // Render the component UI
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="w-[700px] bg-white border rounded-lg shadow-lg flex relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">✖</button>
        <div className="w-1/2 flex justify-center items-center p-6 border-r">
          <img src="/src/assets/img/cmslogo.png" alt="Logo" className="w-32 h-32" />
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-xl font-bold mb-4">Update Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-sm font-medium">Name</label>
            <input type="text" name="name" value={userData.name} onChange={handleInputChange} className="border rounded-md p-2" />
            <label className="text-sm font-medium">Email</label>
            <input type="email" name="email" value={userData.email} onChange={handleInputChange} className="border rounded-md p-2" />
            <label className="text-sm font-medium">Password</label>
            <input type="password" name="password" value={userData.password} onChange={handleInputChange} className="border rounded-md p-2" placeholder="Leave blank to keep unchanged" />
            <div className="flex justify-end gap-4 mt-4">
              <button type="button" onClick={onClose} className="text-gray-600">Cancel</button>
              <button type="submit" className="bg-[#3A0323] hover:bg-[#2a021a] text-white px-4 py-2 rounded-md transition-colors">Confirm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}