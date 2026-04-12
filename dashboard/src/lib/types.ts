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

// Demographics (NFHS-5 district data + RGI projections + SRS trends)
export interface DistrictNFHS5 {
  district: string;
  sexRatioAtBirth: number;
  femaleLiteracy15_49: number;
  institutionalDelivery: number;
  fullImmunization: number;
  childrenStunted: number;
  childrenUnderweight: number;
  improvedSanitation: number;
  cleanCookingFuel: number;
  electricity: number;
}

export interface DemographicsData {
  districts: DistrictNFHS5[];
  stateAverage: {
    sexRatioAtBirth: number;
    totalFertilityRate: number;
    femaleLiteracy15_49: number;
    institutionalDelivery: number;
    fullImmunization: number;
    childrenStunted: number;
    childrenUnderweight: number;
    improvedSanitation: number;
    cleanCookingFuel: number;
    electricity: number;
  };
  srsTrend: { year: number; birthRate: number; deathRate: number; naturalGrowthRate: number; imr: number }[];
  populationProjection: { year: number; total: number; male: number; female: number }[];
  ageProjection: { ageGroup: string; male2011: number; female2011: number; male2026: number; female2026: number }[];
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

// Economy
export interface EconomyData {
  gsdpTimeline: { year: string; valueLakhCr: number }[];
  sectorSplit: { sector: string; percentage: number }[];
  topExports: { name: string; rank: number; share: number }[];
  comparisonIndia: { metric: string; wb: number; india: number; unit: string; higherIsBetter: boolean }[];
  keyMetrics: {
    gsdpRank: number;
    gdpShareIndiaPct: number;
    gdpShare1960Pct: number;
    perCapitaIncomeInr: number;
    povertyRatePct: number;
    nationalPovertyPct: number;
    msmeUnitsLakh: number;
    msmeRank: number;
    industrialGrowthPct: number;
    nationalIndustrialGrowthPct: number;
    exportsBillionUsd: number;
    debtGsdpRatioPct: number;
    ownTaxRevenueCr: number;
    fiscalDeficitPctGsdp: number;
  };
  sources: string[];
}

// Tourism
export interface TourismData {
  foreignArrivals: { year: number; million: number }[];
  indiaShare: { name: string; value: number }[];
  internationalFlightsDaily: { city: string; flights: number }[];
  topSourceCountries: { country: string; share: number }[];
  unescoSites: { name: string; type: string; year: number }[];
  keyMetrics: {
    foreignArrivalsMillion: number;
    rankForeignArrivals: number;
    sharePct: number;
    yoyGrowthPct: number;
    durgaPujaEconomicImpactBillionUsd: number;
    communityPujasCount: number;
    kolkataIntlFlightsDaily: number;
    delhiIntlFlightsDaily: number;
    mumbaiIntlFlightsDaily: number;
  };
  sources: string[];
}

// Investment
export interface InvestmentData {
  bgbsEditions: { year: number; proposalsLakhCr: number }[];
  majorInvestments: { company: string; amountCr: number; sector: string; note: string }[];
  industrialInfra: {
    industrialParks: number;
    itParks: number;
    electronicsParks: number;
    siliconValleyHubCompanies: number;
    dataCentres: number;
    sezs: number;
    strikesSince2011: number;
  };
  keySectors: string[];
  keyMetrics: {
    cumulativeProposalsLakhCr: number;
    realizedLakhCr: number;
    mous2025: number;
    latestEditionYear: number;
    latestEditionProposalsLakhCr: number;
  };
  sources: string[];
}

// Culture
export interface CultureData {
  nobelLaureates: { name: string; field: string; year: number; connection: string }[];
  iconicFigures: { name: string; domain: string; note: string }[];
  artForms: { name: string; type: string; recognition: string }[];
  destinations: { name: string; type: string; highlight: string; bestSeason: string }[];
  quote: { text: string; author: string; source: string };
  sources: string[];
}

// GeoJSON district feature
export interface DistrictFeature {
  type: 'Feature';
  properties: {
    district: string;
    dtcode: string;
    sexRatioAtBirth?: number;
    femaleLiteracy15_49?: number;
    institutionalDelivery?: number;
    fullImmunization?: number;
    childrenStunted?: number;
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
