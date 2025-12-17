import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning } from 'lucide-react';

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
}

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const getWeatherIcon = (iconCode: string, size: number = 32) => {
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

export function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <h3 className="mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-sm mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <div className="mb-2">
                {getWeatherIcon(day.icon)}
              </div>
              <div className="text-center">
                <div className="text-sm">{Math.round(day.tempMax)}°</div>
                <div className="text-sm text-gray-500">{Math.round(day.tempMin)}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
