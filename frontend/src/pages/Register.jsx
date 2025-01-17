import React, { useState } from "react";
import Camera from "../components/Camera";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!capturedImage) {
      alert("Please capture an image!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("image", capturedImage);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Register</h1>
      <div className="bg-white p-6 rounded shadow w-96">
        <label className="block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <label className="block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <Camera onCapture={(image) => setCapturedImage(image)} />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
        >
          Register
        </button>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
