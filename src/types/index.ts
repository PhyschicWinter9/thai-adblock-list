/**
 * Configuration for the main generator
 */
export interface GeneratorConfig {
  /** Source file containing the adblock rules */
  sourceFile: string;
  /** Output directory for generated files */
  outputDir: string;
  /** Version of the generated lists */
  version: string;
  /** Homepage URL for the project */
  homepage: string;
  /** Expiration time in days */
  expires: string;
  /** Enable/disable specific adblockers */
  enabledAdblockers: Record<string, boolean>;
  /** Generate domain list */
  generateDomainList: boolean;
}

/**
 * Rule transformation function type
 */
export type RuleTransformationFn = (rule: string) => string | null;

/**
 * Rule filter function type
 */
export type RuleFilterFn = (rule: string) => boolean;

/**
 * Features supported by an adblock extension
 */
export interface AdblockFeatures {
  supportsBadFilter: boolean;
  supportsNetworkFilters: boolean;
  supportsElementHiding: boolean;
  supportsCosmeticFiltering: boolean;
  supportsScriptletInjection: boolean;
  supportsRedirectDirectives: boolean;
  supportsRemoveParam: boolean;
  supportsCSP: boolean;
  supportsExtendedCSS?: boolean;
  supportsAppModifier?: boolean;
  supportsAdvancedModifiers?: boolean;
}

/**
 * Rule priority mapping
 */
export interface RulePriority {
  comments: number;
  exceptions: number;
  networkFilters: number;
  elementHiding: number;
  other: number;
}

/**
 * Configuration for a specific adblock extension
 */
export interface AdblockConfig {
  /** Name of the extension/software */
  extensionName: string;
  /** Title for the filter list */
  title: string;
  /** Description of the filter list */
  description: string;
  /** Additional header content */
  additionalHeader?: string;
  /** Array of rule transformation functions */
  ruleTransformations?: RuleTransformationFn[];
  /** Array of rule filter functions */
  ruleFilters?: RuleFilterFn[];
  /** Features supported by this adblock */
  features: AdblockFeatures;
  /** Priority for rule ordering */
  rulePriority: RulePriority;
}

/**
 * Statistics about processed rules
 */
export interface RuleStatistics {
  total: number;
  elementHiding: number;
  networkFilters: number;
  exceptions: number;
  comments: number;
}

/**
 * Rule types enum
 */
export enum RuleType {
  COMMENT = 'comment',
  ELEMENT_HIDING = 'element-hiding',
  NETWORK_FILTER = 'network-filter',
  OTHER = 'other'
}

/**
 * Date format patterns
 */
export enum DateFormat {
  DDMMYYYY = 'DDMMYYYY',
  DD_MM_YYYY = 'DD-MM-YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD'
}

/**
 * Error types for the generator
 */
export class AdblockGeneratorError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AdblockGeneratorError';
  }
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  validRules: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Domain extraction options
 */
export interface DomainExtractionOptions {
  includeSubdomains?: boolean;
  excludeWildcards?: boolean;
  excludeExceptions?: boolean;
}

/**
 * Generation result interface
 */
export interface GenerationResult {
  outputPath: string;
  rulesProcessed: number;
  originalRulesCount: number;
  statistics: RuleStatistics;
}

/**
 * Available adblock configurations type
 */
export type AdblockConfigs = Record<string, AdblockConfig>;