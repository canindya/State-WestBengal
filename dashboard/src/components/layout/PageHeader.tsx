interface PageHeaderProps {
  title: string;
  description: string;
  accent?: string;
  /**
   * Optional "The story" paragraph rendered below the title. Use to set up
   * the page's Big Idea — three sentences, beginning/middle/end. Charts
   * below are then read as evidence, not as isolated widgets.
   */
  story?: string;
}

export default function PageHeader({ title, description, accent = 'ganga', story }: PageHeaderProps) {
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
    <div className={`mb-8 border-l-4 ${borderColor} pl-4 sm:pl-5`}>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm sm:text-base text-muted max-w-3xl">{description}</p>
      {story && (
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/90 max-w-3xl">
          {story}
        </p>
      )}
    </div>
  );
}
