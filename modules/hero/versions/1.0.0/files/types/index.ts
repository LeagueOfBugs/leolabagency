export interface HeroCta {
  label: string;
  href: string;
  /** Default: "primary" */
  variant?: "primary" | "secondary";
}

export interface HeroProps {
  headline: string;
  subheadline?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  /** Short trust badges shown below the CTAs */
  badges?: string[];
  /** "dark" = charcoal bg / cream text (default), "light" = cream bg / dark text */
  variant?: "dark" | "light";
  /** Optional background image URL — overlaid with a dark scrim */
  backgroundImage?: string;
  /** Minimum height. Default: "80vh" */
  minHeight?: string;
}
