export interface SupportedSite {
  id: string;
  name: string;
  domain: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  en: Translation;
  th: Translation;
}

export type Language = 'en' | 'th';