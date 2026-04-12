import type {
  OverviewData,
  DemographicsData,
  ClimateData,
  AQIData,
  HealthData,
  EducationData,
  CrimeData,
  TransportData,
  BudgetData,
  DistrictGeoJSON,
  EconomyData,
  TourismData,
  InvestmentData,
  CultureData,
} from './types';

const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/data';

async function fetchJSON<T>(path: string): Promise<T> {
  const url = `${BASE}/${path}`;
  console.log(`[data] Fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[data] Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  const json = await res.json();
  console.log(`[data] Loaded ${path}:`, typeof json, Array.isArray(json) ? `(${json.length} items)` : '');
  return json;
}

export const loadOverview = () => fetchJSON<OverviewData>('overview_wb.json');
export const loadDemographics = () => fetchJSON<DemographicsData>('demographics_wb.json');
export const loadClimate = () => fetchJSON<ClimateData>('climate_wb.json');
export const loadAQI = () => fetchJSON<AQIData>('aqi_wb.json');
export const loadHealth = () => fetchJSON<HealthData>('health_wb.json');
export const loadEducation = () => fetchJSON<EducationData>('education_wb.json');
export const loadCrime = () => fetchJSON<CrimeData>('crime_wb.json');
export const loadTransport = () => fetchJSON<TransportData>('transport_wb.json');
export const loadBudget = () => fetchJSON<BudgetData>('budget_wb.json');
export const loadDistricts = () => fetchJSON<DistrictGeoJSON>('districts_wb.geojson');
export const loadEconomy = () => fetchJSON<EconomyData>('economy_wb.json');
export const loadTourism = () => fetchJSON<TourismData>('tourism_wb.json');
export const loadInvestment = () => fetchJSON<InvestmentData>('investment_wb.json');
export const loadCulture = () => fetchJSON<CultureData>('culture_wb.json');
