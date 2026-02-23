"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  FaGraduationCap,
} from "react-icons/fa";
import {
  BookOpen,
  Video,
  TestTube,
  Calendar,
  FileQuestion,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import {
  createItemReview,
  getEducatorItemReviews,
} from "@/components/server/reviews.routes";
import Player from "@vimeo/player";
import {
  followEducator,
  unfollowEducator,
} from "@/components/server/student/student.routes";
import { getUserData } from "@/utils/userData";
import { toast } from "react-hot-toast";

const EDUCATOR_FALLBACK_IMAGE = "/images/placeholders/educatorFallback.svg";

const extractVimeoId = (value) => {
  if (!value) return null;
  if (/^\d+$/.test(value)) return value;

  const match =
    value.match(/vimeo\.com\/(?:video\/|videos\/)?(\d+)/) ||
    value.match(/player\.vimeo\.com\/video\/(\d+)/);

  if (match && match[1]) return match[1];
  return null;
};

const safeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const safeYear = (value, fallback = new Date().getFullYear()) => {
  const date = value ? new Date(value) : null;
  const year =
    date && Number.isFinite(date.getTime()) ? date.getFullYear() : NaN;
  return Number.isFinite(year) ? year : fallback;
};

const RATING_STORAGE_KEY = "faculty-pedia-educator-ratings";

const getStoredEducatorRating = (educatorId, studentId) => {
  try {
    if (!educatorId || !studentId || typeof window === "undefined") {
      return null;
    }
    const raw = localStorage.getItem(RATING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const key = `${studentId}::${educatorId}`;
    const value = parsed?.[key];
    return Number.isFinite(value) ? value : null;
  } catch (error) {
    console.warn("Unable to read stored rating:", error);
    return null;
  }
};

const setStoredEducatorRating = (educatorId, studentId, rating) => {
  try {
    if (!educatorId || !studentId || !Number.isFinite(rating)) return;
    const key = `${studentId}::${educatorId}`;
    const raw = localStorage.getItem(RATING_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[key] = rating;
    localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.warn("Unable to persist rating locally:", error);
  }
};

const ViewProfile = ({ educatorData }) => {
  const router = useRouter();
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

  const resolveAvatar = () => {
    // Handle image as object with url property
    if (educatorData?.image && typeof educatorData.image === "object") {
      const url = educatorData.image.url;
      if (url && typeof url === "string" && url.trim().length > 0) {
        return url;
      }
    }
    // Handle image as string
    if (educatorData?.image && typeof educatorData.image === "string" && educatorData.image.trim().length > 0) {
      return educatorData.image;
    }
    // Fallback
    return EDUCATOR_FALLBACK_IMAGE;
  };

  const [avatarSrc, setAvatarSrc] = useState(resolveAvatar);

  useEffect(() => {
    setAvatarSrc(resolveAvatar());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educatorData?.image]);

  // Vimeo player refs
  const vimeoContainerRef = useRef(null);
  const vimeoIframeRef = useRef(null);
  const vimeoPlayerRef = useRef(null);
  const reviewCarouselRef = useRef(null);

  const payPerHourFeeValue = safeNumber(educatorData?.payPerHourFee, 0);
  const hasPayPerHour =
    Number.isFinite(payPerHourFeeValue) && payPerHourFeeValue > 0;
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
    average: Number(educatorData?.rating?.average ?? educatorData?.rating ?? 0),
    count: Number(
      educatorData?.rating?.count ??
        educatorData?.reviewCount ??
        educatorData?.ratingsCount ??
        0
    ),
  }));
  const [userRating, setUserRating] = useState(() => {
    const userData = getUserData();
    const eduId = educatorData?._id;
    if (userData?._id && eduId) {
      const existing = getStoredEducatorRating(eduId, userData._id);
      return Number.isFinite(existing) ? existing : 0;
    }
    return 0;
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [itemReviews, setItemReviews] = useState([]);
  const [itemReviewsLoading, setItemReviewsLoading] = useState(false);
  const [itemReviewsError, setItemReviewsError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [itemReviewRating, setItemReviewRating] = useState(0);
  const [itemReviewText, setItemReviewText] = useState("");
  const [isSubmittingItemReview, setIsSubmittingItemReview] = useState(false);

  // State for webinar details
  const [webinarDetails, setWebinarDetails] = useState([]);
  const [loadingWebinars, setLoadingWebinars] = useState(false);

  // State for course details
  const [courseDetails, setCourseDetails] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // State for test series details
  const [testSeriesDetails, setTestSeriesDetails] = useState([]);
  const [loadingTestSeries, setLoadingTestSeries] = useState(false);

  const reviewableItems = useMemo(() => {
    const items = [];
    if (Array.isArray(courseDetails)) {
      courseDetails.forEach((course) => {
        if (!course) return;
        items.push({
          id: course._id || course.id,
          type: "course",
          title: course.title || course.name || "Course",
        });
      });
    }
    if (Array.isArray(webinarDetails)) {
      webinarDetails.forEach((webinar) => {
        if (!webinar) return;
        items.push({
          id: webinar._id || webinar.id,
          type: "webinar",
          title: webinar.title || "Webinar",
        });
      });
    }
    if (Array.isArray(testSeriesDetails)) {
      testSeriesDetails.forEach((series) => {
        if (!series) return;
        items.push({
          id: series._id || series.id,
          type: "testSeries",
          title: series.title || "Test Series",
        });
      });
    }
    return items;
  }, [courseDetails, webinarDetails, testSeriesDetails]);

  // State for follow functionality
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    educatorData?.followers?.length || 0
  );
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getUserData());
  const educatorId = educatorData?._id;
  const [summaryCounts, setSummaryCounts] = useState({
    courses: 0,
    webinars: 0,
    testSeries: 0,
  });
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const postCount = safeNumber(
    educatorData?.posts?.length ?? educatorData?.postCount,
    0
  );
  const canRate = Boolean(currentUser?._id);
  const payPerHourSubjects = Array.isArray(educatorData?.subject)
    ? educatorData.subject.filter(Boolean).join(", ")
    : educatorData?.subject || null;
  const payPerHourSpecializations = Array.isArray(educatorData?.specialization)
    ? educatorData.specialization.filter(Boolean).join(", ")
    : educatorData?.specialization || null;
  const payPerHourDescription =
    educatorData?.payPerHourDescription || educatorData?.bio || null;
  const payPerHourWhatsAppLink = educatorData?.whatsappNumber
    ? `https://wa.me/${educatorData.whatsappNumber}`
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

    if (educatorData?._id && userData?._id) {
      const existingRating = getStoredEducatorRating(
        educatorData._id,
        userData._id
      );
      if (Number.isFinite(existingRating)) {
        setUserRating(existingRating);
      } else {
        setUserRating(0);
      }
    } else {
      setUserRating(0);
    }
  }, [educatorData?._id]);

  // Fetch webinar details when component mounts or educatorData changes
  useEffect(() => {
    const fetchWebinarDetails = async () => {
      if (educatorData?.webinars && educatorData.webinars.length > 0) {
        setLoadingWebinars(true);
        try {
          const validIds = educatorData.webinars.filter(
            (id) => id && typeof id === "string" && id.trim().length > 0
          );

          const webinarPromises = validIds.map((webinarId) =>
            getWebinarById(webinarId).catch((err) => {
              console.warn(
                `Failed to fetch webinar ${webinarId}:`,
                err.message
              );
              return null;
            })
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
          const validIds = educatorData.courses.filter(
            (id) => id && typeof id === "string" && id.trim().length > 0
          );

          const coursePromises = validIds.map((courseId) =>
            getCourseById(courseId).catch((err) => {
              console.warn(`Failed to fetch course ${courseId}:`, err.message);
              return null;
            })
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
          const validIds = educatorData.testSeries.filter(
            (id) => id && typeof id === "string" && id.trim().length > 0
          );

          const testSeriesPromises = validIds.map((testSeriesId) =>
            getTestSeriesById(testSeriesId).catch((err) => {
              console.warn(
                `Failed to fetch test series ${testSeriesId}:`,
                err.message
              );
              return null;
            })
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

  // Fetch item reviews for this educator (courses, webinars, test series)
  useEffect(() => {
    if (!educatorId) return;
    let cancelled = false;

    const loadReviews = async () => {
      setItemReviewsLoading(true);
      setItemReviewsError(null);
      try {
        const response = await getEducatorItemReviews(educatorId, {
          limit: 50,
        });
        const list = response?.data || response?.reviews || [];
        if (!cancelled) {
          setItemReviews(Array.isArray(list) ? list : []);
        }
      } catch (error) {
        console.error("Error fetching educator item reviews:", error);
        if (!cancelled) {
          setItemReviewsError(
            error?.response?.data?.message || "Unable to load reviews right now."
          );
        }
      } finally {
        if (!cancelled) {
          setItemReviewsLoading(false);
        }
      }
    };

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [educatorId]);

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
      setStoredEducatorRating(educatorData._id, currentUser._id, value);
      setHoverRating(0);
      toast.success("Thanks for rating this educator!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Unable to submit your rating. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleItemReviewSubmit = async () => {
    if (isSubmittingItemReview) return;

    if (!currentUser?._id) {
      toast.error("Please login as a student to submit a review");
      return;
    }

    if (!selectedItemForReview?.id || !selectedItemForReview?.type) {
      toast.error("Select a course, webinar, or test series to review");
      return;
    }

    if (!itemReviewRating || itemReviewRating < 1 || itemReviewRating > 5) {
      toast.error("Please provide a rating between 1 and 5");
      return;
    }

    try {
      setIsSubmittingItemReview(true);
      await createItemReview({
        studentId: currentUser._id,
        itemId: selectedItemForReview.id,
        itemType: selectedItemForReview.type,
        rating: itemReviewRating,
        reviewText: itemReviewText,
      });
      toast.success("Review submitted");
      setItemReviewText("");
      setItemReviewRating(0);
      setIsReviewModalOpen(false);
      // Refresh reviews list
      const response = await getEducatorItemReviews(educatorId, { limit: 50 });
      const list = response?.data || response?.reviews || [];
      setItemReviews(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error submitting item review:", error);
      toast.error(
        error?.response?.data?.message || "Unable to submit review."
      );
    } finally {
      setIsSubmittingItemReview(false);
    }
  };

  const scrollReviews = (direction = "right") => {
    const node = reviewCarouselRef.current;
    if (!node) return;

    const gap = (() => {
      try {
        const style = window.getComputedStyle(node);
        const parsed = parseFloat(style.columnGap || style.gap || "0");
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 16;
      } catch (_err) {
        return 16;
      }
    })();

    const cardWidth = node.firstElementChild?.getBoundingClientRect?.().width || 320;
    const step = Math.max(cardWidth + gap, 1);
    const max = Math.max(node.scrollWidth - node.clientWidth, 0);

    if (max <= 0) return;

    if (direction === "left") {
      const atStart = node.scrollLeft <= 1;
      if (atStart) {
        node.scrollTo({ left: max, behavior: "smooth" });
        return;
      }
      const next = Math.max(node.scrollLeft - step, 0);
      node.scrollTo({ left: next, behavior: "smooth" });
    } else {
      const atEnd = node.scrollLeft >= max - 1;
      if (atEnd) {
        node.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const next = Math.min(node.scrollLeft + step, max);
      node.scrollTo({ left: next, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const node = reviewCarouselRef.current;
    if (!node || !itemReviews || itemReviews.length <= 1) return undefined;

    const id = window.setInterval(() => {
      scrollReviews("right");
    }, 3000);

    return () => window.clearInterval(id);
  }, [itemReviews]);

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
    <div className="w-full min-h-screen bg-[#f6f6f8]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#636388] mb-6 font-medium">
          <a className="hover:text-[#231fe5] transition-colors" href="/">
            Home
          </a>
          <span className="text-gray-400">›</span>
          <a
            className="hover:text-[#231fe5] transition-colors"
            href="/educators"
          >
            Educators
          </a>
          <span className="text-gray-400">›</span>
          <span className="text-[#111118]">{`${educatorData.firstName} ${educatorData.lastName}`}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN (Profile & About) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-blue-50 to-indigo-50 opacity-50 z-0"></div>

              <div className="relative z-10 mt-4 mb-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md ring-4 ring-white">
                  <Image
                    src={avatarSrc}
                    alt={`${educatorData.firstName} ${educatorData.lastName}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                    onError={() => setAvatarSrc(EDUCATOR_FALLBACK_IMAGE)}
                    priority
                  />
                  <div
                    className="absolute bottom-1 right-1 bg-green-500 border-2 border-white rounded-full w-4 h-4 shadow-sm"
                    title="Online"
                  ></div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center w-full">
                <h1 className="text-[#111118] text-2xl font-bold tracking-tight">
                  {`${educatorData.firstName} ${educatorData.lastName}`}
                </h1>
                <p className="text-[#636388] text-sm font-medium mt-1">
                  @{educatorData.username || "educator"}
                </p>

                <div className="flex items-center gap-1 mt-3 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
                  <IoStarSharp className="text-yellow-500 text-[18px]" />
                  <span className="text-[#111118] text-sm font-bold">
                    {ratingAverageSafe.toFixed(1)}
                  </span>
                  <span className="text-[#636388] text-xs font-normal">
                    ({ratingCountSafe} reviews)
                  </span>
                </div>

                <div className="mt-6 w-full flex flex-col gap-3">
                  <button
                    onClick={handleFollowToggle}
                    disabled={isLoadingFollow || !currentUser}
                    className={`w-full text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      isFollowing
                        ? "bg-green-600 hover:bg-green-700 shadow-green-200"
                        : "bg-[#231fe5] hover:bg-[#1a16b5] shadow-blue-200"
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
                        <span>Following...</span>
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

                  <div className="text-[#636388] text-xs font-medium">
                    {safeNumber(followerCount, 0).toLocaleString()} Followers
                  </div>
                </div>
              </div>
            </div>

            {/* About Section Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-[#111118] text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-[#231fe5] text-[22px]">ℹ️</span>
                About Me
              </h2>
              <div className="prose prose-sm text-[#636388] font-normal leading-relaxed mb-6">
                <p>{educatorData.bio || educatorData.description}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#111118] uppercase tracking-wider mb-2">
                    Specialization
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(educatorData.specialization) ? (
                      educatorData.specialization.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {spec}
                        </span>
                      ))
                    ) : educatorData.specialization ? (
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                        {educatorData.specialization}
                      </span>
                    ) : null}
                    {Array.isArray(educatorData.subject) &&
                      educatorData.subject.map((subj, idx) => (
                        <span
                          key={`subj-${idx}`}
                          className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {subj}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#111118] uppercase tracking-wider mb-2">
                    Experience
                  </p>
                  <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                    <FaGraduationCap className="text-gray-500 w-4.5 h-4.5" />
                    <span className="text-sm text-[#111118] font-medium">
                      {safeNumber(educatorData.yoe, 0)}+ Years
                      Experience
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Section for Students */}
            {canRate && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-[#111118] text-lg font-bold mb-4">
                  Rate This Educator
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className="p-1"
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onFocus={() => setHoverRating(value)}
                        onBlur={() => setHoverRating(0)}
                        onClick={() => handleRatingSubmit(value)}
                        disabled={isSubmittingRating}
                        aria-label={`Rate ${value} ${
                          value === 1 ? "star" : "stars"
                        }`}
                      >
                        <IoStarSharp
                          className={`w-8 h-8 ${
                            value <= (hoverRating || userRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-[#636388]">
                    {isSubmittingRating
                      ? "Submitting..."
                      : userRating
                        ? `You rated ${userRating}/5`
                        : "Click to rate"}
                  </span>
                </div>
              </div>
            )}

            {/* Enrolled Item Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-[#111118] text-lg font-bold">
                   Students Feedback
                  </h3>
                  <p className="text-sm text-[#636388]">
                    Feedback from students enrolled in this educator's content
                  </p>
                </div>
                {canRate && reviewableItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemForReview(
                        selectedItemForReview || reviewableItems[0]
                      );
                      setIsReviewModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#231fe5] text-white text-sm font-semibold shadow-sm hover:bg-[#1c19c8] transition-colors"
                  >
                    Share Your Review
                  </button>
                )}
              </div>

              {itemReviewsError && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {itemReviewsError}
                </div>
              )}

              {itemReviewsLoading ? (
                <div className="py-6 text-center text-sm text-[#636388]">
                  Loading reviews...
                </div>
              ) : itemReviews.length === 0 ? (
                <div className="py-6 text-center text-sm text-[#636388]">
                  No reviews yet. Be the first to share your experience.
                </div>
              ) : (
                <div className="relative">
                  <div
                    ref={reviewCarouselRef}
                    className="flex gap-4 overflow-hidden pb-2 scroll-smooth"
                  >
                    {itemReviews.map((review) => {
                      const ratingValue = Number(review.rating) || 0;
                      return (
                        <div
                          key={`${review.itemType}-${review._id || review.itemId}`}
                          className="min-w-[280px] max-w-[320px] bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                              {review.itemType === "testSeries"
                                ? "Test Series"
                                : review.itemType}
                            </span>
                            <span className="text-xs text-[#636388]">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#111118] mb-1 line-clamp-2" title={review.itemTitle}>
                            {review.itemTitle || "Untitled"}
                          </p>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IoStarSharp
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= ratingValue
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-[#636388] ml-1">
                              {ratingValue.toFixed(1)}
                            </span>
                          </div>
                          {review.reviewText ? (
                            <p className="text-sm text-[#111118] mb-3 line-clamp-3">
                              {review.reviewText}
                            </p>
                          ) : (
                            <p className="text-sm text-[#636388] mb-3">
                              No comment provided.
                            </p>
                          )}
                          <div className="text-xs text-[#636388] font-semibold">
                            — {review.studentName || "Student"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (Media, Stats, Experience, Actions) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Intro Media Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative w-full aspect-video bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
                {educatorData.introVideoLink &&
                extractVimeoId(educatorData.introVideoLink) ? (
                  <iframe
                    src={`${educatorData.introVideoLink}?title=0&byline=0&portrait=0`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                    <div className="w-20 h-20 bg-[#231fe5]/10 rounded-full flex items-center justify-center shadow-sm mb-6 border border-[#231fe5]/20">
                      <Video className="w-10 h-10 text-[#231fe5]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center text-[#111118]">
                      Intro Video of {educatorData.firstName}{" "}
                      {educatorData.lastName}
                    </h3>
                    <p className="text-sm text-[#636388] text-center max-w-md">
                      is not currently available. Check out soon!
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs text-[#636388]">
                      <div className="w-2 h-2 bg-[#231fe5] rounded-full animate-pulse"></div>
                      <span>Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Teaching Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => router.push(`/courses?educator=${educatorId}`)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-1 hover:border-[#231fe5]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#231fe5]/50"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-1">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-[#111118]">
                  {isLoadingSummary
                    ? "..."
                    : safeNumber(
                        summaryCounts.courses ?? courseDetails?.length,
                        0,
                      )}
                </p>
                <p className="text-xs text-[#636388] font-medium uppercase tracking-wide">
                  Courses
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(`/test-series?educator=${educatorId}`)
                }
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-1 hover:border-[#231fe5]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#231fe5]/50"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                  <TestTube className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-[#111118]">
                  {isLoadingSummary
                    ? "..."
                    : safeNumber(
                        summaryCounts.testSeries ?? testSeriesDetails?.length,
                        0,
                      )}
                </p>
                <p className="text-xs text-[#636388] font-medium uppercase tracking-wide">
                  Test Series
                </p>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/webinars?educator=${educatorId}`)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-1 hover:border-[#231fe5]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#231fe5]/50"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-[#111118]">
                  {isLoadingSummary
                    ? "..."
                    : safeNumber(
                        summaryCounts.webinars ?? webinarDetails?.length,
                        0,
                      )}
                </p>
                <p className="text-xs text-[#636388] font-medium uppercase tracking-wide">
                  Webinars
                </p>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/posts?educator=${educatorId}`)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-1 hover:border-[#231fe5]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#231fe5]/50"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-[#111118]">
                  {safeNumber(postCount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-[#636388] font-medium uppercase tracking-wide">
                  Posts
                </p>
              </button>
            </div>

            {/* Experience & Qualifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Work Experience */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-[#111118] text-lg font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="text-[#231fe5] w-5 h-5" />
                  Work Experience
                </h3>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                  {educatorData.workExperience &&
                  educatorData.workExperience.length > 0 ? (
                    educatorData.workExperience.map((exp, index) => (
                      <div key={index} className="relative pl-6">
                        <div
                          className={`absolute -left-2.25 top-1.5 w-4 h-4 rounded-full ${
                            index === 0 ? "bg-[#231fe5]" : "bg-gray-300"
                          } border-4 border-white shadow-sm`}
                        ></div>
                        <h4 className="text-[#111118] text-sm font-bold">
                          {exp.title}
                        </h4>
                        <p
                          className={`${
                            index === 0 ? "text-[#231fe5]" : "text-[#636388]"
                          } text-xs font-medium mb-1`}
                        >
                          {exp.company} • {safeYear(exp.startDate)} -{" "}
                          {safeYear(exp.endDate)}
                        </p>
                        {exp.description && (
                          <p className="text-[#636388] text-xs">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-[#636388] text-sm">
                      No work experience listed
                    </p>
                  )}
                </div>
              </div>

              {/* Qualifications & Socials Wrapper */}
              <div className="flex flex-col gap-6">
                {/* Qualifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-[#111118] text-lg font-bold mb-4 flex items-center gap-2">
                    <FaGraduationCap className="text-[#231fe5] w-5 h-5" />
                    Qualifications
                  </h3>
                  <ul className="space-y-4">
                    {educatorData.qualification &&
                    educatorData.qualification.length > 0 ? (
                      educatorData.qualification.map((qual, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 w-2 h-2 rounded-full bg-blue-200"></div>
                          <div>
                            <p className="text-[#111118] text-sm font-semibold">
                              {qual.title}
                            </p>
                            <p className="text-[#636388] text-xs">
                              {qual.institute},{" "}
                              {safeYear(qual.endDate || qual.startDate)}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-[#636388] text-sm">
                        No qualifications listed
                      </p>
                    )}
                  </ul>
                </div>

                {/* Contact & Social */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-[#111118] text-lg font-bold mb-4">
                    Connect
                  </h3>
                  <div className="space-y-3 mb-6">
                    {educatorData.email && (
                      <div className="flex items-center gap-3 text-sm text-[#636388]">
                        <IoMailSharp className="w-5 h-5" />
                        <span className="truncate">{educatorData.email}</span>
                      </div>
                    )}
                    {educatorData.mobileNumber && (
                      <div className="flex items-center gap-3 text-sm text-[#636388]">
                        <IoCallSharp className="w-5 h-5" />
                        <span>{educatorData.mobileNumber}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {educatorData.socials?.linkedin && (
                      <a
                        href={educatorData.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {educatorData.socials?.twitter && (
                      <a
                        href={educatorData.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-400 transition-colors"
                      >
                        <FaTwitter className="w-4 h-4" />
                      </a>
                    )}
                    {educatorData.socials?.instagram && (
                      <a
                        href={educatorData.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      >
                        <FaInstagram className="w-4 h-4" />
                      </a>
                    )}
                    {educatorData.socials?.youtube && (
                      <a
                        href={educatorData.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <FaYoutube className="w-4 h-4" />
                      </a>
                    )}
                    {educatorData.socials?.facebook && (
                      <a
                        href={educatorData.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <FaFacebook className="w-4 h-4" />
                      </a>
                    )}
                    {educatorData.whatsappNumber && (
                      <a
                        href={`https://wa.me/91${educatorData.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600  hover:text-green-600 transition-colors cursor-pointer"
                      >
                        <IoLogoWhatsapp className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Per Hour Action Card - Book 1:1 Session */}
            {hasPayPerHour && (
              <div className="bg-linear-to-r from-blue-900 to-indigo-900 rounded-xl shadow-lg shadow-blue-900/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
                <div className="relative z-10 text-center sm:text-left">
                  <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">
                    Book a Session
                  </p>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <h2 className="text-3xl font-bold">
                      ₹{payPerHourFeeValue.toLocaleString("en-IN")}
                    </h2>
                    <span className="text-blue-200">/ hour</span>
                  </div>
                  <p className="text-blue-100/80 text-sm mt-2 max-w-xs">
                    One-on-one mentorship and personalized doubt clearing
                    sessions.
                  </p>
                </div>
                <div className="relative z-10 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsPayPerHourModalOpen(true)}
                    className="w-full sm:w-auto bg-white text-[#231fe5] hover:bg-blue-50 font-bold py-3 px-8 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Book 1:1 Session</span>
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Courses Section */}
        {courseDetails && courseDetails.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#111118] mb-6">
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
                        yearsExperience: safeNumber(
                          educatorData.yoe,
                          0,
                        ),
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
                  className="px-6 py-3 bg-[#231fe5] text-white rounded-lg font-medium hover:bg-[#1a17b8] transition-all duration-200 flex items-center gap-2"
                >
                  View More Courses
                  <span className="text-sm opacity-90">
                    ({Math.min(3, courseDetails.length - visibleCourses)} more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Webinars Section */}
        {webinarDetails && webinarDetails.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#111118] mb-6">
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
                          educatorData.image ||
                          EDUCATOR_FALLBACK_IMAGE,
                        qualification:
                          educatorData.qualification?.[0]?.title || "N/A",
                        specialization:
                          webinar.specialization || educatorData.specialization,
                        subject: webinar.subject,
                        totalHours: (() => {
                          const durationMinutes = safeNumber(
                            webinar.duration,
                            0,
                          );
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
                          },
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
                  className="px-6 py-3 bg-[#231fe5] text-white rounded-lg font-medium hover:bg-[#1a17b8] transition-all duration-200 flex items-center gap-2"
                >
                  View More Webinars
                  <span className="text-sm opacity-90">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#111118] mb-6">
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
                          educatorData.image ||
                          EDUCATOR_FALLBACK_IMAGE,
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
                  className="px-6 py-3 bg-[#231fe5] text-white rounded-lg font-medium hover:bg-[#1a17b8] transition-all duration-200 flex items-center gap-2"
                >
                  View More Test Series
                  <span className="text-sm opacity-90">
                    ({Math.min(3, testSeriesDetails.length - visibleTestSeries)}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Item Review Modal */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#111118]">
                    Share Your Course / Webinar / Test Series Review
                  </h3>
                  <p className="text-sm text-[#636388]">
                    You can review only the items you are enrolled in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Close review modal"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#111118]">
                    Select Item
                  </label>
                  <select
                    value={selectedItemForReview?.id || ""}
                    onChange={(e) => {
                      const next = reviewableItems.find((item) => item.id === e.target.value);
                      setSelectedItemForReview(next || null);
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#231fe5]/50"
                  >
                    <option value="" disabled>
                      Select a course, webinar, or test series
                    </option>
                    {reviewableItems.map((item) => (
                      <option key={`${item.type}-${item.id}`} value={item.id}>
                        {item.title} ({item.type === "testSeries" ? "Test Series" : item.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#111118]">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setItemReviewRating(value)}
                        className="p-1"
                        aria-label={`Rate ${value}`}
                      >
                        <IoStarSharp
                          className={`w-7 h-7 ${
                            value <= itemReviewRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#636388]">
                      {itemReviewRating ? `${itemReviewRating}/5` : "Select"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#111118]">
                    Review (optional)
                  </label>
                  <textarea
                    value={itemReviewText}
                    onChange={(e) => setItemReviewText(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#231fe5]/50"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#111118] hover:bg-gray-50"
                    disabled={isSubmittingItemReview}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleItemReviewSubmit}
                    className="px-4 py-2 rounded-lg bg-[#231fe5] text-white text-sm font-semibold shadow-sm hover:bg-[#1c19c8] disabled:opacity-60"
                    disabled={isSubmittingItemReview}
                  >
                    {isSubmittingItemReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pay Per Hour Modal */}
        {isPayPerHourPortalReady && isPayPerHourModalOpen
          ? createPortal(
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/50">
                <div
                  className="absolute inset-0"
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
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          Pay Per Hour Session
                        </h2>
                        <p className="text-sm text-blue-100">
                          Personalised 1:1 guidance with {payPerHourDisplayName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPayPerHourModalOpen(false)}
                        className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                        aria-label="Close pay per hour details"
                      >
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="overflow-y-auto px-6 pb-6 pt-4">
                      <div className="flex items-start gap-3 rounded-xl border border-[#231fe5]/20 bg-[#231fe5]/5 p-4">
                        <FaMoneyBillWave className="mt-1 h-5 w-5 text-[#231fe5]" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#231fe5]">
                            Hourly rate
                          </p>
                          <p className="text-3xl font-bold text-[#111118]">
                            ₹
                            {payPerHourFeeValue.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            per hour session with {payPerHourDisplayName}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3">
                        {payPerHourSpecializations && (
                          <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Specialisations
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {payPerHourSpecializations}
                            </p>
                          </div>
                        )}
                        {payPerHourSubjects && (
                          <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Subjects covered
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {payPerHourSubjects}
                            </p>
                          </div>
                        )}
                        {educatorData?.yoe && (
                          <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                            <FaClock className="mt-1 h-4 w-4 text-[#231fe5]" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Experience
                              </p>
                              <p className="text-sm text-gray-700">
                                {educatorData.yoe}+ years of
                                mentoring students
                              </p>
                            </div>
                          </div>
                        )}
                        {payPerHourDescription && (
                          <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Session overview
                            </p>
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
                            Email{" "}
                            {payPerHourDisplayName.split(" ")[0] || "Educator"}
                          </a>
                        )}
                        {!payPerHourWhatsAppLink && !payPerHourEmailLink && (
                          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
                            Contact details are currently unavailable. Please
                            try connecting via the follow button instead.
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
              document.body,
            )
          : null}
      </div>
    </div>
  );
};

export default ViewProfile;
