'use client';

import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';

interface CategoryToggleProps {
  categories: string[];
  active: Set<string>;
  onChange: (active: Set<string>) => void;
  className?: string;
}

export default function CategoryToggle({ categories, active, onChange, className = '' }: CategoryToggleProps) {
  const { t } = useTranslation();
  const allActive = active.size === categories.length;

  const toggle = (cat: string) => {
    const next = new Set(active);
    if (next.has(cat)) {
      if (next.size > 1) next.delete(cat);
    } else {
      next.add(cat);
    }
    onChange(next);
  };

  const resetAll = () => {
    onChange(new Set(categories));
  };

  return (
    <div className={`flex flex-wrap gap-1.5 mb-3 ${className}`}>
      <button
        onClick={resetAll}
        className="text-xs py-1.5 px-3 sm:py-1 sm:px-2.5 rounded-full border transition-colors font-semibold"
        style={{
          backgroundColor: allActive ? COLORS.gangaBlue : 'transparent',
          borderColor: COLORS.gangaBlue,
          color: allActive ? '#fff' : COLORS.gangaBlue,
          opacity: allActive ? 1 : 0.7,
        }}
      >
        {t('common.all')}
      </button>
      {categories.map((cat) => {
        const isActive = active.has(cat);
        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className="text-xs py-1.5 px-3 sm:py-1 sm:px-2.5 rounded-full border transition-colors"
            style={{
              backgroundColor: isActive ? COLORS.gangaBlue : 'transparent',
              borderColor: COLORS.gangaBlue,
              color: isActive ? '#fff' : COLORS.gangaBlue,
              opacity: isActive ? 1 : 0.5,
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
