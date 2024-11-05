import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Weather Dashboard" in response.text

def test_get_weather():
    response = client.get("/weather/Perth")
    assert response.status_code == 200
    assert "Weather for Perth" in response.text
