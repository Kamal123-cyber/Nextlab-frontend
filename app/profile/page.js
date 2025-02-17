"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import CONSTANT from "../Constant";


export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
//   const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      console.log("Token:", token);

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${CONSTANT.BASE_URL}/api/auth/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     router.push("/login");
//   };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <div className="animate-pulse">
          <div className="h-20 w-20 bg-gray-300 rounded-full mx-auto"></div>
          <div className="mt-4 h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex flex-col items-center">
      

        {/* Name & Email */}
        <h2 className="text-2xl font-bold text-gray-900 mt-4">{profile?.username}</h2>
        <p className="text-gray-600">{profile?.email}</p>

        {/* Points Earned */}
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-lg font-semibold text-blue-700">
            Points Earned: <span className="text-black">{profile?.points}</span>
          </p>
        </div>

        {/* Logout Button */}
        
      </div>
    </div>
  );
}
