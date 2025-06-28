import * as fs from 'fs';
import * as path from 'path';
import { AdblockGenerator } from '../lib/generator.js';
import { 
  formatDate, 
  extractDomains, 
  validateRules,
} from '../lib/utils.js';
import { uBlockOriginConfig } from '../configs/ublockOrigin.js';
import { AdblockGeneratorError, DateFormat, GeneratorConfig } from '../types/index.js';

// Test configuration
const testConfig: GeneratorConfig = {
  sourceFile: 'test/test-rules.txt',
  outputDir: 'test/output',
  version: '1.0-test',
  homepage: 'https://test.example.com',
  expires: '1',
  enabledAdblockers: {
    uBlockOrigin: true,
    adBlockPlus: true,
    adGuard: true
  },
  generateDomainList: true
};

// Sample test rules
const testRules: string[] = [
  '! Test comment',
  '||example.com^',
  'example.com##.ad',
  '@@||example.com/allowed^',
  '||test.com/path$script,third-party',
  'test.com##div[id="banner"]',
  '',
  '! Another comment',
  '||domain.test^$badfilter'
];

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

/**
 * Test runner with proper TypeScript types
 */
class TestRunner {
  private results: TestResult[] = [];

  public test(name: string, testFn: () => void | Promise<void>): void {
    this.results.push({
      name,
      passed: false
    });

    const currentTest = this.results[this.results.length - 1]!;

    try {
      console.log(`Testing: ${name}`);
      const result = testFn();
      
      if (result instanceof Promise) {
        result
          .then(() => {
            currentTest.passed = true;
            console.log('✅ PASSED\n');
          })
          .catch((error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : String(error);
            currentTest.error = errorMessage;
            console.log(`❌ FAILED: ${errorMessage}\n`);
          });
      } else {
        currentTest.passed = true;
        console.log('✅ PASSED\n');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      currentTest.error = errorMessage;
      console.log(`❌ FAILED: ${errorMessage}\n`);
    }
  }

  public getSummary(): { passed: number; failed: number; total: number } {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.length - passed;
    return { passed, failed, total: this.results.length };
  }

  public getFailedTests(): TestResult[] {
    return this.results.filter(r => !r.passed);
  }
}

/**
 * Run all tests
 */
export async function runTests(): Promise<void> {
  console.log('🧪 Running Thai Adblock List Generator Tests (TypeScript)...\n');
  
  const runner = new TestRunner();
  
  // Test utility functions
  runner.test('Date formatting', () => {
    const date = new Date('2025-05-28');
    const ddmmyyyy = formatDate(date, DateFormat.DDMMYYYY);
    const ddmmyyyy_dash = formatDate(date, DateFormat.DD_MM_YYYY);
    
    if (ddmmyyyy !== '28052025') {
      throw new Error(`DDMMYYYY format failed: expected "28052025", got "${ddmmyyyy}"`);
    }
    if (ddmmyyyy_dash !== '28-05-2025') {
      throw new Error(`DD-MM-YYYY format failed: expected "28-05-2025", got "${ddmmyyyy_dash}"`);
    }
  });
  
  runner.test('Domain extraction', () => {
    const domains = extractDomains(testRules);
    const expectedDomains = ['example.com', 'test.com', 'domain.test'];
    
    for (const expected of expectedDomains) {
      if (!domains.includes(expected)) {
        throw new Error(`Expected domain ${expected} not found in: ${domains.join(', ')}`);
      }
    }
    
    if (domains.length !== expectedDomains.length) {
      throw new Error(`Expected ${expectedDomains.length} domains, got ${domains.length}`);
    }
  });
  
  runner.test('Rule validation', () => {
    const validationResult = validateRules(testRules);
    
    if (validationResult.validRules.length === 0) {
      throw new Error('No rules validated');
    }
    
    // Should filter out empty lines
    const hasEmptyLines = validationResult.validRules.some(rule => rule.trim() === '');
    if (hasEmptyLines) {
      throw new Error('Empty lines not filtered out');
    }
    
    // Check that we have the expected number of non-empty rules
    const expectedNonEmptyRules = testRules.filter(rule => rule.trim() !== '').length;
    if (validationResult.validRules.length !== expectedNonEmptyRules) {
      throw new Error(`Expected ${expectedNonEmptyRules} valid rules, got ${validationResult.validRules.length}`);
    }
  });
  
  // Test error handling
  runner.test('AdblockGeneratorError', () => {
    const error = new AdblockGeneratorError(
      'Test error message',
      'TEST_ERROR_CODE',
      { testData: 'test' }
    );
    
    if (error.name !== 'AdblockGeneratorError') {
      throw new Error(`Expected error name to be "AdblockGeneratorError", got "${error.name}"`);
    }
    
    if (error.code !== 'TEST_ERROR_CODE') {
      throw new Error(`Expected error code to be "TEST_ERROR_CODE", got "${error.code}"`);
    }
    
    if (!error.details || (error.details as any).testData !== 'test') {
      throw new Error('Error details not preserved correctly');
    }
  });
  
  // Test generator
  runner.test('Generator initialization', () => {
    const generator = new AdblockGenerator(testConfig);
    if (!generator) {
      throw new Error('Generator not initialized');
    }
  });
  
  runner.test('Generator config validation', () => {
    // Test with invalid config
    try {
      new AdblockGenerator({
        ...testConfig,
        sourceFile: '' // Invalid
      });
      throw new Error('Should have thrown error for invalid config');
    } catch (error) {
      if (!(error instanceof AdblockGeneratorError)) {
        throw new Error(`Expected AdblockGeneratorError, got ${error}`);
      }
      if (error.code !== 'MISSING_SOURCE_FILE') {
        throw new Error(`Expected error code MISSING_SOURCE_FILE, got ${error.code}`);
      }
    }
  });
  
  runner.test('Rule processing', () => {
    const generator = new AdblockGenerator(testConfig);
    const processed = generator.processRules(testRules, uBlockOriginConfig);
    
    if (processed.length === 0) {
      throw new Error('No rules processed');
    }
    
    // Check that comments are still present
    const hasComments = processed.some(rule => rule.startsWith('!'));
    if (!hasComments) {
      throw new Error('Comments were filtered out unexpectedly');
    }
  });
  
  runner.test('Header generation', () => {
    const generator = new AdblockGenerator(testConfig);
    const header = generator.generateHeader(uBlockOriginConfig);
    
    if (!header.includes(uBlockOriginConfig.title)) {
      throw new Error('Header missing title');
    }
    
    if (!header.includes(testConfig.version)) {
      throw new Error('Header missing version');
    }
    
    if (!header.includes(testConfig.homepage)) {
      throw new Error('Header missing homepage');
    }
  });
  
  runner.test('Statistics generation', () => {
    const generator = new AdblockGenerator(testConfig);
    const stats = generator.getStatistics(testRules);
    
    if (stats.total !== testRules.length) {
      throw new Error(`Expected total ${testRules.length}, got ${stats.total}`);
    }
    
    if (stats.comments === 0) {
      throw new Error('No comments detected in statistics');
    }
    
    if (stats.networkFilters === 0) {
      throw new Error('No network filters detected in statistics');
    }
    
    if (stats.elementHiding === 0) {
      throw new Error('No element hiding rules detected in statistics');
    }
  });
  
  // Test file operations
  runner.test('File generation (integration test)', async () => {
    // Create test directory if it doesn't exist
    const testDir = 'test/output';
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create temporary test rules file
    const testRulesFile = 'test/test-rules.txt';
    fs.writeFileSync(testRulesFile, testRules.join('\n'), 'utf8');
    
    try {
      const generator = new AdblockGenerator(testConfig);
      const rules = generator.loadRules(testRulesFile);
      
      if (rules.length === 0) {
        throw new Error('Failed to load test rules');
      }
      
      // Test adblock list generation
      const outputFile = path.join(testDir, 'test-output.txt');
      const result = await generator.generateAdblockList(
        rules, 
        uBlockOriginConfig, 
        outputFile
      );
      
      if (!fs.existsSync(outputFile)) {
        throw new Error('Output file not created');
      }
      
      if (result.rulesProcessed === 0) {
        throw new Error('No rules processed in output');
      }
      
      // Test domain list generation
      const domainFile = path.join(testDir, 'test-domains.txt');
      const domainResult = await generator.generateDomainList(rules, domainFile);
      
      if (!fs.existsSync(domainFile)) {
        throw new Error('Domain file not created');
      }
      
      if (domainResult.rulesProcessed === 0) {
        throw new Error('No domains extracted');
      }
      
      // Clean up test files
      fs.unlinkSync(testRulesFile);
      fs.unlinkSync(outputFile);
      fs.unlinkSync(domainFile);
      fs.rmdirSync(testDir);
      
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(testRulesFile)) fs.unlinkSync(testRulesFile);
      throw error;
    }
  });
  
  // Wait a bit for async tests to complete
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Print summary
  const summary = runner.getSummary();
  const failedTests = runner.getFailedTests();
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${summary.passed}`);
  console.log(`❌ Failed: ${summary.failed}`);
  console.log(`📈 Success Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%`);
  
  if (failedTests.length > 0) {
    console.log('\n💥 Failed Tests:');
    for (const test of failedTests) {
      console.log(`❌ ${test.name}: ${test.error ?? 'Unknown error'}`);
    }
    console.log('\n💥 Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error('💥 Test runner error:', error);
    process.exit(1);
  });
}