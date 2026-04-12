'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import type { DistrictGeoJSON, DistrictFeature } from '@/lib/types';

const MapContainer = dynamic(
  () => import('react-leaflet').then(m => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(m => m.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then(m => m.GeoJSON),
  { ssr: false }
);

type MetricKey = 'sexRatioAtBirth' | 'femaleLiteracy15_49' | 'institutionalDelivery' | 'fullImmunization' | 'childrenStunted';

const METRIC_OPTIONS: { key: MetricKey; label: string; format: (v: number) => string }[] = [
  { key: 'sexRatioAtBirth', label: 'Sex Ratio at Birth', format: (v) => v.toString() },
  { key: 'femaleLiteracy15_49', label: 'Female Literacy (%)', format: (v) => `${v.toFixed(1)}%` },
  { key: 'institutionalDelivery', label: 'Institutional Delivery (%)', format: (v) => `${v.toFixed(1)}%` },
  { key: 'fullImmunization', label: 'Full Immunization (%)', format: (v) => `${v.toFixed(1)}%` },
  { key: 'childrenStunted', label: 'Child Stunting (%)', format: (v) => `${v.toFixed(1)}%` },
];

function getMetricValue(props: DistrictFeature['properties'], metric: MetricKey): number {
  const val = props[metric];
  return typeof val === 'number' ? val : 0;
}

function interpolateColor(value: number, min: number, max: number): string {
  const t = max === min ? 0.5 : (value - min) / (max - min);
  // Blue (low) -> Green (mid) -> Red (high)
  if (t < 0.5) {
    const r = Math.round(43 + (45 - 43) * (t * 2));
    const g = Math.round(110 + (125 - 110) * (t * 2));
    const b = Math.round(153 + (70 - 153) * (t * 2));
    return `rgb(${r},${g},${b})`;
  } else {
    const r = Math.round(45 + (217 - 45) * ((t - 0.5) * 2));
    const g = Math.round(125 + (79 - 125) * ((t - 0.5) * 2));
    const b = Math.round(70 + (61 - 70) * ((t - 0.5) * 2));
    return `rgb(${r},${g},${b})`;
  }
}

export default function MapPage() {
  const { t } = useTranslation();
  const [geoData, setGeoData] = useState<DistrictGeoJSON | null>(null);
  const [metric, setMetric] = useState<MetricKey>('sexRatioAtBirth');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${base}/data/districts_wb.geojson`)
      .then(r => r.json())
      .then(setGeoData)
      .catch(() => setGeoData(null));
  }, []);

  const { min, max } = useMemo(() => {
    if (!geoData) return { min: 0, max: 1 };
    const values = geoData.features.map(f => getMetricValue(f.properties, metric));
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [geoData, metric]);

  const metricConfig = METRIC_OPTIONS.find(m => m.key === metric)!;

  const style = useCallback((feature: DistrictFeature) => {
    const value = getMetricValue(feature.properties, metric);
    return {
      fillColor: interpolateColor(value, min, max),
      weight: 1.5,
      opacity: 1,
      color: '#2D3748',
      fillOpacity: 0.7,
    };
  }, [metric, min, max]);

  const onEachFeature = useCallback((feature: DistrictFeature, layer: L.Layer) => {
    const props = feature.properties;
    const value = getMetricValue(props, metric);
    layer.bindTooltip(
      `<strong>${props.district}</strong><br/>${metricConfig.label}: ${metricConfig.format(value)}`,
      { sticky: true }
    );
    layer.on({
      mouseover: () => setHoveredDistrict(props.district),
      mouseout: () => setHoveredDistrict(null),
    });
  }, [metric, metricConfig]);

  if (!geoData) {
    return (
      <div>
        <PageHeader title={t('map.pageTitle')} description={t('map.pageDesc')} accent="sundarbans" />
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted">
          <p className="text-lg font-medium">{t('map.loading')}</p>
          <p className="mt-2 text-sm">District boundary GeoJSON will be added in a future update.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('map.pageTitle')}
        description={t('map.pageDesc')}
        accent="sundarbans"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Districts" value="23" color="ganga" />
        <StatCard label="Area" value="88,752 km²" color="sundarbans" />
        <StatCard label="Viewing" value={metricConfig.label} color="shantiniketan" />
        <StatCard label="Hovered" value={hoveredDistrict || 'None'} color="tea" />
      </div>

      {/* Metric selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-muted font-medium self-center">{t('common.colorBy')}</span>
        {METRIC_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setMetric(opt.key)}
            className={`text-xs py-1.5 px-3 rounded-full border transition-colors ${
              metric === opt.key
                ? 'bg-ganga text-white border-ganga'
                : 'text-muted border-border hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-xl border border-border overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={[22.9, 87.85]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            key={metric}
            data={geoData as unknown as GeoJSON.FeatureCollection}
            style={style as unknown as L.PathOptions}
            onEachFeature={onEachFeature as unknown as (feature: GeoJSON.Feature, layer: L.Layer) => void}
          />
        </MapContainer>
      </div>

      {/* Color scale legend */}
      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2">{t('common.legend')}: {metricConfig.label}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{metricConfig.format(min)}</span>
          <div className="flex-1 h-4 rounded" style={{
            background: `linear-gradient(to right, ${interpolateColor(min, min, max)}, ${interpolateColor((min + max) / 2, min, max)}, ${interpolateColor(max, min, max)})`
          }} />
          <span className="text-xs text-muted">{metricConfig.format(max)}</span>
        </div>
      </div>
    </div>
  );
}
