from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import requests
from dotenv import load_dotenv
import os
from typing import Dict, Any

# Load environment variables
load_dotenv()

# Fetch the API key
OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

# Create FastAPI instance
app = FastAPI()

# Mount static directory to serve CSS and JavaScript files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates using Jinja2
templates = Jinja2Templates(directory="templates")

# Step 2: Define a Route for the Home Page
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Step 3: Define Route for Weather Data
@app.get("/weather/", response_class=HTMLResponse)
async def get_weather(request: Request, location: str):
    weather_data = fetch_weather_data(location)
    return templates.TemplateResponse("index.html", {"request": request, "weather_data": weather_data})

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
            "uv_index": "--"  # UV index placeholder, since it is not available in OpenWeatherMap standard API response
        }
    else:
        return {"error": "Unable to fetch weather data"}
