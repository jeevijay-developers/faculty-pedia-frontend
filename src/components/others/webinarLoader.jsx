"use client";

const shimmer = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";

const Bar = ({ className = "" }) => (
	<div className={`rounded-md ${shimmer} animate-pulse ${className}`} />
);

const InfoRow = () => (
	<div className="space-y-3">
		{Array.from({ length: 4 }).map((_, idx) => (
			<div key={idx} className="flex items-center justify-between">
				<Bar className="h-4 w-28" />
				<Bar className="h-4 w-40" />
			</div>
		))}
	</div>
);

const PillRow = ({ count = 4 }) => (
	<div className="flex flex-wrap gap-2">
		{Array.from({ length: count }).map((_, idx) => (
			<Bar key={idx} className="h-8 w-20" />
		))}
	</div>
);

const WebinarLoader = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* Banner */}
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
							<Bar className="h-6 w-2/3" />
							<Bar className="h-4 w-full" />
							<Bar className="h-4 w-5/6" />
							<InfoRow />
							<PillRow />
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
							<Bar className="h-5 w-32" />
							<div className="relative aspect-video rounded-lg bg-gray-100 overflow-hidden">
								<div className={`${shimmer} absolute inset-0 animate-pulse`} />
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Bar className="h-4 w-full" />
								<Bar className="h-4 w-full" />
								<Bar className="h-4 w-full" />
								<Bar className="h-4 w-full" />
							</div>
						</div>
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

						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
							<Bar className="h-5 w-32" />
							<Bar className="h-4 w-full" />
							<Bar className="h-4 w-5/6" />
							<Bar className="h-4 w-2/3" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WebinarLoader;
