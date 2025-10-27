"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Navbar = () => {
  const pathname = usePathname();
  const showNavbar = ["/", "/about", "/discover", "/services", "/contact"].includes(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setMenuOpen(false); // Close menu when switching to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run on mount to set the initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {showNavbar && (
        <nav className="bg-white w-[89vw] fixed top-11 right-[6vw] rounded-full p-4 px-7 flex justify-between items-center z-50">
          {/* Logo Section */}
          <div className="logo flex items-center">
            <Link className="text-3xl font-bold text-[#502274]" href={"/"}>
              VetReach🐾
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-4 items-center">
            <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg" href="/">
              <li>Home</li>
            </Link>
            <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg" href="/about">
              <li>About Us</li>
            </Link>
            <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg" href="/discover">
              <li>Discover</li>
            </Link>
            <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg" href="/services">
              <li>Services</li>
            </Link>
            <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg" href="/contact">
              <li>Contact</li>
            </Link>
          </ul>

          {/* Login/Sign-up Section */}
          <div className="hidden md:flex gap-2">
            <button className="login bg-gray-200 hover:bg-gray-300 p-4 rounded-lg"><LoginLink>Log in</LoginLink></button>
            <button className="signup bg-gray-900 hover:bg-gray-700 text-white p-4 font-bold rounded-full">
            <RegisterLink>Sign up free</RegisterLink>
            </button>
          </div>

          {/* Hamburger Menu Button (Visible on small screens) */}
          <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>

          {/* Mobile Menu */}
          {isMobile && menuOpen && (
            <div className="absolute top-24 right-[6vw] bg-white rounded-lg shadow-lg p-6 w-[70vw] flex flex-col items-center gap-4 z-50">
              <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg w-full text-center" href="/">
                Home
              </Link>
              <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg w-full text-center" href="/about">
                About Us
              </Link>
              <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg w-full text-center" href="/discover">
                Discover
              </Link>
              <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg w-full text-center" href="/services">
                Services
              </Link>
              <Link className="hover:bg-gray-100 p-4 py-2 rounded-lg w-full text-center" href="/contact">
                Contact
              </Link>
              <div className="flex flex-col gap-2 w-full">
                <button className="login bg-gray-200 hover:bg-gray-300 p-4 rounded-lg w-full"><LoginLink>Log in</LoginLink></button>
                <button className="signup bg-gray-900 hover:bg-gray-700 text-white p-4 font-bold rounded-full w-full">
                  <RegisterLink>Sign up free</RegisterLink>
                </button>
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
