const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

// Open-Meteo gives a number for the weather; this turns it into words
const weatherCodes = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy rain showers",
  95: "Thunderstorm"
};

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    result.innerHTML = `<p class="error">Please type a city name first.</p>`;
    return;
  }

  result.innerHTML = `<p class="message">Loading...</p>`;

  try {
    // Step 1: find the latitude and longitude of the city
    const geoUrl =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) + "&count=1";
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      result.innerHTML = `<p class="error">City not found. Check the spelling and try again.</p>`;
      return;
    }

    const place = geoData.results[0];

    // Step 2: get the current weather for that place
    const weatherUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude +
      "&longitude=" + place.longitude +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    const now = weatherData.current;

    const condition = weatherCodes[now.weather_code] || "Weather data received";

    // Step 3: show it on the page
    result.innerHTML = `
      <h2 class="city">${place.name}, ${place.country}</h2>
      <p class="temp">${now.temperature_2m}°C</p>
      <p class="condition">${condition}</p>
      <div class="details">
        <div class="detail-box"><span>Humidity</span>${now.relative_humidity_2m}%</div>
        <div class="detail-box"><span>Wind</span>${now.wind_speed_10m} km/h</div>
      </div>
    `;
  } catch (error) {
    result.innerHTML = `<p class="error">Could not get the weather. Check your internet connection.</p>`;
  }
}

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});