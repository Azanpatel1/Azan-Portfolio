export interface FundingItem {
  /** Award or fellowship name, exactly as it is titled. */
  title: string;
  /** Awarding body, when it is not already in the title. */
  source?: string;
  /** "Jun 2024 – Jun 2026" or "Apr 2023". */
  period: string;
  /** Formatted with the currency symbol, e.g. "$22,338". Omit if undisclosed. */
  amount?: string;
}

/**
 * Grants, fellowships and awards, largest first.
 *
 * Empty on purpose: nothing in this repository records any funding, and these
 * figures are not the kind of thing to guess at. Add entries here and the
 * Funding section appears on the home page; leave it empty and the section is
 * skipped entirely.
 */
export const FUNDING: FundingItem[] = [];
