"use client";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { io } from "socket.io-client";

const statusConfig = {
  Pending: { bg: "bg-slate-100", text: "text-slate-600", icon: "🕐", label: "Pending" },
  Accepted: { bg: "bg-blue-100", text: "text-blue-700", icon: "✅", label: "Accepted" },
  "In Progress": { bg: "bg-amber-100", text: "text-amber-700", icon: "🚗", label: "In Progress" },
  Completed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "🎉", label: "Completed" },
};

export default function RescueUpdates() {
  const { user } = useKindeBrowserClient();
  const [updates, setUpdates] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Connect to Socket.io
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    socket.on("connect", () => {
      setConnected(true);
      // Join reporter's room
      socket.emit("join_reporter", user.id);
      console.log("✅ Connected to VetReach live updates");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("❌ Disconnected from live updates");
    });

    // Listen for status updates
    socket.on("status_update", (data) => {
      setUpdates((prev) => [
        {
          id: Date.now(),
          reportId: data.reportId,
          status: data.status,
          message: data.message,
          time: new Date(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Live Updates</h2>
          <p className="text-slate-500 text-sm mt-0.5">Real-time rescue status notifications</p>
        </div>

        {/* Connection Status */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold ${
          connected ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
        }`}>
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
          {connected ? "Live" : "Connecting..."}
        </div>
      </div>

      {/* Empty State */}
      {updates.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-slate-600 font-medium">No updates yet</p>
          <p className="text-slate-400 text-sm mt-1">
            {connected
              ? "You'll get notified here when your rescue status changes"
              : "Connecting to live updates..."}
          </p>

          {/* Animated waiting indicator */}
          {connected && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => {
            const status = statusConfig[update.status] || statusConfig["Pending"];
            return (
              <div
                key={update.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition animate-fade-in"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${status.bg}`}>
                    {status.icon}
                  </div>

                  <div className="flex-1">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-slate-700 text-sm font-medium">{update.message}</p>

                    {/* Report ID */}
                    <p className="text-slate-400 text-xs mt-1">
                      Report ID: {update.reportId}
                    </p>
                  </div>

                  {/* Time */}
                  <p className="text-slate-400 text-xs flex-shrink-0">
                    {update.time.toLocaleTimeString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Clear Button */}
          <button
            onClick={() => setUpdates([])}
            className="w-full py-3 text-slate-400 text-sm hover:text-slate-600 transition"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}