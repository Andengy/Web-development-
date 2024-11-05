// JavaScript to Keep for Theme Toggle and Date/Time Update

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

    function updateWeather(event) {
        let data = event.detail.xhr.response;
        data = JSON.parse(data); // Parse the JSON response if needed
        console.log(data); // Debugging to check the parsed data
        
        document.getElementById("current-temp").innerText = data.temperature || "--";
        document.getElementById("today-weather-icon").innerText = data.description || "--";
        document.getElementById("date").innerText = new Date(data.date * 1000).toLocaleDateString() || "--";
        document.getElementById("precipitation").innerText = data.precipitation || "--";
        document.getElementById("humidity").innerText = data.humidity || "--";
        document.getElementById("hottest-temp").innerText = data.max_temp || "--";
        document.getElementById("coldest-temp").innerText = data.min_temp || "--";
        document.getElementById("windspeed").innerText = data.wind_speed || "--";
        document.getElementById("uv-index").innerText = data.uv_index || "--";
    }
    
});
