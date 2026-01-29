"use client";

const shimmer = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";

const Bar = ({ className = "" }) => (
	<div className={`rounded-md ${shimmer} animate-pulse ${className}`} />
);

const InfoGrid = () => (
	<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
		{Array.from({ length: 4 }).map((_, idx) => (
			<div
				key={idx}
				className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
			>
				<Bar className="h-4 w-24" />
				<Bar className="h-4 w-16" />
			</div>
		))}
	</div>
);

const ListSection = ({ rows = 5 }) => (
	<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
		<Bar className="h-5 w-32" />
		{Array.from({ length: rows }).map((_, idx) => (
			<Bar key={idx} className="h-4 w-full" />
		))}
	</div>
);

const TestSeriesLoader = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* Hero banner */}
				<div className="relative overflow-hidden rounded-2xl h-48 bg-gray-200">
					<div className={`${shimmer} absolute inset-0 animate-pulse`} />
					<div className="absolute inset-0 flex flex-col justify-center px-6 space-y-3">
						<Bar className="h-8 w-2/3" />
						<Bar className="h-4 w-1/2" />
						<Bar className="h-4 w-1/3" />
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main content */}
					<div className="lg:col-span-2 space-y-6">
						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
							<Bar className="h-6 w-3/4" />
							<Bar className="h-4 w-full" />
							<Bar className="h-4 w-5/6" />
							<InfoGrid />
						</div>

						<ListSection rows={6} />
						<ListSection rows={5} />
					</div>

					{/* Sidebar */}
					<div className="space-y-4">
						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
							<Bar className="h-5 w-24" />
							<Bar className="h-10 w-32" />
							<Bar className="h-4 w-1/2" />
							<Bar className="h-10 w-full" />
							<Bar className="h-4 w-3/4" />
						</div>

						<ListSection rows={4} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestSeriesLoader;
