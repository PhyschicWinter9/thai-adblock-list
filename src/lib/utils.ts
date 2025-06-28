import {
  DateFormat,
  RuleType,
  ValidationResult,
  DomainExtractionOptions,
  AdblockGeneratorError
} from '../types/index.js';

/**
 * Format date according to the specified pattern
 */
export function formatDate(date: Date, pattern: DateFormat): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (pattern) {
    case DateFormat.DDMMYYYY:
      return `${day}${month}${year}`;
    case DateFormat.DD_MM_YYYY:
      return `${day}-${month}-${year}`;
    case DateFormat.YYYY_MM_DD:
      return `${year}-${month}-${day}`;
    default:
      return date.toISOString().split('T')[0] ?? '';
  }
}

/**
 * Extract unique domains from adblock rules
 */
export function extractDomains(
  rules: string[],
  options: DomainExtractionOptions = {}
): string[] {
  const {
    excludeWildcards = true,
    excludeExceptions = false
  } = options;

  const domainSet = new Set<string>();
  
  for (const rule of rules) {
    // Skip comments and empty lines
    if (isComment(rule) || rule.trim() === '') {
      continue;
    }
    
    // Skip exceptions if requested
    if (excludeExceptions && rule.startsWith('@@')) {
      continue;
    }
    
    // Extract domains from network filter rules (||domain.com)
    if (rule.startsWith('||')) {
      const domainMatch = rule.match(/^\|\|([^/$^]+)/);
      if (domainMatch?.[1]) {
        const domain = domainMatch[1];
        if (shouldIncludeDomain(domain, excludeWildcards)) {
          domainSet.add(domain);
        }
      }
    }
    
    // Extract domains from element hiding rules (domain.com##)
    else if (rule.includes('##')) {
      const parts = rule.split('##');
      const domainPart = parts[0];
      if (domainPart && !domainPart.startsWith('!')) {
        const domains = domainPart.split(',');
        for (const domain of domains) {
          const cleanDomain = domain.trim();
          if (cleanDomain && shouldIncludeDomain(cleanDomain, excludeWildcards)) {
            domainSet.add(cleanDomain);
          }
        }
      }
    }
  }
  
  return Array.from(domainSet).sort();
}

/**
 * Helper function to determine if a domain should be included
 */
function shouldIncludeDomain(domain: string, excludeWildcards: boolean): boolean {
  if (excludeWildcards && domain.includes('*')) {
    return false;
  }
  if (domain.includes('~')) {
    return false;
  }
  return domain.length > 0;
}

/**
 * Validate and clean rules
 */
export function validateRules(rules: string[]): ValidationResult {
  const validRules: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    
    // Skip empty lines
    if (!rule || rule.trim() === '') {
      continue;
    }
    
    try {
      // Basic validation
      const normalizedRule = normalizeRule(rule);
      
      // Check for common issues
      if (normalizedRule.length > 8000) {
        warnings.push(`Line ${i + 1}: Rule is very long (${normalizedRule.length} characters)`);
      }
      
      // Check for malformed rules
      if (normalizedRule.includes('##') && normalizedRule.includes('#@#')) {
        warnings.push(`Line ${i + 1}: Rule contains both hiding and exception syntax`);
      }
      
      validRules.push(normalizedRule);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Line ${i + 1}: ${errorMessage}`);
    }
  }
  
  return {
    validRules,
    errors,
    warnings
  };
}

/**
 * Remove duplicates from array while preserving order
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Check if a rule is a comment
 */
export function isComment(rule: string): boolean {
  return rule.trim().startsWith('!');
}

/**
 * Check if a comment is a date-URL comment that should be removed
 */
export function isDateUrlComment(rule: string): boolean {
  if (!isComment(rule)) {
    return false;
  }
  
  const trimmedRule = rule.trim();
  
  // Pattern: ! May 28, 2025 https://example.com
  // or similar date patterns with URLs
  const dateUrlPattern = /^!\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\s+https?:\/\//i;
  
  return dateUrlPattern.test(trimmedRule);
}

/**
 * Check if a comment should be kept (useful comments only)
 */
export function shouldKeepComment(rule: string): boolean {
  if (!isComment(rule)) {
    return true; // Not a comment, keep it
  }
  
  // Remove date-URL comments
  if (isDateUrlComment(rule)) {
    return false;
  }
  
  const trimmedRule = rule.trim().toLowerCase();
  
  // Keep important header comments
  if (trimmedRule.includes('title:') || 
      trimmedRule.includes('version:') || 
      trimmedRule.includes('homepage:') ||
      trimmedRule.includes('expires:') ||
      trimmedRule.includes('description:') ||
      trimmedRule.includes('last modified:')) {
    return true;
  }
  
  // Keep section dividers and important notes
  if (trimmedRule.includes('===') || 
      trimmedRule.includes('---') ||
      trimmedRule.includes('section') ||
      trimmedRule.includes('important') ||
      trimmedRule.includes('note:')) {
    return true;
  }
  
  // Remove empty comments (just "!")
  if (trimmedRule === '!') {
    return false;
  }
  
  // Keep other meaningful comments (longer than just a URL)
  // Remove comments that are just URLs without context
  if (trimmedRule.match(/^!\s*https?:\/\/[^\s]+\s*$/)) {
    return false;
  }
  
  return true;
}

/**
 * Check if a rule is an element hiding rule
 */
export function isElementHidingRule(rule: string): boolean {
  return rule.includes('##') || rule.includes('#@#');
}

/**
 * Check if a rule is a network filter rule
 */
export function isNetworkFilterRule(rule: string): boolean {
  return rule.startsWith('||') || 
         rule.startsWith('@@') || 
         (rule.includes('$') && !isElementHidingRule(rule));
}

/**
 * Normalize rule (remove extra whitespace, etc.)
 */
export function normalizeRule(rule: string): string {
  return rule.trim().replace(/\s+/g, ' ');
}

/**
 * Get rule type
 */
export function getRuleType(rule: string): RuleType {
  if (isComment(rule)) return RuleType.COMMENT;
  if (isElementHidingRule(rule)) return RuleType.ELEMENT_HIDING;
  if (isNetworkFilterRule(rule)) return RuleType.NETWORK_FILTER;
  return RuleType.OTHER;
}

/**
 * Safe file path validation
 */
export function validateFilePath(filePath: string): void {
  if (!filePath || typeof filePath !== 'string') {
    throw new AdblockGeneratorError(
      'Invalid file path provided',
      'INVALID_FILE_PATH',
      { filePath }
    );
  }
  
  // Basic path injection protection
  if (filePath.includes('..') || filePath.includes('~')) {
    throw new AdblockGeneratorError(
      'Potentially unsafe file path',
      'UNSAFE_FILE_PATH',
      { filePath }
    );
  }
}

/**
 * Parse rule modifiers
 */
export function parseRuleModifiers(rule: string): string[] {
  const modifierMatch = rule.match(/\$(.+)$/);
  if (!modifierMatch?.[1]) {
    return [];
  }
  
  return modifierMatch[1]
    .split(',')
    .map(modifier => modifier.trim())
    .filter(modifier => modifier.length > 0);
}

/**
 * Check if rule has specific modifier
 */
export function hasRuleModifier(rule: string, modifier: string): boolean {
  const modifiers = parseRuleModifiers(rule);
  return modifiers.includes(modifier);
}

/**
 * Get current timestamp for logging
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Create a safe logger function
 */
export function createLogger(prefix: string): {
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
} {
  return {
    info: (message: string, ...args: unknown[]): void => {
      console.log(`[${getTimestamp()}] ${prefix} INFO: ${message}`, ...args);
    },
    warn: (message: string, ...args: unknown[]): void => {
      console.warn(`[${getTimestamp()}] ${prefix} WARN: ${message}`, ...args);
    },
    error: (message: string, ...args: unknown[]): void => {
      console.error(`[${getTimestamp()}] ${prefix} ERROR: ${message}`, ...args);
    }
  };
}