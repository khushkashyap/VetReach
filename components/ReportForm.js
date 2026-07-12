'use client';
import React, { useState, useRef } from 'react';
import FileUpload from './FileUpload';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { CircleCheckBig, MapPin, XCircle, ChevronDown } from "lucide-react";
import { GiCow } from "react-icons/gi";
import { FaDog, FaCat, FaFeather } from "react-icons/fa";
import { MdQuestionMark } from "react-icons/md";

const animalOptions = [
  { value: 'Cow', label: 'Cow', Icon: GiCow, color: 'text-amber-700' },
  { value: 'Buffalo', label: 'Buffalo', Icon: GiCow, color: 'text-gray-700' },
  { value: 'Dog', label: 'Dog', Icon: FaDog, color: 'text-orange-700' },
  { value: 'Cat', label: 'Cat', Icon: FaCat, color: 'text-amber-600' },
  { value: 'Bird', label: 'Bird', Icon: FaFeather, color: 'text-blue-600' },
  { value: 'Other', label: 'Other', Icon: MdQuestionMark, color: 'text-slate-600' },
];

export default function ReportForm() {
  const { user } = useKindeBrowserClient();
  const fileUploadRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | error
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    animalType: '',
    animalCount: '',
    severity: '',
    latitude: null,
    longitude: null,
    message: '',
    imageUrl: '',
    reporterKindeId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // Allow dashes and spaces for formatting, but limit numeric digits to 10
      const numericOnly = value.replace(/[^0-9]/g, '');
      if (numericOnly.length <= 10) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAnimalSelect = (value) => {
    setFormData({ ...formData, animalType: value });
    setDropdownOpen(false);
  };

  const handleImageUpload = (url) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationStatus('success');
      },
      () => {
        setLocationStatus('error');
      },
    );
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      animalType: '',
      animalCount: '',
      severity: '',
      latitude: null,
      longitude: null,
      message: '',
      imageUrl: '',
      reporterKindeId: '',
    });
    setLocationStatus('idle');
    if (fileUploadRef.current) fileUploadRef.current.resetImage();
  };

  const handleSubmit = async (e) => {
    console.log('User:', user);
    console.log('User ID:', user?.id);
    e.preventDefault();

    if (!user?.id) {
      alert('Please wait, user session is loading...');
      return;
    }

    if (!formData.imageUrl) {
      alert('Please upload an image before submitting.');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      alert('Please share your location before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, reporterKindeId: user?.id }),
        },
      );

      if (response.ok) {
        alert('Report submitted successfully! Help is on the way 🐾');
        resetForm();
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const severityConfig = {
    Minor: {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-300',
      dot: 'bg-emerald-500',
    },
    Moderate: {
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-300',
      dot: 'bg-amber-500',
    },
    Critical: {
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-300',
      dot: 'bg-red-500',
    },
  };

  return (
    <div className="w-full flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🐾</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Report Injured Animal
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Help us reach the animal faster — every second counts.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Section: Reporter Info */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">
              Reporter Details
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  First Name
                </label>
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
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Last Name
                </label>
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
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                name="phoneNumber"
                placeholder="Enter your 10-digit number"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength="10"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Section: Animal Info */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">
              Animal Details
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Animal Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition flex items-center justify-between hover:bg-slate-100"
                  >
                    <span className="flex items-center gap-2">
                      {formData.animalType ? (
                        <>
                          {(() => {
                            const selected = animalOptions.find(opt => opt.value === formData.animalType);
                            const { Icon, color } = selected || {};
                            return (
                              <>
                                <Icon className={`text-lg ${color}`} />
                                <span>{selected?.label}</span>
                              </>
                            );
                          })()}
                        </>
                      ) : (
                        <span className="text-slate-400">Select animal</span>
                      )}
                    </span>
                    <ChevronDown size={18} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                      {animalOptions.map((option) => {
                        const { Icon, color, value, label } = option;
                        const isSelected = formData.animalType === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleAnimalSelect(value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                              isSelected
                                ? 'bg-teal-50 border-l-4 border-teal-600'
                                : 'hover:bg-slate-50'
                            } ${value !== animalOptions[animalOptions.length - 1].value ? 'border-b border-slate-100' : ''}`}
                          >
                            <Icon className={`text-lg ${color}`} />
                            <span className={`text-sm font-medium ${
                              isSelected ? 'text-teal-700 font-semibold' : 'text-slate-700'
                            }`}>
                              {label}
                            </span>
                            {isSelected && <span className="ml-auto text-teal-600">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Animal Count
                </label>
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
              <label className="block text-xs font-medium text-slate-500 mb-2">
                Injury Severity
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Minor', 'Moderate', 'Critical'].map((level) => {
                  const config = severityConfig[level];
                  const isSelected = formData.severity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, severity: level })
                      }
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? `${config.bg} ${config.color} border-current shadow-sm`
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${isSelected ? config.dot : 'bg-slate-300'}`}
                      ></span>
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">
              Location
            </p>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationStatus === 'loading'}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl border-2 border-dashed font-medium text-sm transition-all ${
                locationStatus === 'success'
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : locationStatus === 'error'
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : locationStatus === 'loading'
                      ? 'border-slate-300 bg-slate-50 text-slate-400 cursor-wait'
                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {locationStatus === 'loading' && (
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              {locationStatus === 'success' && <CircleCheckBig size={16} />}
              {locationStatus === 'error' && <XCircle size={16} />}
              {locationStatus === 'idle' && <MapPin size={16} />}

              {locationStatus === 'idle' && 'Use My Current Location'}
              {locationStatus === 'loading' && 'Fetching location...'}
              {locationStatus === 'success' &&
                `Location captured (${formData.latitude?.toFixed(4)}, ${formData.longitude?.toFixed(4)})`}
              {locationStatus === 'error' &&
                'Failed to get location. Try again.'}
            </button>
          </div>

          {/* Section: Description & Photo */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">
              Description & Photo
            </p>
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Describe the situation
              </label>
              <textarea
                name="message"
                placeholder="Describe the animal's condition, exact spot, any visible injuries..."
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition resize-none"
              />
            </div>
            <FileUpload
              ref={fileUploadRef}
              onUploadSuccess={handleImageUpload}
            />
          </div>

          {/* Submit */}
          <div className="px-8 py-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-semibold text-white text-sm tracking-wide transition-all shadow-lg ${
                submitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] shadow-teal-200'
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Rescue Report'
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
