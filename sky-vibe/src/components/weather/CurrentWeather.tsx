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
            className="text-center py-8"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-2 mb-4"
            >
                <MapPin className="w-4 h-4 text-white/70" />
                <span className="text-white/90 font-medium text-lg">
                    {location.name}{location.country ? `, ${location.country}` : ''}
                </span>
            </motion.div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 blur-3xl bg-white/30 rounded-full scale-150 animate-pulse" />
                    <WeatherIcon
                        code={data.current.weather_code}
                        size="2xl"
                        className="text-white relative z-10 drop-shadow-2xl"
                        animate={true}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2"
            >
                <span className="text-[140px] md:text-[180px] font-thin text-white leading-none tracking-tighter">
                    {temp}
                </span>
                <span className="text-5xl md:text-6xl font-thin text-white/70 align-top">°</span>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-2xl font-thin tracking-wide"
            >
                {label}
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center justify-center gap-4 text-white/70"
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