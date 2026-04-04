interface PageHeaderProps {
  title: string;
  description: string;
  accent?: string;
}

export default function PageHeader({ title, description, accent = 'ganga' }: PageHeaderProps) {
  const borderColor = {
    ganga: 'border-ganga',
    sundarbans: 'border-sundarbans',
    shantiniketan: 'border-shantiniketan',
    durga: 'border-durga',
    mustard: 'border-mustard',
    terracotta: 'border-terracotta',
    twilight: 'border-twilight',
    tea: 'border-tea',
  }[accent] || 'border-ganga';

  return (
    <div className={`mb-8 border-l-4 ${borderColor} pl-4`}>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-muted">{description}</p>
    </div>
  );
}
