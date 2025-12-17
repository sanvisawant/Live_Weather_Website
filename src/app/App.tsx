import React, { useState, useEffect, JSX } from "react";
import { Search, MapPin } from "lucide-react";
import { WeatherCard } from "./components/WeatherCard";
import { ForecastCard } from "./components/ForecastCard";

// Mock weather data - In production, replace with actual API calls
const mockWeatherData = {
  city: "London",
  country: "GB",
  temperature: 15,
  feelsLike: 13,
  condition: "Partly Cloudy",
  description: "broken clouds",
  humidity: 72,
  windSpeed: 4.5,
  icon: "04d",
};

const mockForecast = [
  {
    date: new Date().toISOString(),
    tempMax: 17,
    tempMin: 12,
    condition: "Cloudy",
    icon: "04d",
  },
  {
    date: new Date(Date.now() + 86400000).toISOString(),
    tempMax: 19,
    tempMin: 14,
    condition: "Sunny",
    icon: "01d",
  },
  {
    date: new Date(Date.now() + 172800000).toISOString(),
    tempMax: 16,
    tempMin: 11,
    condition: "Rainy",
    icon: "10d",
  },
  {
    date: new Date(Date.now() + 259200000).toISOString(),
    tempMax: 15,
    tempMin: 10,
    condition: "Partly Cloudy",
    icon: "02d",
  },
  {
    date: new Date(Date.now() + 345600000).toISOString(),
    tempMax: 18,
    tempMin: 13,
    condition: "Sunny",
    icon: "01d",
  },
];

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(mockWeatherData);
  const [forecast, setForecast] = useState(mockForecast);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingMockData, setUsingMockData] = useState(true);

  // Load default weather on component mount
  useEffect(() => {
    // Start with mock data, don't try to fetch on load
    setUsingMockData(true);
  }, []);

  const fetchWeather = async (cityName: string) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";
    console.log("API Key:", API_KEY);


    // If no valid API key, use mock data
    if (API_KEY === "") {
      setWeather({
        ...mockWeatherData,
        city: cityName,
      });
      setForecast(mockForecast);
      setUsingMockData(true);
      setError(
        "Using demo data. Add your OpenWeatherMap API key to see live weather.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;

      const [currentResponse, forecastResponse] =
        await Promise.all([
          fetch(currentWeatherUrl),
          fetch(forecastUrl),
        ]);

      if (!currentResponse.ok) {
        const errorData = await currentResponse.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "City not found");
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      setWeather({
        city: currentData.name,
        country: currentData.sys.country,
        temperature: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        icon: currentData.weather[0].icon,
      });

      // Process forecast data (get one per day at noon)
      const dailyForecasts = forecastData.list
        .filter((item: any) => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);

      setForecast(
        dailyForecasts.map((item: any) => ({
          date: item.dt_txt,
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
        })),
      );

      setUsingMockData(false);
    } catch (err: any) {
      console.error("Fetch error:", err);

      // Provide more specific error messages
      let errorMessage = "Failed to fetch weather data. ";
      if (err.message.includes("Invalid API key")) {
        errorMessage =
          "Invalid API key. Please get a free key from OpenWeatherMap. Using demo data instead.";
      } else if (err.message.includes("city not found")) {
        errorMessage +=
          "City not found. Please check the spelling and try again. Using demo data.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage +=
          "Network error. Please check your internet connection. Using demo data.";
      } else {
        errorMessage += err.message + " Using demo data.";
      }

      setError(errorMessage);

      // Fall back to mock data
      setWeather({
        ...mockWeatherData,
        city: cityName,
      });
      setForecast(mockForecast);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);
          setError("");

          try {
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

            const [currentResponse, forecastResponse] =
              await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastUrl),
              ]);

            if (!currentResponse.ok)
              throw new Error(
                "Unable to fetch weather for your location",
              );

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            setWeather({
              city: currentData.name,
              country: currentData.sys.country,
              temperature: currentData.main.temp,
              feelsLike: currentData.main.feels_like,
              condition: currentData.weather[0].main,
              description: currentData.weather[0].description,
              humidity: currentData.main.humidity,
              windSpeed: currentData.wind.speed,
              icon: currentData.weather[0].icon,
            });

            // Process forecast data (get one per day at noon)
            const dailyForecasts = forecastData.list
              .filter((item: any) =>
                item.dt_txt.includes("12:00:00"),
              )
              .slice(0, 5);

            setForecast(
              dailyForecasts.map((item: any) => ({
                date: item.dt_txt,
                tempMax: item.main.temp_max,
                tempMin: item.main.temp_min,
                condition: item.weather[0].main,
                icon: item.weather[0].icon,
              })),
            );
          } catch (err) {
            setError(
              "Failed to fetch weather for your location.",
            );
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError(
            "Unable to get your location. Please enable location services.",
          );
        },
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-blue-600 mb-2">Weather Now</h1>
          <p className="text-gray-600">
            Get real-time weather updates for any city
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for a city... (e.g., Paris, Tokyo, New York)"
                value={city}
                onChange={(e: { target: { value: any; }; }) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Search"}
            </button>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <MapPin size={20} />
            </button>
          </form>
          {error && (
            <div className="mt-3 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <p className="text-gray-500 text-xs mt-1">
                Try searching for: London, Paris, Tokyo, New
                York, Sydney
              </p>
            </div>
          )}
        </div>

        {/* Weather Display */}
        <div className="flex flex-col items-center gap-6">
          <WeatherCard weather={weather} />
          <ForecastCard forecast={forecast} />
        </div>

        {/* API Info */}
        <div className="mt-8 p-4 bg-white rounded-lg max-w-2xl mx-auto">
          {usingMockData && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Currently showing demo data.</strong>{" "}
                To see live weather, search for a city.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
