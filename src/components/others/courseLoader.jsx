"use client";

const shimmer = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";

const Bar = ({ className = "" }) => (
	<div className={`rounded-md ${shimmer} animate-pulse ${className}`} />
);

const StatGrid = () => (
	<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
		{Array.from({ length: 4 }).map((_, idx) => (
			<div
				key={idx}
				className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm"
			>
				<div className="h-10 w-10 mx-auto rounded-full bg-gray-200 mb-3" />
				<Bar className="h-6 w-16 mx-auto mb-1" />
				<Bar className="h-3 w-20 mx-auto" />
			</div>
		))}
	</div>
);

const CardList = ({ count = 2 }) => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{Array.from({ length: count }).map((_, idx) => (
			<div
				key={idx}
				className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4"
			>
				<Bar className="h-5 w-2/3" />
				<Bar className="h-4 w-1/2" />
				<Bar className="h-40 w-full" />
				<Bar className="h-4 w-1/3" />
				<div className="grid grid-cols-2 gap-3">
					<Bar className="h-10 w-full" />
					<Bar className="h-10 w-full" />
				</div>
			</div>
		))}
	</div>
);

const VideoSection = () => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{Array.from({ length: 2 }).map((_, idx) => (
			<div
				key={idx}
				className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3"
			>
				<Bar className="h-5 w-1/2" />
				<div className="relative aspect-video rounded-lg bg-gray-100 overflow-hidden">
					<div className={`${shimmer} absolute inset-0 animate-pulse`} />
				</div>
			</div>
		))}
	</div>
);

const CourseLoader = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto p-4 space-y-6">
				{/* Header */}
				<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
					<Bar className="h-8 w-1/2" />
					<Bar className="h-4 w-2/3" />
					<div className="flex flex-wrap gap-2">
						{Array.from({ length: 4 }).map((_, idx) => (
							<Bar key={idx} className="h-6 w-20" />
						))}
					</div>
				</div>

				{/* Stats */}
				<StatGrid />

				{/* Video sections */}
				<VideoSection />

				{/* Features */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
						<Bar className="h-5 w-40" />
						{Array.from({ length: 6 }).map((_, idx) => (
							<Bar key={idx} className="h-4 w-full" />
						))}
					</div>
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
						<Bar className="h-5 w-32" />
						{Array.from({ length: 5 }).map((_, idx) => (
							<Bar key={idx} className="h-4 w-full" />
						))}
					</div>
				</div>

				{/* Live classes / tests cards */}
				<CardList count={2} />

				{/* Sidebar pricing mock */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3"></div>
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
						<Bar className="h-6 w-1/3" />
						<Bar className="h-8 w-1/2" />
						<Bar className="h-4 w-2/3" />
						<Bar className="h-10 w-full" />
						<Bar className="h-4 w-1/2" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseLoader;
