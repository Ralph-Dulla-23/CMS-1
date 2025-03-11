// src/firebase/firestoreService.js

import { db } from './firebase-config';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth for admin check

/**
 * Submits a student interview form to Firestore.
 * @param {Object} formData - The form data to be submitted.
 * @returns {Object} - Success status and document ID or error message.
 */
export const submitStudentInterviewForm = async (formData) => {
  try {
    // Validate form data before submission
    if (!formData.studentName || !formData.courseYearSection || !formData.dateOfBirth) {
      throw new Error("Required fields are missing.");
    }

    // Enhance form data with additional metadata
    const enhancedFormData = {
      ...formData,
      email: localStorage.getItem('userEmail') || '', // Add user email
      submissionDate: new Date().toISOString(), // Add submission date
      status: 'Pending', // Initial status
      type: 'Walk-in', // Default type
      referral: 'Self', // Default referral source
      remarks: '', // Empty initially
      isReferral: false // Flag to identify if it's a referral
    };

    // Add document to Firestore collection
    const docRef = await addDoc(collection(db, "studentInterviews"), enhancedFormData);
    console.log("Document written with ID: ", docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * Checks if the current user is an admin
 * @returns {Promise<boolean>} - True if the user is an admin, false otherwise.
 */
const isAdmin = async () => {
  try {
    // Check if admin email is stored in localStorage
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    return userRole === 'admin' && userEmail === 'admin@gmail.com';
  } catch (error) {
    console.error("Error checking admin status: ", error);
    return false;
  }
};

/**
 * Fetches all student interview forms from Firestore.
 * @returns {Object} - Success status and forms or error message.
 */
export const getStudentInterviewForms = async () => {
  try {
    console.log("Checking admin status from localStorage");
    // Simple admin check based on localStorage
    const isAdmin = localStorage.getItem('userRole') === 'admin' && 
                   localStorage.getItem('userEmail') === 'admin@gmail.com';
    
    if (!isAdmin) {
      console.log("Not admin - access denied");
      return { 
        success: false, 
        error: "Unauthorized access. Only administrators can view all forms."
      };
    }

    console.log("Admin access confirmed, fetching forms...");
    
    try {
      // Direct fetch without authentication checks
      const querySnapshot = await getDocs(collection(db, "studentInterviews"));
      console.log("Raw query result:", querySnapshot);
      
      const forms = [];
      querySnapshot.forEach((doc) => {
        forms.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Successfully fetched ${forms.length} forms`);
      return { success: true, forms };
    } catch (fetchError) {
      console.error("Error in Firestore fetch operation:", fetchError);
      return { 
        success: false, 
        error: `Firestore fetch error: ${fetchError.message}` 
      };
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * Updates the status and remarks of a student interview form in Firestore.
 * @param {string} formId - The ID of the form to update.
 * @param {string} status - The new status (e.g., "Reviewed", "Rescheduled").
 * @param {string} remarks - Additional remarks for the update.
 * @returns {Object} - Success status or error message.
 */
export const updateFormStatus = async (formId, status, remarks) => {
  try {
    // Check if the user is an admin
    if (!await isAdmin()) {
      return { 
        success: false, 
        error: "Unauthorized access. Only administrators can update forms."
      };
    }

    // Update the document in Firestore
    const formRef = doc(db, "studentInterviews", formId);
    await updateDoc(formRef, {
      status,
      remarks,
      updatedAt: new Date().toISOString() // Add update timestamp
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    return { success: false, error: error.message };
  }
};