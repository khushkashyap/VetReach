"use client";
import { useEffect, useState } from "react";

const severityConfig = {
  Minor: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  Moderate: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  Critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500" },
};

const statusConfig = {
  Pending: { bg: "bg-slate-100", text: "text-slate-600" },
  Accepted: { bg: "bg-blue-100", text: "text-blue-700" },
  "In Progress": { bg: "bg-amber-100", text: "text-amber-700" },
  Completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

export default function ViewRescueRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setRequests(data);
    } catch (err) {
      console.error("Error fetching rescue requests:", err);
      setError("Failed to fetch rescue requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) throw new Error("Failed to update");
      await fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <svg className="animate-spin w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-slate-500 text-sm">Loading rescue requests...</p>
      </div>
    );

  // Error
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Rescue Requests</h2>
          <p className="text-slate-500 text-sm mt-0.5">{requests.length} total reports</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition shadow-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-slate-600 font-medium">No rescue requests yet</p>
          <p className="text-slate-400 text-sm mt-1">New reports will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const severity = severityConfig[request.severity] || severityConfig["Minor"];
            const status = statusConfig[request.status] || statusConfig["Pending"];
            const isUpdating = updatingId === request._id;

            return (
              <div
                key={request._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Animal + Reporter Info */}
                    <div className="flex gap-4 flex-1">
                      {/* Animal Photo */}
                      {request.imageUrl && (
                        <img
                          src={request.imageUrl}
                          alt="Animal"
                          className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Animal Type + Count */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-bold text-slate-800 text-lg">
                            {request.animalType}
                            {request.animalCount && (
                              <span className="text-slate-400 font-normal text-sm ml-1">
                                × {request.animalCount}
                              </span>
                            )}
                          </h3>

                          {/* Severity Badge */}
                          {request.severity && (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${severity.bg} ${severity.border} ${severity.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`}></span>
                              {request.severity}
                            </span>
                          )}

                          {/* Status Badge */}
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                            {request.status || "Pending"}
                          </span>
                        </div>

                        {/* Reporter */}
                        <p className="text-slate-600 text-sm mb-1">
                          👤 {request.firstName} {request.lastName} — 📞 {request.phoneNumber}
                        </p>

                        {/* Message */}
                        {request.message && (
                          <p className="text-slate-500 text-sm line-clamp-2">
                            💬 {request.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location + Time */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                      {/* GPS Location */}
                      {request.latitude && request.longitude && (
                        <a
                          href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-teal-600 text-sm font-medium hover:underline"
                        >
                          📍 Open in Google Maps
                        </a>
                      )}

                      {/* Time */}
                      <p className="text-slate-400 text-xs">
                        🕐 {new Date(request.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-2">
                      {request.status === "Pending" && (
                        <button
                          onClick={() => handleStatusUpdate(request._id, "Accepted")}
                          disabled={isUpdating}
                          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "✅ Accept Rescue"}
                        </button>
                      )}
                      {request.status === "Accepted" && (
                        <button
                          onClick={() => handleStatusUpdate(request._id, "In Progress")}
                          disabled={isUpdating}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "🚗 Mark In Progress"}
                        </button>
                      )}
                      {request.status === "In Progress" && (
                        <button
                          onClick={() => handleStatusUpdate(request._id, "Completed")}
                          disabled={isUpdating}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "🎉 Mark Completed"}
                        </button>
                      )}
                      {request.status === "Completed" && (
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                          ✅ Rescue Completed
                        </span>
                      )}
                    </div>
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