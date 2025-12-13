"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import { User as UserIcon, BookOpen, BarChart2, Settings as SettingsIcon, HelpCircle, LogOut, Bell, Loader2, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { confirmAlert } from "../CustomAlert";
import toast from "react-hot-toast";
import {
  getStudentNotifications,
  markNotificationAsRead,
} from "../server/student/student.routes";

const INITIAL_NOTIFICATION_STATE = {
  items: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationState, setNotificationState] = useState(INITIAL_NOTIFICATION_STATE);
  const notificationPanelRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const syncUserData = () => {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem("faculty-pedia-student-data");
      if (!stored) {
        setIsLoggedIn(false);
        setUserData(null);
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("faculty-pedia-student-data");
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    const handleStorage = (event) => {
      if (!event || !event.key || event.key === "faculty-pedia-student-data") {
        syncUserData();
      }
    };

    syncUserData();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
      window.addEventListener("student-data-updated", syncUserData);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("student-data-updated", syncUserData);
      }
    };
  }, []);

  const fetchNotifications = useCallback(
    async ({ suppressUnread = false } = {}) => {
      if (!userData?._id) {
        return;
      }

      setNotificationState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await getStudentNotifications(userData._id, {
          limit: 20,
          unreadOnly: true,
        });
        const items = Array.isArray(result?.notifications)
          ? result.notifications
          : [];
        const unreadCount = result?.unreadCount ?? items.length;

        setNotificationState((prev) => ({
          ...prev,
          items,
          loading: false,
          error: null,
          unreadCount,
        }));
      } catch (error) {
        console.error("Error loading notifications:", error);
        setNotificationState((prev) => ({
          ...prev,
          loading: false,
          error: "Unable to load notifications right now.",
        }));
      }
    },
    [userData?._id]
  );

  const formatRelativeTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    if (diffMs <= 0) return "Just now";

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) return `${diffSeconds}s ago`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    });
  };

  const getNameInitials = (name = "") => {
    const trimmed = name.trim();
    if (!trimmed) return "FP";
    const parts = trimmed.split(/\s+/).slice(0, 2);
    const initials = parts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials || "FP";
  };

  const handleNotificationRefresh = () => {
    fetchNotifications({ suppressUnread: isNotificationOpen });
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsExamDropdownOpen(false);
  };

  const closeNotifications = () => setIsNotificationOpen(false);

  const handleNotificationSelect = useCallback(
    (item) => {
      if (!item) {
        return;
      }

      closeNotifications();

      const notificationId = item.id || item._id;
      if (notificationId && userData?._id) {
        setNotificationState((prev) => {
          const filteredItems = prev.items.filter(
            (entry) => entry.id !== notificationId
          );
          const nextUnread = Math.max(prev.unreadCount - 1, 0);
          return {
            ...prev,
            items: filteredItems,
            unreadCount: nextUnread,
          };
        });

        markNotificationAsRead(userData._id, notificationId).catch((error) => {
          console.error("Failed to mark notification as read:", error);
          // Re-fetch to resync state if API call fails
          fetchNotifications({ suppressUnread: true });
        });
      }

      if (item.link) {
        router.push(item.link);
      }
    },
    [userData?._id, router, fetchNotifications]
  );

  const handleLogout = async () => {
    const confirmed = await confirmAlert({
      title: 'Delete Student',
      message: 'Are you sure you want to logout ?',
      type: 'error',
      confirmText: 'Yes, Logout',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      localStorage.removeItem('faculty-pedia-student-data');
      localStorage.removeItem('faculty-pedia-auth-token');
      setIsLoggedIn(false);
      setUserData(null);
      setIsNotificationOpen(false);
      setNotificationState(INITIAL_NOTIFICATION_STATE);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('student-data-updated'));
      }
      toast.success('Logged out successfully');
      // Optionally redirect to home page
      router.push('/');

    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?._id) {
      fetchNotifications();
    } else {
      setNotificationState(INITIAL_NOTIFICATION_STATE);
    }
  }, [isLoggedIn, userData?._id, fetchNotifications]);

  useEffect(() => {
    if (!isNotificationOpen || !isLoggedIn || !userData?._id) {
      return;
    }

    fetchNotifications({ suppressUnread: true });
  }, [isNotificationOpen, isLoggedIn, userData?._id, fetchNotifications]);

  useEffect(() => {
    if (!isNotificationOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const resolveAvatarSrc = (data) => {
    if (!data || !data.image) {
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }
    if (typeof data.image === "string") return data.image;
    return (
      data.image.url ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  const toggleExamDropdown = () => {
    setIsExamDropdownOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };
  const hoverExamDropdown = "hover:bg-gray-200 transition-colors duration-200 rounded-md p-2";
  const menuItems = [
    {
      name: "Exams",
      href: "/exams",
      hasDropdown: true,
      subMenus: [
        { name: "IIT-JEE", href: "/exams/iit-jee" },
        { name: "NEET", href: "/exams/neet" },
        { name: "CBSE", href: "/exams/cbse" },
      ],
    },
    // { name: 'Courses', href: '/courses' },
    // { name: 'Webinars', href: '/webinars' },
    { name: "Educators", href: "/educators" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/logo/logo-blue.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
                style={{ height: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* random */}

          {/* Desktop Menu - Middle */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsExamDropdownOpen(true)}
                      onMouseLeave={() => setIsExamDropdownOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-50 relative group flex items-center space-x-1"
                      >
                        <span>{item.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExamDropdownOpen ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                      </Link>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 transform origin-top ${isExamDropdownOpen
                          ? "opacity-100 scale-100 visible"
                          : "opacity-0 scale-95 invisible"
                          }`}
                      >
                        <div className="py-2">
                          {item.subMenus.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-50 relative group"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons/Profile - Right */}
          <div className="hidden lg:block">
            <div className="ml-4 flex items-center space-x-4">
              {isLoggedIn && userData ? (
                <>
                  <div className="relative" ref={notificationPanelRef}>
                    <button
                      type="button"
                      aria-label="Notifications"
                      aria-expanded={isNotificationOpen}
                      onClick={handleNotificationToggle}
                      className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Bell className="h-5 w-5" />
                      {notificationState.unreadCount > 0 && notificationState.items.length > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                        </span>
                      )}
                    </button>

                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">Notifications</span>
                          <button
                            type="button"
                            onClick={handleNotificationRefresh}
                            disabled={notificationState.loading}
                            className="flex items-center justify-center rounded-full p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Refresh notifications"
                          >
                            {notificationState.loading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RefreshCcw className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notificationState.loading ? (
                            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span>Loading notifications...</span>
                            </div>
                          ) : notificationState.error ? (
                            <div className="space-y-3 px-4 py-6 text-sm">
                              <p className="text-red-500">{notificationState.error}</p>
                              <button
                                type="button"
                                onClick={handleNotificationRefresh}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Try again
                              </button>
                            </div>
                          ) : notificationState.items.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-gray-500">
                              You're all caught up! Follow your favourite educators to get updates.
                            </div>
                          ) : (
                            <ul className="divide-y divide-gray-100">
                              {notificationState.items.map((item) => (
                                <li key={item.id}>
                                  <button
                                    type="button"
                                    className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-blue-50 focus:outline-none"
                                    onClick={() => handleNotificationSelect(item)}
                                  >
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                                      {getNameInitials(item.educatorName)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                                          {item.title}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {formatRelativeTime(item.createdAt)}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-xs text-gray-600">
                                        {item.message}
                                      </p>
                                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400">
                                        <span className="text-gray-500">{item.educatorName}</span>
                                        <span>•</span>
                                        <span>{item.type}</span>
                                      </div>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Avatar
                        as="button"
                        isBordered={true}
                        style={{ opacity: 1 }}
                        src={resolveAvatarSrc(userData)}
                        className=" border-2 border-gray-300 rounded-full transition-transform hover:scale-105"

                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat" className="w-52 shadow-lg rounded-lg bg-white p-2">
                      <DropdownItem key="profile_settings" className={`${hoverExamDropdown}`}>
                        <Link href={`/profile/${userData.role}/${userData._id}`} className="flex items-center">
                          <UserIcon className="size-4 mr-2" /> Dashboard
                        </Link>
                      </DropdownItem>
                      <DropdownItem key="help" className={`${hoverExamDropdown}`}>
                        <Link href="/help" className="flex items-center">
                          <HelpCircle className="size-4 mr-2" /> Help & Support
                        </Link>
                      </DropdownItem>
                      <DropdownItem className="hover:bg-red-200 transition-colors duration-200 rounded-md" key="logout" color="danger" onClick={handleLogout}>
                        <span className="flex items-center"><LogOut className="size-4 mr-2" /> Log Out</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link
                    href="/join-as-student"
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                  >
                    Join As Student
                  </Link>
                  <Link
                    href="/join-as-educator"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-102 shadow-md hover:shadow-lg"
                  >
                    Join As Educator
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen
          ? "max-h-96 opacity-100"
          : "max-h-0 opacity-0 overflow-hidden"
          }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.hasDropdown ? (
                <div>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 hover:bg-white flex-1 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={toggleExamDropdown}
                      className="text-gray-700 hover:text-blue-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isExamDropdownOpen ? "rotate-180" : ""
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Dropdown Submenu */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${isExamDropdownOpen
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                  >
                    <div className="pl-6 py-2 space-y-1">
                      {item.subMenus.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="text-gray-600 hover:text-blue-600 hover:bg-white block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsExamDropdownOpen(false);
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 hover:bg-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 mt-3">
            {isLoggedIn && userData ? (
              <div className="px-3">
                <div className="flex items-center space-x-3 pb-3">
                  <Avatar
                    isBordered={true}
                    src={resolveAvatarSrc(userData)}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{userData.name || "User"}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-blue-600 hover:bg-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center"><UserIcon className="size-4 mr-2" /> My Profile</span>
                </Link>
                <Link
                  href="/my-courses"
                  className="text-gray-700 hover:text-blue-600 hover:bg-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center"><BookOpen className="size-4 mr-2" /> My Courses</span>
                </Link>
                <Link
                  href="/settings"
                  className="text-gray-700 hover:text-blue-600 hover:bg-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center"><SettingsIcon className="size-4 mr-2" /> Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                >
                  <span className="flex items-center"><LogOut className="size-4 mr-2" /> Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/join-as-student"
                  className="text-gray-700 hover:text-blue-600 hover:bg-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join As Student
                </Link>
                <Link
                  href="/join-as-educator"
                  className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 mx-3 mt-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join As Educator
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;