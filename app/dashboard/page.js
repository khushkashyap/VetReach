"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ReportForm from "@/components/ReportForm";
import ViewRescueRequest from "@/components/ViewRescueRequest";
import RescueHistory from "@/components/RescueHistory";
import RescueUpdates from "@/components/RescueUpdates";

export default function Dashboard() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-fit">
        <Sidebar setSelectedFeature={setSelectedFeature} />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 md:px-12 lg:px-24 xl:px-48 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        {/* Render selected feature */}
        {selectedFeature === "reportform" ? (
          <ReportForm />
        ) : selectedFeature === "viewrescuerequest" ? (
          <ViewRescueRequest />
        ) : selectedFeature === "rescuehistory" ? (
          <RescueHistory />
        ) : selectedFeature === "rescueupdates" ? (
          <RescueUpdates />
        ) : selectedFeature ? (
          <h1 className="text-3xl font-bold text-white">
            {selectedFeature.replace("/", "").toUpperCase()}
          </h1>
        ) : (
          <div className="w-full text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent">
              Welcome To VetReach
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent">
              We'd love to help
            </h2>
            <p className="text-lg md:text-xl mb-6 font-medium bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent">
              Report Injured Animal and we'll get in touch within a minute.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
