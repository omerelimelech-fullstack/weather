import { motion } from 'framer-motion';
import WeatherIcon, { getWeatherInfo } from '@/components/weather/WeatherIcon';
import { MapPin } from 'lucide-react';

interface CurrentWeatherProps {
    data: any; // Using any for now as the weather data structure is complex, but could be typed
    location: {
        name: string;
        country: string;
    };
}

export default function CurrentWeather({ data, location }: CurrentWeatherProps) {
    const { label } = getWeatherInfo(data.current.weather_code);
    const temp = Math.round(data.current.temperature_2m);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center py-6"
        >
            {/* Location */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-2 mb-2"
            >
                <MapPin className="w-4 h-4 text-white/70" />
                <span className="text-white/90 font-medium text-lg">
                    {location.name}{location.country ? `, ${location.country}` : ''}
                </span>
            </motion.div>

            {/* Main Info: Icon + Temp */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-row items-center justify-center gap-8 py-2"
            >
                {/* Weather Icon */}
                <div className="relative">
                    <div className="absolute inset-0 blur-3xl bg-white/30 rounded-full scale-125 animate-pulse" />
                    <WeatherIcon
                        code={data.current.weather_code}
                        size="2xl"
                        className="text-white relative z-10 drop-shadow-2xl"
                        animate={true}
                    />
                </div>

                {/* Temperature */}
                <div className="flex items-start">
                    <span className="text-7xl md:text-8xl font-thin text-white leading-none tracking-tighter">
                        {temp}
                    </span>
                    <span className="text-4xl md:text-5xl font-thin text-white/70 mt-2">°</span>
                </div>
            </motion.div>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-2xl font-thin tracking-wide mb-2"
            >
                {label}
            </motion.p>

            {/* High / Low */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-4 text-white/70"
            >
                <span className="text-sm">
                    H: {Math.round(data.daily.temperature_2m_max[0])}°
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-sm">
                    L: {Math.round(data.daily.temperature_2m_min[0])}°
                </span>
            </motion.div>
        </motion.div>
    );
}