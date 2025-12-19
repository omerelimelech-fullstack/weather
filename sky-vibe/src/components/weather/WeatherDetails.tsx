import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Sun, type LucideIcon } from 'lucide-react';

interface DetailCardProps {
    icon: LucideIcon;
    label: string;
    value: number | string;
    unit: string;
    delay: number;
}

function DetailCard({ icon: Icon, label, value, unit, delay }: DetailCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30
                      group-hover:bg-white/25 transition-all duration-300 shadow-lg shadow-black/5" />
            <div className="relative p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-white/60" />
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                        {label}
                    </span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-thin text-white">{value}</span>
                    <span className="text-base font-light text-white/70">{unit}</span>
                </div>
            </div>
        </motion.div>
    );
}

interface WeatherDetailsProps {
    data: any;
}

export default function WeatherDetails({ data }: WeatherDetailsProps) {
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = Math.round(data.current.wind_speed_10m);
    const feelsLike = Math.round(data.current.apparent_temperature);

    // Simulate UV Index based on time of day and cloud cover
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour <= 18;
    const cloudCover = data.current.cloud_cover || 0;
    const baseUV = isDay ? (hour >= 10 && hour <= 14 ? 8 : 4) : 0;
    const uvIndex = Math.max(0, Math.round(baseUV * (1 - cloudCover / 100)));

    const details = [
        { icon: Droplets, label: 'Humidity', value: humidity, unit: '%' },
        { icon: Wind, label: 'Wind', value: windSpeed, unit: 'km/h' },
        { icon: Thermometer, label: 'Feels Like', value: feelsLike, unit: '°' },
        { icon: Sun, label: 'UV Index', value: uvIndex, unit: uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Mod' : 'High' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-4"
        >
            <div className="grid grid-cols-2 gap-3">
                {details.map((detail, idx) => (
                    <DetailCard
                        key={detail.label}
                        {...detail}
                        delay={0.5 + idx * 0.1}
                    />
                ))}
            </div>
        </motion.div>
    );
}