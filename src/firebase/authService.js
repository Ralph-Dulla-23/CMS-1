import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase-config"; // Ensure correct Firebase config is imported

/**
 * User Registration Function
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (student/faculty)
 * @param {Object} userData - User details based on role (name, course, yearLevel, section for student or department for faculty)
 * @returns {Object} Registration result
 */
export const signUp = async (email, password, role, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Use the correct collection names and ensure all data is correctly formatted
    await setDoc(doc(db, role === 'student' ? "students" : "faculty", user.uid), {
      ...userData,
      email,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    return { 
      success: true, 
      user,
      message: "Registration successful" 
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      message: error.message || "Registration failed" 
    };
  }
};

/**
 * Enhanced Login Function with Admin Support
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Login result
 */


export const login = async (email, password) => {
  try {
    console.log("Login attempt for:", email);
    
    // Special case for admin
    if (email === "admin@gmail.com" && password === "123") {
      console.log("Admin credentials detected");
      
      // Skip Firebase Authentication for admin
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userEmail', 'admin@gmail.com');
      localStorage.setItem('isAdmin', 'true');
      
      console.log("Admin session established");
      
      return { 
        success: true, 
        isAdmin: true,
        user: {
          role: 'admin',
          email: 'admin@gmail.com'
        },
        message: "Admin login successful"
      };
    }

    // Regular user login with Firebase Authentication
    console.log("Attempting Firebase authentication for regular user");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Firebase authentication successful");

    // Check if the user is a student
    const studentDoc = await getDoc(doc(db, "students", user.uid));
    if (studentDoc.exists()) {
      console.log("Student document found");
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userEmail', email);
      
      return { 
        success: true, 
        isAdmin: false,
        user: userCredential.user,
        userData: studentDoc.data(),
        message: "Login successful"
      };
    }

    // Check if the user is faculty
    const facultyDoc = await getDoc(doc(db, "faculty", user.uid));
    if (facultyDoc.exists()) {
      console.log("Faculty document found");
      localStorage.setItem('userRole', 'faculty');
      localStorage.setItem('userEmail', email);
      
      return { 
        success: true, 
        isAdmin: false,
        user: userCredential.user,
        userData: facultyDoc.data(),
        message: "Login successful"
      };
    }

    console.log("User document not found in Firestore");
    return { 
      success: false, 
      message: "User document not found in Firestore" 
    };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      message: error.message || "Login failed" 
    };
  }
};
/**
 * Session Management Helper
 * @param {Object} user - User object
 * @param {boolean} isAdmin - Admin status
 */
const handleSession = (user, isAdmin) => {
  localStorage.setItem('userRole', isAdmin ? 'admin' : 'user');
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('lastLogin', new Date().toISOString());
};

/**
 * Error Handler
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
const handleError = (error) => {
  const errorMessages = {
    'auth/user-not-found': 'No user found with this email',
    'auth/wrong-password': 'Invalid password',
    'auth/email-already-in-use': 'Email already registered',
    'auth/invalid-email': 'Invalid email format',
    'auth/weak-password': 'Password should be at least 6 characters'
  };

  return errorMessages[error.code] || error.message;
};

/**
 * Logout Function
 */
export const logout = async () => {
  try {
    await auth.signOut();
    localStorage.clear();
    return { success: true, message: "Logout successful" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
