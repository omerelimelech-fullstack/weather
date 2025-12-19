import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudDrizzle,
    CloudFog,
    Cloudy,
    type LucideIcon
} from 'lucide-react';

interface WeatherInfo {
    icon: LucideIcon;
    label: string;
}

const weatherCodeMap: Record<number, WeatherInfo> = {
    0: { icon: Sun, label: 'Clear Sky' },
    1: { icon: Sun, label: 'Mainly Clear' },
    2: { icon: Cloud, label: 'Partly Cloudy' },
    3: { icon: Cloudy, label: 'Overcast' },
    45: { icon: CloudFog, label: 'Foggy' },
    48: { icon: CloudFog, label: 'Depositing Rime Fog' },
    51: { icon: CloudDrizzle, label: 'Light Drizzle' },
    53: { icon: CloudDrizzle, label: 'Moderate Drizzle' },
    55: { icon: CloudDrizzle, label: 'Dense Drizzle' },
    56: { icon: CloudDrizzle, label: 'Freezing Drizzle' },
    57: { icon: CloudDrizzle, label: 'Freezing Drizzle' },
    61: { icon: CloudRain, label: 'Slight Rain' },
    63: { icon: CloudRain, label: 'Moderate Rain' },
    65: { icon: CloudRain, label: 'Heavy Rain' },
    66: { icon: CloudRain, label: 'Freezing Rain' },
    67: { icon: CloudRain, label: 'Freezing Rain' },
    71: { icon: CloudSnow, label: 'Slight Snow' },
    73: { icon: CloudSnow, label: 'Moderate Snow' },
    75: { icon: CloudSnow, label: 'Heavy Snow' },
    77: { icon: CloudSnow, label: 'Snow Grains' },
    80: { icon: CloudRain, label: 'Rain Showers' },
    81: { icon: CloudRain, label: 'Rain Showers' },
    82: { icon: CloudRain, label: 'Violent Rain' },
    85: { icon: CloudSnow, label: 'Snow Showers' },
    86: { icon: CloudSnow, label: 'Heavy Snow Showers' },
    95: { icon: CloudLightning, label: 'Thunderstorm' },
    96: { icon: CloudLightning, label: 'Thunderstorm with Hail' },
    99: { icon: CloudLightning, label: 'Thunderstorm with Hail' },
};

export function getWeatherInfo(code: number): WeatherInfo {
    return weatherCodeMap[code] || { icon: Cloud, label: 'Unknown' };
}

export function isRainyWeather(code: number): boolean {
    return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

export function isCloudyWeather(code: number): boolean {
    return [2, 3, 45, 48].includes(code);
}

interface WeatherIconProps {
    code: number;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    animate?: boolean;
}

export default function WeatherIcon({ code, size = 'md', className = '', animate = false }: WeatherIconProps) {
    const { icon: Icon } = getWeatherInfo(code);

    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-20 h-20',
        '2xl': 'w-28 h-28'
    };

    // Animate sun icons
    const shouldAnimate = animate && [0, 1].includes(code);
    const animationClass = shouldAnimate ? 'animate-spin' : '';
    const animationStyle = shouldAnimate ? { animationDuration: '20s' } : {};

    return (
        <Icon
            className={`${sizeClasses[size]} ${className} ${animationClass}`}
            strokeWidth={1.5}
            style={animationStyle}
        />
    );
}