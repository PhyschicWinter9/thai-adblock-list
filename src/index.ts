import * as fs from 'fs';
import * as path from 'path';
import { AdblockGenerator } from './lib/generator.js';
import { uBlockOriginConfig } from './configs/ublockOrigin.js';
import { adBlockPlusConfig } from './configs/adBlockPlus.js';
import { adGuardConfig } from './configs/adGuard.js';
import { 
  GeneratorConfig, 
  AdblockConfigs, 
  AdblockGeneratorError,
  GenerationResult 
} from './types/index.js';
import { createLogger } from './lib/utils.js';

// Initialize logger
const logger = createLogger('Main');

// Main Configuration
const config: GeneratorConfig = {
  // Source file containing the rules
  sourceFile: 'adblock-filters-list/adblock-filters-list.txt',
  
  // Output directory
  outputDir: 'subscription',
  
  // Global settings
  version: '1.3',
  homepage: 'https://github.com/PhyschicWinter9/thai-adblock-list',
  expires: '1', // Days
  
  // Enable/disable specific adblockers
  enabledAdblockers: {
    uBlockOrigin: true,
    adBlockPlus: true,
    adGuard: true
  },
  
  // Generate domain list
  generateDomainList: true
};

// Available adblock configurations
const adblockConfigs: AdblockConfigs = {
  uBlockOrigin: uBlockOriginConfig,
  adBlockPlus: adBlockPlusConfig,
  adGuard: adGuardConfig
};

/**
 * Main function to orchestrate the generation process
 */
async function main(): Promise<void> {
  try {
    logger.info('🚀 Starting Thai Adblock List Generator...');
    
    // Validate configuration
    validateConfiguration();
    
    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
      logger.info(`📁 Created output directory: ${config.outputDir}`);
    }
    
    // Initialize generator
    const generator = new AdblockGenerator(config);
    
    // Load rules from source file
    logger.info(`📖 Loading rules from: ${config.sourceFile}`);
    const rules = generator.loadRules(config.sourceFile);
    logger.info(`✅ Loaded ${rules.length} rules`);
    
    // Track generation results
    const results: GenerationResult[] = [];
    
    // Generate lists for each enabled adblock
    for (const [name, enabled] of Object.entries(config.enabledAdblockers)) {
      if (!enabled) {
        logger.info(`⏭️  Skipping ${name} (disabled)`);
        continue;
      }
      
      const adblockConfig = adblockConfigs[name];
      if (!adblockConfig) {
        logger.error(`❌ Configuration not found for: ${name}`);
        continue;
      }
      
      logger.info(`🔧 Generating list for: ${name}`);
      
      try {
        const outputFile = path.join(
          config.outputDir, 
          `thai-adblock-list-${name.toLowerCase()}.txt`
        );
        
        const result = await generator.generateAdblockList(
          rules, 
          adblockConfig, 
          outputFile
        );
        
        results.push(result);
        logger.info(`✅ Generated: ${outputFile}`);
        logger.info(`   📊 Rules processed: ${result.rulesProcessed}/${result.originalRulesCount}`);
        
      } catch (error) {
        logger.error(`❌ Failed to generate list for ${name}:`);
        if (error instanceof AdblockGeneratorError) {
          logger.error(`   Code: ${error.code}`);
          logger.error(`   Message: ${error.message}`);
        } else {
          logger.error(`   ${error}`);
        }
      }
    }
    
    // Generate domain list if enabled
    if (config.generateDomainList) {
      logger.info('🌐 Generating domain list...');
      try {
        const domainFile = path.join(config.outputDir, 'domains.txt');
        const domainResult = await generator.generateDomainList(rules, domainFile);
        results.push(domainResult);
        logger.info(`✅ Generated: ${domainFile}`);
        logger.info(`   🌐 Domains extracted: ${domainResult.rulesProcessed}`);
      } catch (error) {
        logger.error('❌ Failed to generate domain list:');
        if (error instanceof AdblockGeneratorError) {
          logger.error(`   Code: ${error.code}`);
          logger.error(`   Message: ${error.message}`);
        } else {
          logger.error(`   ${error}`);
        }
      }
    }
    
    // Print summary
    printGenerationSummary(results);
    
    logger.info('🎉 Thai Adblock List generation completed!');
    
  } catch (error) {
    logger.error('💥 Fatal error during generation:');
    if (error instanceof AdblockGeneratorError) {
      logger.error(`Code: ${error.code}`);
      logger.error(`Message: ${error.message}`);
      if (error.details) {
        logger.error(`Details: ${JSON.stringify(error.details, null, 2)}`);
      }
    } else {
      logger.error(`${error}`);
    }
    process.exit(1);
  }
}

/**
 * Validate the main configuration
 */
function validateConfiguration(): void {
  // Check if source file exists
  if (!fs.existsSync(config.sourceFile)) {
    throw new AdblockGeneratorError(
      `Source file not found: ${config.sourceFile}`,
      'SOURCE_FILE_NOT_FOUND',
      { sourceFile: config.sourceFile }
    );
  }
  
  // Check if at least one adblock is enabled
  const enabledCount = Object.values(config.enabledAdblockers)
    .filter(Boolean).length;
  
  if (enabledCount === 0 && !config.generateDomainList) {
    throw new AdblockGeneratorError(
      'No adblockers enabled and domain list generation disabled',
      'NO_OUTPUTS_ENABLED'
    );
  }
  
  // Validate adblock configurations
  for (const [name, enabled] of Object.entries(config.enabledAdblockers)) {
    if (enabled && !adblockConfigs[name]) {
      throw new AdblockGeneratorError(
        `Adblock configuration missing for enabled adblock: ${name}`,
        'MISSING_ADBLOCK_CONFIG',
        { adblockName: name }
      );
    }
  }
  
  logger.info('✅ Configuration validation passed');
}

/**
 * Print generation summary
 */
function printGenerationSummary(results: GenerationResult[]): void {
  if (results.length === 0) {
    logger.warn('⚠️  No files were generated');
    return;
  }
  
  logger.info('\n📊 Generation Summary:');
  logger.info('═'.repeat(50));
  
  let totalOriginalRules = 0;
  let totalProcessedRules = 0;
  
  for (const result of results) {
    const fileName = path.basename(result.outputPath);
    const efficiency = ((result.rulesProcessed / result.originalRulesCount) * 100).toFixed(1);
    
    logger.info(`📄 ${fileName}`);
    logger.info(`   Original rules: ${result.originalRulesCount.toLocaleString()}`);
    logger.info(`   Processed rules: ${result.rulesProcessed.toLocaleString()}`);
    logger.info(`   Efficiency: ${efficiency}%`);
    logger.info(`   Comments: ${result.statistics.comments}`);
    logger.info(`   Network filters: ${result.statistics.networkFilters}`);
    logger.info(`   Element hiding: ${result.statistics.elementHiding}`);
    logger.info(`   Exceptions: ${result.statistics.exceptions}`);
    logger.info('');
    
    totalOriginalRules = Math.max(totalOriginalRules, result.originalRulesCount);
    totalProcessedRules += result.rulesProcessed;
  }
  
  logger.info(`📈 Total files generated: ${results.length}`);
  logger.info(`📊 Total rules processed: ${totalProcessedRules.toLocaleString()}`);
  logger.info('═'.repeat(50));
}

/**
 * Handle uncaught errors
 */
process.on('uncaughtException', (error) => {
  logger.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the generator
if (require.main === module) {
  main().catch((error) => {
    logger.error('💥 Main process error:', error);
    process.exit(1);
  });
}

export { main, config, adblockConfigs };