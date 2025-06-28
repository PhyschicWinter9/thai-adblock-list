import { AdblockConfig } from '../types/index.js';
import { normalizeRule, isComment, shouldKeepComment } from '../lib/utils.js';

export const adBlockPlusConfig: AdblockConfig = {
  // Basic information
  extensionName: 'Adblock Plus 3.18',
  title: 'Thai Adblock List for Adblock Plus',
  description: 'Comprehensive adblock list for Thai websites compatible with Adblock Plus',
  
  // Additional header content specific to Adblock Plus
  additionalHeader: `! This list is compatible with Adblock Plus
! Adblock Plus syntax and features supported
! For best results, use with Adblock Plus v3.10 or later`,

  // Rule transformations specific to Adblock Plus
  ruleTransformations: [
    // Normalize whitespace
    (rule: string): string => normalizeRule(rule),
    
    // Convert uBlock Origin specific syntax to Adblock Plus compatible
    (rule: string): string | null => {
      // Remove uBlock Origin specific modifiers that ABP doesn't support
      if (rule.includes('$redirect=')) {
        // Convert redirect to generic block for ABP
        return rule.replace(/\$redirect=[^,]*,?/g, '$').replace(/\$$/g, '');
      }
      
      // Handle removeparam (not supported in ABP)
      if (rule.includes('$removeparam')) {
        // Remove these rules as ABP doesn't support them
        return null;
      }
      
      // Handle CSP rules (limited support in ABP)
      if (rule.includes('$csp=')) {
        // Keep basic CSP rules, remove complex ones
        return rule;
      }
      
      return rule;
    }
  ],

  // Rule filters specific to Adblock Plus
  ruleFilters: [
    // Filter out rules that aren't compatible with Adblock Plus
    (rule: string): boolean => {
      // Skip empty or null rules
      if (!rule || rule.trim() === '') return false;
      
      // Filter comments - keep only useful ones
      if (isComment(rule)) {
        return shouldKeepComment(rule);
      }
      
      // Remove uBlock Origin specific syntax that ABP doesn't support
      if (rule.includes('$removeparam') || 
          rule.includes('$removeheader') ||
          rule.includes(':style(') ||
          rule.includes(':remove()') ||
          rule.includes('##^')) {
        return false;
      }
      
      // Remove complex scriptlet injections
      if (rule.includes('##+js(') || rule.includes('##script:inject(')) {
        return false;
      }
      
      return true;
    }
  ],

  // Adblock Plus specific features
  features: {
    supportsBadFilter: true,
    supportsNetworkFilters: true,
    supportsElementHiding: true,
    supportsCosmeticFiltering: true,
    supportsScriptletInjection: false, // Limited support
    supportsRedirectDirectives: false,
    supportsRemoveParam: false,
    supportsCSP: true // Limited support
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