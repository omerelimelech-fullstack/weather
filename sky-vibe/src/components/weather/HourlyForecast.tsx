import { motion } from 'framer-motion';
import WeatherIcon from '@/components/weather/WeatherIcon';
import { format, parseISO } from 'date-fns';

interface HourlyForecastProps {
    data: any;
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
    // Get current time to filter next 24 hours
    const currentHour = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

    const allTimes = data.hourly.time as string[];
    const allTemps = data.hourly.temperature_2m as number[];
    const allCodes = data.hourly.weather_code as number[];

    // Find start index
    const startIndex = allTimes.findIndex((t) => t.startsWith(currentHour));
    const safeStartIndex = startIndex === -1 ? 0 : startIndex;

    // Slice next 24 hours
    const next24Times = allTimes.slice(safeStartIndex, safeStartIndex + 24);
    const next24Temps = allTemps.slice(safeStartIndex, safeStartIndex + 24);
    const next24Codes = allCodes.slice(safeStartIndex, safeStartIndex + 24);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full mb-8 relative"
        >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg shadow-black/5" />

            <div className="relative p-4">
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3 pl-2">
                    Hourly Forecast
                </h3>

                <div className="flex overflow-x-auto pb-2 gap-4 scrollbar-hide">
                    {next24Times.map((time, idx) => {
                        const date = parseISO(time);
                        return (
                            <motion.div
                                key={time}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.05 }}
                                className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[60px]"
                            >
                                <span className="text-sm text-white/70">
                                    {format(date, 'HH:mm')}
                                </span>

                                <WeatherIcon
                                    code={next24Codes[idx]}
                                    size="md"
                                    className="text-white drop-shadow-md"
                                />

                                <span className="text-lg font-medium text-white">
                                    {Math.round(next24Temps[idx])}°
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
