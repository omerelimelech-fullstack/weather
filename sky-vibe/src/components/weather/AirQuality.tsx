import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

interface AirQualityProps {
    aqi: number;
}

export default function AirQuality({ aqi }: AirQualityProps) {
    // Determine AQI Level
    const getLevel = (aqi: number) => {
        if (aqi <= 20) return { label: 'Good', color: 'text-green-400' };
        if (aqi <= 40) return { label: 'Fair', color: 'text-yellow-400' };
        if (aqi <= 60) return { label: 'Moderate', color: 'text-orange-400' };
        if (aqi <= 80) return { label: 'Poor', color: 'text-red-400' };
        if (aqi <= 100) return { label: 'Very Poor', color: 'text-purple-400' };
        return { label: 'Hazardous', color: 'text-rose-900' };
    };

    const level = getLevel(aqi);
    const percentage = Math.min(Math.max((aqi / 100) * 100, 5), 100); // Clamp between 5% and 100%

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-lg"
        >
            <div className="flex items-center gap-2 mb-4">
                <Wind className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Air Quality</span>
            </div>

            <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-light text-white">{aqi}</span>
                <span className={`text-lg font-medium ${level.color}`}>{level.label}</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
                <div
                    className="absolute inset-0 w-full h-full opacity-30"
                    style={{
                        background: 'linear-gradient(90deg, #4ade80 0%, #facc15 40%, #f87171 100%)'
                    }}
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white relative z-10 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                />
            </div>
            <p className="text-right text-xs text-white/40 mt-1">European AQI</p>
        </motion.div>
    );
}
