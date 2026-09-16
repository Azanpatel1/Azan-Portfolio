/** Zero-padded index the way the plates are numbered: 1 -> "01". */
export const pad = (n: number, width = 2) => String(n).padStart(width, '0');
