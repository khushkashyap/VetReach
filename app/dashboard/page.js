'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ReportForm from '@/components/ReportForm';
import ViewRescueRequest from '@/components/ViewRescueRequest';
import RescueHistory from '@/components/RescueHistory';
import RescueUpdates from '@/components/RescueUpdates';

export default function Dashboard() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-fit">
        <Sidebar setSelectedFeature={setSelectedFeature} />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col justify-start items-center px-4 md:px-12 lg:px-24 xl:px-48 max-h-screen overflow-y-auto pt-8 md:pt-16 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">

        {/* Render selected feature */}
        {selectedFeature === 'reportform' ? (
          <ReportForm />
        ) : selectedFeature === 'viewrescuerequest' ? (
          <ViewRescueRequest />
        ) : selectedFeature === 'rescuehistory' ? (
          <RescueHistory />
        ) : selectedFeature === 'rescueupdates' ? (
          <RescueUpdates />
        ) : selectedFeature ? (
          <h1 className="text-3xl font-bold text-white">
            {selectedFeature.replace('/', '').toUpperCase()}
          </h1>
        ) : (
          <div className="w-full text-center px-4 py-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
              Rescue Network Active
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Every Second <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  Matters
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-teal-100 rounded-full -z-0"></span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-500 text-lg md:text-xl font-normal max-w-md mx-auto leading-relaxed mb-8">
              Spot an injured animal? Report it instantly — we'll connect you
              with the nearest rescue center in under a minute.
            </p>

            {/* Stats Row */}
            <div className="inline-flex items-center gap-6 bg-white border border-slate-100 shadow-sm rounded-2xl px-6 py-3 text-sm">
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">24/7</p>
                <p className="text-slate-400 text-xs">Available</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">&lt;1 min</p>
                <p className="text-slate-400 text-xs">Response</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">🐾</p>
                <p className="text-slate-400 text-xs">All Animals</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
