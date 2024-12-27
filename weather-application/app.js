import { updateForecastChart, processForecastData } from "./forecast.js";

const API_KEY = "9e40eca1567deaebe357d63748f62ddb";

document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");

  // Auto-fetch weather for default city (Bucharest)
  fetchWeatherData("Bucharest");

  // Add input event listener for real-time updates
  cityInput.addEventListener(
    "input",
    debounce((e) => {
      const city = e.target.value.trim();
      if (city) {
        fetchWeatherData(city);
      }
    }, 500)
  );
});

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function fetchWeatherData(city) {
  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    updateCurrentWeather(currentData);
    updateForecastChart(forecastData);
    updateForecastDays(forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function updateCurrentWeather(data) {
  // Update datetime
  const datetimeEl = document.querySelector(".datetime");
  const date = new Date();
  datetimeEl.textContent = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Update weather icon
  const weatherIcon = document.querySelector(".weather-icon img");
  const iconName = getWeatherIcon(data.weather[0].main);
  weatherIcon.src = `icons/${iconName}.svg`;

  // Update temperature and condition
  document.querySelector(".temperature").textContent = `${Math.round(
    data.main.temp
  )}°C`;
  document.querySelector(".condition").textContent = data.weather[0].main;

  // Update weather details
  const details = document.querySelectorAll(".detail .value");
  details[0].textContent = `${data.main.humidity}%`;
  details[1].textContent = `${Math.round(data.wind.speed)} km/h`;
}

function getWeatherIcon(condition) {
  const iconMap = {
    Clear: "sunny",
    Clouds: "cloudy",
    Rain: "cloudy",
    Snow: "cloudy",
    Thunderstorm: "cloudy",
    Drizzle: "cloudy",
    Mist: "cloudy",
    Smoke: "cloudy",
    Haze: "cloudy",
    Dust: "cloudy",
    Fog: "cloudy",
    Sand: "cloudy",
    Ash: "cloudy",
    Squall: "cloudy",
    Tornado: "cloudy",
  };
  return iconMap[condition] || "cloudy";
}

function updateForecastDays(forecastData) {
  const forecastContainer = document.querySelector(".forecast");
  const { dailyForecasts } = processForecastData(forecastData);

  // Clear existing forecast days
  forecastContainer.innerHTML = "";

  // Create forecast day elements
  dailyForecasts.forEach((dayForecast, index) => {
    const forecastDayEl = document.createElement("div");
    forecastDayEl.classList.add("forecast-day");
    if (index === 0) forecastDayEl.classList.add("today");

    forecastDayEl.innerHTML = `
            <div class="day">${dayForecast.day}</div>
            <img src="icons/${dayForecast.icon}.svg" alt="Weather Icon">
            <div class="forecast-temperature">${dayForecast.temperature}°C</div>
        `;

    forecastContainer.appendChild(forecastDayEl);
  });
}
