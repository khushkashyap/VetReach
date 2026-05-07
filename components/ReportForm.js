"use client";
import React, { useState, useRef } from "react";
import FileUpload from "./FileUpload";

export default function ReportForm() {
  const fileUploadRef = useRef();
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | success | error
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    animalType: "",
    animalCount: "",
    severity: "",
    latitude: null,
    longitude: null,
    message: "",
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationStatus("success");
      },
      () => {
        setLocationStatus("error");
      }
    );
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      animalType: "",
      animalCount: "",
      severity: "",
      latitude: null,
      longitude: null,
      message: "",
      imageUrl: "",
    });
    setLocationStatus("idle");
    if (fileUploadRef.current) fileUploadRef.current.resetImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      alert("Please upload an image before submitting.");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      alert("Please share your location before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Report submitted successfully! Help is on the way 🐾");
        resetForm();
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const severityConfig = {
    Minor: { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-300", dot: "bg-emerald-500" },
    Moderate: { color: "text-amber-600", bg: "bg-amber-50 border-amber-300", dot: "bg-amber-500" },
    Critical: { color: "text-red-600", bg: "bg-red-50 border-red-300", dot: "bg-red-500" },
  };

  return (
    <div className="w-full flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🐾</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Report Injured Animal</h1>
          <p className="text-slate-500 mt-2 text-sm">Help us reach the animal faster — every second counts.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Section: Reporter Info */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">Reporter Details</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Rahul"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Sharma"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
              <input
                type="number"
                name="phoneNumber"
                placeholder="Enter your 10-digit number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Section: Animal Info */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">Animal Details</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Animal Type</label>
                <select
                  name="animalType"
                  value={formData.animalType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition appearance-none"
                >
                  <option value="">Select animal</option>
                  <option>🐄 Cow</option>
                  <option>🐃 Buffalo</option>
                  <option>🐕 Dog</option>
                  <option>🐈 Cat</option>
                  <option>🐦 Bird</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Animal Count</label>
                <select
                  name="animalCount"
                  value={formData.animalCount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition appearance-none"
                >
                  <option value="">Select count</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>3+</option>
                </select>
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Injury Severity</label>
              <div className="grid grid-cols-3 gap-3">
                {["Minor", "Moderate", "Critical"].map((level) => {
                  const config = severityConfig[level];
                  const isSelected = formData.severity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: level })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? `${config.bg} ${config.color} border-current shadow-sm`
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? config.dot : "bg-slate-300"}`}></span>
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">Location</p>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationStatus === "loading"}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl border-2 border-dashed font-medium text-sm transition-all ${
                locationStatus === "success"
                  ? "border-teal-400 bg-teal-50 text-teal-700"
                  : locationStatus === "error"
                  ? "border-red-300 bg-red-50 text-red-600"
                  : locationStatus === "loading"
                  ? "border-slate-300 bg-slate-50 text-slate-400 cursor-wait"
                  : "border-slate-300 bg-slate-50 text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              {locationStatus === "loading" && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {locationStatus === "success" && <span>✅</span>}
              {locationStatus === "error" && <span>❌</span>}
              {locationStatus === "idle" && <span>📍</span>}

              {locationStatus === "idle" && "Use My Current Location"}
              {locationStatus === "loading" && "Fetching location..."}
              {locationStatus === "success" &&
                `Location captured (${formData.latitude?.toFixed(4)}, ${formData.longitude?.toFixed(4)})`}
              {locationStatus === "error" && "Failed to get location. Try again."}
            </button>
          </div>

          {/* Section: Description & Photo */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">Description & Photo</p>
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Describe the situation</label>
              <textarea
                name="message"
                placeholder="Describe the animal's condition, exact spot, any visible injuries..."
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition resize-none"
              />
            </div>
            <FileUpload ref={fileUploadRef} onUploadSuccess={handleImageUpload} />
          </div>

          {/* Submit */}
          <div className="px-8 py-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-semibold text-white text-sm tracking-wide transition-all shadow-lg ${
                submitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 active:scale-[0.98] shadow-teal-200"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Rescue Report"
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              Your report will be sent to nearby rescue centers immediately.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}