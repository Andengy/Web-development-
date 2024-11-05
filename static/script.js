document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const themeToggle = document.getElementById("theme-toggle");

    // Mapping weather descriptions to emojis
    const weatherEmojiMap = {
        "clear sky": "☀️",
        "few clouds": "🌤️",
        "scattered clouds": "☁️",
        "broken clouds": "☁️",
        "shower rain": "🌧️",
        "rain": "🌧️",
        "thunderstorm": "⛈️",
        "snow": "❄️",
        "mist": "🌫️",
        "light rain": "🌦️",
        "overcast clouds": "☁️",
        "haze": "🌫️",
        "fog": "🌁"
    };

    async function fetchLocations(city) {
        console.log("City submitted:", city);
        try {
            const response = await fetch("/search_location", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ city })
            });

            if (!response.ok) throw new Error("Failed to fetch location data.");
            const locations = await response.json();
            console.log("Locations received:", locations);
            displayLocationOptions(locations);
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    }

    function displayLocationOptions(locations) {
        const locationList = document.getElementById("location-list");
        const locationOptions = document.getElementById("location-options");

        locationOptions.innerHTML = "";  // Clear previous results
        locationList.style.display = "block";

        locations.forEach(location => {
            const listItem = document.createElement("li");
            const button = document.createElement("button");
            button.textContent = `${location.name}, ${location.country}`;
            button.onclick = () => fetchWeather(location.lat, location.lon);
            listItem.appendChild(button);
            locationOptions.appendChild(listItem);
        });
    }

    async function fetchWeather(lat, lon) {
        console.log("Fetching weather for coordinates:", lat, lon);
        try {
            const response = await fetch(`/get_weather?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error("Failed to fetch weather data.");
            const weatherData = await response.json();
            console.log("Weather data received:", weatherData);
            displayWeatherData(weatherData);
            updateDateTime();
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    function displayWeatherData(data) {
        console.log("Detailed weather data received:", data);

        // Display temperature in "Today's Weather" area
        document.querySelector(".weather-text").textContent = `Temperature Now: ${data.temperature || "--"} °C`;

        // Update main stats
        document.getElementById("temperature").textContent = `${data.humidity || "--"} %`; // Shows humidity as percentage under Temperature

        // Precipitation in mm from rain or snow data
        const precipitationMm = data.precipitation_mm ? `${data.precipitation_mm} mm` : "0 mm";
        document.getElementById("precipitation").textContent = precipitationMm;

        // Convert wind speed to m/s and update
        const windSpeedMps = (data.wind_speed / 3.6).toFixed(2);
        document.getElementById("windspeed").textContent = `${windSpeedMps || "--"} m/s`;

        document.getElementById("max-temp").textContent = `${data.max_temp || "--"} °C`;
        document.getElementById("min-temp").textContent = `${data.min_temp || "--"} °C`;
        document.getElementById("uv-index").textContent = `${data.uv_index || "--"}`;

        // Update emoji icon based on weather description
        const weatherDescription = data.description ? data.description.toLowerCase() : "clear sky";
        const emojiIcon = weatherEmojiMap[weatherDescription] || "🌈";
        document.querySelector(".weather-icon").textContent = emojiIcon;
    }

    // Update date and time using user's local time
    function updateDateTime() {
        const now = new Date();

        // Format date as day/month/year
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const year = now.getFullYear();
        document.getElementById("date").textContent = `${day}/${month}/${year}`;

        // Format time in 12-hour format with AM/PM
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert hour to 12-hour format
        document.getElementById("time").textContent = `${hours}:${minutes} ${ampm}`;

        // Display a time-based emoji based on user's local time
        const timeEmoji = hours < 6 ? "🌙" :
                          hours < 12 ? "🌅" :
                          hours < 18 ? "🌞" : "🌌";
        document.getElementById("time-emoji").textContent = timeEmoji;
    }

    // Toggle light and dark themes
    function toggleTheme() {
        document.body.classList.toggle("light-theme");
        const currentTheme = document.body.classList.contains("light-theme") ? "🌞" : "🌙";
        themeToggle.textContent = currentTheme;
    }

    // Event listener for theme toggle button
    themeToggle.addEventListener("click", toggleTheme);

    // Event listener for city search form
    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        const city = document.getElementById("search-city").value.trim();
        if (city) {
            fetchLocations(city);
        }
    });

    // Initial update of date and time
    updateDateTime();
    // Set the initial theme icon
    themeToggle.textContent = document.body.classList.contains("light-theme") ? "🌞" : "🌙";
});
