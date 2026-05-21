"use client";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Clock, CheckCircle, Loader, AlertTriangle, RefreshCw, MessageCircle, User, Phone, MapPin, Info } from "lucide-react";

const statusConfig = {
  Pending: { bg: "bg-slate-100", text: "text-slate-600", icon: Clock, color: "text-slate-600" },
  Accepted: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle, color: "text-blue-600" },
  "In Progress": { bg: "bg-amber-100", text: "text-amber-700", icon: Loader, color: "text-amber-600" },
  Completed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle, color: "text-emerald-600" },
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
        <Loader size={32} className="animate-spin text-teal-600" />
        <p className="text-slate-500 text-sm font-medium">Loading reports...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <p className="text-red-700 text-sm font-medium">{error}</p>
        <button onClick={fetchReports} className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition">
          Try Again
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {role === "reporter" ? "My Reports" : role === "hospital" ? "Assigned Rescues" : "All Reports"}
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">{reports.length} {reports.length === 1 ? 'report' : 'reports'} total</p>
        </div>
        <button onClick={fetchReports} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-50 transition shadow-sm hover:shadow-md">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-8 pb-6 border-b border-slate-200">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              filter === f
                ? "bg-teal-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
          <div className="p-4 bg-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Info size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-800 font-semibold text-lg">No reports found</p>
          <p className="text-slate-500 text-sm mt-2">
            {filter === "All" ? "No reports available yet" : `No ${filter} reports`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const status = statusConfig[report.status] || statusConfig["Pending"];
            const severity = severityConfig[report.severity] || severityConfig["Minor"];
            const StatusIcon = status.icon;
            return (
              <div key={report._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-teal-300">
                <div className="p-6">
                  <div className="flex gap-5">
                    {report.imageUrl && (
                      <img src={report.imageUrl} alt="Animal" className="w-24 h-24 rounded-xl object-cover border-2 border-slate-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <h3 className="font-bold text-slate-900 text-lg">
                          {report.animalType}
                          {report.animalCount && <span className="text-slate-400 font-normal text-sm ml-2">×{report.animalCount}</span>}
                        </h3>
                        {report.severity && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${severity.bg} ${severity.border} ${severity.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`}></span>
                            {report.severity}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                          <StatusIcon size={14} />
                          {report.status || "Pending"}
                        </span>
                      </div>

                      {report.message && (
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3 flex items-start gap-2">
                          <MessageCircle size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{report.message}</span>
                        </p>
                      )}

                      {role !== "reporter" && (
                        <p className="text-slate-700 text-sm font-medium flex items-center gap-2 mb-2">
                          <User size={16} className="text-slate-500" />
                          {report.firstName} {report.lastName}
                          <span className="text-slate-300 mx-1">•</span>
                          <Phone size={14} className="text-slate-500" />
                          {report.phoneNumber}
                        </p>
                      )}

                      {role === "reporter" && report.assignedHospital && (
                        <p className="text-teal-700 text-sm font-semibold flex items-center gap-2">
                          <Info size={16} className="text-teal-600" />
                          {report.assignedHospital.name}
                          <span className="text-teal-300 mx-1">•</span>
                          <Phone size={14} className="text-teal-600" />
                          {report.assignedHospital.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100 flex-wrap gap-3">
                    {report.latitude && report.longitude && (
                      <a href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-teal-600 text-sm font-medium hover:text-teal-700 transition">
                        <MapPin size={16} />
                        View Location
                      </a>
                    )}
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(report.createdAt).toLocaleString("en-IN")}
                    </p>
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