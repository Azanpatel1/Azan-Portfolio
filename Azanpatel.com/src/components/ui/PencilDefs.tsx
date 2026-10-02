/**
 * Shared SVG filter definitions for the pencil look. Mounted once in Layout.
 * `.hw-rough` -> #pencil-edge (displacement 1.6 + grain) for 44px+ headings,
 * `.hw-rough-sm` -> #pencil-edge-sm (displacement 1.1) for 28–40px headings.
 * Never apply these to body-size text (see src/handwriting/README.md).
 */
const PencilDefs = () => (
  <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
    <defs>
      <filter id="pencil-edge" x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="2" seed="4" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.0" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="9" result="grain" />
        <feColorMatrix in="grain" type="luminanceToAlpha" result="ga" />
        <feComponentTransfer in="ga" result="gmask">
          <feFuncA type="table" tableValues="0.5 1 1" />
        </feComponentTransfer>
        <feComposite in="rough" in2="gmask" operator="in" />
      </filter>
      <filter id="pencil-edge-sm" x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="2" seed="4" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="0.6" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="9" result="grain" />
        <feColorMatrix in="grain" type="luminanceToAlpha" result="ga" />
        <feComponentTransfer in="ga" result="gmask">
          <feFuncA type="table" tableValues="0.5 1 1" />
        </feComponentTransfer>
        <feComposite in="rough" in2="gmask" operator="in" />
      </filter>
    </defs>
  </svg>
);

export default PencilDefs;
