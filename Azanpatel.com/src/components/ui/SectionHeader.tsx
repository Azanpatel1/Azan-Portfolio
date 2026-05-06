interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
}

const SectionHeader = ({ index, label, title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-xs text-accent tracking-[0.2em]">{index}</span>
        <span className="label">{label}</span>
        <span className="flex-1 h-px bg-ink-line" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-medium text-text max-w-3xl leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-text-muted max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
