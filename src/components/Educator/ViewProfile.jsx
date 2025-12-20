import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IoStarSharp, IoCallSharp, IoMailSharp } from "react-icons/io5";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaUserPlus,
  FaUserCheck,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import CourseCard from "@/components/Courses/CourseCard";
import UpcomingWebinarCard from "@/components/Webinars/UpcomingWebinarCard";
import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import { IoLogoWhatsapp } from "react-icons/io";
import Link from "next/link";
import {
  getWebinarById,
  getWebinarsByEducator,
} from "@/components/server/webinars.routes";
import {
  getCourseById,
  getCoursesByEducator,
} from "@/components/server/course.routes";
import {
  getTestSeriesById,
  getTestSeriesByEducator,
} from "@/components/server/test-series.route";
import { rateEducator } from "@/components/server/educators.routes";
import Player from "@vimeo/player";

const extractVimeoId = (value) => {
  if (!value) return null;
  if (/^\d+$/.test(value)) return value;

  const match =
    value.match(/vimeo\.com\/(?:video\/|videos\/)?(\d+)/) ||
    value.match(/player\.vimeo\.com\/video\/(\d+)/);

  if (match && match[1]) return match[1];
  return null;
};
import {
  followEducator,
  unfollowEducator,
} from "@/components/server/student/student.routes";
import { getUserData } from "@/utils/userData";
import { toast } from "react-hot-toast";

const safeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const safeYear = (value, fallback = new Date().getFullYear()) => {
  const date = value ? new Date(value) : null;
  const year = date && Number.isFinite(date.getTime()) ? date.getFullYear() : NaN;
  return Number.isFinite(year) ? year : fallback;
};

const ViewProfile = ({ educatorData }) => {
  // Add safety check at the top
  if (!educatorData) {
    console.error("ViewProfile: educatorData is null or undefined");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg font-semibold text-gray-800">
            No educator data available
          </p>
        </div>
      </div>
    );
  }
  // State for managing visible items
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [visibleWebinars, setVisibleWebinars] = useState(6);
  const [visibleTestSeries, setVisibleTestSeries] = useState(6);

  console.log("Educator data: ", educatorData);

  // Vimeo player refs
  const vimeoContainerRef = useRef(null);
  const vimeoIframeRef = useRef(null);
  const vimeoPlayerRef = useRef(null);

  const payPerHourFeeValue = safeNumber(educatorData?.payPerHourFee, 0);
  const hasPayPerHour = Number.isFinite(payPerHourFeeValue) && payPerHourFeeValue > 0;
  const [isPayPerHourModalOpen, setIsPayPerHourModalOpen] = useState(false);
  const [isPayPerHourPortalReady, setIsPayPerHourPortalReady] = useState(false);

  useEffect(() => {
    setIsPayPerHourPortalReady(true);
    return () => setIsPayPerHourPortalReady(false);
  }, []);

  useEffect(() => {
    if (!isPayPerHourModalOpen || typeof document === "undefined") {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isPayPerHourModalOpen]);

  useEffect(() => {
    if (!isPayPerHourModalOpen || typeof window === "undefined") {
      return;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPayPerHourModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPayPerHourModalOpen]);

  useEffect(() => {
    if (!hasPayPerHour && isPayPerHourModalOpen) {
      setIsPayPerHourModalOpen(false);
    }
  }, [hasPayPerHour, isPayPerHourModalOpen]);

  const [ratingState, setRatingState] = useState(() => ({
    average: Number(
      educatorData?.rating?.average ?? educatorData?.rating ?? 0
    ),
    count: Number(
      educatorData?.rating?.count ??
        educatorData?.reviewCount ??
        educatorData?.ratingsCount ??
        0
    ),
  }));
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // State for webinar details
  const [webinarDetails, setWebinarDetails] = useState([]);
  const [loadingWebinars, setLoadingWebinars] = useState(false);

  // State for course details
  const [courseDetails, setCourseDetails] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // State for test series details
  const [testSeriesDetails, setTestSeriesDetails] = useState([]);
  const [loadingTestSeries, setLoadingTestSeries] = useState(false);

  // State for follow functionality
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    educatorData?.followers?.length || 0
  );
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const educatorId = educatorData?._id;
  const [summaryCounts, setSummaryCounts] = useState({
    courses: 0,
    webinars: 0,
    testSeries: 0,
  });
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const canRate = Boolean(currentUser?._id);
  const payPerHourSubjects = Array.isArray(educatorData?.subject)
    ? educatorData.subject.filter(Boolean).join(", ")
    : educatorData?.subject || null;
  const payPerHourSpecializations = Array.isArray(educatorData?.specialization)
    ? educatorData.specialization.filter(Boolean).join(", ")
    : educatorData?.specialization || null;
  const payPerHourDescription =
    educatorData?.payPerHourDescription || educatorData?.bio || null;
  const payPerHourWhatsAppLink = educatorData?.mobileNumber
    ? `https://wa.me/${educatorData.mobileNumber}`
    : null;
  const payPerHourEmailLink = educatorData?.email
    ? `mailto:${educatorData.email}`
    : null;
  const payPerHourDisplayName =
    [educatorData?.firstName, educatorData?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    educatorData?.fullName ||
    educatorData?.name ||
    "this educator";

  useEffect(() => {
    setRatingState({
      average: Number(
        educatorData?.rating?.average ?? educatorData?.rating ?? 0
      ),
      count: Number(
        educatorData?.rating?.count ??
          educatorData?.reviewCount ??
          educatorData?.ratingsCount ??
          0
      ),
    });
    setUserRating(0);
    setHoverRating(0);
  }, [educatorData]);

  const ratingAverage = ratingState.average ?? 0;
  const ratingCount = ratingState.count ?? 0;
  const ratingAverageSafe = safeNumber(ratingAverage, 0);
  const ratingCountSafe = safeNumber(ratingCount, 0);

  // Check if user is already following this educator
  useEffect(() => {
    const userData = getUserData();
    setCurrentUser(userData);

    if (userData && userData.followingEducators && educatorData?._id) {
      const following = userData.followingEducators.some(
        (follow) =>
          follow.educatorId === educatorData._id ||
          follow.educatorId?._id === educatorData._id
      );
      setIsFollowing(following);
    }
  }, [educatorData?._id]);

  // Fetch webinar details when component mounts or educatorData changes
  useEffect(() => {
    const fetchWebinarDetails = async () => {
      if (educatorData?.webinars && educatorData.webinars.length > 0) {
        setLoadingWebinars(true);
        try {
          const webinarPromises = educatorData.webinars.map((webinarId) =>
            getWebinarById(webinarId)
          );
          const webinars = await Promise.all(webinarPromises);
          setWebinarDetails(webinars.filter((webinar) => webinar)); // Filter out any null/undefined results
        } catch (error) {
          console.error("Error fetching webinar details:", error);
          setWebinarDetails([]);
        } finally {
          setLoadingWebinars(false);
        }
      }
    };

    fetchWebinarDetails();
  }, [educatorData?.webinars]);

  // Fetch course details when component mounts or educatorData changes
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (educatorData?.courses && educatorData.courses.length > 0) {
        setLoadingCourses(true);
        try {
          const coursePromises = educatorData.courses.map((courseId) =>
            getCourseById(courseId)
          );
          const courses = await Promise.all(coursePromises);
          setCourseDetails(courses.filter((course) => course)); // Filter out any null/undefined results
        } catch (error) {
          console.error("Error fetching course details:", error);
          setCourseDetails([]);
        } finally {
          setLoadingCourses(false);
        }
      }
    };

    fetchCourseDetails();
  }, [educatorData?.courses]);

  // Fetch test series details when component mounts or educatorData changes
  useEffect(() => {
    const fetchTestSeriesDetails = async () => {
      if (educatorData?.testSeries && educatorData.testSeries.length > 0) {
        setLoadingTestSeries(true);
        try {
          const testSeriesPromises = educatorData.testSeries.map(
            (testSeriesId) => getTestSeriesById(testSeriesId)
          );
          const testSeriesList = await Promise.all(testSeriesPromises);
          setTestSeriesDetails(
            testSeriesList.filter((testSeries) => testSeries)
          ); // Filter out any null/undefined results
        } catch (error) {
          console.error("Error fetching test series details:", error);
          setTestSeriesDetails([]);
        } finally {
          setLoadingTestSeries(false);
        }
      }
    };

    fetchTestSeriesDetails();
  }, [educatorData?.testSeries]);

  // Fetch summary counts (courses, webinars, test series) by educator ID
  useEffect(() => {
    if (!educatorId) return;

    let isMounted = true;

    const loadSummaryCounts = async () => {
      setIsLoadingSummary(true);
      try {
        const [coursesRes, webinarsRes, testSeriesRes] = await Promise.all([
          getCoursesByEducator(educatorId, { page: 1, limit: 1 }),
          getWebinarsByEducator(educatorId, { page: 1, limit: 1 }),
          getTestSeriesByEducator(educatorId, { page: 1, limit: 1 }),
        ]);

        const totalCourses =
          coursesRes?.pagination?.totalCourses ??
          coursesRes?.pagination?.total ??
          coursesRes?.totalCourses ??
          coursesRes?.courses?.length ??
          0;

        const totalWebinars =
          webinarsRes?.data?.pagination?.totalWebinars ??
          webinarsRes?.pagination?.totalWebinars ??
          webinarsRes?.totalWebinars ??
          webinarsRes?.data?.webinars?.length ??
          0;

        const totalTestSeries =
          testSeriesRes?.pagination?.totalTestSeries ??
          testSeriesRes?.pagination?.total ??
          testSeriesRes?.totalTestSeries ??
          testSeriesRes?.testSeries?.length ??
          0;

        if (isMounted) {
          setSummaryCounts({
            courses: totalCourses,
            webinars: totalWebinars,
            testSeries: totalTestSeries,
          });
        }
      } catch (error) {
        console.error("Error fetching educator summary counts:", error);
        if (isMounted) {
          setSummaryCounts({
            courses: courseDetails?.length || 0,
            webinars: webinarDetails?.length || 0,
            testSeries: testSeriesDetails?.length || 0,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingSummary(false);
        }
      }
    };

    loadSummaryCounts();

    return () => {
      isMounted = false;
    };
  }, [
    educatorId,
    courseDetails?.length,
    webinarDetails?.length,
    testSeriesDetails?.length,
  ]);

  if (!educatorData) return null; // Functions to load more items
  const loadMoreCourses = () => {
    setVisibleCourses((prev) => prev + 3);
  };

  const loadMoreWebinars = () => {
    setVisibleWebinars((prev) => prev + 3);
  };

  const loadMoreTestSeries = () => {
    setVisibleTestSeries((prev) => prev + 3);
  };

  // Follow functionality
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login as a student to follow educators");
      return;
    }

    if (!educatorData?._id) {
      toast.error("Educator information not available");
      return;
    }

    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowEducator(currentUser._id, educatorData._id);
        toast.success("Unfollowed successfully");
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));

        // Update local storage
        const updatedFollowing = currentUser.followingEducators.filter(
          (follow) =>
            follow.educatorId !== educatorData._id &&
            follow.educatorId?._id !== educatorData._id
        );
        const updatedUser = {
          ...currentUser,
          followingEducators: updatedFollowing,
        };
        localStorage.setItem(
          "faculty-pedia-student-data",
          JSON.stringify(updatedUser)
        );
        setCurrentUser(updatedUser);
      } else {
        await followEducator(currentUser._id, educatorData._id);
        toast.success("Followed successfully");
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);

        // Update local storage
        const newFollow = {
          educatorId: educatorData._id,
          followedAt: new Date(),
        };
        const updatedFollowing = [
          ...(currentUser.followingEducators || []),
          newFollow,
        ];
        const updatedUser = {
          ...currentUser,
          followingEducators: updatedFollowing,
        };
        localStorage.setItem(
          "faculty-pedia-student-data",
          JSON.stringify(updatedUser)
        );
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error(
        error.response?.data?.message || "Failed to update follow status"
      );
      // Revert optimistic update on error
      if (isFollowing) {
        setFollowerCount((prev) => prev + 1);
      } else {
        setFollowerCount((prev) => Math.max(0, prev - 1));
      }
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleRatingSubmit = async (value) => {
    if (isSubmittingRating) {
      return;
    }

    if (!canRate) {
      toast.error("Please login as a student to rate this educator");
      return;
    }

    if (!educatorData?._id) {
      toast.error("Educator information not available");
      return;
    }

    if (!value || value < 1 || value > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    try {
      setIsSubmittingRating(true);
      const response = await rateEducator(educatorData._id, {
        rating: value,
        studentId: currentUser._id,
      });
      const nextRating = response?.data?.rating;
      if (nextRating) {
        setRatingState({
          average: Number(nextRating.average ?? value),
          count: Number(nextRating.count ?? ratingCount),
        });
      }
      setUserRating(value);
      setHoverRating(0);
      toast.success("Thanks for rating this educator!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      const errorMessage = error?.response?.data?.message || "Unable to submit your rating. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Initialize Vimeo intro video player when introVideoLink changes
  useEffect(() => {
    const link = educatorData?.introVideoLink;
    const container = vimeoContainerRef.current;

    if (!link || !container) return;

    const videoId = extractVimeoId(link);
    if (!videoId) return;

    if (!vimeoIframeRef.current) {
      const iframe = document.createElement("iframe");
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";
      container.innerHTML = "";
      container.appendChild(iframe);
      vimeoIframeRef.current = iframe;
    }

    if (!vimeoPlayerRef.current) {
      vimeoPlayerRef.current = new Player(vimeoIframeRef.current, {
        id: videoId,
        autopause: false,
        muted: false,
      });
    } else {
      vimeoPlayerRef.current.loadVideo(videoId).catch(() => {});
    }

    const playerInstance = vimeoPlayerRef.current;
    const handlePlay = () => {
      console.log("Played the intro video");
    };

    playerInstance.on("play", handlePlay);

    return () => {
      playerInstance.off("play", handlePlay);
    };
  }, [educatorData?.introVideoLink]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (vimeoPlayerRef.current) {
        vimeoPlayerRef.current.unload().catch(() => {});
        vimeoPlayerRef.current = null;
      }
      vimeoIframeRef.current = null;
    },
    []
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Educator Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Educator Photo & Basic Info */}
            <div className="lg:w-1/3">
              {/* Educator Photo */}
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-600">
                  <Image
                    src={
                      educatorData.image?.url || "/images/placeholders/1.svg"
                    }
                    alt={`${educatorData.firstName} ${educatorData.lastName}`}
                    fill
                    sizes="(100vw)"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {`${educatorData.firstName} ${educatorData.lastName}`}
                </h1>

                <div className="mb-3">
                  {educatorData.qualification &&
                    educatorData.qualification.map((q, i) => {
                      return (
                        <section key={i}>
                          <p className="text-lg text-blue-600 font-medium">
                            {q?.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {q?.institute}
                          </p>
                        </section>
                      );
                    })}
                </div>

                <div className="mb-3">
                  <p className="text-gray-600">
                    {safeNumber(educatorData.yearsExperience, 0)}+ years experience
                  </p>
                </div>

                {/* Specialization Badge */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {educatorData.specialization}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <IoMailSharp className="w-4 h-4" />
                    <span className="text-sm">{educatorData.email}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <IoCallSharp className="w-4 h-4" />
                    <span className="text-sm">{educatorData.mobileNumber}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-center lg:items-start gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <IoStarSharp
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(ratingAverageSafe)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {ratingAverageSafe.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({ratingCountSafe} reviews)
                    </span>
                  </div>
                  {canRate ? (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span>Rate this educator:</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className="p-0.5"
                            onMouseEnter={() => setHoverRating(value)}
                            onMouseLeave={() => setHoverRating(0)}
                            onFocus={() => setHoverRating(value)}
                            onBlur={() => setHoverRating(0)}
                            onClick={() => handleRatingSubmit(value)}
                            disabled={isSubmittingRating}
                            aria-label={`Rate ${value} ${value === 1 ? "star" : "stars"}`}
                          >
                            <IoStarSharp
                              className={`w-5 h-5 ${
                                value <= (hoverRating || userRating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {isSubmittingRating
                          ? "Submitting..."
                          : userRating
                          ? `You rated ${userRating}/5`
                          : "Tap a star"}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Login as a student to share your rating.
                    </p>
                  )}
                </div>

                {/* Follow Button and Follower Count */}
                <div className="flex flex-col items-center lg:items-start gap-3 mb-6">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={handleFollowToggle}
                      disabled={isLoadingFollow || !currentUser}
                      className={`flex items-center gap-2 px-6 py-2 text-sm rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isFollowing
                          ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isLoadingFollow ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Following  ...</span>
                        </>
                      ) : isFollowing ? (
                        <>
                          <FaUserCheck className="w-4 h-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="w-4 h-4" />
                          {currentUser ? "Follow" : "Login to Follow"}
                        </>
                      )}
                    </button>

                    {hasPayPerHour && (
                      <button
                        type="button"
                        onClick={() => setIsPayPerHourModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      >
                        <FaMoneyBillWave className="w-4 h-4" />
                        Pay Per Hour
                      </button>
                    )}

                    <Link
                      href={`https://wa.me/${educatorData.mobileNumber}`}
                      target="_blank"
                    >
                      <span className="cursor-pointer">
                        {" "}
                        <IoLogoWhatsapp className="text-green-500 w-8 h-8" />{" "}
                      </span>
                    </Link>
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="text-lg font-semibold text-gray-900">
                      {safeNumber(followerCount, 0).toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {followerCount === 1 ? "Follower" : "Followers"}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center lg:justify-start gap-3">
                  {educatorData.socials?.instagram && (
                    <a
                      href={educatorData.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="w-5 h-5 text-pink-600 hover:text-pink-700" />
                    </a>
                  )}
                  {educatorData.socials?.facebook && (
                    <a
                      href={educatorData.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                    </a>
                  )}
                  {educatorData.socials?.twitter && (
                    <a
                      href={educatorData.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter className="w-5 h-5 text-blue-400 hover:text-blue-500" />
                    </a>
                  )}
                  {educatorData.socials?.linkedin && (
                    <a
                      href={educatorData.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="w-5 h-5 text-blue-700 hover:text-blue-800" />
                    </a>
                  )}
                  {educatorData.socials?.youtube && (
                    <a
                      href={educatorData.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube className="w-5 h-5 text-red-600 hover:text-red-700" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 gap-6">
                {/* Intro Video */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction Video
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {educatorData.introVideoLink ? (
                      <iframe src="https://player.vimeo.com/video/VIDEO_ID" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                        No intro video available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{educatorData.bio}</p>
        </div>

        {/* Work Experience & Qualifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Work Experience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Work Experience
            </h2>
            <div className="space-y-6">
              {educatorData.workExperience?.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exp.title}
                  </h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {safeYear(exp.startDate)} - {safeYear(exp.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Education & Qualifications
            </h2>
            <div className="space-y-6">
              {educatorData.qualification?.map((qual, index) => (
                <div key={index} className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {qual.title}
                  </h3>
                  <p className="text-green-600 font-medium">{qual.institute}</p>
                  <p className="text-sm text-gray-600">
                    {safeYear(qual.startDate)} - {safeYear(qual.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Details & Payment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Details Section */}
          {/* <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Specialization:
                    </span>
                    <span className="text-lg font-semibold text-blue-600">
                      {educatorData.specialization}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Classes:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {educatorData.class}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Courses:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {courseDetails?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Experience:
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {safeNumber(educatorData.yearsExperience, 0)}+ years
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className={`text-lg font-semibold ${
                        educatorData.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {educatorData.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Followers:
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {educatorData.followers?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Courses Section */}
        {courseDetails && courseDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Courses
            </h2>
            {loadingCourses ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading courses...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseDetails.slice(0, visibleCourses).map((course, index) => (
                  <CourseCard
                    key={course._id || index}
                    course={{
                      ...course,
                      educator: {
                        _id: educatorData._id,
                        firstName: educatorData.firstName,
                        lastName: educatorData.lastName,
                        image: educatorData.image,
                        specialization: educatorData.specialization,
                        qualification: educatorData.qualification,
                        rating: ratingAverage,
                        yearsExperience: safeNumber(educatorData.yearsExperience, 0),
                      },
                    }}
                  />
                ))}
              </div>
            )}
            {visibleCourses < courseDetails.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreCourses}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  View More Courses
                  <span className="text-sm">
                    ({Math.min(3, courseDetails.length - visibleCourses)} more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Webinars Section */}
        {webinarDetails && webinarDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Webinars
            </h2>
            {loadingWebinars ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading webinars...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webinarDetails
                  .slice(0, visibleWebinars)
                  .map((webinar, index) => (
                    <UpcomingWebinarCard
                      key={webinar._id || index}
                      item={{
                        id: webinar._id,
                        title: webinar.title,
                        description: webinar.description,
                        educatorName: `${educatorData.firstName} ${educatorData.lastName}`,
                        educatorPhoto:
                          educatorData.image?.url ||
                          "/images/placeholders/1.svg",
                        qualification:
                          educatorData.qualification?.[0]?.title || "N/A",
                        specialization:
                          webinar.specialization || educatorData.specialization,
                        subject: webinar.subject,
                        totalHours: (() => {
                          const durationMinutes = safeNumber(webinar.duration, 0);
                          const hours = Math.floor(durationMinutes / 60);
                          const minutes = durationMinutes % 60;
                          return `${hours}h ${minutes}m`;
                        })(),
                        timeRange: webinar.time,
                        date: new Date(webinar.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        ),
                        fee: webinar.fees?.toString() || "0",
                        detailsLink: `/webinars/${webinar._id}`,
                        image:
                          webinar.image?.url || "/images/placeholders/1.svg",
                        seatLimit: webinar.seatLimit,
                        enrolledCount: webinar.enrolledStudents?.length || 0,
                        webinarType: webinar.webinarType,
                        webinarLink: webinar.webinarLink,
                      }}
                    />
                  ))}
              </div>
            )}
            {visibleWebinars < webinarDetails.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreWebinars}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  View More Webinars
                  <span className="text-sm">
                    ({Math.min(3, webinarDetails.length - visibleWebinars)}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Test Series Section */}
        {testSeriesDetails && testSeriesDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Test Series
            </h2>
            {loadingTestSeries ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading test series...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testSeriesDetails
                  .slice(0, visibleTestSeries)
                  .map((testSeries, index) => (
                    <TestSeriesCard
                      key={testSeries._id || index}
                      testSeries={{
                        id: testSeries._id,
                        title: testSeries.title,
                        educatorName: `${educatorData.firstName} ${educatorData.lastName}`,
                        educatorPhoto:
                          educatorData.image?.url ||
                          "/images/placeholders/1.svg",
                        qualification:
                          educatorData.qualification?.[0]?.title || "N/A",
                        subject: testSeries.subject,
                        specialization: testSeries.specialization,
                        noOfTests: testSeries.noOfTests,
                        fee: testSeries.price,
                        slug: testSeries._id || `test-series-${index}`,
                        description: testSeries.description,
                        validity: testSeries.validity,
                        startDate: testSeries.startDate,
                        endDate: testSeries.endDate,
                      }}
                    />
                  ))}
              </div>
            )}
            {visibleTestSeries < testSeriesDetails.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreTestSeries}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  View More Test Series
                  <span className="text-sm">
                    ({Math.min(3, testSeriesDetails.length - visibleTestSeries)}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Statistics Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Educator Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isLoadingSummary
                  ? "..."
                  : safeNumber(summaryCounts.courses ?? courseDetails?.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {isLoadingSummary
                  ? "..."
                  : safeNumber(summaryCounts.webinars ?? webinarDetails?.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Webinars</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {isLoadingSummary
                  ? "..."
                  : safeNumber(summaryCounts.testSeries ?? testSeriesDetails?.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Test Series</div>
            </div>
          </div>
        </div>
        {isPayPerHourPortalReady && isPayPerHourModalOpen
          ? createPortal(
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setIsPayPerHourModalOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Pay per hour session details"
                  className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex flex-col max-h-[85vh]">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Pay Per Hour Session</h2>
                        <p className="text-xs text-gray-500">Personalised 1 : 1 guidance with {payPerHourDisplayName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPayPerHourModalOpen(false)}
                        className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close pay per hour details"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="overflow-y-auto px-6 pb-6 pt-4">
                      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <FaMoneyBillWave className="mt-1 h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Hourly rate</p>
                          <p className="text-3xl font-bold text-gray-900">
                            ₹{payPerHourFeeValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-sm text-gray-600">per hour session with {payPerHourDisplayName}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3">
                        {payPerHourSpecializations && (
                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Specialisations</p>
                            <p className="mt-1 text-sm text-gray-700">{payPerHourSpecializations}</p>
                          </div>
                        )}
                        {payPerHourSubjects && (
                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subjects covered</p>
                            <p className="mt-1 text-sm text-gray-700">{payPerHourSubjects}</p>
                          </div>
                        )}
                        {educatorData?.yearsExperience && (
                          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
                            <FaClock className="mt-1 h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Experience</p>
                              <p className="text-sm text-gray-700">{educatorData.yearsExperience}+ years of mentoring students</p>
                            </div>
                          </div>
                        )}
                        {payPerHourDescription && (
                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Session overview</p>
                            <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                              {payPerHourDescription}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {payPerHourWhatsAppLink && (
                          <Link
                            href={payPerHourWhatsAppLink}
                            target="_blank"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
                          >
                            <IoLogoWhatsapp className="h-5 w-5" />
                            WhatsApp Now
                          </Link>
                        )}
                        {payPerHourEmailLink && (
                          <a
                            href={payPerHourEmailLink}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                          >
                            <IoMailSharp className="h-5 w-5" />
                            Email {payPerHourDisplayName.split(" ")[0] || "Educator"}
                          </a>
                        )}
                        {!payPerHourWhatsAppLink && !payPerHourEmailLink && (
                          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
                            Contact details are currently unavailable. Please try connecting via the follow button instead.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setIsPayPerHourModalOpen(false)}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null}
      </div>
    </div>
  );
};

export default ViewProfile;
