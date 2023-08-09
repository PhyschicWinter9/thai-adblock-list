const fs = require('fs');
const path = require('path');
const dateFormat = require('date-and-time');

// Configuration Header
const ExtenstionName = "Adblock Plus 3.18"
const Version = "1.3"
const Title = 'THAIADBLOCK LISTS';
const VersionTimeStamps = dateFormat.format(new Date(), "DDMMYYYY");
const LastModified = dateFormat.format(new Date(), "DD-MM-YYYY");
const Expires = "1"; // Days
const Homepage = "https://github.com/PhyschicWinter9/thai-adblock-list"

// Configuration File
const pathRulesFileName = 'adblock-filters-list/adblock-filters-list.txt'; // Change this to the file containing your rules
const outputFileName = 'thai-adblock-list.txt'; // Change this to your desired output file name

// Template Header
const EasyListHeader = `\
[${ExtenstionName}] 
! Version: ${Version}-${VersionTimeStamps}
! Title: ${Title}
! Last modified: ${LastModified}
! Expires: ${Expires} day (update frequency)
! Homepage: ${Homepage}
!
! This is a list of adservers and trackers that are blocked by default.
! You can add your own filters here. Just make sure to use the $badfilter
! option, otherwise your filter will be ignored.
!
! This list is maintained by PhyschicWinter9.
! Please report unblocked adservers or other issues here: https://github.com/PhyschicWinter9/thai-adblock-list/issues
!
!\n`;

const DomainHeader = `\
[Domain List]
! Created: ${dateFormat.format(new Date(), "dd-mm-yyyy")}
! Homepage: ${Homepage}
!
! This list contains the unique domains from the EasyList rules.
!
!\n`;



// Function to read rules from a file
function readRulesFromFile(fileName) {
    const filePath = path.join(__dirname, fileName);
    try {
      const rules = fs.readFileSync(filePath, 'utf8').split('\n').map(rule => rule.trim());
      return rules;
    } catch (error) {
      console.error('An error occurred while reading the rules file:', error);
      return [];
    }
  }
  
  // Function to generate the EasyList subscription file
  function generateEasyListFile(fileName, header, rules) {
    try {
      const content = header + rules.join('\n');
      fs.writeFileSync(fileName, content);
      console.log(`Subscription file "${fileName}" generated successfully.`);
    } catch (error) {
      console.error('An error occurred while generating the subscription file:', error);
    }
  }

  // Extract unique domains from rules
function extractDomains(rules) {
    const domainSet = new Set();
    for (const rule of rules) {
        if (rule.startsWith('||') && rule.indexOf('/') > 0) {
            const domain = rule.substring(2, rule.indexOf('/', 2));
            domainSet.add(domain);
        }
    }
    return Array.from(domainSet);
}

// Generate the domain.txt file
function generateDomainFile(domains) {
    try {
        const content = DomainHeader + domains.join('\n');
        fs.writeFileSync('domain.txt', content);
        console.log('Domain file "domain.txt" generated successfully.');
    } catch (error) {
        console.error('An error occurred while generating the domain file:', error);
    }
}



const AdblockFilterList = readRulesFromFile(pathRulesFileName);
const uniqueDomains = extractDomains(AdblockFilterList);
generateDomainFile(uniqueDomains);
generateEasyListFile(outputFileName, EasyListHeader, AdblockFilterList);

