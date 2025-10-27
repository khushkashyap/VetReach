"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const pathname = usePathname();
  const showFooter = ["/", "/about", "/discover", "/services", "/contact"].includes(pathname);

  return (
    <>
      {showFooter && (
        <footer className="p-10 bg-[#502274]">
          {/* Footer Content */}
          <div className="max-w-6xl px-6 sm:px-10 lg:px-20 py-14 rounded-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-sm md:text-base bg-white">
            {/* Company Section */}
            <div>
              <h2 className="font-bold mb-6 text-lg md:text-2xl text-[#502274]">Company</h2>
              <ul className="space-y-3">
                <li>About the company snippet...</li>
                <li>Contact info...</li>
                <li>Our Team</li>
              </ul>
            </div>
            {/* Help Section */}
            <div>
              <h2 className="font-bold mb-6 text-lg md:text-2xl text-[#502274]">Help</h2>
              <ul className="space-y-3">
                <li>FAQ</li>
                <li>Contact form link</li>
                <li>Support center</li>
              </ul>
            </div>
            {/* Resources Section */}
            <div>
              <h2 className="font-bold mb-6 text-lg md:text-2xl text-[#502274]">Resources</h2>
              <ul className="space-y-3">
                <li>Blogs</li>
                <li>Reports</li>
              </ul>
            </div>
            {/* Extra Links Section */}
            <div>
              <h2 className="font-bold mb-6 text-lg md:text-2xl text-[#502274]">Extra Links</h2>
              <ul className="space-y-3">
                <li>Careers</li>
                <li>Privacy policy</li>
                <li>About Us</li>
                <li>Legal Notice</li>
              </ul>
            </div>
          </div>

          {/* VetReach Branding */}
          <div className="w-[90%] md:w-[80%] mx-auto h-40 flex justify-center items-center text-[#502274] font-bold bg-[#e9c0e9] mt-14 text-4xl md:text-6xl lg:text-8xl rounded-3xl">
            VetReach🐾
          </div>

          {/* Social Media and Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-10 text-white space-y-4 md:space-y-0">
            {/* Social Media Icons */}
            <div className="flex space-x-6 text-xl">
              <FaFacebookF className="hover:text-[#e9c0e9] cursor-pointer" />
              <FaXTwitter className="hover:text-[#e9c0e9] cursor-pointer" />
              <FaLinkedinIn className="hover:text-[#e9c0e9] cursor-pointer" />
              <FaInstagram className="hover:text-[#e9c0e9] cursor-pointer" />
            </div>
            {/* Copyright Text */}
            <span className="text-center text-sm md:text-base">
              ©2023 VetReach | All rights reserved.
            </span>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
