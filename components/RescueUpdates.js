"use client";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { io } from "socket.io-client";
import { Clock, CheckCircle, Loader, AlertTriangle, Bell, Zap } from "lucide-react";

const statusConfig = {
  Pending: { bg: "bg-slate-100", text: "text-slate-600", icon: Clock, color: "text-slate-600" },
  Accepted: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle, color: "text-blue-600" },
  "In Progress": { bg: "bg-amber-100", text: "text-amber-700", icon: Loader, color: "text-amber-600" },
  Completed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle, color: "text-emerald-600" },
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Live Updates</h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">Real-time rescue status notifications</p>
        </div>

        {/* Connection Status */}
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition ${
          connected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            connected ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-pulse"
          }`}></span>
          {connected ? "Connected" : "Connecting..."}
        </div>
      </div>

      {/* Empty State */}
      {updates.length === 0 ? (
        <div className="text-center py-24 px-10 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
          <div className="p-4 bg-teal-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bell size={32} className="text-teal-600" />
          </div>
          <p className="text-slate-800 font-semibold text-lg">No updates yet</p>
          <p className="text-slate-600 text-sm mt-2">
            {connected
              ? "You'll get notified here when your rescue status changes"
              : "Connecting to live updates..."}
          </p>

          {/* Animated waiting indicator */}
          {connected && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => {
            const status = statusConfig[update.status] || statusConfig["Pending"];
            const StatusIcon = status.icon;
            return (
              <div
                key={update.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-lg transition-all duration-300 hover:border-teal-300 animate-fade-in"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${status.bg} group-hover:scale-110 transition-transform`}>
                    <StatusIcon size={24} className={status.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        {update.status || "Pending"}
                      </span>
                      <Zap size={14} className="text-amber-500" />
                    </div>

                    {/* Message */}
                    <p className="text-slate-800 text-sm font-semibold mb-1">{update.message}</p>

                    {/* Report ID */}
                    <p className="text-slate-500 text-xs">
                      Report ID: <span className="font-mono text-slate-600">{update.reportId}</span>
                    </p>
                  </div>

                  {/* Time */}
                  <p className="text-slate-400 text-xs flex-shrink-0 font-medium">
                    {update.time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Clear Button */}
          <button
            onClick={() => setUpdates([])}
            className="w-full py-3 text-slate-500 text-sm font-medium hover:text-slate-700 hover:bg-slate-50 rounded-xl transition mt-4"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}