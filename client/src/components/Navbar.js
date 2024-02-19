import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClickLogout = () => {
    logout();
  };
  return (
    <nav className="fixed start-0 top-0 bg-emerald-200 bg-opacity-30 backdrop-blur-sm p-4 z-10 w-full shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-gray-200 font-bold text-xl">
            <a href="/">
              <span className="text-emerald-400">Discuss</span> Nest
            </a>
          </div>

          <div className="hidden md:flex space-x-4 mr-12">
            <a
              href="/"
              className="text-gray-200 hover:text-gray-600 my-auto font-medium text-md transition duration-300 ease-in-out hover:text-gray-400"
            >
              Home
            </a>
            <a
              href="/forum"
              className="text-gray-200 hover:text-gray-600 my-auto font-medium text-md transition duration-300 ease-in-out hover:text-gray-400"
            >
              Forum
            </a>
            <a
              href="/faq"
              className="text-gray-200 hover:text-gray-600 my-auto font-medium text-md transition duration-300 ease-in-out hover:text-gray-400"
            >
              FaQ
            </a>
            <a
              href="/contact"
              className="text-gray-200 hover:text-gray-600 my-auto font-medium text-md transition duration-300 ease-in-out hover:text-gray-400"
            >
              Contact
            </a>
            {!user && (
              <>
                <Link to="/login">
                  <Button className="text-gray-600 bg-emerald-400 text-sm px-4">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="text-gray-600 bg-emerald-400 text-sm px-4">
                    Signup
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <>
                {/* <div className="text-gray-800 my-auto">Halo, {user.name}</div> */}
                <div className="text-gray-200 hover:text-gray-400 my-auto font-medium text-md">
                  <button
                    id="dropdownHoverButton"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="inline-flex items-center "
                    type="button"
                  >
                    Hello, {user.name}
                    <svg
                      className="w-2.5 h-2.5 ms-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div
                      id="dropdownHover"
                      className="z-10 absolute bg-white bg-opacity-30 backdrop-blur-sm rounded-lg drop-shadow-2xl w-44"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <ul className="py-2 text-sm text-gray-200 hover:text-grey-400 ">
                        <li>
                          <Link to={`/update-user`}>
                            <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-blue-200 dark:hover:text-dark transition duration-300 transform hover:scale-100">
                              Update Profile
                            </div>
                          </Link>
                          <Link
                            to={`/update-post`}
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-blue-200 dark:hover:text-dark transition duration-300 transform hover:scale-100"
                          >
                            My Posts
                          </Link>
                          <div
                            onClick={handleClickLogout}
                            className="block px-4 py-2 relative flex items-center cursor-pointer transition duration-300 hover:bg-blue-200 transform hover:scale-100 "
                          >
                            <div id="text" className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="w-3 h-2.5"
                              >
                                <path
                                  d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                                  fill="currentColor"
                                />
                              </svg>
                              <span className="ml-2">Logout</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                {/*   <Button
                  onClick={handleClickLogout}
                  color="blue"
                  className="text-white text-sm px-4"
                >
                  Logout
                </Button> */}
              </>
            )}
          </div>
          <div className="md:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="text-gray-800 hover:text-gray-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <a
              href="/"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              Home
            </a>
            <a
              href="#"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              About
            </a>
            <a
              href="#"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              Services
            </a>
            <a
              href="#"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              Contact
            </a>
            <Link to="/login">
              <Button
                color="blue"
                className="text-white text-sm px-4 block mb-2"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button color="blue" className="text-white text-sm px-4 block">
                Signup
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
