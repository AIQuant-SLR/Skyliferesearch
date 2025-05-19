// src/firebase/logout.js
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";

export const logout = async (setUser) => {
  try {
    await signOut(auth);
    setUser(null);
    toast.success("Logged out successfully", { position: "bottom-left" });
  } catch (error) {
    console.error("Logout error", error);
    toast.error("Error during logout");
  }
};
