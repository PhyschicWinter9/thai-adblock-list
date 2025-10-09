# Thai Adblock Lists

### Introduction

This repository is designed for Thai people who surf the Internet and aims to provide an adblock list to enhance their browsing experience. The list is open for contributions from anyone who wants to contribute and improve it.

### Purpose

The main purpose of this repository is to block advertisements and unwanted content on various Thai websites. By using the adblock list, users can enjoy a cleaner and more streamlined browsing experience without intrusive ads. Key benefits include:

- Block intrusive advertisements on Thai websites
- Block malicious ads including illegal gambling advertisements
- Improve page loading speed and reduce bandwidth usage
- Provide a cleaner and safer browsing experience

### Getting Started

To utilize the Thai Adblock List, you can follow these steps:

1. Install an adblocker extension on your web browser. Popular options include:

   - uBlock Origin (Recommended)
   - Adblock Plus
   - AdGuard
   - Brave Browser (built-in adblocker)

2. Enable the adblocker extension on your web browser.

3. Visit the settings or options of your adblocker extension and locate the section for adding custom adblock lists.

4. Add the following URL as a custom adblock list:

   [Thai Adblock List RAW](https://raw.githubusercontent.com/PhyschicWinter9/thai-adblock-list/main/thai-adblock-list.txt)

5. Save the settings and reload the pages you visit to start enjoying an ad-free browsing experience.

### Features

- Optimized for Thai websites and Thai language content
- Blocks malicious advertisements including illegal gambling ads
- Improves page loading speed and reduces bandwidth usage
- Regular updates to maintain effectiveness
- Compatible with major adblocker extensions (uBlock Origin, Adblock Plus, AdGuard)
- Support for both desktop and mobile browsers

### Checksums

For your convenience, you can use these checksums to verify the integrity of the adblock list file:

- SHA-1: cd0864e2bfbeef7ed2c02d03fd3726fe7b30e748 thai-adblock-list.txt
- MD5: 00cacef56b345aef9dfc08e7fb7a30c2 thai-adblock-list.txt

Please note that checksums are a way to verify file integrity and ensure that the file has not been tampered with.

### Contributing

Contributions to the Thai Adblock List are highly encouraged and appreciated. To contribute, follow these steps:

1. Fork the repository to your GitHub account.

2. Make the necessary changes or additions to the adblock list file, ensuring that the formatting follows the established guidelines.

3. Test your changes thoroughly to ensure they work correctly and don't break website functionality.

4. Submit a pull request, describing the changes you made and the reason for them. Include:

   - What types of ads or content your filter blocks
   - Why the change is necessary
   - Any testing you performed

5. Your contribution will be reviewed, and if approved, merged into the main repository to benefit all users.

Please note that all contributions should align with the goal of blocking ads and unwanted content for Thai websites.

### Filter Syntax

This adblock list uses standard filter syntax compatible with:

- Adblock Plus syntax
- uBlock Origin extended syntax

For more information about filter syntax, visit:

- [Adblock Plus Filter Documentation](https://help.adblock.com/hc/en-us/articles/360062733293)
- [uBlock Origin Filter Syntax](https://github.com/gorhill/uBlock/wiki/Static-filter-syntax)

### For Maintainers and Contributors

#### Managing Website Lists

To maintain and update filters effectively while keeping the repository clean and legally compliant:

**1. Use Comments in Filter File**

Organize your filters using section comments in `thai-adblock-list.txt`:

```
! ===== Section 1: General Thai sites =====
! Last updated: 25-09-2025
[filter rules here]

! ===== Section 2: Streaming sites =====
! Last updated: 25-09-2025
[filter rules here]
```

**2. Keep Personal Records Separate**

Track specific websites in your personal files (not committed to GitHub):

- Use a local spreadsheet (Excel, Google Sheets, Notion)
- Create a private document on your computer
- Add personal tracking files to `.gitignore`:

```
# Personal tracking files
INTERNAL_NOTES.md
website-tracking.xlsx
notes/
*.private.md
```

**3. Best Practices for Updates**

DO:

- Use generic commit messages: "Update filter rules", "Fix popup blockers", "Improve ad blocking"
- Test changes on multiple websites before committing
- Document the type of ads blocked in filter comments
- Keep detailed personal notes in private files

DON'T:

- Mention specific website names in commit messages
- Commit personal tracking files to the public repository
- Create public lists of websites that may have legal issues

**4. Filter Organization Tips**

Effective commenting helps maintain and debug filters:

```
! Purpose: Block video player ads
! Type: Popup, overlay, pre-roll
! Priority: High
example.com##.video-ad-overlay
example.com##.popup-container

! Purpose: Block gambling ads
! Type: Banner, sidebar
! Priority: Critical (illegal content)
another-site.com##.gambling-banner
```

This approach allows maintainers to track and update filters efficiently while keeping the public repository clean and legally safe.

### Reporting Issues

If you encounter any issues or have suggestions for improvement, please feel free to open an issue on the repository's issue tracker.

#### Types of Issues You Can Report:

**1. Ads Not Being Blocked**

- Provide the URL of the website (if appropriate)
- Describe the type of ad (popup, banner, video pre-roll, etc.)
- Include screenshots showing the ad (blur sensitive content if needed)

**2. Website Functionality Issues**

- Report if the adblock list breaks website features
- Describe what stopped working
- Include steps to reproduce the problem

**3. False Positives**

- Report if legitimate content is being blocked
- Specify which elements are incorrectly blocked

**4. Filter Requests**

- Request blocking of specific ad types on Thai websites
- Describe the advertising behavior you want blocked
- Note: You don't need to publicly name specific websites if you're concerned about privacy

#### How to Report:

1. Go to the [Issues](https://github.com/PhyschicWinter9/thai-adblock-list/issues) section of this repository.
2. Click on the "New Issue" button.
3. Provide information as detailed as possible:
   - Browser and adblocker extension version
   - Operating system
   - Steps to reproduce
   - Screenshots (recommended)
4. The community will review and address it as soon as possible.

#### Privacy Note:

If you're uncomfortable posting website URLs publicly, you can:

- Send details via GitHub private message to maintainers
- Describe the ad type and behavior in general terms
- Use descriptive names instead of actual URLs (e.g., "a popular Thai streaming site")

The maintainers will work with you to identify and fix the issue without requiring public disclosure of specific websites.

### Updates

This list is maintained and updated regularly to ensure effectiveness against new advertisement methods and to minimize false positives.

Last major update: September 2025

### License

The Thai Adblock List is released under the [MIT License](https://opensource.org/licenses/MIT). By contributing to this repository, you agree to your contributions being licensed under the same license.

### Disclaimer

The Thai Adblock List is a community-driven effort, and while the goal is to provide an effective adblock list, there is no guarantee that all ads or unwanted content will be blocked. The effectiveness of the list may vary over time as websites evolve their ad serving methods. Users are encouraged to supplement the adblock list with their own custom rules as needed.

Please note that the Thai Adblock List is not affiliated with or endorsed by any website or organization. It is an independent project created by individuals to improve the browsing experience for Thai users.

**The Thai Adblock List does not support or condone the use of pirate sites or any illegal activities. The list is intended to block ads and unwanted content on legitimate websites only. Users are responsible for using the list in compliance with applicable laws and regulations.**

This project is provided "as-is" without any warranties, express or implied. The maintainers are not responsible for any issues that may arise from using this adblock list.

---
