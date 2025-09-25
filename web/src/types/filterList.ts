export interface FilterListMetadata {
  version: string;
  title: string;
  lastModified: string;
  expires: string;
  homepage: string;
  description: string;
  ruleCount: number;
  fileSize: string;
  fileSizeBytes: number;
}

export interface FilterProvider {
  id: string;
  name: string;
  description: string;
  subscribeUrl: string;
  rawUrl: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  instructions: string[];
  metadata?: FilterListMetadata;
  loading?: boolean;
  error?: string;
}