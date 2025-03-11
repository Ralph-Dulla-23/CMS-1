import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../firebase/authService";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setEmail(selectedRole === "admin" ? "admin@gmail.com" : ""); // Pre-fill email for admin
    setError("");
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const result = await login(email, password);

      if (result.success) {
        // Store user role and email in localStorage
        localStorage.setItem("userRole", result.isAdmin ? "admin" : role);
        localStorage.setItem("userEmail", email);
        
        // For admin, explicitly store additional information
        if (result.isAdmin) {
          localStorage.setItem("isAdmin", "true");
        }
      
        // Navigate to appropriate dashboard based on user role
        if (result.isAdmin) {
          navigate("/Admindashboard");
        } else if (role === "faculty") {
          navigate("/facultydash");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
      <img 
        src="src/assets/img/cmslogo.png"
        alt="Logo" 
        className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16"
      />

      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
        <p className="text-gray-6 00 text-sm mb-4">
          Choose your role and enter your credentials to access the system.
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
            {error}
          </p>
        )}

        {/* Role Selection */}
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 p-3 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              role === "student" ? "bg-[#340013] text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleRoleSelect("student")}
          >
            🎓 Student
          </button>
          <button
            className={`flex-1 p-3 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              role === "faculty" ? "bg-[#340013] text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleRoleSelect("faculty")}
          >
            👤 Faculty
          </button>
        </div>

        {/* Input Fields */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md mt-3 focus:outline-none focus:ring-2 focus:ring-[#340013]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={role === "admin"}
        />
        <input
          type="password"
          placeholder="Password (6+ characters)"
          className="w-full p-2 border rounded-md mt-3 focus:outline-none focus:ring-2 focus:ring-[#340013]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Remember Me */}
        <div className="flex items-center mt-3">
          <input 
            type="checkbox" 
            id="rememberMe" 
            className="mr-2 accent-[#340013]" 
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-600">
            Remember me
          </label>
        </div>

        {/* Login Button */}
        <button
          className={`w-full mt-4 bg-[#340013] text-white p-2 rounded-md text-sm font-medium 
            transition-all hover:bg-[#2a0010] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
          {role !== "admin" && (
            <span
              className="text-[#340013] font-medium hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </span>
          )}
        </div>
      </div>
    </div>
  );
}