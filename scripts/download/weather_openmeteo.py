"""Download historical weather + air quality data from Open-Meteo API for West Bengal cities."""
import json
import requests
import os
import time
from datetime import date, timedelta

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw')

# Major WB cities with coordinates
CITIES = {
    "Kolkata":    {"lat": 22.5726, "lon": 88.3639},
    "Howrah":     {"lat": 22.5958, "lon": 88.2636},
    "Asansol":    {"lat": 23.6889, "lon": 86.9661},
    "Durgapur":   {"lat": 23.5204, "lon": 87.3119},
    "Siliguri":   {"lat": 26.7271, "lon": 88.3953},
    "Haldia":     {"lat": 22.0667, "lon": 88.0698},
    "Bardhaman":  {"lat": 23.2324, "lon": 87.8615},
    "Malda":      {"lat": 25.0108, "lon": 88.1411},
    "Baharampur": {"lat": 24.1005, "lon": 88.2517},
    "Kharagpur":  {"lat": 22.3460, "lon": 87.2320},
}

def download_weather():
    """Download daily weather data for all WB cities from Open-Meteo Archive API."""
    url = "https://archive-api.open-meteo.com/v1/archive"
    all_data = {}

    for city, coords in CITIES.items():
        params = {
            "latitude": coords["lat"],
            "longitude": coords["lon"],
            "start_date": "2015-01-01",
            "end_date": (date.today() - timedelta(days=1)).isoformat(),
            "daily": ",".join([
                "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean",
                "precipitation_sum", "rain_sum",
                "wind_speed_10m_max", "relative_humidity_2m_mean",
            ]),
            "timezone": "Asia/Kolkata"
        }
        print(f"Fetching weather data for {city}...")
        for attempt in range(5):
            resp = requests.get(url, params=params, timeout=120)
            if resp.status_code == 429:
                wait = 10 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s (attempt {attempt+1}/5)...")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            break
        else:
            raise Exception(f"Failed to fetch weather for {city} after 5 retries")
        all_data[city] = resp.json()
        n_days = len(resp.json().get("daily", {}).get("time", []))
        print(f"  {city}: {n_days} days")
        time.sleep(3)  # Rate limit: pause between cities

    out_path = os.path.join(OUTPUT_DIR, "openmeteo_weather_wb.json")
    with open(out_path, 'w') as f:
        json.dump(all_data, f, indent=2)
    print(f"Saved weather data to {out_path}")


def download_air_quality():
    """Download daily air quality data for all WB cities from Open-Meteo API."""
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    all_data = {}

    for city, coords in CITIES.items():
        params = {
            "latitude": coords["lat"],
            "longitude": coords["lon"],
            "start_date": "2022-01-01",
            "end_date": (date.today() - timedelta(days=1)).isoformat(),
            "hourly": ",".join([
                "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                "sulphur_dioxide", "ozone", "european_aqi",
            ]),
            "timezone": "Asia/Kolkata"
        }
        print(f"Fetching AQ data for {city}...")
        for attempt in range(5):
            resp = requests.get(url, params=params, timeout=120)
            if resp.status_code == 429:
                wait = 10 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s (attempt {attempt+1}/5)...")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            break
        else:
            raise Exception(f"Failed to fetch AQ for {city} after 5 retries")
        all_data[city] = resp.json()
        n_hours = len(resp.json().get("hourly", {}).get("time", []))
        print(f"  {city}: {n_hours} hours")
        time.sleep(3)  # Rate limit: pause between cities

    out_path = os.path.join(OUTPUT_DIR, "openmeteo_airquality_wb.json")
    with open(out_path, 'w') as f:
        json.dump(all_data, f, indent=2)
    print(f"Saved AQ data to {out_path}")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    download_weather()
    download_air_quality()
    print("Done.")
