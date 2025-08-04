"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Import Link from next/link
import React, { useState } from "react";

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="header-responsive">
      <div className="logo-responsive">
                <Image 
          src={"/logo69.png"}
          width={60}
          height={60}
                    alt="logo"
          className="object-contain sm:w-16 sm:h-16 md:w-20 md:h-20"
                />
        <span className="text-lg sm:text-xl md:text-2xl font-semibold italic text-gray-700 tracking-wide">
    Pompous AI Interview Mocker
</span>
            </div>

      {/* Desktop Navigation */}
      <ul className="nav-responsive mobile-hidden">
        <li
          className={`nav-item ${
            path === "/dashboard" ? "text-blue-500 font-bold" : "text-black"
          }`}
        >
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li
          className={`nav-item ${
            path === "/dashboard/upgrade"
              ? "text-blue-500 font-bold"
              : "text-black"
          }`}
        >
          <Link href="/dashboard/upgrade">Upgrade</Link>
        </li>
        <li
          className={`nav-item ${
            path === "/dashboard/how" ? "text-blue-500 font-bold" : "text-black"
          }`}
        >
          <Link href="/dashboard/how">About us</Link>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="mobile-only p-2 rounded-md hover:bg-accent transition-all"
        aria-label="Toggle mobile menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-only absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
          <ul className="nav-responsive p-4">
            <li
              className={`nav-item ${
                path === "/dashboard" ? "text-blue-500 font-bold" : "text-black"
              }`}
            >
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li
              className={`nav-item ${
                path === "/dashboard/upgrade"
                  ? "text-blue-500 font-bold"
                  : "text-black"
              }`}
            >
              <Link
                href="/dashboard/upgrade"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Upgrade
              </Link>
            </li>
            <li
              className={`nav-item ${
                path === "/dashboard/how"
                  ? "text-blue-500 font-bold"
                  : "text-black"
              }`}
            >
              <Link
                href="/dashboard/how"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </Link>
            </li>
        </ul>
        </div>
      )}

      <UserButton className="focus-ring" />
    </div>
  );
}

export default Header;
