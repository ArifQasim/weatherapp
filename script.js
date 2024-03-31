let compression = document.querySelector(".compression");
let home = document.querySelector(".back-home");

compression.addEventListener("click", (event) => {
  document.querySelector(".weather-showCase").classList.add("hide");
  document.querySelector(".compression_section ").classList.remove("hide");
  document.querySelector(".back-home").classList.remove("hide");
  document.querySelector(".compression").classList.add("hide");
});
home.addEventListener("click", (event) => {
  document.querySelector(".weather-showCase").classList.remove("hide");
  document.querySelector(".compression_section ").classList.add("hide");
  document.querySelector(".back-home").classList.add("hide");
  document.querySelector(".compression").classList.remove("hide");
});

document.addEventListener("DOMContentLoaded", function () {
  const myAPI = "ec7569fd39527720903ee1087cda1bf6";

  async function getWeatherData(cityName) {
    const genocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${myAPI}`;

    try {
      const response = await fetch(genocodeURL);
      const data = await response.json();

      if (data.length > 0) {
        const longitude = data[0].lon;
        const latitude = data[0].lat;

        const currentWeatherData = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${myAPI}`;

        try {
          const res = await fetch(currentWeatherData);
          const weatherData = await res.json();

          const sunriseTime = new Date(
            weatherData.sys.sunrise * 1000
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Sunrise time in hours and minutes only
          const sunsetTime = new Date(
            weatherData.sys.sunset * 1000
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Sunset time in hours and minutes only
          const windSpeed = weatherData.wind.speed;
          const temperature = Math.floor(weatherData.main.temp - 273.15); // Convert Kelvin to Celsius
          const feelsLike = Math.floor(weatherData.main.feels_like - 273.15);
          const pressure = weatherData.main.pressure;
          const humidity = weatherData.main.humidity;

          return {
            sunriseTime,
            sunsetTime,
            windSpeed,
            temperature,
            feelsLike,
            pressure,
            humidity,
          };
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      } else {
        console.log("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
    }
  }

  let cityName = "";

  const searchInput = document.getElementById("searchBar");
  const locationElement = document.querySelector(".location");

  if (searchInput) {
    searchInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        cityName = searchInput.value.trim();
        locationElement.innerText = cityName;
        console.log("City Name:", cityName);

        const weatherData = await getWeatherData(cityName);
        console.log("Weather Data:", weatherData);

        if (weatherData !== null) {
          const sunriseElement = document.getElementById("sunrise");
          const sunsetElement = document.getElementById("sunset");
          const windSpeedElement = document.getElementById("wind");
          const humidityElements = document.querySelectorAll(".hum");
          const temperatureElement = document.getElementById("temp");
          const feelsLikeElement = document.getElementById("feelsLike");
          const pressureElement = document.getElementById("Pressue");

          sunriseElement.innerText = weatherData.sunriseTime;
          sunsetElement.innerText = weatherData.sunsetTime;
          windSpeedElement.innerText = `${weatherData.windSpeed} km/h`;
          temperatureElement.innerText = `${weatherData.temperature}°C`;
          feelsLikeElement.innerText = weatherData.feelsLike + "°C";
          pressureElement.innerText = weatherData.pressure + " hPa";

          humidityElements.forEach((element) => {
            element.innerText = weatherData.humidity + "%";
          });
        } else {
          console.error("Weather data not available.");
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    });
  } else {
    console.error("Search input element not found.");
  }
});
