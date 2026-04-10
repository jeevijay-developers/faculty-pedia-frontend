"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function TestResultSlugPage() {
	const params = useParams();
	const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
			<div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 text-center">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Test submitted successfully</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					Your answers for test <span className="font-semibold">{slug || "unknown"}</span> have been received.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link
						href="/test-series"
						className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Browse more tests
					</Link>
					<Link
						href="/profile"
						className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
					>
						Go to profile
					</Link>
				</div>
			</div>
		</div>
	);
}
