'use client';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import ViewRescueRequest from '@/components/ViewRescueRequest';
import RescueHistory from '@/components/RescueHistory';
import { Building2, RotateCw, Users, User, Mail, Phone, MapPin, BarChart3 } from 'lucide-react';

// Hospitals Management Component
function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals`);
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/${id}/toggle-status`, {
        method: "PATCH",
      });
      fetchHospitals();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const deleteHospital = async (id) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/${id}`, {
        method: "DELETE",
      });
      fetchHospitals();
    } catch (err) {
      console.error("Error deleting hospital:", err);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="relative w-14 h-14">
        <svg className="animate-spin w-14 h-14 text-purple-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm font-medium">Loading hospitals...</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Manage Hospitals</h2>
          <p className="text-slate-500 text-sm mt-1">{hospitals.length} registered hospitals</p>
        </div>
        <button onClick={fetchHospitals} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:from-slate-50 hover:to-slate-100 hover:border-slate-300 transition-all shadow-sm hover:shadow-md">
          <RotateCw size={16} /> Refresh
        </button>
      </div>

      {hospitals.length === 0 ? (
        <div className="text-center py-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
          <Building2 size={48} className="mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600 font-semibold text-lg">No hospitals registered yet</p>
          <p className="text-slate-500 text-sm mt-2">Hospitals will appear here once registered</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {hospitals.map((hospital) => (
            <div key={hospital._id} className="group bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Building2 size={20} /> {hospital.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${hospital.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {hospital.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-600 text-sm flex items-center gap-2"><Mail size={16} /> <span className="font-medium">{hospital.email}</span></p>
                    <p className="text-slate-600 text-sm flex items-center gap-2"><Phone size={16} /> <span className="font-medium">{hospital.phone}</span></p>
                    <p className="text-slate-600 text-sm flex items-center gap-2"><MapPin size={16} /> <span className="font-medium">{hospital.address}</span></p>
                  </div>
                  <p className="text-slate-400 text-xs mt-3 bg-slate-100 w-fit px-2 py-1 rounded">
                    {hospital.assignedReports?.length || 0} assigned reports
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleStatus(hospital._id)}
                    className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all transform hover:scale-105 ${
                      hospital.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200"
                    }`}
                  >
                    {hospital.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteHospital(hospital._id)}
                    className="px-5 py-2 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 rounded-lg text-xs font-semibold transition-all transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Users Management Component
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const roleConfig = {
    admin: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
    hospital: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    reporter: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="relative w-14 h-14">
        <svg className="animate-spin w-14 h-14 text-purple-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm font-medium">Loading users...</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Manage Users</h2>
          <p className="text-slate-500 text-sm mt-1">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:from-slate-50 hover:to-slate-100 hover:border-slate-300 transition-all shadow-sm hover:shadow-md">
          <RotateCw size={16} /> Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
          <Users size={48} className="mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600 font-semibold text-lg">No users found</p>
          <p className="text-slate-500 text-sm mt-2">Users will appear here once registered</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => {
            const role = roleConfig[user.role] || roleConfig["reporter"];
            return (
              <div key={user._id} className="group bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2"><User size={18} /> {user.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${role.bg} ${role.text} border ${role.border}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 text-sm flex items-center gap-2"><Mail size={16} /> <span className="font-medium">{user.email}</span></p>
                      <p className="text-slate-400 text-xs mt-1 bg-slate-100 w-fit px-2 py-1 rounded">
                        {user.myReports?.length || 0} reports submitted
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Role Update */}
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all cursor-pointer hover:border-slate-300"
                    >
                      <option value="reporter">Reporter</option>
                      <option value="hospital">Hospital</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-5 py-2 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 rounded-lg text-xs font-semibold transition-all transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Main Admin Dashboard
export default function AdminDashboard() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-fit">
        <AdminSidebar
          setSelectedFeature={setSelectedFeature}
          activeFeature={selectedFeature}
        />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col justify-start items-center px-4 md:px-12 lg:px-24 xl:px-48 max-h-screen overflow-y-auto pt-8 md:pt-16">

        {selectedFeature === 'allreports' ? (
          <ViewRescueRequest />
        ) : selectedFeature === 'rescuehistory' ? (
          <RescueHistory role="admin" />
        ) : selectedFeature === 'hospitals' ? (
          <ManageHospitals />
        ) : selectedFeature === 'users' ? (
          <ManageUsers />
        ) : (
          <div className="w-full text-center px-4 py-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-purple-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wider uppercase shadow-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Admin Control Center
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Welcome to <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  VetReach Control
                </span>
                <span className="absolute bottom-0 left-0 w-full h-4 bg-purple-200 rounded-full -z-0 blur-sm"></span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-12">
              Manage all rescue operations, hospitals, and users from your centralized command center. Monitor, control, and coordinate everything in real-time.
            </p>

            {/* CTA Stats Row */}
            <div className="inline-flex items-center gap-8 bg-white border border-slate-200 shadow-lg rounded-2xl px-8 py-6 text-sm backdrop-blur-sm">
              <div className="text-center">
                <BarChart3 size={32} className="mx-auto mb-2 text-slate-700" />
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Reports</p>
                <p className="text-slate-400 text-xs mt-1">All rescues</p>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
              <div className="text-center">
                <Building2 size={32} className="mx-auto mb-2 text-slate-700" />
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Hospitals</p>
                <p className="text-slate-400 text-xs mt-1">Network</p>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
              <div className="text-center">
                <Users size={32} className="mx-auto mb-2 text-slate-700" />
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">Users</p>
                <p className="text-slate-400 text-xs mt-1">Community</p>
              </div>
            </div>

            {/* Bottom hint */}
            <p className="text-slate-400 text-xs mt-12">Select an option from the sidebar to get started</p>
          </div>
        )}
      </section>
    </main>
  );
}