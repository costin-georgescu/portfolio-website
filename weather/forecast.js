export function updateForecastChart(forecastData) {
  const ctx = document.getElementById("temperatureChart").getContext("2d");

  // Process forecast data
  const { labels, temperatures, dailyForecasts } =
    processForecastData(forecastData);

  // Destroy existing chart if it exists
  if (window.temperatureChart instanceof Chart) {
    window.temperatureChart.destroy();
  }

  // Create new chart
  window.temperatureChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature",
          data: temperatures,
          borderColor: "#4285f4",
          backgroundColor: "rgba(66, 133, 244, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#4285f4",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 10,
          left: 10,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            maxTicksLimit: 5,
            callback: function (value) {
              return value + "°C";
            },
          },
        },
      },
    },
  });

  console.log("Chart Context:", ctx);
  console.log("Labels:", labels);
  console.log("Temperatures:", temperatures);
  console.log("Daily Forecasts:", dailyForecasts);
}

export function processForecastData(forecastData) {
  const timePoints = [];
  const temperatures = [];
  const dailyForecasts = [];
  const processedDays = new Set();

  // Process time points for chart
  forecastData.list.slice(0, 8).forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    timePoints.push(
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      })
    );
    temperatures.push(Math.round(entry.main.temp));
  });

  // Process daily forecasts
  forecastData.list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });

    // Avoid duplicates
    if (!processedDays.has(day)) {
      processedDays.add(day);

      dailyForecasts.push({
        day: day,
        icon: getWeatherIcon(entry.weather[0].main),
        humidity: entry.main.humidity,
        temperature: Math.round(entry.main.temp),
      });
    }

    // Limit to 5 days
    if (dailyForecasts.length >= 5) return;
  });

  console.log("Forecast Data:", forecastData);
  console.log("Processed Time Points:", timePoints);
  console.log("Processed Temperatures:", temperatures);
  console.log("Daily Forecasts:", dailyForecasts);

  return {
    labels: timePoints,
    temperatures: temperatures,
    dailyForecasts: dailyForecasts,
  };
}

// Helper function to map weather conditions to icons
function getWeatherIcon(condition) {
  const iconMap = {
    Clear: "sunny",
    Clouds: "cloudy",
    Rain: "rainy",
    Drizzle: "drizzle",
    Thunderstorm: "stormy",
    Snow: "snowy",
    Mist: "foggy",
    Smoke: "cloudy",
    Haze: "cloudy",
    Dust: "cloudy",
    Fog: "foggy",
    Sand: "foggy",
    Ash: "cloudy",
    Squall: "cloudy",
    Tornado: "tornado",
  };
  return iconMap[condition] || "cloudy";
}
