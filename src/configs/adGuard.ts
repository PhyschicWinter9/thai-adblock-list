import { AdblockConfig } from '../types/index.js';
import { normalizeRule, isComment, shouldKeepComment } from '../lib/utils.js';

export const adGuardConfig: AdblockConfig = {
  // Basic information
  extensionName: 'AdGuard',
  title: 'Thai Adblock List for AdGuard',
  description: 'Comprehensive adblock list for Thai websites optimized for AdGuard products',
  
  // Additional header content specific to AdGuard
  additionalHeader: `! This list is optimized for AdGuard products
! AdGuard supports extended syntax and advanced filtering
! Compatible with AdGuard Browser Extension, AdGuard for Windows/Mac/Android/iOS`,

  // Rule transformations specific to AdGuard
  ruleTransformations: [
    // Normalize whitespace
    (rule: string): string => normalizeRule(rule),
    
    // AdGuard specific optimizations
    (rule: string): string => {
      // AdGuard supports most uBlock Origin syntax, but let's optimize some rules
      
      // Convert to AdGuard extended CSS where beneficial
      if (rule.includes('##') && rule.includes(':not(')) {
        // AdGuard has better support for complex selectors
        return rule;
      }
      
      // Handle AdGuard specific modifiers
      if (rule.includes('$app=')) {
        // Keep AdGuard app-specific rules
        return rule;
      }
      
      return rule;
    }
  ],

  // Rule filters specific to AdGuard
  ruleFilters: [
    // AdGuard has excellent compatibility, so keep most rules
    (rule: string): boolean => {
      // Skip empty rules
      if (!rule || rule.trim() === '') return false;
      
      // Filter comments - keep only useful ones
      if (isComment(rule)) {
        return shouldKeepComment(rule);
      }
      
      // AdGuard supports most advanced syntax, so keep almost everything
      // Only filter out extremely specific syntax that might cause issues
      
      return true;
    }
  ],

  // AdGuard specific features (very comprehensive)
  features: {
    supportsBadFilter: true,
    supportsNetworkFilters: true,
    supportsElementHiding: true,
    supportsCosmeticFiltering: true,
    supportsScriptletInjection: true,
    supportsRedirectDirectives: true,
    supportsRemoveParam: true,
    supportsCSP: true,
    supportsExtendedCSS: true,
    supportsAppModifier: true,
    supportsAdvancedModifiers: true
  },

  // Priority for rule ordering
  rulePriority: {
    comments: 1000,
    exceptions: 900,
    networkFilters: 800,
    elementHiding: 700,
    other: 600
  }
};