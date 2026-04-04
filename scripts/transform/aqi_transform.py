"""Transform Open-Meteo hourly AQ data into daily AQI JSON for the dashboard."""
import json
import os
from collections import defaultdict

RAW_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'openmeteo_airquality_wb.json')
OUT_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed', 'aqi_wb.json')


def european_to_indian_aqi(eu_aqi):
    """Rough mapping from European AQI (0-100 scale) to Indian AQI (0-500 scale)."""
    if eu_aqi is None:
        return None
    if eu_aqi <= 20:
        return int(eu_aqi * 2.5)       # Good: 0-50
    elif eu_aqi <= 40:
        return int(50 + (eu_aqi - 20) * 2.5)  # Moderate: 50-100
    elif eu_aqi <= 60:
        return int(100 + (eu_aqi - 40) * 5)   # Unhealthy Sensitive: 100-200
    elif eu_aqi <= 80:
        return int(200 + (eu_aqi - 60) * 5)   # Unhealthy: 200-300
    elif eu_aqi <= 100:
        return int(300 + (eu_aqi - 80) * 10)  # Very Unhealthy: 300-500
    else:
        return 500


def transform():
    with open(RAW_PATH) as f:
        raw = json.load(f)

    daily_records = []
    cities = sorted(raw.keys())

    for city in cities:
        hourly = raw[city].get("hourly", {})
        times = hourly.get("time", [])
        pm25 = hourly.get("pm2_5", [])
        pm10 = hourly.get("pm10", [])
        no2 = hourly.get("nitrogen_dioxide", [])
        so2 = hourly.get("sulphur_dioxide", [])
        co = hourly.get("carbon_monoxide", [])
        o3 = hourly.get("ozone", [])
        eu_aqi = hourly.get("european_aqi", [])

        # Group by date
        day_data = defaultdict(lambda: {"pm25": [], "pm10": [], "no2": [], "so2": [], "co": [], "o3": [], "aqi": []})
        for i, t in enumerate(times):
            day = t[:10]
            if i < len(pm25) and pm25[i] is not None: day_data[day]["pm25"].append(pm25[i])
            if i < len(pm10) and pm10[i] is not None: day_data[day]["pm10"].append(pm10[i])
            if i < len(no2) and no2[i] is not None: day_data[day]["no2"].append(no2[i])
            if i < len(so2) and so2[i] is not None: day_data[day]["so2"].append(so2[i])
            if i < len(co) and co[i] is not None: day_data[day]["co"].append(co[i])
            if i < len(o3) and o3[i] is not None: day_data[day]["o3"].append(o3[i])
            if i < len(eu_aqi) and eu_aqi[i] is not None: day_data[day]["aqi"].append(eu_aqi[i])

        for day in sorted(day_data.keys()):
            d = day_data[day]
            avg = lambda arr: round(sum(arr) / len(arr), 1) if arr else 0
            eu_avg = avg(d["aqi"])
            daily_records.append({
                "date": day,
                "city": city,
                "aqi": european_to_indian_aqi(eu_avg) if eu_avg else 0,
                "pm25": avg(d["pm25"]),
                "pm10": avg(d["pm10"]),
                "no2": avg(d["no2"]),
                "so2": avg(d["so2"]),
                "co": avg(d["co"]),
                "o3": avg(d["o3"]),
            })

    result = {
        "daily": daily_records,
        "cities": cities,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w') as f:
        json.dump(result, f, indent=2)
    print(f"Wrote {len(daily_records)} daily AQI records for {len(cities)} cities to {OUT_PATH}")


if __name__ == "__main__":
    transform()
