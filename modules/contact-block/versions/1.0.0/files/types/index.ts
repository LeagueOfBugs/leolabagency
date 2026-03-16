export interface BusinessHours {
  days: string;
  hours: string;
}

export interface ContactBlockProps {
  businessName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email?: string;
  hours: BusinessHours[];
  /** Google Maps embed src URL */
  mapEmbedUrl?: string;
  /** e.g. "Street parking available on Main St." */
  parkingNote?: string;
  /** Shown above hours — e.g. "Walk-ins welcome" */
  note?: string;
}
