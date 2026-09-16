import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

/** One stroke weight, one grid — the site's icons should read as a set. */
export const ArrowRight = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 10h12m0 0l-4.5-4.5M16 10l-4.5 4.5" />
  </svg>
);

export const ArrowUpRight = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5.5 14.5l9-9m0 0h-6m6 0v6" />
  </svg>
);

export const ArrowLeft = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M16 10H4m0 0l4.5-4.5M4 10l4.5 4.5" />
  </svg>
);

export const ArrowUp = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M10 16V4m0 0L5.5 8.5M10 4l4.5 4.5" />
  </svg>
);

export const ChevronLeft = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12.5 4.5L7 10l5.5 5.5" />
  </svg>
);

export const ChevronRight = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M7.5 4.5L13 10l-5.5 5.5" />
  </svg>
);

export const Close = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
);

export const Copy = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="7" y="7" width="9" height="9" />
    <path d="M13 7V4.5A.5.5 0 0012.5 4h-8a.5.5 0 00-.5.5v8a.5.5 0 00.5.5H7" />
  </svg>
);

export const Check = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);

export const Plus = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M10 4v12M4 10h12" />
  </svg>
);
