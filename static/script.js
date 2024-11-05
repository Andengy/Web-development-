document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");

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

    // Initial update of date and time
    updateDateTime();
    // Set the initial theme icon
    themeToggle.textContent = document.body.classList.contains("light-theme") ? "🌞" : "🌙";

    // Optional: Update the date and time periodically (e.g., every minute)
    setInterval(updateDateTime, 60000);

    // Emoji mapping for weather description
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

    // HTMX response listener for weather data
    document.body.addEventListener("htmx:afterRequest", (event) => {
        if (event.detail.xhr && event.detail.xhr.response) {
            let data = event.detail.xhr.response;

            // If data is not already parsed as an object, parse it
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.error("Error parsing data:", e);
                    return;
                }
            }

            // Map the retrieved weather data to the appropriate HTML elements
            document.getElementById("current-temp").innerText = data.temperature || "--";
            
            // Set the emoji icon based on the weather description
            const weatherDescription = data.description ? data.description.toLowerCase() : "clear sky";
            const emojiIcon = weatherEmojiMap[weatherDescription] || "🌈";
            document.getElementById("today-weather-icon").innerText = emojiIcon;

            document.getElementById("precipitation").innerText = data.precipitation || "--";
            document.getElementById("humidity").innerText = data.humidity || "--";
            document.getElementById("hottest-temp").innerText = data.max_temp || "--";
            document.getElementById("coldest-temp").innerText = data.min_temp || "--";
            document.getElementById("windspeed").innerText = data.wind_speed || "--";
            document.getElementById("uv-index").innerText = data.uv_index || "--";

            // Update the date format to be more readable
            if (data.date) {
                document.getElementById("date").innerText = new Date(data.date * 1000).toLocaleDateString() || "--";
            }
        }
    });
});
