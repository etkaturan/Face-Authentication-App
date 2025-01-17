import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to Face ID App</h1>
      <p className="text-xl mb-8">Secure and seamless login with face recognition technology.</p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded shadow hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded shadow hover:bg-gray-100"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
