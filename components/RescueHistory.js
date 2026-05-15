"use client";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const statusConfig = {
  Pending: { bg: "bg-slate-100", text: "text-slate-600", icon: "🕐" },
  Accepted: { bg: "bg-blue-100", text: "text-blue-700", icon: "✅" },
  "In Progress": { bg: "bg-amber-100", text: "text-amber-700", icon: "🚗" },
  Completed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "🎉" },
};

const severityConfig = {
  Minor: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  Moderate: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  Critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500" },
};

export default function RescueHistory({ role = "reporter" }) {
  const { user } = useKindeBrowserClient();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchReports = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      let url = "";

      if (role === "reporter") {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/reporter/${user.id}`;
      } else if (role === "hospital") {
        const hospitalRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/kinde/${user.id}`);
        if (!hospitalRes.ok) throw new Error("Hospital not found");
        const hospital = await hospitalRes.json();
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/${hospital._id}/reports`;
      } else if (role === "admin") {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user, role]);

  const filters = ["All", "Pending", "Accepted", "In Progress", "Completed"];
  const filteredReports = filter === "All" ? reports : reports.filter((r) => r.status === filter);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <svg className="animate-spin w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-slate-500 text-sm">Loading reports...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchReports} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition">
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {role === "reporter" ? "My Reports" : role === "hospital" ? "Assigned Rescues" : "All Reports"}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">{reports.length} total reports</p>
        </div>
        <button onClick={fetchReports} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition shadow-sm">
          🔄 Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === f ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-slate-600 font-medium">No reports found</p>
          <p className="text-slate-400 text-sm mt-1">
            {filter === "All" ? "No reports available yet" : `No ${filter} reports`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const status = statusConfig[report.status] || statusConfig["Pending"];
            const severity = severityConfig[report.severity] || severityConfig["Minor"];
            return (
              <div key={report._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                  <div className="flex gap-4">
                    {report.imageUrl && (
                      <img src={report.imageUrl} alt="Animal" className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-bold text-slate-800 text-lg">
                          {report.animalType}
                          {report.animalCount && <span className="text-slate-400 font-normal text-sm ml-1">× {report.animalCount}</span>}
                        </h3>
                        {report.severity && (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${severity.bg} ${severity.border} ${severity.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`}></span>
                            {report.severity}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                          {status.icon} {report.status || "Pending"}
                        </span>
                      </div>

                      {report.message && <p className="text-slate-500 text-sm line-clamp-2 mb-2">💬 {report.message}</p>}

                      {role !== "reporter" && (
                        <p className="text-slate-600 text-sm">👤 {report.firstName} {report.lastName} — 📞 {report.phoneNumber}</p>
                      )}

                      {role === "reporter" && report.assignedHospital && (
                        <p className="text-teal-600 text-sm font-medium">🏥 {report.assignedHospital.name} — 📞 {report.assignedHospital.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 flex-wrap gap-2">
                    {report.latitude && report.longitude && (
                      <a href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm font-medium hover:underline">
                        📍 View Location
                      </a>
                    )}
                    <p className="text-slate-400 text-xs">🕐 {new Date(report.createdAt).toLocaleString("en-IN")}</p>
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