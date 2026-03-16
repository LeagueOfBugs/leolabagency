export interface GalleryItemData {
  /** Required: the "after" image (or only image if no before/after) */
  src: string;
  alt: string;
  /** If provided, enables before/after toggle */
  beforeSrc?: string;
  /** Short caption shown below the image */
  caption?: string;
  /** Service type label e.g. "Hemming" */
  service?: string;
}

export interface GalleryGridProps {
  items: GalleryItemData[];
  heading?: string;
  subheading?: string;
  /** Number of columns on desktop. Default: 3 */
  columns?: 2 | 3 | 4;
}
