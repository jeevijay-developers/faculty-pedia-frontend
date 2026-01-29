"use client";

const shimmer = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";

const Bar = ({ className = "" }) => (
	<div className={`rounded-md ${shimmer} animate-pulse ${className}`} />
);

const CardGrid = ({ count = 3 }) => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{Array.from({ length: count }).map((_, idx) => (
			<div
				key={idx}
				className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
			>
				<div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-gray-100">
					<div className={`${shimmer} absolute inset-0 animate-pulse`} />
				</div>
				<Bar className="h-4 w-3/4 mb-2" />
				<Bar className="h-4 w-1/2 mb-4" />
				<div className="flex items-center gap-2">
					<div className="h-10 w-10 rounded-full bg-gray-200" />
					<div className="flex-1 space-y-2">
						<Bar className="h-3 w-1/2" />
						<Bar className="h-3 w-1/3" />
					</div>
				</div>
			</div>
		))}
	</div>
);

const ViewProfileLoader = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
				{/* Top section */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Profile card */}
					<div className="lg:col-span-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex flex-col items-center text-center gap-4">
							<div className="relative">
								<div className="h-28 w-28 rounded-full bg-gray-200" />
								<div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-gray-300 border-2 border-white" />
							</div>
							<div className="space-y-2 w-full">
								<Bar className="h-4 w-2/3 mx-auto" />
								<Bar className="h-3 w-1/2 mx-auto" />
							</div>
							<div className="flex flex-col gap-2 w-full">
								<div className="flex items-center gap-2 justify-center">
									<Bar className="h-3 w-16" />
									<Bar className="h-3 w-10" />
								</div>
								<Bar className="h-10 w-full" />
								<Bar className="h-10 w-full" />
							</div>
						</div>
					</div>

					{/* Details + chips */}
					<div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
						<Bar className="h-6 w-2/3" />
						<Bar className="h-4 w-1/2" />
						<div className="grid grid-cols-2 gap-3">
							<Bar className="h-12 w-full" />
							<Bar className="h-12 w-full" />
							<Bar className="h-12 w-full" />
							<Bar className="h-12 w-full" />
						</div>
						<div className="flex flex-wrap gap-2">
							{Array.from({ length: 6 }).map((_, idx) => (
								<Bar key={idx} className="h-7 w-20" />
							))}
						</div>
					</div>

					{/* Videos */}
					<div className="lg:col-span-3 space-y-4">
						<div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm h-full flex flex-col gap-3">
							<Bar className="h-4 w-1/2" />
							<div className="flex-1 rounded-lg bg-gray-100 relative overflow-hidden">
								<div className={`${shimmer} absolute inset-0 animate-pulse`} />
							</div>
							<div className="flex-1 rounded-lg bg-gray-100 relative overflow-hidden">
								<div className={`${shimmer} absolute inset-0 animate-pulse`} />
							</div>
						</div>
					</div>
				</div>

				{/* Courses skeleton */}
				<div className="space-y-4">
					<Bar className="h-6 w-40" />
					<CardGrid count={3} />
				</div>

				{/* Webinars skeleton */}
				<div className="space-y-4">
					<Bar className="h-6 w-48" />
					<CardGrid count={3} />
				</div>

				{/* Test series skeleton */}
				<div className="space-y-4">
					<Bar className="h-6 w-52" />
					<CardGrid count={3} />
				</div>
			</div>
		</div>
	);
};

export default ViewProfileLoader;
