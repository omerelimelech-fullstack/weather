import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LocationData {
    name: string;
    country: string;
    lat: number;
    lon: number;
    admin1?: string;
}

interface SearchBarProps {
    onLocationSelect: (location: LocationData) => void;
    onUseMyLocation: () => void;
    isLoadingLocation: boolean;
    isSaved: boolean;
    onToggleSave: () => void;
}

export default function SearchBar({
    onLocationSelect,
    onUseMyLocation,
    isLoadingLocation,
    isSaved,
    onToggleSave
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
                );
                const data = await res.json();
                setResults(data.results || []);
                setShowResults(true);
            } catch (err) {
                console.error('Geocoding error:', err);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const handleSelect = (location: any) => {
        onLocationSelect({
            name: location.name,
            country: location.country,
            lat: location.latitude,
            lon: location.longitude,
            admin1: location.admin1,
        });
        setQuery('');
        setShowResults(false);
        setResults([]);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md mx-auto">
            <div className="relative">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg shadow-black/5" />
                <div className="relative flex items-center">
                    <div className="absolute left-4 text-white/60">
                        {isSearching ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => results.length > 0 && setShowResults(true)}
                        placeholder="Search city..."
                        className="w-full pl-12 pr-32 py-4 bg-transparent text-white placeholder-white/50 
                       rounded-2xl outline-none text-base font-medium"
                    />

                    {/* Actions Container */}
                    <div className="absolute right-3 flex items-center gap-2">
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery('');
                                    setResults([]);
                                    setShowResults(false);
                                }}
                                className="p-1 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        <div className="h-6 w-px bg-white/20" />

                        <button
                            onClick={onToggleSave}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                            <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-white text-white' : ''}`} />
                        </button>

                        <button
                            onClick={onUseMyLocation}
                            disabled={isLoadingLocation}
                            className="p-2 bg-white/30 hover:bg-white/40 backdrop-blur-sm
                                     rounded-xl transition-all duration-200 disabled:opacity-50 border border-white/20"
                        >
                            {isLoadingLocation ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                            ) : (
                                <MapPin className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showResults && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                    >
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-xl shadow-black/10">
                            {results.map((result, idx) => (
                                <motion.button
                                    key={`${result.id}-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleSelect(result)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 
                             transition-colors text-left border-b border-white/10 last:border-0"
                                >
                                    <MapPin className="w-4 h-4 text-white/60 flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-medium">{result.name}</p>
                                        <p className="text-white/60 text-sm">
                                            {[result.admin1, result.country].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}