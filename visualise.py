# visualise.py
from fh_matplotlib import matplotlib2fasthtml
import numpy as np
import matplotlib.pyplot as plt

@matplotlib2fasthtml
def generate_weather_chart(days):
    temperatures = [np.random.randint(15, 30) for _ in range(days)]
    plt.figure(figsize=(10, 5))
    plt.plot(range(1, days + 1), temperatures, marker='o')
    plt.title('Temperature Forecast')
    plt.xlabel('Days')
    plt.ylabel('Temperature (°C)')
    plt.grid(True)