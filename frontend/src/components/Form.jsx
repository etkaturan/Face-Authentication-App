// frontend/src/components/Form.jsx
import React from "react";

const Form = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <label className="block text-gray-700 font-medium mb-2">Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
