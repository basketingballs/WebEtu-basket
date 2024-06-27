"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./AuthProvider";
import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // State to manage dropdown menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle dropdown menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to close menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-green-600 py-4 px-4 md:px-12 flex items-center justify-between relative z-50">
      <div className="flex items-center flex-shrink-0">
        <Link href="/">
          <Image
            src="/nav.png" // Replace with your actual logo path
            alt="Logo"
            width={120}
            height={80}
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="text-white p-2 focus:outline-none"
          onClick={toggleMenu} // Toggle menu visibility on click
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-green-600 shadow-lg z-50">
          <div className="flex flex-col space-y-2 p-4">
            {user && (
              <>
                {pathname !== "/group" && (
                  <Link
                    href="/group" // Adjust the href for your Group page
                    className="text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
                    onClick={closeMenu} // Close menu on link click
                  >
                    <UserIcon className="h-6 w-6" />
                    Group
                  </Link>
                )}

                {pathname !== "/profile" && (
                  <Link
                    href="/profile"
                    className="text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
                    onClick={closeMenu} // Close menu on link click
                  >
                    <UserIcon className="h-6 w-6" />
                    Profile
                  </Link>
                )}

                <button
                  className="text-white hover:bg-white hover:text-red-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
                  onClick={() => {
                    signOut();
                    closeMenu(); // Close menu after sign out
                  }}
                >
                  <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
                </button>
              </>
            )}

            {!user && (
              <Link
                href="/login"
                className={`text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300 ${
                  pathname === "/login" ? "hidden" : ""
                }`}
                onClick={closeMenu} // Close menu on link click
              >
                <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-2">
        {user && (
          <>
            {pathname !== "/group" && (
              <Link
                href="/group" // Adjust the href for your Group page
                className="flex gap-2 text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
              >
                <UserIcon className="h-6 w-6" />
                Group
              </Link>
            )}

            {pathname !== "/profile" && (
              <Link
                href="/profile"
                className="flex gap-2 text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
              >
                <UserIcon className="h-6 w-6" />
                Profile
              </Link>
            )}

            <button
              className="flex gap-2 text-white hover:bg-white hover:text-red-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
              onClick={() => signOut()}
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
            </button>
          </>
        )}

        {!user && (
          <Link
            href="/login"
            className={`flex gap-2 text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300 ${
              pathname === "/login" ? "hidden" : ""
            }`}
          >
            <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
