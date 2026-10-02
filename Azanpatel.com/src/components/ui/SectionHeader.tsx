import Hand from '../../handwriting/Hand';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
}

const SectionHeader = ({ index, label, title, description }: SectionHeaderProps) => {
  // one small cascade per header, so the paragraph follows the heading (index/label first)
  // instead of every block of the header starting at once
  const group = `section:${label}`;
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <Hand group={group} className="font-mono text-xs text-accent tracking-[0.18em]">{index}</Hand>
        <Hand group={group} className="label">{label}</Hand>
        <span className="flex-1 h-px bg-ink-line" />
      </div>
      <Hand as="h2" roughSm group={group} className="text-3xl sm:text-4xl text-text max-w-3xl leading-snug">
        {title}
      </Hand>
      {description && (
        <Hand as="p" group={group} className="mt-4 text-text-muted max-w-2xl leading-relaxed">
          {description}
        </Hand>
      )}
    </div>
  );
};

export default SectionHeader;
