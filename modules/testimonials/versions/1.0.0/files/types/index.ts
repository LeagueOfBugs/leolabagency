export interface Testimonial {
  name: string;
  /** e.g. "Binghamton, NY" */
  location?: string;
  quote: string;
  /** 1–5, default 5 */
  rating?: number;
  /** URL to avatar image */
  avatarUrl?: string;
}

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  heading?: string;
  subheading?: string;
  /** "light" (default) or "dark" background */
  variant?: "light" | "dark";
}
