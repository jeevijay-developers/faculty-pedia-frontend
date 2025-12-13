"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FiMail, FiMessageSquare } from "react-icons/fi";
import { getStudentNotifications } from "@/components/server/student/student.routes";

const extractEducatorId = (entry) => {
	if (!entry) {
		return null;
	}

	const rawId =
		entry?.educatorId?._id ??
		entry?.educatorId?.id ??
		entry?.educatorId ??
		entry?._id ??
		entry?.id ??
		null;

	return rawId ? String(rawId) : null;
};

const getNotificationEducatorId = (notification) => {
	if (!notification) {
		return null;
	}

	const rawId =
		notification?.educator?.id ??
		notification?.educator?._id ??
		notification?.metadata?.educatorId ??
		notification?.metadata?.educatorID ??
		notification?.sender?._id ??
		notification?.sender?.id ??
		null;

	return rawId ? String(rawId) : null;
};

const formatTimestamp = (value) => {
	if (!value) {
		return "";
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
};

const getInitials = (name) => {
	if (!name) {
		return "E";
	}

	const parts = name.trim().split(" ");
	if (parts.length === 1) {
		return parts[0].charAt(0).toUpperCase();
	}

	return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const MessagesTab = ({ studentId, followingEducators = [] }) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const followedEducatorIds = useMemo(() => {
		if (!Array.isArray(followingEducators)) {
			return new Set();
		}

		const ids = followingEducators
			.map((entry) => extractEducatorId(entry))
			.filter(Boolean);

		return new Set(ids);
	}, [followingEducators]);

	useEffect(() => {
		let isMounted = true;

		const loadMessages = async () => {
			if (!studentId) {
				return;
			}

			try {
				setLoading(true);
				setError(null);

				const response = await getStudentNotifications(studentId, {
					limit: 100,
					type: "broadcast_message",
				});

				if (!isMounted) {
					return;
				}

				const notifications = Array.isArray(response?.notifications)
					? response.notifications
					: [];

				const filtered = notifications
					.filter((notification) => notification?.type === "broadcast_message")
					.filter((notification) => {
						if (!followedEducatorIds.size) {
							return true;
						}

						const educatorId = getNotificationEducatorId(notification);
						return educatorId ? followedEducatorIds.has(educatorId) : false;
					})
					.sort((a, b) => {
						const dateA = new Date(a?.createdAt || 0).getTime();
						const dateB = new Date(b?.createdAt || 0).getTime();
						return dateB - dateA;
					});

				setMessages(filtered);
			} catch (err) {
				if (!isMounted) {
					return;
				}

				const message =
					err?.response?.data?.message || err?.message || "Failed to load messages";
				setError(message);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadMessages();

		return () => {
			isMounted = false;
		};
	}, [studentId, followedEducatorIds]);

	const renderAvatar = (message) => {
		const educatorName = message?.educatorName || "Educator";
		const avatarUrl = message?.educator?.avatar || null;

		if (avatarUrl) {
			return (
				<Image
					src={avatarUrl}
					alt={educatorName}
					width={40}
					height={40}
					className="h-10 w-10 rounded-full object-cover"
				/>
			);
		}

		return (
			<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold uppercase text-blue-600">
				{getInitials(educatorName)}
			</div>
		);
	};

	const renderContent = () => {
		if (!studentId) {
			return (
				<div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-600">
					Student information is required to load messages.
				</div>
			);
		}

		if (loading) {
			return (
				<div className="space-y-3">
					{[0, 1, 2].map((item) => (
						<div
							key={`message-skeleton-${item}`}
							className="h-20 animate-pulse rounded-2xl bg-gray-100"
						/>
					))}
				</div>
			);
		}

		if (error) {
			return (
				<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
					<p className="text-sm font-medium text-red-600">{error}</p>
					<p className="mt-1 text-xs text-red-500">Please try again in a moment.</p>
				</div>
			);
		}

		if (!messages.length) {
			if (!followedEducatorIds.size) {
				return (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
						<FiMail className="mb-3 h-10 w-10 text-blue-500" />
						<h3 className="text-lg font-semibold text-gray-900">
							Follow educators to receive messages
						</h3>
						<p className="mt-2 text-sm text-gray-600">
							Educators you follow can share announcements and updates. Follow your mentors to stay informed.
						</p>
					</div>
				);
			}

			return (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center">
					<FiMessageSquare className="mb-3 h-10 w-10 text-gray-400" />
					<h3 className="text-lg font-semibold text-gray-900">No messages yet</h3>
					<p className="mt-2 text-sm text-gray-600">
						When your educators send announcements, they will appear here.
					</p>
				</div>
			);
		}

		return (
			<ul className="space-y-4">
				{messages.map((message, index) => {
					const messageId = String(message?.id ?? message?._id ?? index);
					const educatorName = message?.educatorName || "Educator";
					const createdAt = formatTimestamp(message?.createdAt);

					return (
						<li
							key={messageId}
							className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow"
						>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
								<div>{renderAvatar(message)}</div>
								<div className="flex-1 space-y-1">
									<div className="flex flex-wrap items-center gap-2">
										<p className="text-sm font-semibold text-gray-900">{educatorName}</p>
										{createdAt && (
											<span className="text-xs text-gray-500">{createdAt}</span>
										)}
									</div>

									{message?.title && (
										<p className="text-sm font-semibold text-gray-800">{message.title}</p>
									)}

									{message?.message && (
										<p className="text-sm text-gray-600 whitespace-pre-line">
											{message.message}
										</p>
									)}

									{message?.metadata?.summary && (
										<p className="text-xs text-gray-500">
											{message.metadata.summary}
										</p>
									)}
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
			<div className="flex flex-col gap-2 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-900">Messages</h2>
					<p className="mt-1 text-sm text-gray-500">
						Broadcast announcements sent by educators you follow.
					</p>
				</div>
				{messages.length > 0 && (
					<span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
						<FiMail className="h-4 w-4" />
						{messages.length === 1 ? "1 message" : `${messages.length} messages`}
					</span>
				)}
			</div>
			<div className="p-6">{renderContent()}</div>
		</div>
	);
};

export default MessagesTab;
