'use client';

import { useEffect, useState } from 'react';
import { loadCulture } from '@/lib/data';
import type { CultureData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';

const TYPE_COLORS: Record<string, string> = {
  City: COLORS.gangaBlue,
  'Hill Station': COLORS.teaGreen,
  Nature: COLORS.sundarbansGreen,
  Heritage: COLORS.shantiniketan,
  Gateway: COLORS.twilightPurple,
  Beach: COLORS.mustardYellow,
  Wildlife: COLORS.terracottaBrown,
};

export default function CulturePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<CultureData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCulture()
      .then(setData)
      .catch(e => { console.error('Culture load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading culture data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('culture.loading')}</div>;

  return (
    <div>
      <PageHeader
        title={t('culture.pageTitle')}
        description={t('culture.pageDesc')}
        accent="twilight"
      />

      {/* Tagore quote */}
      <div className="mb-8 rounded-xl border-l-4 border-twilight bg-card p-6">
        <p className="text-lg italic text-foreground">&ldquo;{data.quote.text}&rdquo;</p>
        <p className="mt-2 text-sm text-muted">— {data.quote.author}, <span className="italic">{data.quote.source}</span></p>
      </div>

      {/* Nobel Laureates Timeline */}
      <ChartCard title="Nobel Laureates from Bengal" subtitle="Three Nobel Prizes rooted in Bengal's intellectual tradition" source="Nobel Foundation">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-twilight/30" />
          <div className="space-y-6">
            {data.nobelLaureates.map((nl) => (
              <div key={nl.name} className="relative pl-12">
                <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-twilight text-white flex items-center justify-center text-xs font-bold">
                  {nl.year}
                </div>
                <p className="font-semibold text-lg">{nl.name}</p>
                <p className="text-sm text-mustard">{nl.field}</p>
                <p className="text-sm text-muted mt-1">{nl.connection}</p>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      {/* Iconic Figures */}
      <div className="mt-6">
        <ChartCard title="Iconic Figures" subtitle="Personalities who shaped modern India from Bengal" source="West Bengal Heritage Commission">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.iconicFigures.map((fig, i) => (
              <div key={fig.name} className="rounded-lg border border-border bg-card-hover p-4">
                <p className="text-sm font-semibold" style={{ color: COLORS.chart[i % COLORS.chart.length] }}>{fig.domain}</p>
                <p className="text-lg font-bold mt-1">{fig.name}</p>
                <p className="text-xs text-muted mt-2">{fig.note}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Art Forms */}
      <div className="mt-6">
        <ChartCard title="Art Forms & Traditions" subtitle="Living heritage of Bengal" source="UNESCO, WB Heritage Commission">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.artForms.map((art, i) => (
              <div key={art.name} className="rounded-lg border border-border bg-card-hover p-3">
                <p className="text-xs uppercase tracking-wide" style={{ color: COLORS.chart[i % COLORS.chart.length] }}>{art.type}</p>
                <p className="font-semibold mt-1">{art.name}</p>
                <p className="text-xs text-muted mt-1">{art.recognition}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Destinations Grid */}
      <div className="mt-6">
        <ChartCard title="Places to Explore" subtitle="Twelve destinations across West Bengal" source="WB Tourism Department" data={data.destinations as unknown as Record<string, unknown>[]}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.destinations.map((dest) => {
              const color = TYPE_COLORS[dest.type] || COLORS.gangaBlue;
              return (
                <div key={dest.name} className="rounded-lg border border-border bg-card-hover p-4 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-lg font-bold">{dest.name}</p>
                    <span className="text-xs rounded-full px-2 py-0.5 shrink-0" style={{ backgroundColor: color + '33', color }}>
                      {dest.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-2 flex-1">{dest.highlight}</p>
                  <p className="text-xs text-muted mt-3">Best: <span className="text-foreground">{dest.bestSeason}</span></p>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
