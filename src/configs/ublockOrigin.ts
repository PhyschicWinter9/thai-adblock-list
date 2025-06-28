import { AdblockConfig } from '../types/index.js';
import { normalizeRule, isComment, shouldKeepComment } from '../lib/utils.js';

export const uBlockOriginConfig: AdblockConfig = {
  // Basic information
  extensionName: 'uBlock Origin',
  title: 'Thai Adblock List for uBlock Origin',
  description: 'Comprehensive adblock list for Thai websites optimized for uBlock Origin',
  
  // Additional header content specific to uBlock Origin
  additionalHeader: `! This list is optimized for uBlock Origin
! uBlock Origin supports advanced syntax and network filtering
! For best results, use with uBlock Origin v1.40.0 or later`,

  // Rule transformations specific to uBlock Origin
  ruleTransformations: [
    // Normalize whitespace
    (rule: string): string => normalizeRule(rule),
    
    // Add uBlock Origin specific optimizations
    (rule: string): string => {
      // Convert generic element hiding to more specific ones where possible
      if (rule.includes('##') && !rule.includes(',')) {
        // Keep as is - uBlock Origin handles these well
        return rule;
      }
      return rule;
    }
  ],

  // Rule filters specific to uBlock Origin
  ruleFilters: [
    // Keep all valid rules - uBlock Origin is very capable
    (rule: string): boolean => {
      // Skip empty rules
      if (rule.trim() === '') return false;
      
      // Filter comments - keep only useful ones
      if (isComment(rule)) {
        return shouldKeepComment(rule);
      }
      
      // Keep all other rules - uBlock Origin can handle complex syntax
      return true;
    }
  ],

  // uBlock Origin specific features
  features: {
    supportsBadFilter: true,
    supportsNetworkFilters: true,
    supportsElementHiding: true,
    supportsCosmeticFiltering: true,
    supportsScriptletInjection: true,
    supportsRedirectDirectives: true,
    supportsRemoveParam: true,
    supportsCSP: true
  },

  // Priority for rule ordering (higher = processed first)
  rulePriority: {
    comments: 1000,
    exceptions: 900,
    networkFilters: 800,
    elementHiding: 700,
    other: 600
  }
};