"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { confirmAlert } from "@/components/CustomAlert";
import { unfollowEducator } from "../server/student/student.routes";

const deriveEducatorName = (educator) => {
  if (!educator || typeof educator !== "object") {
    return "";
  }

  const candidates = [
    educator.name,
    educator.fullName,
    educator.displayName,
    educator.educatorName,
    educator.personalInfo?.fullName,
    educator.personalInfo?.name,
    educator.profile?.fullName,
    educator.profile?.name,
    [educator.firstName, educator.lastName].filter(Boolean).join(" "),
    educator.user?.name,
    [educator.user?.firstName, educator.user?.lastName]
      .filter(Boolean)
      .join(" "),
  ]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value && value.length > 0);

  return candidates[0] || "";
};

const EducatorsTab = ({ followingEducators }) => {
  const router = useRouter();
  const [studentId, setStudentId] = useState(null);
  const [unfollowing, setUnfollowing] = useState({});

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("faculty-pedia-student-data")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setStudentId(parsed?._id || parsed?.id || null);
      }
    } catch (err) {
      console.warn("Failed to derive student id", err);
    }
  }, []);

  const educators = useMemo(() => {
    return followingEducators
      .map((follow) => {
        const educatorData = follow.educatorId || follow;

        if (!educatorData || !educatorData._id) {
          console.warn("Skipping invalid educator data:", follow);
          return null;
        }

        const isValidId = /^[a-f\d]{24}$/i.test(educatorData._id);
        if (!isValidId) {
          console.warn("Invalid educator ID format:", educatorData._id);
          return null;
        }

        return {
          ...educatorData,
          followedAt: follow.followedAt,
        };
      })
      .filter(Boolean);
  }, [followingEducators]);

  const [displayEducators, setDisplayEducators] = useState(educators);

  useEffect(() => {
    setDisplayEducators(educators);
  }, [educators]);

  const handleMessage = (educatorId) => {
    const targetPath = studentId
      ? `/profile/student/${studentId}?tab=messages`
      : "/profile?tab=messages";
    router.push(targetPath);
  };

  const handleUnfollow = async (educatorId) => {
    if (!studentId || !educatorId) {
      toast.error("Missing student or educator information");
      return;
    }

    const confirmed = await confirmAlert({
      title: "Unfollow educator",
      message: "Are you sure you want to unfollow this educator?",
      type: "error",
      confirmText: "Yes, unfollow",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      setUnfollowing((prev) => ({ ...prev, [educatorId]: true }));
      await unfollowEducator(studentId, educatorId);
      setDisplayEducators((prev) => prev.filter((e) => e._id !== educatorId));

      // Update localStorage to sync with educator profile view
      try {
        const raw = window.localStorage.getItem("faculty-pedia-student-data");
        if (raw) {
          const studentData = JSON.parse(raw);
          if (studentData.followingEducators) {
            studentData.followingEducators = studentData.followingEducators.filter(
              (follow) => {
                const followedId = follow.educatorId?._id || follow.educatorId;
                return followedId !== educatorId;
              }
            );
            window.localStorage.setItem(
              "faculty-pedia-student-data",
              JSON.stringify(studentData)
            );
          }
        }
      } catch (storageErr) {
        console.warn("Failed to update localStorage after unfollow:", storageErr);
      }

      toast.success("Unfollowed successfully");
    } catch (err) {
      console.error("Failed to unfollow", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Unable to unfollow"
      );
    } finally {
      setUnfollowing((prev) => {
        const next = { ...prev };
        delete next[educatorId];
        return next;
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Following Educators
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {displayEducators.length} total
          </p>
        </div>
      </div>

      {displayEducators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayEducators.map((educator) => {
            const educatorName = deriveEducatorName(educator);
            const profileImage =
              educator.profileImage?.url || educator.image?.url;
            const educatorId = educator._id;

            if (!educatorId) return null;

            return (
              <div
                key={educatorId}
                className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121b23] p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  {profileImage ? (
                    <div className="relative h-12 w-12 shrink-0">
                      <Image
                        src={profileImage}
                        alt={educatorName || "Educator"}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <FiUser className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/profile/educator/${educatorId}`}
                      className="font-semibold text-gray-900 dark:text-white truncate hover:text-blue-600"
                    >
                      {educatorName || "Educator"}
                    </Link>
                    <p className="text-sm text-gray-500 truncate">
                      {educator.specialization || educator.subject || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {educator.subject && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 font-medium">
                      {educator.subject}
                    </span>
                  )}
                  {educator.followedAt && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 font-medium">
                      Following since{" "}
                      {new Date(educator.followedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <span className="flex items-center gap-1">
                    <FiStar className="h-4 w-4 text-amber-500" />
                    {educator.rating?.average
                      ? educator.rating.average.toFixed(1)
                      : typeof educator.rating === "number"
                      ? educator.rating.toFixed(1)
                      : "N/A"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>
                    {educator.yearsExperience || educator.experience || 0} yrs
                    exp.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMessage(educatorId)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    Message
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnfollow(educatorId)}
                    disabled={!!unfollowing[educatorId]}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-100 disabled:opacity-60"
                  >
                    {unfollowing[educatorId] ? "Unfollowing..." : "Unfollow"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">👥</div>
          <p className="text-gray-500 text-lg mb-2">
            Not following any educators yet
          </p>
          <p className="text-gray-400 text-sm">
            Browse educators and click the follow button to start learning from
            the best!
          </p>
          <Link
            href="/educators"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Educators
          </Link>
        </div>
      )}
    </div>
  );
};

export default EducatorsTab;
