"use client";

const shimmer = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";

const Bar = ({ className = "" }) => (
	<div className={`rounded-md ${shimmer} animate-pulse ${className}`} />
);

const CardRow = ({ count = 4 }) => (
	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{Array.from({ length: count }).map((_, idx) => (
			<div
				key={idx}
				className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
			>
				<div className="relative mb-3 h-32 overflow-hidden rounded-lg bg-gray-100">
					<div className={`${shimmer} absolute inset-0 animate-pulse`} />
				</div>
				<Bar className="h-4 w-3/4 mb-2" />
				<Bar className="h-4 w-1/2 mb-2" />
				<Bar className="h-3 w-1/3" />
			</div>
		))}
	</div>
);

const ExamLoader = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
				{/* Hero banner */}
				<div className="relative overflow-hidden rounded-2xl h-56 sm:h-64 bg-gray-200">
					<div className={`${shimmer} absolute inset-0 animate-pulse`} />
					<div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 space-y-3">
						<Bar className="h-8 w-1/3" />
						<Bar className="h-4 w-2/3" />
						<Bar className="h-4 w-1/2" />
						<div className="flex gap-3 mt-2">
							<Bar className="h-10 w-28" />
							<Bar className="h-10 w-32" />
						</div>
					</div>
				</div>

				{/* Educators */}
				<div className="space-y-4">
					<Bar className="h-6 w-48" />
					<CardRow count={4} />
				</div>

				{/* Courses */}
				<div className="space-y-4">
					<Bar className="h-6 w-56" />
					<CardRow count={4} />
				</div>

				{/* Live classes */}
				<div className="space-y-4">
					<Bar className="h-6 w-60" />
					<CardRow count={3} />
				</div>

				{/* PPH classes */}
				<div className="space-y-4">
					<Bar className="h-6 w-64" />
					<CardRow count={3} />
				</div>

				{/* Webinars */}
				<div className="space-y-4">
					<Bar className="h-6 w-52" />
					<CardRow count={3} />
				</div>

				{/* Test series */}
				<div className="space-y-4">
					<Bar className="h-6 w-56" />
					<CardRow count={3} />
				</div>

				{/* Posts */}
				<div className="space-y-4">
					<Bar className="h-6 w-44" />
					<CardRow count={3} />
				</div>
			</div>
		</div>
	);
};

export default ExamLoader;
