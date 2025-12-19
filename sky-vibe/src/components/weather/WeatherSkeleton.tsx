import Skeleton from '@/components/ui/Skeleton';

export default function WeatherSkeleton() {
    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Search Bar Skeleton */}
            <Skeleton className="h-14 w-full max-w-md mx-auto rounded-2xl" />

            {/* Current Weather Skeleton */}
            <div className="flex flex-col items-center">
                <Skeleton className="h-8 w-48 mb-4" /> {/* Date */}
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-40" /> {/* Location */}
                    <Skeleton className="w-32 h-32 rounded-full" /> {/* Icon */}
                    <Skeleton className="h-24 w-40" /> {/* Temp */}
                    <Skeleton className="h-6 w-32" /> {/* Condition */}
                </div>
            </div>

            {/* Hourly Forecast Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-16 shrink-0" />
                    ))}
                </div>
            </div>

            {/* Details Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>

            {/* Daily Forecast Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
