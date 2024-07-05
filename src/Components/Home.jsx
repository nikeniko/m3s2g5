import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const fetchWeather = async (city) => {
    try {
      const apiKey = "d312d4b7859a8401195b406ebf89d9b1";
      const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length > 0) {
        const { lat, lon } = geocodeData[0];
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather(location);
    }
  };

  const getIconUrl = (icon) =>
    `http://openweathermap.org/img/wn/${icon}@2x.png`;

  useEffect(() => {
    fetchWeather("Rome");
  }, []);

  const getDailyForecasts = (forecastData) => {
    const dailyForecasts = [];
    const uniqueDays = new Set();

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.getUTCDate();
      if (!uniqueDays.has(day) && date.getUTCHours() === 12) {
        dailyForecasts.push(item);
        uniqueDays.add(day);
      }
    });

    return dailyForecasts.slice(0, 5);
  };

  const getWeatherBackgroundClass = () => {
    if (weather) {
      const weatherCondition = weather.weather[0].main.toLowerCase();
      if (weatherCondition === "clear") {
        return "clear-sky-background";
      } else if (weatherCondition === "rain") {
        return "rainy-background";
      } else if (weatherCondition === "clouds") {
        return "cloudy-background";
      } else if (weatherCondition === "mist") {
        return "mist-background";
      } else if (weatherCondition === "haze") {
        return "mist-background";
      }
    }
    return "";
  };

  return (
    <div className={`app ${getWeatherBackgroundClass()}`}>
      <div className="app-container fs-4">
        <div className="app-search">
          <input
            className="search-input"
            placeholder="Enter location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        {weather && (
          <>
            <div className="app-top">
              <div className="app-location">
                <p>{weather.name}</p>
              </div>

              <div className="app-temp">
                <h1>{Math.round(weather.main.temp)}°C</h1>
              </div>
              <div className="app-description">
                <p>{weather.weather[0].description}</p>
              </div>
            </div>

            <div className="app-bottom">
              <div className="app-feels">
                <p className="app-bold">
                  {Math.round(weather.main.feels_like)}°C
                </p>
                <p>Feels Like</p>
              </div>
              <div className="app-humidity">
                <p className="app-bold">{weather.main.humidity}%</p>
                <p>Humidity</p>
              </div>
              <div className="app-wind">
                <p className="app-bold">
                  {Math.round(weather.wind.speed)} km/h
                </p>
                <p>Wind</p>
              </div>
            </div>
          </>
        )}

        {forecast && (
          <div className="app-forecast">
            <h2>Next 5 Days</h2>
            <div className="forecast-container">
              {getDailyForecasts(forecast).map((item, index) => (
                <Link
                  key={index}
                  to={`/weather-details/${index}`}
                  className="forecast-item-link text-decoration-none"
                >
                  <div className="forecast-item">
                    <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <img
                      src={getIconUrl(item.weather[0].icon)}
                      alt="weather icon"
                    />
                    <p>{Math.round(item.main.temp)}°C</p>
                    <p>{item.weather[0].description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
