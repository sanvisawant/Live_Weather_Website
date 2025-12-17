import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherCardProps {
  weather: WeatherData;
}

const getWeatherIcon = (iconCode: string, size: number = 64) => {
  const iconProps = { size, strokeWidth: 1.5 };
  
  if (iconCode.includes('01')) return <Sun {...iconProps} className="text-yellow-500" />;
  if (iconCode.includes('02')) return <Cloud {...iconProps} className="text-gray-400" />;
  if (iconCode.includes('03') || iconCode.includes('04')) return <Cloud {...iconProps} className="text-gray-500" />;
  if (iconCode.includes('09')) return <CloudDrizzle {...iconProps} className="text-blue-500" />;
  if (iconCode.includes('10')) return <CloudRain {...iconProps} className="text-blue-500" />;
  if (iconCode.includes('11')) return <CloudLightning {...iconProps} className="text-purple-500" />;
  if (iconCode.includes('13')) return <CloudSnow {...iconProps} className="text-blue-300" />;
  
  return <Cloud {...iconProps} className="text-gray-400" />;
};

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <div className="p-8">
        <div className="flex flex-col gap-6">
          {/* Location */}
          <div className="text-center">
            <h2 className="text-gray-600">
              {weather.city}, {weather.country}
            </h2>
            <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex-shrink-0">
              {getWeatherIcon(weather.icon)}
            </div>
            <div>
              <div className="flex items-start">
                <span className="text-6xl">{Math.round(weather.temperature)}</span>
                <span className="text-2xl mt-2">°C</span>
              </div>
              <p className="text-gray-600 mt-2">{weather.condition}</p>
              <p className="text-gray-500 text-sm capitalize">{weather.description}</p>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Thermometer className="text-red-500 mb-2" size={24} strokeWidth={1.5} />
              <span className="text-gray-600 text-sm">Feels Like</span>
              <span>{Math.round(weather.feelsLike)}°C</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Droplets className="text-blue-500 mb-2" size={24} strokeWidth={1.5} />
              <span className="text-gray-600 text-sm">Humidity</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Wind className="text-gray-500 mb-2" size={24} strokeWidth={1.5} />
              <span className="text-gray-600 text-sm">Wind Speed</span>
              <span>{weather.windSpeed} m/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
