"""Transform Open-Meteo daily weather data into climate_wb.json for the dashboard."""
import json
import os
from collections import defaultdict

RAW_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'openmeteo_weather_wb.json')
OUT_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed', 'climate_wb.json')

# Map API city names to district names used in the dashboard
CITY_TO_DISTRICT = {
    'Kolkata': 'Kolkata',
    'Howrah': 'Howrah',
    'Asansol': 'Barddhaman (Paschim)',
    'Durgapur': 'Barddhaman (Purba)',
    'Siliguri': 'Darjeeling',
    'Haldia': 'Medinipur (Purba)',
    'Bardhaman': 'Barddhaman (Purba)',
    'Malda': 'Malda',
    'Baharampur': 'Murshidabad',
    'Kharagpur': 'Medinipur (Paschim)',
}

# Districts not covered by any city — keep curated rainfall for these
CURATED_ONLY_DISTRICTS = [
    'North 24 Parganas', 'South 24 Parganas', 'Hooghly', 'Nadia', 'Birbhum',
    'Bankura', 'Purulia', 'Jhargram', 'Uttar Dinajpur', 'Dakshin Dinajpur',
    'Jalpaiguri', 'Alipurduar', 'Cooch Behar', 'Kalimpong',
]

MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Curated district rainfall (from IMD) — kept for districts without city weather stations
CURATED_RAINFALL = {
    "North 24 Parganas": {"annual": 1632, "monsoon": 1310, "winter": 22, "preMonsoon": 175, "postMonsoon": 125},
    "South 24 Parganas": {"annual": 1812, "monsoon": 1450, "winter": 20, "preMonsoon": 195, "postMonsoon": 147},
    "Hooghly": {"annual": 1480, "monsoon": 1185, "winter": 26, "preMonsoon": 168, "postMonsoon": 101},
    "Nadia": {"annual": 1510, "monsoon": 1208, "winter": 23, "preMonsoon": 170, "postMonsoon": 109},
    "Birbhum": {"annual": 1350, "monsoon": 1080, "winter": 25, "preMonsoon": 148, "postMonsoon": 97},
    "Bankura": {"annual": 1380, "monsoon": 1104, "winter": 24, "preMonsoon": 152, "postMonsoon": 100},
    "Purulia": {"annual": 1310, "monsoon": 1048, "winter": 22, "preMonsoon": 145, "postMonsoon": 95},
    "Jhargram": {"annual": 1420, "monsoon": 1136, "winter": 19, "preMonsoon": 162, "postMonsoon": 103},
    "Uttar Dinajpur": {"annual": 1820, "monsoon": 1456, "winter": 15, "preMonsoon": 212, "postMonsoon": 137},
    "Dakshin Dinajpur": {"annual": 1700, "monsoon": 1360, "winter": 16, "preMonsoon": 195, "postMonsoon": 129},
    "Jalpaiguri": {"annual": 3200, "monsoon": 2560, "winter": 22, "preMonsoon": 380, "postMonsoon": 238},
    "Alipurduar": {"annual": 3650, "monsoon": 2920, "winter": 25, "preMonsoon": 420, "postMonsoon": 285},
    "Cooch Behar": {"annual": 2900, "monsoon": 2320, "winter": 18, "preMonsoon": 345, "postMonsoon": 217},
    "Kalimpong": {"annual": 2800, "monsoon": 2240, "winter": 30, "preMonsoon": 330, "postMonsoon": 200},
}

# Curated extreme events (from IMD/NDMA) — not derivable from weather API
EXTREME_EVENTS = [
    {"year": 2020, "event": "Cyclone Amphan", "type": "Cyclone", "affected": "South 24 Parganas, Kolkata, North 24 Parganas"},
    {"year": 2021, "event": "Cyclone Yaas", "type": "Cyclone", "affected": "Purba Medinipur, South 24 Parganas"},
    {"year": 2022, "event": "Severe Floods", "type": "Flood", "affected": "Murshidabad, Malda, Nadia"},
    {"year": 2023, "event": "Heat Wave", "type": "Heat Wave", "affected": "Bankura, Purulia, Birbhum, Barddhaman"},
    {"year": 2023, "event": "Flash Floods", "type": "Flood", "affected": "Darjeeling, Kalimpong, Jalpaiguri"},
    {"year": 2024, "event": "Cyclone Remal", "type": "Cyclone", "affected": "South 24 Parganas, North 24 Parganas, Kolkata"},
    {"year": 2024, "event": "Severe Heat Wave", "type": "Heat Wave", "affected": "Bankura, Purulia, Birbhum, Paschim Barddhaman"},
]


def get_season(month):
    """Return season key for a month number (1-12)."""
    if month in (12, 1, 2):
        return 'winter'
    elif month in (3, 4, 5):
        return 'preMonsoon'
    elif month in (6, 7, 8, 9):
        return 'monsoon'
    else:
        return 'postMonsoon'


def transform():
    with open(RAW_PATH) as f:
        raw = json.load(f)

    # --- District rainfall from real API data ---
    district_rainfall = {}

    for city, data in raw.items():
        district = CITY_TO_DISTRICT.get(city)
        if not district or district in district_rainfall:
            continue

        daily = data.get('daily', data.get('hourly', {}))
        times = daily.get('time', [])
        precip = daily.get('precipitation_sum', [])

        season_totals = defaultdict(list)  # season -> list of yearly totals
        year_totals = defaultdict(float)

        for i, t in enumerate(times):
            if i >= len(precip) or precip[i] is None:
                continue
            year = int(t[:4])
            month = int(t[5:7])
            season = get_season(month)
            year_totals[year] += precip[i]
            season_totals[(year, season)] = season_totals.get((year, season), 0) + precip[i] if isinstance(season_totals.get((year, season)), (int, float)) else precip[i]

        # Recalculate with proper per-year season totals
        yearly_season = defaultdict(lambda: defaultdict(float))
        yearly_total = defaultdict(float)
        for i, t in enumerate(times):
            if i >= len(precip) or precip[i] is None:
                continue
            year = int(t[:4])
            month = int(t[5:7])
            season = get_season(month)
            yearly_season[year][season] += precip[i]
            yearly_total[year] += precip[i]

        # Average across complete years (2016-2025)
        complete_years = [y for y in yearly_total if 2016 <= y <= 2025]
        if not complete_years:
            continue

        avg_annual = round(sum(yearly_total[y] for y in complete_years) / len(complete_years))
        avg_seasons = {}
        for s in ('monsoon', 'winter', 'preMonsoon', 'postMonsoon'):
            vals = [yearly_season[y][s] for y in complete_years if s in yearly_season[y]]
            avg_seasons[s] = round(sum(vals) / len(vals)) if vals else 0

        district_rainfall[district] = {
            'district': district,
            'annual': avg_annual,
            'monsoon': avg_seasons.get('monsoon', 0),
            'winter': avg_seasons.get('winter', 0),
            'preMonsoon': avg_seasons.get('preMonsoon', 0),
            'postMonsoon': avg_seasons.get('postMonsoon', 0),
        }

    # Add curated-only districts
    for district, vals in CURATED_RAINFALL.items():
        if district not in district_rainfall:
            district_rainfall[district] = {'district': district, **vals}

    # --- Monthly rainfall (state average from all cities) ---
    monthly_totals = defaultdict(lambda: defaultdict(list))  # month -> year -> total
    for city, data in raw.items():
        daily = data.get('daily', data.get('hourly', {}))
        times = daily.get('time', [])
        precip = daily.get('precipitation_sum', [])
        city_monthly = defaultdict(lambda: defaultdict(float))
        for i, t in enumerate(times):
            if i >= len(precip) or precip[i] is None:
                continue
            year = int(t[:4])
            month = int(t[5:7])
            city_monthly[month][year] += precip[i]
        for month in range(1, 13):
            for year, total in city_monthly[month].items():
                if 2016 <= year <= 2025:
                    monthly_totals[month][year].append(total)

    monthly_rainfall = []
    for month in range(1, 13):
        yearly_avgs = []
        for year, city_vals in monthly_totals[month].items():
            yearly_avgs.append(sum(city_vals) / len(city_vals))
        avg = round(sum(yearly_avgs) / len(yearly_avgs)) if yearly_avgs else 0
        monthly_rainfall.append({'month': MONTH_NAMES[month - 1], 'rainfall': avg})

    # --- Temperature trend (state average by year) ---
    yearly_temps = defaultdict(lambda: {'max': [], 'min': [], 'mean': []})
    for city, data in raw.items():
        daily = data.get('daily', data.get('hourly', {}))
        times = daily.get('time', [])
        t_max = daily.get('temperature_2m_max', [])
        t_min = daily.get('temperature_2m_min', [])
        t_mean = daily.get('temperature_2m_mean', [])
        for i, t in enumerate(times):
            year = int(t[:4])
            if i < len(t_max) and t_max[i] is not None:
                yearly_temps[year]['max'].append(t_max[i])
            if i < len(t_min) and t_min[i] is not None:
                yearly_temps[year]['min'].append(t_min[i])
            if i < len(t_mean) and t_mean[i] is not None:
                yearly_temps[year]['mean'].append(t_mean[i])

    temperature_trend = []
    for year in sorted(yearly_temps.keys()):
        d = yearly_temps[year]
        if not d['max']:
            continue
        temperature_trend.append({
            'year': year,
            'maxTemp': round(sum(d['max']) / len(d['max']), 1),
            'minTemp': round(sum(d['min']) / len(d['min']), 1),
            'avgTemp': round(sum(d['mean']) / len(d['mean']), 1),
        })

    result = {
        'districtRainfall': list(district_rainfall.values()),
        'monthlyRainfall': monthly_rainfall,
        'temperatureTrend': temperature_trend,
        'extremeEvents': EXTREME_EVENTS,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"Wrote climate data: {len(result['districtRainfall'])} districts, "
          f"{len(temperature_trend)} years of temperature, "
          f"{len(monthly_rainfall)} months of rainfall")


if __name__ == "__main__":
    transform()
