'use client';
import { useTranslation } from '@/i18n/useTranslation';
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border py-4 text-center text-sm text-muted">
      {t('layout.footer')}
    </footer>
  );
}
