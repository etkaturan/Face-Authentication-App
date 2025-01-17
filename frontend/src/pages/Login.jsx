import React, { useState } from "react";
import FaceDetectionIcon from "../components/FaceDetectionIcon";

const Login = () => {
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState("");

  const handleFaceRecognition = async (imageData) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/recognize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (data.success) {
        setMatches(data.matches);
      } else {
        alert(data.error || "Face not recognized");
      }
    } catch (error) {
      console.error("Error during recognition:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email === selectedUser.email) {
      alert(`Welcome, ${selectedUser.name}!`);
      window.location.href = "/dashboard"; // Redirect to dashboard
    } else {
      alert("Email does not match the selected user!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Login</h1>
      {matches.length === 0 ? (
        <div className="flex flex-col items-center">
          <FaceDetectionIcon onRecognize={handleFaceRecognition} />
          <p className="text-gray-700 mt-4">Looking for your face...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow w-96">
          <h2 className="text-lg font-bold mb-4">Top Matches</h2>
          {matches.map((match, index) => (
            <button
              key={index}
              onClick={() => handleUserSelection(match)}
              className="w-full text-left px-4 py-2 border rounded mb-2 hover:bg-gray-100"
            >
              <p className="text-sm font-bold">{match.name}</p>
              <p className="text-sm text-gray-500">
                {match.email} - {match.similarity_score}%
              </p>
            </button>
          ))}
          {selectedUser && (
            <form onSubmit={handleEmailSubmit} className="mt-4">
              <label className="block text-gray-700">Confirm Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
