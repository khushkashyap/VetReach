"use client";
import { useEffect, useState } from "react";

export default function ViewRescueRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response from server");
        }

        const data = await response.json();

        // ✅ Since data is already an array
        if (!Array.isArray(data)) {
          throw new Error("Expected an array of rescue requests");
        }

        setRequests(data);
      } catch (error) {
        console.error("Error fetching rescue requests:", error);
        setError("Failed to fetch rescue requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p className="text-center text-white">Loading rescue requests...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Rescue Requests</h2>
      {requests.length === 0 ? (
        <p className="text-center text-white">No rescue requests available.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="border p-4 rounded shadow text-white">
              <p><strong>Animal:</strong> {request.animalType}</p>
              <p><strong>Location:</strong> {request.location}</p>
              <p><strong>Status:</strong> {request.status || "Pending"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
