import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../../firebase/authService"; // Import your signUp function

export default function Signup() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const userData = role === "student"
      ? { name, email, course, yearLevel, section, role }
      : { name, email, department, role }; // Faculty only has department and role

    // Call signUp function with the appropriate user data
    const result = await signUp(email, password, role, userData);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <img 
        src="src/assets/img/cmslogo.png"
        alt="Logo" 
        className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16"
      />

      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-gray-900">Create an account</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Role Selection */}
        <div className="flex gap-2 mb-4">
          <button 
            className={`flex-1 p-3 border rounded-lg ${role === "student" ? "bg-[#340013] text-white" : "bg-gray-200 text-gray-700"}`} 
            onClick={() => setRole("student")}
          >
            🎓 Student
          </button>
          <button 
            className={`flex-1 p-3 border rounded-lg ${role === "faculty" ? "bg-[#340013] text-white" : "bg-gray-200 text-gray-700"}`} 
            onClick={() => setRole("faculty")}
          >
            👤 Faculty
          </button>
        </div>

        {/* Common Input Fields */}
        <input 
          type="text" 
          placeholder="Full Name" 
          className="w-full p-2 border rounded-md mt-3" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border rounded-md mt-3" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password (6+ characters)" 
          className="w-full p-2 border rounded-md mt-3" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          className="w-full p-2 border rounded-md mt-3" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />

        {/* Student Fields */}
        {role === "student" && (
          <>
            <input 
              type="text" 
              placeholder="Course" 
              className="w-full p-2 border rounded-md mt-3" 
              value={course} 
              onChange={(e) => setCourse(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Year Level" 
              className="w-full p-2 border rounded-md mt-3" 
              value={yearLevel} 
              onChange={(e) => setYearLevel(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Section" 
              className="w-full p-2 border rounded-md mt-3" 
              value={section} 
              onChange={(e) => setSection(e.target.value)} 
            />
          </>
        )}

        {/* Faculty Fields */}
        {role === "faculty" && (
          <>
            <input 
              type="text" 
              placeholder="Department" 
              className="w-full p-2 border rounded-md mt-3" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)} 
            />
          </>
        )}

        {/* Sign Up Button */}
        <button 
          className="w-full mt-4 bg-[#340013] text-white p-2 rounded-md text-sm font-medium" 
          onClick={handleSignup}
        >
          Create Account
        </button>

        {/* Login Redirect */}
        <p className="text-sm text-gray-600 text-center mt-3">
          Already have an account? {" "}
          <span 
            className="text-[#340013] font-medium hover:underline cursor-pointer" 
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
