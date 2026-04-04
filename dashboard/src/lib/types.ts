// Overview / Landing page
export interface OverviewData {
  population: { value: string; year: number; source: string };
  populationDensity: { value: string; unit: string; source: string };
  literacy: { value: string; male: string; female: string; source: string };
  sexRatio: { value: number; source: string };
  gsdp: { value: string; growthRate: string; year: string; source: string };
  hdi: { value: number; rank: number; source: string };
  forestCover: { value: string; percentage: string; source: string };
  roadDensity: { value: string; unit: string; source: string };
}

// Demographics
export interface DistrictDemographic {
  district: string;
  population: number;
  area: number;
  density: number;
  literacy: number;
  sexRatio: number;
  urbanPercentage: number;
  scPercentage: number;
  stPercentage: number;
}

export interface DemographicsData {
  districts: DistrictDemographic[];
  populationTrend: { year: number; population: number; urban: number; rural: number }[];
  ageDistribution: { ageGroup: string; male: number; female: number }[];
}

// Climate
export interface ClimateData {
  districtRainfall: { district: string; annual: number; monsoon: number; winter: number; preMonsoon: number; postMonsoon: number }[];
  monthlyRainfall: { month: string; rainfall: number }[];
  temperatureTrend: { year: number; maxTemp: number; minTemp: number; avgTemp: number }[];
  extremeEvents: { year: number; event: string; type: string; affected: string }[];
}

// Air Quality
export interface AQIDaily {
  date: string;
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface AQIData {
  daily: AQIDaily[];
  cities: string[];
}

// Health
export interface HealthData {
  infrastructure: { district: string; hospitals: number; phcs: number; chcs: number; beds: number; doctors: number }[];
  indicators: {
    imr: { value: number; trend: { year: string; value: number }[] };
    mmr: { value: number; trend: { year: string; value: number }[] };
    immunization: { value: number; children: Record<string, number> };
    institutionalDelivery: number;
    anemia: { women: number; children: number };
  };
  nfhs: Record<string, Record<string, number | string>>;
}

// Education
export interface EducationData {
  schools: { type: string; count: number; management: string }[];
  enrollment: { level: string; boys: number; girls: number; total: number }[];
  infrastructure: { metric: string; percentage: number }[];
  teacherMetrics: { district: string; pupilTeacherRatio: number; qualified: number }[];
  learningOutcomes: { indicator: string; wb: number; national: number }[];
}

// Crime
export interface CrimeData {
  yearly: { year: number; total: number; ipc: number; sll: number; rate: number }[];
  categories: { category: string; count: number; year: number }[];
  specialCategories: { category: string; count: number; year: number }[];
  districtWise: { district: string; total: number; rate: number }[];
}

// Transport
export interface TransportData {
  roadNetwork: { type: string; length: number; unit: string }[];
  vehicleRegistration: { year: number; total: number; twoWheeler: number; car: number; commercial: number; ev: number }[];
  publicTransport: { mode: string; fleet: number; dailyRidership: number }[];
  accidents: { year: number; total: number; deaths: number; injuries: number }[];
}

// Budget
export interface BudgetData {
  revenue: { year: string; ownTax: number; nonTax: number; centralTransfers: number; total: number }[];
  expenditure: { year: string; revenue: number; capital: number; total: number }[];
  sectorExpenditure: { sector: string; amount: number; percentage: number; year: string }[];
  fiscalIndicators: { year: string; fiscalDeficit: number; revenueDeficit: number; debtGsdpRatio: number }[];
}

// GeoJSON district feature
export interface DistrictFeature {
  type: 'Feature';
  properties: {
    district: string;
    dtcode: string;
    population?: number;
    density?: number;
    literacy?: number;
    [key: string]: string | number | undefined;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export interface DistrictGeoJSON {
  type: 'FeatureCollection';
  features: DistrictFeature[];
}
