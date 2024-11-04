# app.py
from fasthtml import common as fh
from visualise import generate_weather_chart
from WeatherDashboard import WeatherDashboard

app, rt = fh.fast_app()

@rt("/", ["get"])
def homepage():
    return WeatherDashboard().render()

@rt("/update_forecast", ["get"])
def update_forecast(forecast_days: int):
    return fh.Div(
        generate_weather_chart(forecast_days),
        fh.P(f"Forecast for the next {forecast_days} days")
    )

fh.serve()