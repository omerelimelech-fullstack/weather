import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CloudOff, RefreshCw } from 'lucide-react';
import SearchBar, { type LocationData } from './components/weather/SearchBar';
import SavedCitiesList from './components/weather/SavedCitiesList';
import CurrentWeather from './components/weather/CurrentWeather';
import WeatherDetails from './components/weather/WeatherDetails';
import DailyForecast from './components/weather/DailyForecast';
import HourlyForecast from './components/weather/HourlyForecast';
import WeatherSkeleton from './components/weather/WeatherSkeleton';
import { isRainyWeather, isCloudyWeather } from './components/weather/WeatherIcon';

const fetchWeather = async (lat: number, lon: number) => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min'
    ].join(','),
    timezone: 'auto'
  });

  const weatherPromise = fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
    .then(async res => {
      if (!res.ok) throw new Error('Failed to fetch weather');
      return res.json();
    });

  const aqiPromise = fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`)
    .then(async res => {
      if (!res.ok) return null;
      return res.json();
    });

  const [weather, aqi] = await Promise.all([weatherPromise, aqiPromise]);
  return { weather, aqi };
};

function getBackgroundStyle(temp: number, weatherCode: number) {
  // Rain/storm conditions - dark moody gradients
  if (isRainyWeather(weatherCode)) {
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #434343 100%)';
  }

  // Cloudy/foggy conditions - soft grey gradients
  if (isCloudyWeather(weatherCode)) {
    return 'linear-gradient(135deg, #bdc3c7 0%, #869199 50%, #667788 100%)';
  }

  // Temperature-based gradients for clear/partly clear
  if (temp <= 0) return 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)'; // Icy blue
  if (temp <= 10) return 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'; // Cool blue
  if (temp <= 20) return 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'; // Fresh teal
  if (temp <= 25) return 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'; // Warm sunset
  if (temp <= 30) return 'linear-gradient(135deg, #FDBB2D 0%, #F7931E 100%)'; // Hot orange
  if (temp <= 35) return 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)'; // Very hot
  return 'linear-gradient(135deg, #FF0844 0%, #FFB199 100%)'; // Extreme heat
}

export default function SkyVibe() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Load saved location and saved cities or default
  useEffect(() => {
    const saved = localStorage.getItem('skyvibeLocation');
    const savedCities = localStorage.getItem('skyvibeSavedLines');

    if (saved) {
      setLocation(JSON.parse(saved));
    } else {
      // Default to London
      setLocation({ name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 });
    }

    if (savedCities) {
      setSavedLocations(JSON.parse(savedCities));
    }
  }, []);

  const { data: combinedData, isPending: isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['weather', location?.lat, location?.lon],
    queryFn: () => {
      if (!location) throw new Error("Location is missing");
      return fetchWeather(location.lat, location.lon);
    },
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const weather = combinedData?.weather;
  const aqi = combinedData?.aqi;

  const handleLocationSelect = (loc: LocationData) => {
    setLocation(loc);
    localStorage.setItem('skyvibeLocation', JSON.stringify(loc));
    setGeoError(null);
  };

  const toggleLocationSave = () => {
    if (!location) return;

    setSavedLocations(prev => {
      const exists = prev.some(l => l.lat === location.lat && l.lon === location.lon);
      let newLocations;
      if (exists) {
        newLocations = prev.filter(l => l.lat !== location.lat || l.lon !== location.lon);
      } else {
        newLocations = [...prev, location];
      }
      localStorage.setItem('skyvibeSavedLines', JSON.stringify(newLocations));
      return newLocations;
    });
  };

  const removeSavedLocation = (locToRemove: LocationData) => {
    setSavedLocations(prev => {
      const newLocations = prev.filter(l => l.lat !== locToRemove.lat || l.lon !== locToRemove.lon);
      localStorage.setItem('skyvibeSavedLines', JSON.stringify(newLocations));
      return newLocations;
    });
  };

  const isLocationSaved = useMemo(() => {
    if (!location) return false;
    return savedLocations.some(l => l.lat === location.lat && l.lon === location.lon);
  }, [location, savedLocations]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported');
      return;
    }

    setIsLoadingGeo(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get city name
        try {
          const loc: LocationData = {
            name: 'Current Location',
            country: '',
            lat: latitude,
            lon: longitude
          };

          handleLocationSelect(loc);
        } catch {
          handleLocationSelect({
            name: 'Current Location',
            country: '',
            lat: latitude,
            lon: longitude
          });
        } finally {
          setIsLoadingGeo(false);
        }
      },
      () => {
        setGeoError('Location access denied');
        setIsLoadingGeo(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const backgroundStyle = useMemo(() => {
    if (!weather) return { background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' };
    return {
      background: getBackgroundStyle(
        weather.current.temperature_2m,
        weather.current.weather_code
      )
    };
  }, [weather]);

  return (
    <div
      className="min-h-screen transition-all duration-1000"
      style={backgroundStyle}
    >
      <div className="min-h-screen relative overflow-hidden flex items-center">
        {/* Ambient orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-thin text-white tracking-[0.3em] mb-2 drop-shadow-lg">SKY-VIBE</h1>
            <p className="text-white/60 text-xs font-light tracking-[0.25em]">WEATHER INTELLIGENCE</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <SearchBar
              onLocationSelect={handleLocationSelect}
              onUseMyLocation={handleUseMyLocation}
              isLoadingLocation={isLoadingGeo}
              isSaved={isLocationSaved}
              onToggleSave={toggleLocationSave}
            />
            {geoError && (
              <p className="text-red-300 text-sm text-center mt-2">{geoError}</p>
            )}
          </motion.div>

          {/* Saved Cities List */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
          >
            <SavedCitiesList
              cities={savedLocations}
              onSelect={handleLocationSelect}
              onRemove={removeSavedLocation}
            />
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WeatherSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32"
              >
                <CloudOff className="w-16 h-16 text-white/40 mb-4" />
                <p className="text-white/60 mb-4">Unable to load weather</p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full 
                             text-white text-sm transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </motion.div>
            ) : weather && location ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Refresh indicator */}
                {isFetching && (
                  <div className="absolute top-4 right-4">
                    <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
                  </div>
                )}

                <CurrentWeather data={weather} location={location} />
                <HourlyForecast data={weather} />
                <WeatherDetails
                  data={weather}
                  aqi={aqi?.current?.european_aqi}
                />
                <DailyForecast data={weather} />

                {/* Last updated */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center text-white/30 text-xs mt-8"
                >
                  Pull to refresh • Data from Open-Meteo
                </motion.p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}