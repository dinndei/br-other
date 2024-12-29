'use client'
import React, { useState } from "react";

const TmpNavbar = () => {

  const [showProfile, setShowProfile] = useState(false);


  return (
    <nav className="bg-black text-white px-4 py-3 flex items-center justify-between shadow-lg">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center bg-white rounded-md w-10 h-10">
          <span className="text-black font-bold ">S</span>
        </div>
        <h1 className="text-lg font-semibold"></h1>
      </div>

     

      {/* Right Section */}
      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Sign Up
        </button>
        <button className="border border-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          Log In
        </button>
      </div>
    </nav>
  );
};

export default TmpNavbar;
