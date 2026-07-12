'use client';
import React, { useState, useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Building2, Heart, Clock } from 'lucide-react';
import HospitalSidebar from '@/components/HospitalSidebar';
import HospitalRegistration from '@/components/HospitalRegistration';
import ViewRescueRequest from '@/components/ViewRescueRequest';
import RescueHistory from '@/components/RescueHistory';

export default function HospitalDashboard() {
  const { user } = useKindeBrowserClient();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isRegistered, setIsRegistered] = useState(null); // null = loading

  useEffect(() => {
    const checkRegistration = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hospitals/kinde/${user.id}`
        );
        if (res.ok) {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
      } catch {
        setIsRegistered(false);
      }
    };
    checkRegistration();
  }, [user]);

  // Loading
  if (isRegistered === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  // Not registered — show registration form
  if (!isRegistered) {
    return <HospitalRegistration onRegistered={() => setIsRegistered(true)} />;
  }

  // Registered — show dashboard
  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-fit">
        <HospitalSidebar
          setSelectedFeature={setSelectedFeature}
          activeFeature={selectedFeature}
        />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col justify-start items-center px-4 md:px-12 lg:px-24 xl:px-48 max-h-screen overflow-y-auto pt-8 md:pt-16 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">

        {selectedFeature === 'viewrescuerequest' ? (
          <ViewRescueRequest />
        ) : selectedFeature === 'rescuehistory' ? (
          <RescueHistory role="hospital" />
        ) : (
          <div className="w-full text-center px-4 py-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              Hospital Portal
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Ready to <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                  Rescue
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 rounded-full -z-0"></span>
              </span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl font-normal max-w-md mx-auto leading-relaxed mb-8">
              Monitor incoming rescue requests and update rescue status in real-time.
            </p>

            <div className="inline-flex items-center gap-6 bg-white border border-slate-100 shadow-sm rounded-2xl px-6 py-3 text-sm">
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">24/7</p>
                <p className="text-slate-400 text-xs">On Call</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-slate-400 text-xs">Hospital</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Heart size={20} className="text-red-600" />
                  </div>
                </div>
                <p className="text-slate-400 text-xs">Rescue</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}