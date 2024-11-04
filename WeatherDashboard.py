# WeatherDashboard.py
from fasthtml import common as fh

class WeatherDashboard:
    def __init__(self):
        self.weather_data = self.fetch_weather_data()  # Mock function

    def fetch_weather_data(self):
        # Mock data
        return {"current_temp": 23, "condition": "Partly Cloudy", "aqi": 45, "precipitation": 20}

    def render(self):
        return fh.Div(
            fh.H1("Weather Dashboard"),
            fh.Div(fh.H2(f"Current Weather: {self.weather_data['current_temp']}°C, {self.weather_data['condition']}"), cls="current-weather"),
            fh.Div(fh.H3("Temperature Forecast"), fh.Div(id="forecast-chart"), cls="forecast"),
            fh.Div(fh.H3(f"Air Quality Index: {self.weather_data['aqi']}"), cls="air-quality"),
            fh.Div(fh.H3(f"Precipitation Probability: {self.weather_data['precipitation']}%"), cls="precipitation"),
            fh.H3("Enter forecast days:"),
            fh.Div(
                fh.Input(type="number", min="1", max="10", value="5", name="forecast_days", id="forecast_days_input", cls="forecast-days-input"),
                fh.Button("Update Forecast", hx_get="/update_forecast", hx_target="#forecast-chart", hx_include="#forecast_days_input"),
                cls="forecast-input"
            )
        )