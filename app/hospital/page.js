'use client';
import React, { useState } from 'react';
import { Clock, Building2, Heart } from 'lucide-react';
import HospitalSidebar from '@/components/HospitalSidebar';
import ViewRescueRequest from '@/components/ViewRescueRequest';
import RescueHistory from '@/components/RescueHistory';

export default function HospitalDashboard() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-full md:w-fit">
        <HospitalSidebar
          setSelectedFeature={setSelectedFeature}
          activeFeature={selectedFeature}
        />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col justify-start items-center px-4 md:px-12 lg:px-24 xl:px-48 max-h-screen overflow-y-auto pt-8 md:pt-16">

        {selectedFeature === 'viewrescuerequest' ? (
          <ViewRescueRequest />
        ) : selectedFeature === 'rescuehistory' ? (
          <RescueHistory />
        ) : (
          /* Default Home Screen */
          <div className="w-full text-center px-4 py-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide uppercase backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Hospital Dashboard
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Emergency <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                  Response Ready
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-blue-100 rounded-full -z-0 blur-sm"></span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              Monitor incoming rescue requests in real-time and update rescue status instantly. Stay connected with our advanced tracking system.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              {/* 24/7 Card */}
              <div className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-lg rounded-2xl px-6 py-8 text-center transition-all duration-300 hover:border-blue-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Clock size={28} className="text-blue-600" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-2xl mb-1">24/7</p>
                <p className="text-slate-500 text-sm font-medium">Always Available</p>
              </div>

              {/* Hospital Card */}
              <div className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-lg rounded-2xl px-6 py-8 text-center transition-all duration-300 hover:border-emerald-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                    <Building2 size={28} className="text-emerald-600" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-2xl mb-1">Advanced</p>
                <p className="text-slate-500 text-sm font-medium">Hospital Network</p>
              </div>

              {/* Rescue Card */}
              <div className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-lg rounded-2xl px-6 py-8 text-center transition-all duration-300 hover:border-rose-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-rose-100 rounded-full group-hover:bg-rose-200 transition-colors">
                    <Heart size={28} className="text-rose-600" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-2xl mb-1">Emergency</p>
                <p className="text-slate-500 text-sm font-medium">Rescue Response</p>
              </div>
            </div>

            {/* CTA Info */}
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-200 rounded-2xl px-8 py-6 backdrop-blur-sm">
              <p className="text-slate-700 text-sm font-medium">
                Use the navigation menu to view incoming rescue requests or check your rescue history
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}