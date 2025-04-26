/**
 * Marketing Materials Generator
 * Utility for generating various marketing content for hackathons
 */

// Helper function to clean up text for use in hashtags, URLs, etc.
function cleanText(text) {
  return text.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
}

// Main function to generate marketing materials
function generateMarketingMaterial(type, hackathonDetails) {
  const { 
    name = "Hack the Future", 
    theme = "Innovation and Technology", 
    date = "November 10-12, 2025", 
    location = "Virtual",
    prizes = "$8,500 in total prizes",
    organizerName = "[Your Organization]",
    registerUrl = "[register-url]"
  } = hackathonDetails;

  // Clean up text for use in hashtags, domains, etc.
  const cleanName = cleanText(name);
  const cleanTheme = cleanText(theme);

  switch(type) {
    case 'poster':
      return generatePoster(hackathonDetails);
    case 'social':
      return generateSocialMedia(hackathonDetails);
    case 'email':
      return generateEmailTemplate(hackathonDetails);
    case 'press':
      return generatePressRelease(hackathonDetails);
    case 'banner':
      return generateBannerContent(hackathonDetails);
    case 'slogan':
      return generateSlogans(hackathonDetails);
    case 'sponsorship':
      return generateSponsorshipPackage(hackathonDetails);
    default:
      return generateGeneralInfo(hackathonDetails);
  }
}

function generatePoster(details) {
  const { name, theme, date, location, prizes, registerUrl } = details;
  
  return `# ${name} - ${theme}

**Join us for an epic coding adventure!**

**Date:** ${date}
**Location:** ${location}

## PRIZES
- 1st Place: $5,000
- 2nd Place: $2,500
- 3rd Place: $1,000

## HIGHLIGHTS
- 48 hours of coding
- Mentorship from industry experts
- Networking opportunities
- Free food and swag

## REGISTRATION
Visit ${registerUrl} to register

Sponsored by: [Your Company Name]

*This is poster content that you can adapt for your design. For an actual printable poster, I recommend working with a graphic designer who can incorporate your branding elements and visual identity.*`;
}

function generateSocialMedia(details) {
  const { name, theme, date, location, prizes, registerUrl } = details;
  const hashtag = `#${cleanText(name)}`;
  const themeHashtag = `#${cleanText(theme)}`;
  
  const twitter = `🚀 Join us for ${hashtag} on ${date}! 💻 ${theme} challenges, amazing prizes, and networking opportunities await. Register now at ${registerUrl} #Hackathon #Tech #Coding`;
          
  const linkedin = `We're excited to announce ${name}, a ${theme} hackathon happening on ${date} at ${location}!

Join innovators and tech enthusiasts for 48 hours of coding, mentorship, and the chance to win prizes up to $5,000.

What to expect:
- Expert mentorship
- Networking with industry professionals
- Great prizes
- Learning opportunities

Register now: ${registerUrl}

#Hackathon #Innovation ${themeHashtag} #TechEvents`;
          
  const instagram = `📣 ${hashtag} is coming! 📣

🗓️ ${date}
📍 ${location}
🏆 ${prizes}

Join us for an incredible weekend of coding, collaboration, and innovation around ${theme}. Whether you're a seasoned developer or just starting out, this is your chance to showcase your skills, learn from experts, and win amazing prizes!

Tag a friend who would love to join your hackathon team! 👥

Register through the link in our bio.

#Hackathon #Coding #TechEvent #Innovation ${themeHashtag} #Programming`;
  
  return `## Social Media Content for ${name}

### Twitter
${twitter}

### LinkedIn
${linkedin}

### Instagram
${instagram}

*These templates can be customized with your specific details and should be accompanied by eye-catching images or graphics relevant to your hackathon theme.*`;
}

function generateEmailTemplate(details) {
  const { name, theme, date, location, prizes, organizerName, registerUrl } = details;
  
  return `## Hackathon Announcement Email

**Subject:** Join us for ${name} - ${theme} | ${date}

**Body:**

Hello [Name],

We're excited to announce **${name}**, a ${theme}-focused hackathon taking place on **${date}** at **${location}**!

### Why Participate?

- **Innovate:** Work on cutting-edge solutions in ${theme}
- **Network:** Connect with industry professionals and fellow tech enthusiasts
- **Learn:** Gain new skills through workshops and mentor sessions
- **Win:** Compete for prizes totaling ${prizes}

### Event Details

- **When:** ${date}
- **Where:** ${location}
- **Who:** Developers, designers, and innovators of all skill levels
- **Cost:** Free registration (limited spots available)

### Schedule Highlights

- **Day 1:** Opening ceremony, team formation, and initial workshops
- **Day 2:** Full day of hacking with mentor support
- **Day 3:** Project submissions, presentations, and awards ceremony

### Ready to Join?

[REGISTER NOW BUTTON: ${registerUrl}]

Early registration closes on [date], so secure your spot today!

Questions? Reply to this email or visit our FAQ page.

We can't wait to see what you'll build!

Best regards,

[Your Name]
${organizerName}

P.S. Know someone who would love this event? Forward this email to spread the word!`;
}

function generatePressRelease(details) {
  const { name, theme, date, location, prizes, organizerName, registerUrl } = details;
  
  return `## PRESS RELEASE

**FOR IMMEDIATE RELEASE**

# ${name} Brings Together Tech Innovators to Tackle ${theme} Challenges

**${location.toUpperCase()} (Today's Date)** - ${organizerName} is proud to announce ${name}, a cutting-edge hackathon focused on ${theme}, scheduled for ${date} at ${location}.

This intensive event will bring together over [expected number] of developers, designers, and tech enthusiasts from across [region/industry] to collaborate on innovative solutions addressing real-world challenges in the ${theme} space.

"${name} represents our commitment to fostering innovation and supporting the next generation of tech leaders," said [Spokesperson Name], [Title] at ${organizerName}. "Participants will have the opportunity to transform their ideas into functional prototypes while receiving mentorship from industry experts."

**Event Highlights:**

- ${prizes} for winning teams
- Mentorship from leading ${theme} experts
- Networking opportunities with industry professionals
- Workshops on cutting-edge technologies
- Recruitment opportunities from sponsor companies

The hackathon will culminate in a showcase where teams present their solutions to a panel of judges from [list notable organizations/companies]. Winners will be announced during an awards ceremony on [final date].

Registration is now open at ${registerUrl}. Early bird registration closes on [date].

**About ${organizerName}:**
[2-3 sentences about your organization]

**Media Contact:**
[Contact Name]
[Email]
[Phone Number]

###`;
}

function generateBannerContent(details) {
  const { name, theme, date, location, prizes, registerUrl } = details;
  
  return `## Digital Banner Content for ${name}

**Main Banner (1200x628px):**

**Bold Headline:** ${name}

**Subheading:** Innovate. Code. Transform.

**Key Details:**
- ${date}
- ${location}
- ${prizes}

**Call to Action:** REGISTER NOW

---

**Square Format (1080x1080px for Instagram):**

**Header:** CODE THE FUTURE

**Main Text:** ${name}

**Supporting Text:** A ${theme} Hackathon

**Details:** ${date} | ${location}

**CTA:** Register at ${registerUrl}

---

**Leaderboard (728x90px):**

**Compact Message:** ${name} | ${date} | ${prizes} | Register Now

*Note: These are content suggestions for your banner designs. For actual digital banners, you should work with a graphic designer who can incorporate your branding, color scheme, and visual elements.*`;
}

function generateSlogans(details) {
  const { name, theme } = details;
  const cleanTheme = cleanText(theme);
  
  // Extract keywords from theme for more targeted slogans
  const keywords = theme.toLowerCase().split(' ');
  
  let slogans = [
    `Code Today. Shape Tomorrow. ${name}.`,
    `Where Innovation Meets ${theme}.`,
    `48 Hours of Code. Unlimited Potential.`,
    `Ideas. Code. Impact. ${name}.`,
    `Hack the ${theme}. Change the Future.`
  ];
  
  // Add more targeted slogans based on theme keywords
  if (keywords.some(word => ['ai', 'intelligence', 'machine', 'data', 'learning'].includes(word))) {
    slogans.push(`Coding Intelligence. Solving Tomorrow.`);
    slogans.push(`Data Problems. Human Solutions.`);
  }
  
  if (keywords.some(word => ['sustain', 'green', 'climate', 'environment', 'eco'].includes(word))) {
    slogans.push(`Code Green. Build Clean.`);
    slogans.push(`Hack for a Sustainable Tomorrow.`);
  }
  
  if (keywords.some(word => ['health', 'medical', 'care', 'bio', 'life'].includes(word))) {
    slogans.push(`Code that Cares. Tech that Heals.`);
    slogans.push(`Hacking Healthcare. Coding Wellness.`);
  }
  
  return `## Tagline/Slogan Ideas for ${name}

${slogans.map(s => `- "${s}"`).join('\n')}

**Hashtag Options:**
- #${cleanText(name)}
- #Hack${cleanTheme}
- #Code${cleanTheme}

*These slogans can be used across your marketing materials including website, social media, emails, and physical materials like t-shirts or banners.*`;
}

function generateSponsorshipPackage(details) {
  const { name, theme, date, location, prizes, organizerName } = details;
  
  return `## ${name} - Sponsorship Package

### Why Sponsor ${name}?

${name} brings together the brightest minds in technology to solve real-world problems in ${theme}. By sponsoring our event, your organization will:

- Connect with top tech talent for potential recruitment
- Demonstrate your commitment to innovation in ${theme}
- Increase brand visibility within the tech community
- Showcase your products/APIs to motivated developers
- Support the next generation of tech leaders

### Sponsorship Tiers

#### Platinum Tier ($10,000)
- Premier logo placement on event website, promotional materials, and venue
- Dedicated booth in prime location at the event
- Opportunity to host a workshop or technical talk
- 5 minutes to address attendees during opening ceremony
- First access to participant resumes
- 4 judges on the panel
- Ability to propose a custom challenge with dedicated prize
- Social media features (10 dedicated posts)
- Logo on participant t-shirts

#### Gold Tier ($5,000)
- Prominent logo placement on event website and promotional materials
- Booth at the event
- 2 judges on the panel
- Opportunity to present a technical workshop
- Social media features (5 dedicated posts)
- Logo on participant t-shirts

#### Silver Tier ($2,500)
- Logo on event website and select promotional materials
- 1 judge on the panel
- Social media mentions (3 dedicated posts)
- Opportunity to provide branded swag for participants

#### Bronze Tier ($1,000)
- Logo on event website
- Social media mention (1 dedicated post)
- Opportunity to provide recruiting materials or swag

### Custom Sponsorship Opportunities

- Meal Sponsor: $3,000 (exclusive branding during meals)
- Coffee/Refreshment Sponsor: $1,500
- Workshop Sponsor: $2,000
- Prize Sponsor: Starting at $500

### Contact Information

To discuss sponsorship opportunities, please contact:

[Sponsorship Coordinator Name]
[Email]
[Phone]

${organizerName}`;
}

function generateGeneralInfo(details) {
  const { name, theme } = details;
  
  return `## Marketing Material Options for ${name}

I can help you create various marketing materials for your hackathon. Here are some options:

1. **Social Media Content** - Posts for Twitter, LinkedIn, Facebook, Instagram
2. **Email Templates** - Announcement, reminder, and follow-up emails
3. **Event Posters/Flyers** - Digital or printable promotional materials
4. **Press Release** - For media outreach
5. **Digital Banners/Ads** - For websites and online promotion
6. **Taglines/Slogans** - Memorable phrases for your event
7. **Sponsor Prospectus** - Materials for potential sponsors
8. **Participant Guide** - Information pack for registrants

To generate any of these materials, please ask specifically for what you need, for example:
- "Generate a social media post for our AI hackathon"
- "Create an email template for our upcoming hackathon"
- "Design a poster for our sustainability hackathon"

Please provide any specific details about your hackathon including name, theme, dates, location, prizes, etc. to make the materials more relevant.`;
}

// Extract hackathon details from a user prompt
function extractHackathonDetails(prompt) {
  return {
    name: extractHackathonName(prompt) || "Hack the Future",
    theme: extractTheme(prompt) || "Innovation and Technology",
    date: extractDate(prompt) || "November 10-12, 2025",
    location: extractLocation(prompt) || "Virtual",
    prizes: extractPrizes(prompt) || "$8,500 in total prizes",
    organizerName: extractOrganization(prompt) || "[Your Organization]",
    registerUrl: extractWebsite(prompt) || "hackathon.yourorganization.com"
  };
}

function extractHackathonName(prompt) {
  // Try to find phrases like "for [name] hackathon" or "our hackathon [name]"
  const nameRegex = /(?:for|our|the)\s+(?:hackathon|event|competition)?\s*["]?([A-Za-z0-9\s&\-']+(?:Hack|Hackathon|Challenge|Jam|Fest|Con|Summit|Code|Fest|Marathon))["]?/i;
  const match = prompt.match(nameRegex);
  if (match && match[1] && match[1].length > 3) {
    return match[1].trim();
  }
  
  // Try to find any capitalized phrases that might be names
  const capitalizedNameRegex = /([A-Z][A-Za-z0-9\s&\-']+(?:Hack|Hackathon|Challenge|Jam|Fest|Con|Summit|Code|Fest|Marathon))/g;
  const matches = [...prompt.matchAll(capitalizedNameRegex)];
  if (matches.length > 0) {
    return matches[0][1].trim();
  }
  
  return null;
}

function extractTheme(prompt) {
  const themeRegex = /(?:theme|focus|about|on)\s+["]?([A-Za-z0-9\s&\-']+)["]?/i;
  const match = prompt.match(themeRegex);
  return match ? match[1].trim() : null;
}

function extractDate(prompt) {
  // Try to match date patterns
  const dateRegex = /(?:on|at|for|date[s:]?|scheduled)(?:\s+for)?\s+([A-Za-z]+\s+\d{1,2}(?:\s*-\s*\d{1,2})?,\s*\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\s+[A-Za-z]+\s+\d{4})/i;
  const match = prompt.match(dateRegex);
  return match ? match[1].trim() : null;
}

function extractLocation(prompt) {
  const locationRegex = /(?:at|in|location[s:]?|place[s:]?|venue[s:]?)\s+([A-Za-z\s,]+(?:Conference Center|University|Hotel|Center|Hall|Building|Campus|Online|Virtual|Remote))/i;
  const match = prompt.match(locationRegex);
  
  if (match) {
    return match[1].trim();
  }
  
  // Check for words indicating virtual events
  if (/\b(?:online|virtual|remote|zoom|teams|web|digital)\b/i.test(prompt)) {
    return "Virtual";
  }
  
  return null;
}

function extractPrizes(prompt) {
  const prizesRegex = /(?:prize[s]?|award[s]?|winning)\s+(?:of|is|are|total)?\s*\$?([\d,]+)/i;
  const match = prompt.match(prizesRegex);
  return match ? `$${match[1]} in prizes` : null;
}

function extractOrganization(prompt) {
  const orgRegex = /(?:by|from|organized by|hosting|organizer[s:]?)\s+([A-Z][A-Za-z0-9\s&\-']+(?:Inc|LLC|Corp|Corporation|Company|Organization|University|College|School|Association|Foundation|Institute))/i;
  const match = prompt.match(orgRegex);
  return match ? match[1].trim() : null;
}

function extractWebsite(prompt) {
  const websiteRegex = /(?:website|url|link|site|register at|visit)\s+(?:is|at)?\s*([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)/i;
  const match = prompt.match(websiteRegex);
  return match ? match[1].trim() : null;
}

module.exports = {
  generateMarketingMaterial,
  extractHackathonDetails
}; 