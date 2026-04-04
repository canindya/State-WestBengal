'use client';

import PageHeader from '@/components/layout/PageHeader';
import { useTranslation } from '@/i18n/useTranslation';

export default function DemographicsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t('demographics.pageTitle')}
        description={t('demographics.pageDesc')}
        accent="shantiniketan"
      />
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted">
        <p className="text-lg font-medium">{t('common.comingSoon')}</p>
        <p className="mt-2 text-sm">{t('common.comingSoonDesc')}</p>
      </div>
    </div>
  );
}
