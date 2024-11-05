from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse  # Import necessary responses
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import requests
from dotenv import load_dotenv
import os
from typing import Dict, Any

# Load environment variables from .env file with explicit path
load_dotenv()

# Fetch the API key
OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

# Create FastAPI instance
app = FastAPI()

# Mount static directory to serve CSS and JavaScript files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates using Jinja2
templates = Jinja2Templates(directory="templates")

# Define a Route for the Home Page
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    # Initial weather data with placeholder values
    initial_weather_data = {
        "location": "N/A",
        "temperature": "--",
        "description": "--",
        "humidity": "--",
        "wind_speed": "--",
        "max_temp": "--",
        "min_temp": "--",
        "uv_index": "--",
        "date": "--",
        "precipitation": "--"
    }
    return templates.TemplateResponse("index.html", {"request": request, "weather_data": initial_weather_data})

# New Route to Handle Search Location (HTMLx-based)
@app.post("/search_location", response_class=JSONResponse)
async def search_location(city: str = Form(...)):
    weather_data = fetch_weather_data(city)
    # Adding print statements for debugging
    print("Weather data fetched:", weather_data)
    return JSONResponse(content=weather_data)

# Helper Function to Fetch Weather Data from APIs
def fetch_weather_data(location: str) -> Dict[str, Any]:
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
    weather_response = requests.get(weather_url)
    
    if weather_response.status_code == 200:
        weather = weather_response.json()
        return {
            "location": location,
            "temperature": weather["main"]["temp"],
            "description": weather["weather"][0]["description"],
            "humidity": weather["main"]["humidity"],
            "wind_speed": weather["wind"]["speed"],
            "max_temp": weather["main"]["temp_max"],
            "min_temp": weather["main"]["temp_min"],
            "date": weather["dt"],  # You can format this date properly
            "precipitation": weather.get("rain", {}).get("1h", "0"),  # Example precipitation data
            "uv_index": "--"  # Placeholder since UV index is not available in OpenWeatherMap standard API
        }
    else:
        print("Error fetching data from OpenWeatherMap:", weather_response.status_code)
        return {
            "location": location,
            "temperature": "--",
            "description": "--",
            "humidity": "--",
            "wind_speed": "--",
            "max_temp": "--",
            "min_temp": "--",
            "date": "--",
            "precipitation": "--",
            "uv_index": "--"
        }
