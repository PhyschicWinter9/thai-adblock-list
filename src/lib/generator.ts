import * as fs from 'fs';
import * as path from 'path';
import {
    AdblockConfig,
    AdblockGeneratorError,
    DateFormat,
    GenerationResult,
    GeneratorConfig,
    RuleStatistics,
    RuleType
} from '../types/index.js';
import {
    createLogger,
    extractDomains,
    formatDate,
    getRuleType,
    removeDuplicates,
    validateFilePath,
    validateRules,
} from './utils.js';

export class AdblockGenerator {
  private readonly logger = createLogger('Generator');
  
  constructor(private readonly config: GeneratorConfig) {
    this.validateConfig(config);
  }

  /**
   * Validate generator configuration
   */
  private validateConfig(config: GeneratorConfig): void {
    if (!config.sourceFile) {
      throw new AdblockGeneratorError(
        'Source file is required',
        'MISSING_SOURCE_FILE'
      );
    }
    
    if (!config.outputDir) {
      throw new AdblockGeneratorError(
        'Output directory is required',
        'MISSING_OUTPUT_DIR'
      );
    }
    
    if (!config.version) {
      throw new AdblockGeneratorError(
        'Version is required',
        'MISSING_VERSION'
      );
    }
  }

  /**
   * Load rules from a file
   */
  public loadRules(filePath: string): string[] {
    try {
      validateFilePath(filePath);
      
      const fullPath = path.resolve(filePath);
      
      if (!fs.existsSync(fullPath)) {
        throw new AdblockGeneratorError(
          `Source file not found: ${fullPath}`,
          'FILE_NOT_FOUND',
          { filePath: fullPath }
        );
      }
      
      this.logger.info(`Loading rules from: ${fullPath}`);
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const rules = content
        .split('\n')
        .map(rule => rule.trim())
        .filter(rule => rule.length > 0);
      
      const validationResult = validateRules(rules);
      
      if (validationResult.warnings.length > 0) {
        this.logger.warn(`Found ${validationResult.warnings.length} warnings during validation`);
        validationResult.warnings.slice(0, 5).forEach(warning => {
          this.logger.warn(warning);
        });
        if (validationResult.warnings.length > 5) {
          this.logger.warn(`... and ${validationResult.warnings.length - 5} more warnings`);
        }
      }
      
      if (validationResult.errors.length > 0) {
        this.logger.error(`Found ${validationResult.errors.length} errors during validation`);
        validationResult.errors.slice(0, 3).forEach(error => {
          this.logger.error(error);
        });
        throw new AdblockGeneratorError(
          'Rule validation failed',
          'VALIDATION_FAILED',
          { errors: validationResult.errors }
        );
      }
      
      this.logger.info(`Successfully loaded ${validationResult.validRules.length} rules`);
      return validationResult.validRules;
      
    } catch (error) {
      if (error instanceof AdblockGeneratorError) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AdblockGeneratorError(
        `Failed to load rules from ${filePath}: ${errorMessage}`,
        'LOAD_RULES_FAILED',
        { originalError: error, filePath }
      );
    }
  }

  /**
   * Generate header for adblock list
   */
  public generateHeader(adblockConfig: AdblockConfig): string {
    const timestamp = formatDate(new Date(), DateFormat.DDMMYYYY);
    const lastModified = formatDate(new Date(), DateFormat.DD_MM_YYYY);
    
    const header = `[${adblockConfig.extensionName}]
! Version: ${this.config.version}-${timestamp}
! Title: ${adblockConfig.title}
! Last modified: ${lastModified}
! Expires: ${this.config.expires} day (update frequency)
! Homepage: ${this.config.homepage}
! Description: ${adblockConfig.description}
!
! This is a list of adservers and trackers that are blocked by default.
! You can add your own filters here. Just make sure to use the $badfilter
! option, otherwise your filter will be ignored.
!
! This list is maintained by PhyschicWinter9.
! Please report unblocked adservers or other issues here: ${this.config.homepage}/issues
!
${adblockConfig.additionalHeader || ''}
!
`;
    return header;
  }

  /**
   * Process rules for specific adblock format
   */
  public processRules(rules: string[], adblockConfig: AdblockConfig): string[] {
    let processedRules = [...rules];

    this.logger.info(`Processing ${processedRules.length} rules for ${adblockConfig.extensionName}`);

    // Apply rule transformations if defined
    if (adblockConfig.ruleTransformations) {
      for (const transformation of adblockConfig.ruleTransformations) {
        processedRules = processedRules
          .map(rule => {
            try {
              return transformation(rule);
            } catch (error) {
              this.logger.warn(`Transformation failed for rule: ${rule}`);
              return rule;
            }
          })
          .filter((rule): rule is string => rule !== null);
      }
    }

    // Apply rule filters if defined
    if (adblockConfig.ruleFilters) {
      for (const filter of adblockConfig.ruleFilters) {
        const beforeCount = processedRules.length;
        processedRules = processedRules.filter(rule => {
          try {
            return filter(rule);
          } catch (error) {
            this.logger.warn(`Filter failed for rule: ${rule}`);
            return true; // Keep rule if filter fails
          }
        });
        this.logger.info(`Filter removed ${beforeCount - processedRules.length} rules`);
      }
    }

    // Remove duplicates and sort
    const uniqueRules = removeDuplicates(processedRules);
    this.logger.info(`Removed ${processedRules.length - uniqueRules.length} duplicate rules`);
    
    // Sort rules by type priority
    const sortedRules = this.sortRulesByPriority(uniqueRules, adblockConfig);
    
    this.logger.info(`Processed ${sortedRules.length} rules successfully`);
    return sortedRules;
  }

  /**
   * Sort rules by priority
   */
  private sortRulesByPriority(rules: string[], adblockConfig: AdblockConfig): string[] {
    return rules.sort((a, b) => {
      const priorityA = this.getRulePriority(a, adblockConfig);
      const priorityB = this.getRulePriority(b, adblockConfig);
      
      // Higher priority first
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // Alphabetical order for same priority
      return a.localeCompare(b);
    });
  }

  /**
   * Get priority for a rule
   */
  private getRulePriority(rule: string, adblockConfig: AdblockConfig): number {
    const ruleType = getRuleType(rule);
    
    switch (ruleType) {
      case RuleType.COMMENT:
        return adblockConfig.rulePriority.comments;
      case RuleType.ELEMENT_HIDING:
        return adblockConfig.rulePriority.elementHiding;
      case RuleType.NETWORK_FILTER:
        if (rule.startsWith('@@')) {
          return adblockConfig.rulePriority.exceptions;
        }
        return adblockConfig.rulePriority.networkFilters;
      default:
        return adblockConfig.rulePriority.other;
    }
  }

  /**
   * Generate adblock list file
   */
  public async generateAdblockList(
    rules: string[],
    adblockConfig: AdblockConfig,
    outputPath: string
  ): Promise<GenerationResult> {
    try {
      validateFilePath(outputPath);
      
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        this.logger.info(`Created output directory: ${outputDir}`);
      }
      
      // Process rules for this adblock format
      const processedRules = this.processRules(rules, adblockConfig);
      
      // Generate header
      const header = this.generateHeader(adblockConfig);
      
      // Combine header and rules
      const content = header + processedRules.join('\n') + '\n';
      
      // Write to file
      fs.writeFileSync(outputPath, content, 'utf8');
      
      const statistics = this.getStatistics(processedRules);
      
      this.logger.info(`Generated ${outputPath} with ${processedRules.length} rules`);
      
      return {
        outputPath,
        rulesProcessed: processedRules.length,
        originalRulesCount: rules.length,
        statistics
      };
      
    } catch (error) {
      if (error instanceof AdblockGeneratorError) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AdblockGeneratorError(
        `Failed to generate adblock list: ${errorMessage}`,
        'GENERATION_FAILED',
        { originalError: error, outputPath, adblockConfig: adblockConfig.extensionName }
      );
    }
  }

  /**
   * Generate domain list file
   */
  public async generateDomainList(rules: string[], outputPath: string): Promise<GenerationResult> {
    try {
      validateFilePath(outputPath);
      
      const domains = extractDomains(rules);
      const timestamp = formatDate(new Date(), DateFormat.DD_MM_YYYY);
      
      const header = `[Domain List]
! Created: ${timestamp}
! Homepage: ${this.config.homepage}
! Total domains: ${domains.length}
!
! This list contains the unique domains from the adblock rules.
!
!
`;
      
      const content = header + domains.join('\n') + '\n';
      
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, content, 'utf8');
      
      this.logger.info(`Generated domain list with ${domains.length} domains`);
      
      return {
        outputPath,
        rulesProcessed: domains.length,
        originalRulesCount: rules.length,
        statistics: this.getStatistics(rules)
      };
      
    } catch (error) {
      if (error instanceof AdblockGeneratorError) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AdblockGeneratorError(
        `Failed to generate domain list: ${errorMessage}`,
        'DOMAIN_GENERATION_FAILED',
        { originalError: error, outputPath }
      );
    }
  }

  /**
   * Get statistics for rules
   */
  public getStatistics(rules: string[]): RuleStatistics {
    const stats: RuleStatistics = {
      total: rules.length,
      elementHiding: 0,
      networkFilters: 0,
      exceptions: 0,
      comments: 0
    };
    
    for (const rule of rules) {
      const ruleType = getRuleType(rule);
      
      switch (ruleType) {
        case RuleType.COMMENT:
          stats.comments++;
          break;
        case RuleType.ELEMENT_HIDING:
          stats.elementHiding++;
          break;
        case RuleType.NETWORK_FILTER:
          if (rule.startsWith('@@')) {
            stats.exceptions++;
          } else {
            stats.networkFilters++;
          }
          break;
      }
    }
    
    return stats;
  }
}