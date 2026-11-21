export type ArtKey = 'tanks' | 'pour' | 'taproom' | 'ingredients' | 'barrels' | 'exterior' | 'flight' | 'kettle' | 'glass-lager' | 'glass-ale' | 'glass-ipa' | 'glass-stout' | 'glass-seasonal';

export interface DayHours { day: string; open: string | null; close: string | null; closed: boolean }
export interface SocialLink { label: string; url: string }

export interface SiteSettings {
  id: number;
  businessName: string;
  tagline: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string | null;
  phoneVerified: boolean;
  email: string | null;
  mapEmbedUrl: string | null;
  autoMotion: boolean;
  ageGateEnabled: boolean;
  privacyUrl: string | null;
  termsUrl: string | null;
  hours: DayHours[];
  hoursVerified: boolean;
  socialLinks: SocialLink[];
  footerNote: string;
  updatedAt: string;
  fullAddress: string;
  phoneHref: string | null;
  emailHref: string | null;
  mapsUrl: string;
  directionsUrl: string;
  hoursDisplay: { day: string; label: string; confirmed: boolean; isToday: boolean }[];
  openStatus: { isOpen: boolean; label: string } | null;
}

export type ContentType = 'page_copy' | 'hero_slide' | 'story_chapter' | 'brand_value' | 'process_stage' | 'ingredient' | 'visitor_info';
export interface ContentBlock {
  id: number;
  type: ContentType;
  key: string | null;
  title: string;
  body: string | null;
  fields: Record<string, string | null>;
  sortOrder: number;
  published: boolean;
}
export type PageCopy = Record<string, ContentBlock>;

export interface Style { id: number; slug: string; name: string; pluralName: string; count: number }

export interface Product {
  id: number;
  slug: string;
  name: string;
  style: { slug: string; name: string } | null;
  shortDescription: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string;
  art: ArtKey;
  /** Formatted, e.g. "5.4%", or null when not supplied. */
  abv: string | null;
  ibu: number | null;
  /** Only the specifications that exist. */
  specs: { label: string; value: string }[];
  ingredients: string | null;
  tastingNotes: string | null;
  serving: string | null;
  featured: boolean;
  isSample: boolean;
}
export interface ProductDetail { product: Product; related: Product[]; prev: { slug: string; name: string } | null; next: { slug: string; name: string } | null; position: number; total: number }

export type GalleryCategory = 'Brewery' | 'Brewing Process' | 'Products' | 'Ingredients' | 'Details';
export interface GalleryItem { id: number; title: string; category: GalleryCategory; imageUrl: string | null; alt: string; ratio: string; focus: string; art: ArtKey; featuredOnHome: boolean; sortOrder: number; published: boolean }
export interface GalleryResponse { category: string; categories: { name: string; count: number }[]; items: GalleryItem[] }

export type InquiryStatus = 'new' | 'responded' | 'archived';
export interface Inquiry {
  id: number;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  enquiryType: string;
  message: string;
  consentAt: string;
  status: InquiryStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface EnquiryReceipt { received: true; reference: string; name: string; email: string; enquiryType: string; createdAt: string }

export interface AdminProduct extends Omit<Product, 'style' | 'abv' | 'specs'> {
  styleId: number;
  style: { id: number; name: string; slug: string } | null;
  abv: number | null;
  published: boolean;
  sortOrder: number;
}

export interface ApiErrorBody { statusCode?: number; message?: string | string[]; errors?: Record<string, string> }
