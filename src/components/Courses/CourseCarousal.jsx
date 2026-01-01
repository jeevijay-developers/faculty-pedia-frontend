"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import CourseCard from "@/components/Courses/CourseCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import Loading from "../Common/Loading";
import { getCoursesBySpecialization } from "../server/course.routes";
import {
  getEducatorProfile,
  getEducatorsBySpecialization,
  getAllEducators,
} from "../server/educators.routes";
import CarouselFallback from "../Common/CarouselFallback";

const CourseCarousel = ({
  title = "Our Top Courses",
  viewMoreLink = "/courses",
  specialization = "All", // New prop for filtering by specialization
  autoplay = true,
}) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [coursesToRender, setCoursesToRender] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  const isValidObjectId = (value) =>
    typeof value === "string" && /^[a-f\d]{24}$/i.test(value.trim());

  const normalizeId = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return value.trim();
    }

    if (typeof value === "object" && typeof value.toString === "function") {
      return value.toString().trim();
    }

    return "";
  };

  const deriveEducatorCandidate = (course) =>
    course.educator ||
    course.educatorID ||
    course.educatorId ||
    course.creator ||
    course.instructor;

  const deriveEducatorName = (educatorObj, course) => {
    if (educatorObj && typeof educatorObj === "object") {
      const nameFromObj =
        educatorObj.fullName || educatorObj.name || educatorObj.username || "";
      if (nameFromObj) {
        return nameFromObj;
      }
    }

    const fallbackName =
      course.educatorName ||
      course.educatorFullName ||
      course.creatorName ||
      course.instructorName ||
      (typeof course.educator === "string" ? course.educator : "") ||
      (typeof course.educatorId === "string" ? course.educatorId : "") ||
      (typeof course.educatorID === "string" ? course.educatorID : "");

    if (typeof fallbackName === "string") {
      const trimmed = fallbackName.trim();
      return trimmed && !isValidObjectId(trimmed) ? trimmed : "";
    }

    return "";
  };

  const enrichCoursesWithEducators = async (
    courses = [],
    specializationFilter = "All"
  ) => {
    if (!Array.isArray(courses) || courses.length === 0) {
      return [];
    }

    const educatorIdSet = new Set();
    const educatorCache = new Map();

    courses.forEach((course) => {
      const educatorCandidate = deriveEducatorCandidate(course);
      if (
        educatorCandidate &&
        typeof educatorCandidate === "object" &&
        educatorCandidate._id
      ) {
        const normalizedCandidateId = normalizeId(educatorCandidate._id);
        if (normalizedCandidateId) {
          educatorCache.set(normalizedCandidateId, educatorCandidate);
        }
      }

      const educatorName = deriveEducatorName(educatorCandidate, course);

      if (!educatorName) {
        const idCandidate = normalizeId(
          (typeof educatorCandidate === "string" && educatorCandidate) ||
            (typeof course.educatorID === "string" && course.educatorID) ||
            (typeof course.educatorId === "string" && course.educatorId) ||
            educatorCandidate?._id ||
            ""
        );

        if (isValidObjectId(idCandidate)) {
          educatorIdSet.add(idCandidate);
        }
      }
    });

    const idsNeedingLookup = new Set();

    educatorIdSet.forEach((id) => {
      const cached = educatorCache.get(id);
      if (!cached) {
        idsNeedingLookup.add(id);
        return;
      }

      const cachedName = deriveEducatorName(cached, {});
      if (!cachedName) {
        idsNeedingLookup.add(id);
      }
    });

    const populateCacheFromList = (educatorList = []) => {
      if (!Array.isArray(educatorList)) {
        return;
      }
      educatorList.forEach((educator) => {
        const normalizedId = normalizeId(educator?._id || educator?.id);
        if (normalizedId) {
          educatorCache.set(normalizedId, educator);
          idsNeedingLookup.delete(normalizedId);
        }
      });
    };

    if (idsNeedingLookup.size > 0) {
      try {
        let batchResponse;
        if (
          specializationFilter &&
          typeof specializationFilter === "string" &&
          specializationFilter !== "All"
        ) {
          batchResponse = await getEducatorsBySpecialization(
            specializationFilter,
            {
              limit: Math.max(50, idsNeedingLookup.size * 2),
              page: 1,
            }
          );
        } else {
          batchResponse = await getAllEducators({
            limit: Math.max(100, idsNeedingLookup.size * 2),
            page: 1,
          });
        }

        const educatorsFromBatch =
          batchResponse?.data?.educators ||
          batchResponse?.educators ||
          batchResponse?.data ||
          [];

        populateCacheFromList(educatorsFromBatch);
      } catch (batchError) {
        console.warn(
          "Failed to fetch educator batch",
          specializationFilter,
          batchError?.message || batchError
        );
      }
    }

    if (idsNeedingLookup.size > 0) {
      const requests = Array.from(idsNeedingLookup).map(async (id) => {
        try {
          const response = await getEducatorProfile(id);
          const educatorData =
            response?.data?.educator || response?.educator || response || null;

          if (educatorData) {
            educatorCache.set(id, educatorData);
          }
        } catch (err) {
          console.warn("Failed to fetch educator", id, err?.message || err);
        }
      });

      await Promise.allSettled(requests);
    }

    return courses.map((course) => {
      const educatorCandidate = deriveEducatorCandidate(course);
      const educatorIdFromCourse = normalizeId(
        (typeof course.educatorID === "string" && course.educatorID) ||
          (typeof course.educatorId === "string" && course.educatorId) ||
          (typeof educatorCandidate === "string" && educatorCandidate) ||
          educatorCandidate?._id ||
          ""
      );

      const cachedEducator =
        (typeof educatorCandidate === "object" && educatorCandidate) ||
        educatorCache.get(educatorIdFromCourse) ||
        null;

      const resolvedEducator = cachedEducator || educatorCandidate || null;
      const resolvedName = deriveEducatorName(resolvedEducator, course);

      const profilePicture =
        (resolvedEducator &&
          (resolvedEducator.profilePicture?.url ||
            resolvedEducator.profilePicture)) ||
        course.educatorProfilePicture ||
        course.educatorPhoto ||
        null;

      return {
        ...course,
        educator: resolvedEducator,
        educatorID:
          resolvedEducator?._id ||
          course.educatorID ||
          course.educatorId ||
          educatorIdFromCourse,
        educatorName: resolvedName,
        educatorProfilePicture: profilePicture,
      };
    });
  };

  useEffect(() => {
    const fetchOnlineCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCoursesBySpecialization(specialization);

        // Handle different response structures
        let courses = [];
        if (response?.data?.courses && Array.isArray(response.data.courses)) {
          courses = response.data.courses;
        } else if (response?.courses && Array.isArray(response.courses)) {
          courses = response.courses;
        } else if (Array.isArray(response)) {
          courses = response;
        }

        const activeCourses = courses.filter((course) => {
          const status = (course?.status || "").toLowerCase();
          const explicitInactive =
            course?.isActive === false || course?.active === false;
          const flaggedDeleted =
            course?.isDeleted || course?.deletedAt || course?.deleted === true;
          return (
            !!course &&
            !!(course._id || course.id || course.slug) &&
            !explicitInactive &&
            !flaggedDeleted &&
            status !== "deleted" &&
            status !== "inactive"
          );
        });

        const enrichedCourses = await enrichCoursesWithEducators(
          activeCourses,
          specialization
        );
        setCoursesToRender(enrichedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError(error.message || "Failed to load courses");
        setCoursesToRender([]);
      } finally {
        setLoading(false);
      }
    };

    if (specialization) {
      fetchOnlineCourse();
    }
  }, [specialization]);

  if (loading) {
    return <Loading />;
  }

  // Show error state if there was an error
  if (error) {
    return (
      <CarouselFallback
        type="courses"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        actionText="Browse Courses"
        message={error}
      />
    );
  }

  // Show fallback if no courses found
  if (!coursesToRender || coursesToRender.length === 0) {
    return (
      <CarouselFallback
        type="courses"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        actionText="Browse Courses"
      />
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-row justify-between items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {title}
          </h2>

          <Link
            href={viewMoreLink}
            className="bg-white text-gray-700 px-3 py-1 xs:px-4 xs:py-2 sm:px-6 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
          >
            View More
          </Link>
        </div>

        {/* Carousel Container */}

        <div className="relative">
          {/* Navigation Buttons */}
          {coursesToRender.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                aria-label="Previous slide"
                style={{ left: "-1rem" }}
              >
                <RiArrowLeftSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                aria-label="Next slide"
                style={{ right: "-1rem" }}
              >
                <RiArrowRightSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>
            </>
          )}

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={
              autoplay && coursesToRender.length > 1
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            loop={coursesToRender.length > 1}
            className="course-carousel"
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {coursesToRender.map((course, idx) => (
              <SwiperSlide key={course._id || course.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="h-full"
                >
                  <CourseCard
                    course={{
                      ...course,
                      totalWeeks: course.classDuration,
                      startDate: course.startDate,
                      _id: course._id,
                    }}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CourseCarousel;
