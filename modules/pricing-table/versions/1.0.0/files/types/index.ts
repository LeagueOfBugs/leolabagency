export interface PricingItem {
  service: string;
  /** Optional clarifying note e.g. "cuff or plain" */
  notes?: string;
  /** Display string e.g. "$10" or "$50+" */
  from: string;
}

export interface PricingGroup {
  title: string;
  items: PricingItem[];
}

export interface PricingSectionProps {
  groups: PricingGroup[];
  heading?: string;
  subheading?: string;
  /** Shown below the table, e.g. disclaimer about quoted prices */
  notes?: string[];
}
