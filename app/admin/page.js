'use client';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import ViewRescueRequest from '@/components/ViewRescueRequest';
import RescueHistory from '@/components/RescueHistory';

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
    <div className="flex items-center justify-center py-24">
      <svg className="animate-spin w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Hospitals</h2>
          <p className="text-slate-500 text-sm mt-0.5">{hospitals.length} registered hospitals</p>
        </div>
        <button onClick={fetchHospitals} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition shadow-sm">
          🔄 Refresh
        </button>
      </div>

      {hospitals.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-3">🏥</p>
          <p className="text-slate-600 font-medium">No hospitals registered yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div key={hospital._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">🏥 {hospital.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${hospital.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {hospital.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">📧 {hospital.email}</p>
                  <p className="text-slate-500 text-sm">📞 {hospital.phone}</p>
                  <p className="text-slate-500 text-sm">📍 {hospital.address}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {hospital.assignedReports?.length || 0} assigned reports
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleStatus(hospital._id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                      hospital.isActive
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {hospital.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteHospital(hospital._id)}
                    className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition"
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
    admin: { bg: "bg-purple-100", text: "text-purple-700" },
    hospital: { bg: "bg-blue-100", text: "text-blue-700" },
    reporter: { bg: "bg-slate-100", text: "text-slate-600" },
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <svg className="animate-spin w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Users</h2>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition shadow-sm">
          🔄 Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-slate-600 font-medium">No users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const role = roleConfig[user.role] || roleConfig["reporter"];
            return (
              <div key={user._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">👤 {user.name}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${role.bg} ${role.text}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">📧 {user.email}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {user.myReports?.length || 0} reports submitted
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Role Update */}
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="reporter">Reporter</option>
                      <option value="hospital">Hospital</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition"
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
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-fit">
        <AdminSidebar
          setSelectedFeature={setSelectedFeature}
          activeFeature={selectedFeature}
        />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col justify-start items-center px-4 md:px-12 lg:px-24 xl:px-48 max-h-screen overflow-y-auto pt-8 md:pt-16 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">

        {selectedFeature === 'allreports' ? (
          <ViewRescueRequest />
        ) : selectedFeature === 'rescuehistory' ? (
          <RescueHistory role="admin" />
        ) : selectedFeature === 'hospitals' ? (
          <ManageHospitals />
        ) : selectedFeature === 'users' ? (
          <ManageUsers />
        ) : (
          <div className="w-full text-center px-4 py-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
              Admin Portal
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Full <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
                  Control
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-purple-100 rounded-full -z-0"></span>
              </span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl font-normal max-w-md mx-auto leading-relaxed mb-8">
              Manage all rescue operations, hospitals, and users from one place.
            </p>

            {/* Stats Row */}
            <div className="inline-flex items-center gap-6 bg-white border border-slate-100 shadow-sm rounded-2xl px-6 py-3 text-sm">
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">📋</p>
                <p className="text-slate-400 text-xs">Reports</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">🏥</p>
                <p className="text-slate-400 text-xs">Hospitals</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">👥</p>
                <p className="text-slate-400 text-xs">Users</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}