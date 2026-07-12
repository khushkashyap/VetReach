'use client';
import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Clock, CheckCircle, Loader, AlertTriangle, RefreshCw, MapPin, Phone, MessageCircle, User } from 'lucide-react';

const severityConfig = {
  Minor: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    icon: AlertTriangle,
  },
  Moderate: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    icon: AlertTriangle,
  },
  Critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    icon: AlertTriangle,
  },
};

const statusConfig = {
  Pending: { bg: 'bg-slate-100', text: 'text-slate-600', icon: Clock },
  Accepted: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
  'In Progress': { bg: 'bg-amber-100', text: 'text-amber-700', icon: Loader },
  Completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
};

export default function ViewRescueRequest() {
  const { user } = useKindeBrowserClient();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      // Pehle hospital ka data fetch karo
      const hospitalRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/kinde/${user?.id}`,
      );
      const hospital = await hospitalRes.json();

      // Phir assigned reports fetch karo
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/${hospital._id}/reports`,
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      setRequests(data);
    } catch (err) {
      console.error('Error fetching rescue requests:', err);
      setError('Failed to fetch rescue requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchRequests();
  }, [user]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (!response.ok) throw new Error('Failed to update');
      await fetchRequests();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader size={32} className="animate-spin text-teal-600" />
        <p className="text-slate-500 text-sm font-medium">Loading rescue requests...</p>
      </div>
    );

  // Error
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <p className="text-red-700 text-sm font-medium">{error}</p>
        <button
          onClick={fetchRequests}
          className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
        >
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
            Rescue Requests
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">{requests.length} {requests.length === 1 ? 'request' : 'requests'} total</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-50 transition shadow-sm hover:shadow-md"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="text-center py-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
          <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle size={32} className="text-blue-600" />
          </div>
          <p className="text-slate-800 font-semibold text-lg">No rescue requests yet</p>
          <p className="text-slate-600 text-sm mt-2">
            New reports will appear here as they come in
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const severity =
              severityConfig[request.severity] || severityConfig['Minor'];
            const status =
              statusConfig[request.status] || statusConfig['Pending'];
            const isUpdating = updatingId === request._id;
            const SeverityIcon = severity.icon;
            const StatusIcon = status.icon;

            return (
              <div
                key={request._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-teal-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Left: Animal + Reporter Info */}
                    <div className="flex gap-4 flex-1">
                      {/* Animal Photo */}
                      {request.imageUrl && (
                        <img
                          src={request.imageUrl}
                          alt="Animal"
                          className="w-24 h-24 rounded-xl object-cover border-2 border-slate-100 flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Animal Type + Count */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <h3 className="font-bold text-slate-900 text-lg">
                            {request.animalType}
                            {request.animalCount && (
                              <span className="text-slate-400 font-normal text-sm ml-2">
                                ×{request.animalCount}
                              </span>
                            )}
                          </h3>

                          {/* Severity Badge */}
                          {request.severity && (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${severity.bg} ${severity.border} ${severity.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${severity.dot}`}
                              ></span>
                              {request.severity}
                            </span>
                          )}

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            <StatusIcon size={14} />
                            {request.status || 'Pending'}
                          </span>
                        </div>

                        {/* Reporter */}
                        <p className="text-slate-700 text-sm font-medium mb-2 flex items-center gap-2">
                          <User size={16} className="text-slate-500" />
                          {request.firstName} {request.lastName}
                          <span className="text-slate-300 mx-1">•</span>
                          <Phone size={14} className="text-slate-500" />
                          {request.phoneNumber}
                        </p>

                        {/* Message */}
                        {request.message && (
                          <p className="text-slate-600 text-sm line-clamp-2 flex items-start gap-2">
                            <MessageCircle size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                            <span>{request.message}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location + Time + Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      {/* GPS Location */}
                      {request.latitude && request.longitude && (
                        <a
                          href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-teal-600 text-sm font-medium hover:text-teal-700 transition"
                        >
                          <MapPin size={16} />
                          View Location
                        </a>
                      )}

                      {/* Time */}
                      <p className="text-slate-500 text-xs flex items-center gap-1 font-medium">
                        <Clock size={14} />
                        {new Date(request.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-2">
                      {request.status === 'Pending' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id, 'Accepted')
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <CheckCircle size={14} />
                          Accept
                        </button>
                      )}
                      {request.status === 'Accepted' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id, 'In Progress')
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <Loader size={14} />
                          {isUpdating ? 'Updating...' : 'In Progress'}
                        </button>
                      )}
                      {request.status === 'In Progress' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id, 'Completed')
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <CheckCircle size={14} />
                          {isUpdating ? 'Updating...' : 'Complete'}
                        </button>
                      )}
                      {request.status === 'Completed' && (
                        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                          <CheckCircle size={14} />
                          Completed
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
