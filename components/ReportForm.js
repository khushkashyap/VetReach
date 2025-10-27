import React, { useState, useRef } from "react";
import FileUpload from "./FileUpload";

export default function ReportForm() {
  const fileUploadRef = useRef(); // Reference for FileUpload

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    animalType: "",
    location: "",
    message: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Report submitted successfully!");

        // ✅ Reset form fields
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          animalType: "",
          location: "",
          message: "",
          imageUrl: "",
        });

        // ✅ Reset FileUpload Component
        if (fileUploadRef.current) {
          fileUploadRef.current.resetImage();
        }
      } else {
        alert("Failed to submit report.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 text-center">Report an Injured Animal</h2>

      <div className="flex space-x-4">
        <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <input type="number" name="phoneNumber" placeholder="Enter Your Number" value={formData.phoneNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />

      <div className="flex space-x-4">
        <select name="animalType" value={formData.animalType} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option>Animal Type</option>
          <option>Cow</option>
          <option>Buffalo</option>
          <option>Dog</option>
          <option>Cat</option>
        </select>
        <input type="text" name="location" placeholder="Enter Your Location" value={formData.location} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <textarea name="message" placeholder="Leave us a message..." value={formData.message} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>

      {/* 📷 File Upload Component with ref */}
      <FileUpload ref={fileUploadRef} onUploadSuccess={handleImageUpload} />

      <button type="submit" className="w-full bg-gray-700 hover:bg-blue-600 text-white p-3 rounded-lg transition duration-300">
        Submit Report
      </button>
    </form>
  );
}
