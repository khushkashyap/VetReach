"use client";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {

  return (
    <main>
      {/* Section 1 */}
      <section className="bg-[#254f1a] min-h-[126vh] grid grid-cols-1 lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex justify-center flex-col px-[5vw] gap-6 order-2 lg:order-1">
          <h1 className="text-[#d2e823] font-extrabold text-4xl md:text-5xl lg:text-7xl">
            Together, Let's build a safe world for animals.
          </h1>
          <p className="text-[#d2e823] text-base md:text-lg">
            Join countless animal lovers using our platform to make a difference. One powerful link to report injured animals, connect with nearby clinics, and track rescue updates all from your mobile or desktop. Take action and help save lives with just a few clicks!
          </p>
          <div className="input flex justify-center lg:justify-start">
            <button className="bg-[#e9c0e9] rounded-full px-7 py-4 font-medium">
              <RegisterLink>Get started</RegisterLink>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex items-center justify-center px-[5vw] order-1 lg:order-2">
          <img className="w-full max-w-[533px] h-auto" src="/home.png" alt="Home page image" />
        </div>
      </section>

      {/* Section 2 */}
      <section className="bg-[#e9c0e9] min-h-[120vh] grid grid-cols-1 lg:grid-cols-2">
        {/* Left Image */}
        <div className="flex items-center justify-center px-[5vw]">
          <img src="/second.png" alt="Second image" />
        </div>

        {/* Right Content */}
        <div className="flex justify-center flex-col gap-6 px-[5vw]">
          <h1 className="text-[#502274] font-extrabold text-4xl md:text-5xl lg:text-7xl">
            Report and rescue injured animals in minutes.
          </h1>
          <p className="text-[#502274] text-base md:text-lg lg:pr-32">
            Easily report injured animals, connect with nearby clinics, track
            real-time updates, and access resources—all in one powerful
            platform designed to save lives and make a difference.
          </p>
          <div className="input flex justify-center lg:justify-start">
            <button className="bg-[#502274] text-white rounded-full px-7 py-4 font-medium">
              <RegisterLink>Get started</RegisterLink>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
