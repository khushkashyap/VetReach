'use client';
import React, { useState } from 'react';
import { Clock, Zap, PawPrint } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ReportForm from '@/components/ReportForm';
import RescueHistory from '@/components/RescueHistory';
import RescueUpdates from '@/components/RescueUpdates';

export default function Dashboard() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50">
      {/* Sidebar */}
      <aside className="w-full md:w-fit">
        <Sidebar setSelectedFeature={setSelectedFeature} activeFeature={selectedFeature} />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col justify-start items-center px-4 md:px-12 lg:px-24 xl:px-48 max-h-screen overflow-y-auto pt-8 md:pt-16">

        {/* Render selected feature */}
        {selectedFeature === 'reportform' ? (
          <ReportForm />
        ) : selectedFeature === 'rescuehistory' ? (
          <RescueHistory />
        ) : selectedFeature === 'rescueupdates' ? (
          <RescueUpdates />
        ) : selectedFeature ? (
          <h1 className="text-3xl font-bold text-white">
            {selectedFeature.replace('/', '').toUpperCase()}
          </h1>
        ) : (
          <div className="w-full text-center px-4 py-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-100/80 border border-teal-200 text-teal-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide uppercase backdrop-blur-sm">
              <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
              Rescue Network Active
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Every Second <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-teal-600 via-emerald-500 to-emerald-500 bg-clip-text text-transparent">
                  Matters
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-teal-100 rounded-full -z-0 blur-sm"></span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              Spot an injured animal? Report it instantly — we'll connect you with the nearest rescue center in under a minute.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              {/* 24/7 Card */}
              <div className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-lg rounded-2xl px-6 py-8 text-center transition-all duration-300 hover:border-teal-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
                    <Clock size={28} className="text-teal-600" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-2xl mb-1">24/7</p>
                <p className="text-slate-500 text-sm font-medium">Always Online</p>
              </div>

              {/* Response Time Card */}
              <div className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-lg rounded-2xl px-6 py-8 text-center transition-all duration-300 hover:border-emerald-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                    <Zap size={28} className="text-emerald-600" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-2xl mb-1">&lt;1 min</p>
                <p className="text-slate-500 text-sm font-medium">Quick Response</p>
              </div>

              {/* Animals Card */}
              <div className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-lg rounded-2xl px-6 py-8 text-center transition-all duration-300 hover:border-violet-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-violet-100 rounded-full group-hover:bg-violet-200 transition-colors">
                    <PawPrint size={28} className="text-violet-600" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-2xl mb-1">All</p>
                <p className="text-slate-500 text-sm font-medium">Animal Species</p>
              </div>
            </div>

            {/* CTA Info */}
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200 rounded-2xl px-8 py-6 backdrop-blur-sm">
              <p className="text-slate-700 text-sm font-medium">
                Use the menu to report an animal, view your reports, or get live updates from our rescue network
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
