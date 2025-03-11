// src/services/profileService.js
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { setDoc } from "firebase/firestore";

export async function updateUserProfile(newData) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
      console.error("No user logged in");
      alert("No user logged in");
      return;
  }

  try {
      if (newData.email && newData.email !== user.email) {
          await updateEmail(user, newData.email);
          await sendEmailVerification(user);
          alert("Please verify your new email before it can be updated in your profile.");
          return;
      }
      if (newData.password) {
          await updatePassword(user, newData.password);
      }

      const path = user.role === 'student' ? 'students' : 'faculty';
      const userRef = doc(db, path, user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
          alert("Creating a new profile document as it does not exist.");
          await setDoc(userRef, { name: newData.name, email: user.email, createdAt: new Date().toISOString() });
      } else {
          const { email, password, ...firestoreData } = newData;
          await updateDoc(userRef, firestoreData);
      }

      alert("Profile updated successfully");
  } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error.message}`);
  }
}