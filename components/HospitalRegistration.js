"use client";
import { useState, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function HospitalRegistration({ onRegistered }) {
  const { user } = useKindeBrowserClient();
  const [locationStatus, setLocationStatus] = useState("idle");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      () => setLocationStatus("error")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      alert("Please share your hospital location.");
      return;
    }

    if (!user?.id) {
      alert("User session not found. Please refresh.");
      return;
    }

    setSubmitting(true);
    try {
      // Register hospital
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            email: user.email,
            kindeId: user.id,
            isActive: true,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }

      // Update user role to "hospital"
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/kinde/${user.id}`
      );
      const userData = await userRes.json();

      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userData._id}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "hospital" }),
        }
      );

      alert("Hospital registered successfully! 🏥");
      onRegistered(); // Parent ko batao registration complete hua
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hospital Registration</h1>
          <p className="text-slate-500 mt-2 text-sm">Register your hospital to receive nearby rescue requests.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Hospital Info */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Hospital Details</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Hospital Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="City Animal Hospital"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter hospital contact number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Address</label>
                <textarea
                  name="address"
                  placeholder="Enter full hospital address..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Hospital Location</p>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationStatus === "loading"}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl border-2 border-dashed font-medium text-sm transition-all ${
                locationStatus === "success"
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : locationStatus === "error"
                  ? "border-red-300 bg-red-50 text-red-600"
                  : locationStatus === "loading"
                  ? "border-slate-300 bg-slate-50 text-slate-400 cursor-wait"
                  : "border-slate-300 bg-slate-50 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
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

              {locationStatus === "idle" && "Set Hospital Location"}
              {locationStatus === "loading" && "Fetching location..."}
              {locationStatus === "success" && `Location set (${formData.latitude?.toFixed(4)}, ${formData.longitude?.toFixed(4)})`}
              {locationStatus === "error" && "Failed to get location. Try again."}
            </button>
          </div>

          {/* Email (read only) */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Account Email</p>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
              {user?.email || "Loading..."}
            </div>
          </div>

          {/* Submit */}
          <div className="px-8 py-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-semibold text-white text-sm tracking-wide transition-all shadow-lg ${
                submitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-200"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Registering...
                </span>
              ) : (
                "🏥 Register Hospital"
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              Once registered, you'll start receiving nearby rescue requests.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}