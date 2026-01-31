import React from "react";

const SkeletonChipRow = () => (
	<div className="flex flex-wrap gap-3">
		{[...Array(5)].map((_, idx) => (
			<div
				key={idx}
				className="h-6 w-20 rounded-full bg-gray-200 animate-pulse"
			/>
		))}
	</div>
);

const SkeletonCard = ({ tall = false }) => (
	<div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
		<div
			className={`w-full rounded-xl bg-gray-200 animate-pulse ${
				tall ? "h-36" : "h-28"
			}`}
		/>
		<div className="mt-4 space-y-3">
			<div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse" />
			<div className="h-3 w-1/2 rounded-full bg-gray-200 animate-pulse" />
			<div className="h-3 w-2/3 rounded-full bg-gray-200 animate-pulse" />
		</div>
	</div>
);

const SkeletonSection = ({ titleWidth = "w-32", tallCards = false }) => (
	<div className="space-y-4">
		<div className={`h-7 ${titleWidth} rounded-full bg-gray-200 animate-pulse`} />
		<SkeletonChipRow />
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{[...Array(4)].map((_, idx) => (
				<SkeletonCard key={idx} tall={tallCards} />
			))}
		</div>
	</div>
);

const ExamIITJEELoader = () => {
	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
					<div className="h-52 bg-gradient-to-r from-blue-50 via-gray-100 to-blue-100 animate-pulse" />
					<div className="absolute inset-0 flex flex-col justify-center space-y-4 px-8 sm:px-12">
						<div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
						<div className="h-10 w-48 rounded-full bg-gray-200 animate-pulse" />
						<div className="h-4 w-3/4 max-w-xl rounded-full bg-gray-200 animate-pulse" />
						<SkeletonChipRow />
						<div className="flex gap-3">
							<div className="h-10 w-32 rounded-full bg-gray-200 animate-pulse" />
							<div className="h-10 w-32 rounded-full bg-gray-200 animate-pulse" />
						</div>
					</div>
				</div>

				<SkeletonSection titleWidth="w-40" tallCards />
				<SkeletonSection titleWidth="w-48" />
				<SkeletonSection titleWidth="w-44" />
				<SkeletonSection titleWidth="w-36" />
				<SkeletonSection titleWidth="w-40" tallCards />
			</div>
		</div>
	);
};

export default ExamIITJEELoader;
