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
} from './types';

const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/data';

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
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
