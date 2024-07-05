import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const WeatherDetailsPage = () => {
  const { index } = useParams();
  const [weatherDetail, setWeatherDetail] = useState(null);
  const [weather, setWeather] = useState(null);
  const [backgroundClass, setBackgroundClass] = useState("");

  useEffect(() => {
    const fetchWeatherDetail = async () => {
      try {
        const apiKey = "d312d4b7859a8401195b406ebf89d9b1";
        const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Rome&limit=5&appid=${apiKey}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.length > 0) {
          const { lat, lon } = geocodeData[0];
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
          const response = await fetch(forecastUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const forecastData = await response.json();
          const weatherDataIndex = index * 8;

          if (
            forecastData.list &&
            forecastData.list.length > weatherDataIndex
          ) {
            setWeatherDetail(forecastData.list[weatherDataIndex]);
            setWeather(forecastData.list[weatherDataIndex]);
          } else {
            console.error("Invalid index or forecast data structure");
          }
        } else {
          alert("Location not found");
        }
      } catch (error) {
        console.error("Error fetching weather detail:", error);
      }
    };

    fetchWeatherDetail();
  }, [index]);

  useEffect(() => {
    const getWeatherBackgroundClass = () => {
      if (weather) {
        const weatherCondition = weather.weather[0].main.toLowerCase();
        if (weatherCondition === "clear") {
          return "clear-sky-background";
        } else if (weatherCondition === "rain") {
          return "rainy-background";
        } else if (weatherCondition === "clouds") {
          return "cloudy-background";
        } else if (weatherCondition === "mist" || weatherCondition === "haze") {
          return "mist-background";
        }
      }
      return "";
    };

    setBackgroundClass(getWeatherBackgroundClass());
  }, [weather]);

  if (!weatherDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`weather-details ${backgroundClass}`}>
      <h2>Weather Details</h2>
      <div className="detail-item">
        <p>Date: {new Date(weatherDetail.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: {Math.round(weatherDetail.main.temp)}°C</p>
        <p>Feels Like: {Math.round(weatherDetail.main.feels_like)}°C</p>
        <p>Min Temperature: {Math.round(weatherDetail.main.temp_min)}°C</p>
        <p>Max Temperature: {Math.round(weatherDetail.main.temp_max)}°C</p>
        <p>Pressure: {weatherDetail.main.pressure} hPa</p>
        <p>Humidity: {weatherDetail.main.humidity}%</p>
        <p>Weather Description: {weatherDetail.weather[0].description}</p>
        <img
          src={`http://openweathermap.org/img/wn/${weatherDetail.weather[0].icon}@2x.png`}
          alt="weather icon"
        />
        <p>Cloudiness: {weatherDetail.clouds.all}%</p>
        <p>Wind Speed: {weatherDetail.wind.speed} m/s</p>
        <p>Wind Direction: {weatherDetail.wind.deg}°</p>
        <p>Wind Gust: {weatherDetail.wind.gust} m/s</p>
        <p>Visibility: {weatherDetail.visibility} meters</p>
      </div>
    </div>
  );
};

export default WeatherDetailsPage;
