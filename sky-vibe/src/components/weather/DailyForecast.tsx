import { motion } from 'framer-motion';
import WeatherIcon from '@/components/weather/WeatherIcon';
import { format, parseISO } from 'date-fns';

interface DailyForecastProps {
    data: any;
}

export default function DailyForecast({ data }: DailyForecastProps) {
    const days: string[] = data.daily.time.slice(0, 7);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-4 mt-8"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-lg shadow-black/5" />
                <div className="relative p-5">
                    <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-4 h-px bg-white/30" />
                        7-Day Forecast
                    </h3>

                    <div className="space-y-1">
                        {days.map((day, idx) => {
                            const date = parseISO(day);
                            const isToday = idx === 0;
                            const weatherCode = data.daily.weather_code[idx];
                            const maxTemp = Math.round(data.daily.temperature_2m_max[idx]);
                            const minTemp = Math.round(data.daily.temperature_2m_min[idx]);

                            // Calculate bar position
                            const allMaxTemps: number[] = data.daily.temperature_2m_max.slice(0, 7);
                            const allMinTemps: number[] = data.daily.temperature_2m_min.slice(0, 7);
                            const weekMax = Math.max(...allMaxTemps);
                            const weekMin = Math.min(...allMinTemps);
                            const range = weekMax - weekMin;

                            const leftPos = ((minTemp - weekMin) / range) * 100;
                            const barWidth = ((maxTemp - minTemp) / range) * 100;

                            return (
                                <motion.div
                                    key={day}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + idx * 0.05 }}
                                    className="flex items-center py-3 border-b border-white/10 last:border-0"
                                >
                                    <span className={`w-16 text-sm font-medium ${isToday ? 'text-white' : 'text-white/70'}`}>
                                        {isToday ? 'Today' : format(date, 'EEE')}
                                    </span>

                                    <div className="w-10 flex justify-center">
                                        <WeatherIcon code={weatherCode} size="sm" className="text-white/90" />
                                    </div>

                                    <span className="w-10 text-sm text-white/50 text-right">
                                        {minTemp}°
                                    </span>

                                    <div className="flex-1 mx-3 h-1 bg-white/10 rounded-full relative overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${barWidth}%` }}
                                            transition={{ delay: 0.8 + idx * 0.05, duration: 0.5 }}
                                            className="absolute h-full rounded-full"
                                            style={{
                                                left: `${leftPos}%`,
                                                background: `linear-gradient(90deg, 
                          rgba(96, 165, 250, 0.8) 0%, 
                          rgba(251, 191, 36, 0.8) 50%, 
                          rgba(239, 68, 68, 0.8) 100%)`
                                            }}
                                        />
                                    </div>

                                    <span className="w-10 text-sm text-white font-medium text-right">
                                        {maxTemp}°
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}