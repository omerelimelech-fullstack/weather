import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { type LocationData } from '@/components/weather/SearchBar';

interface SavedCitiesListProps {
    cities: LocationData[];
    onSelect: (city: LocationData) => void;
    onRemove: (city: LocationData) => void;
}

export default function SavedCitiesList({ cities, onSelect, onRemove }: SavedCitiesListProps) {
    if (cities.length === 0) return null;

    return (
        <div className="w-full mb-6">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 pl-1">
                Saved Locations
            </h3>
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {cities.map((city) => (
                        <motion.div
                            key={`${city.lat}-${city.lon}`}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group flex-shrink-0 relative"
                        >
                            <button
                                onClick={() => onSelect(city)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 
                                           border border-white/10 rounded-full backdrop-blur-md transition-all
                                           active:scale-95"
                            >
                                <span className="text-sm font-medium text-white whitespace-nowrap">
                                    {city.name}
                                </span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(city);
                                }}
                                className="absolute -top-1 -right-1 p-0.5 bg-white/20 hover:bg-red-500/80 
                                           rounded-full backdrop-blur-md transition-colors opacity-0 
                                           group-hover:opacity-100"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
