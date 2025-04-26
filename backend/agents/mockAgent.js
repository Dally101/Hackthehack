/**
 * Mock Agent implementation for development and testing
 * This provides simulated responses when the real AI services are not available
 */
const BaseAgent = require('./baseAgent');
const { generateMarketingMaterial, extractHackathonDetails } = require('../utils/marketingGenerator');

class MockAgent extends BaseAgent {
  constructor(agentConfig) {
    super(agentConfig);
    this.agentConfig = agentConfig;
    this.name = agentConfig.name;
  }

  async generateResponse(prompt, context = {}) {
    console.log(`[Mock ${this.name}] Processing prompt: ${prompt}`);

    // Create a response based on agent type
    let content = '';
    
    switch (this.agentConfig.name) {
      case 'Registration Agent':
        content = this.getRegistrationResponse(prompt);
        break;
      case 'Team Formation Agent':
        content = this.getTeamFormationResponse(prompt);
        break;
      case 'Scheduling Agent':
        content = this.getSchedulingResponse(prompt);
        break;
      case 'Submission Agent':
        content = this.getSubmissionResponse(prompt);
        break;
      case 'Judging Agent':
        content = this.getJudgingResponse(prompt);
        break;
      case 'Communication Agent':
        content = this.getCommunicationResponse(prompt);
        break;
      case 'Marketing Agent':
        content = this.getMarketingResponse(prompt);
        break;
      default:
        content = `I'm a mock AI assistant. I don't have real capabilities at the moment, but I'm simulating a response to your query: "${prompt}"`;
    }

    // Simulate a delay to mimic AI processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      content,
      metadata: {
        agent: this.name,
        promptTokens: prompt.length,
        completionTokens: content.length,
        mockMode: true
      }
    };
  }

  // Mock responses for each agent type
  getRegistrationResponse(prompt) {
    if (prompt.toLowerCase().includes('register')) {
      return "To register for a hackathon, navigate to the Hackathons page, select the event you want to join, and click the \"Register\" button. You'll need to provide your name, email, and some information about your skills and interests.";
    } else if (prompt.toLowerCase().includes('profile')) {
      return "You can update your profile information by clicking on your avatar in the top-right corner, then selecting \"Profile Settings\". From there, you can add your skills, update your contact information, and set your availability for team matching.";
    } else {
      return "I can help you with registration and profile setup. What specific information do you need about the registration process?";
    }
  }

  getTeamFormationResponse(prompt) {
    if (prompt.toLowerCase().includes('find')) {
      return "To find teammates, you can use our Team Matching feature. Go to the Dashboard, select \"Find Teammates\", and you'll see a list of participants with matching skills and interests. You can filter by skill sets and send team invitations directly through the platform.";
    } else if (prompt.toLowerCase().includes('team')) {
      return "Teams should have 2-5 members with complementary skills. I recommend having a mix of technical roles (front-end, back-end, data science) and design/product roles for the best results. Would you like me to suggest specific team compositions based on your project idea?";
    } else {
      return "I can help you find teammates or build balanced teams for your hackathon project. What specific assistance do you need with team formation?";
    }
  }

  getSchedulingResponse(prompt) {
    if (prompt.toLowerCase().includes('deadline')) {
      return "The submission deadline for this hackathon is Sunday at 2:00 PM. Make sure to submit your project at least 30 minutes before the deadline to avoid any last-minute technical issues.";
    } else if (prompt.toLowerCase().includes('schedule')) {
      return "The hackathon schedule includes: Day 1 - Opening ceremony (9 AM), Team formation (10 AM), and Workshops (1-5 PM). Day 2 - Mentoring sessions (10 AM-2 PM) and ongoing hacking. Day 3 - Project submissions (by 2 PM) and Final presentations (3-5 PM).";
    } else {
      return "I can help you with the hackathon schedule and important deadlines. What specific information do you need about the event timeline?";
    }
  }

  getSubmissionResponse(prompt) {
    if (prompt.toLowerCase().includes('submit')) {
      return "To submit your project, go to your Team Dashboard and click \"Submit Project\". You'll need to provide a project title, description, GitHub repository link, and a brief demo video (2-3 minutes). Make sure all team members are listed correctly on the submission form.";
    } else if (prompt.toLowerCase().includes('requirement')) {
      return "Submission requirements include: 1) Working prototype or demo, 2) Source code in a GitHub repository, 3) Brief presentation slide deck (max 10 slides), 4) A 2-3 minute demo video, and 5) Project description (max 500 words).";
    } else {
      return "I can help you with the project submission process and requirements. What specific information do you need about submitting your hackathon project?";
    }
  }

  getJudgingResponse(prompt) {
    if (prompt.toLowerCase().includes('criteria')) {
      return "Judging criteria include: Innovation (25%), Technical Implementation (25%), User Experience (20%), Impact & Potential (20%), and Presentation Quality (10%). Projects are scored from 1-10 in each category by at least 3 different judges.";
    } else if (prompt.toLowerCase().includes('present')) {
      return "For your presentation, you'll have 5 minutes to demo your project and 2 minutes for Q&A. Focus on the problem you're solving, your approach, and a live demo of your solution. Prepare for questions about technical implementation and scalability.";
    } else {
      return "I can help you understand the judging process and criteria for the hackathon. What specific information do you need about how projects will be evaluated?";
    }
  }

  getCommunicationResponse(prompt) {
    if (prompt.toLowerCase().includes('contact')) {
      return "You can contact the organizers by emailing support@hackathon.org or using the Help desk in the main lobby. For technical issues, use the #tech-support channel in the event Discord server.";
    } else if (prompt.toLowerCase().includes('wifi')) {
      return "The WiFi network name is \"HackathonNetwork\" and the password is \"Hack2025!\". If you have connectivity issues, please visit the technical support desk near the main entrance.";
    } else if (prompt.toLowerCase().includes('food')) {
      return "Meals will be provided throughout the event. Breakfast (8-9 AM), Lunch (12-1 PM), and Dinner (6-7 PM). Snacks and drinks are available at the refreshment stations 24/7. Please note any dietary restrictions during registration.";
    } else if (prompt.toLowerCase().includes('prize')) {
      return "The prizes include: 1st Place - $5,000 and mentorship opportunities, 2nd Place - $2,500, 3rd Place - $1,000. Category prizes include Best UI/UX ($1,000), Most Innovative ($1,000), and Best Use of AI ($1,000).";
    } else {
      return "I'm happy to answer any questions about the hackathon. If you're wondering about specific aspects like schedule, rules, prizes, or resources, just ask!";
    }
  }

  getMarketingResponse(prompt) {
    // Check for marketing material generation requests
    if (prompt.toLowerCase().includes('generate') || prompt.toLowerCase().includes('create') || 
        prompt.toLowerCase().includes('make') || prompt.toLowerCase().includes('design')) {
      
      // Extract hackathon details from the prompt
      const hackathonDetails = extractHackathonDetails(prompt);
      
      if (prompt.toLowerCase().includes('poster') || prompt.toLowerCase().includes('flyer')) {
        return generateMarketingMaterial('poster', hackathonDetails);
      } else if (prompt.toLowerCase().includes('social') && 
                (prompt.toLowerCase().includes('post') || prompt.toLowerCase().includes('content'))) {
        return generateMarketingMaterial('social', hackathonDetails);
      } else if (prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('newsletter')) {
        return generateMarketingMaterial('email', hackathonDetails);
      } else if (prompt.toLowerCase().includes('press') || prompt.toLowerCase().includes('release')) {
        return generateMarketingMaterial('press', hackathonDetails);
      } else if (prompt.toLowerCase().includes('banner') || prompt.toLowerCase().includes('ad')) {
        return generateMarketingMaterial('banner', hackathonDetails);
      } else if (prompt.toLowerCase().includes('slogan') || prompt.toLowerCase().includes('tagline')) {
        return generateMarketingMaterial('slogan', hackathonDetails);
      } else if (prompt.toLowerCase().includes('sponsor') || prompt.toLowerCase().includes('sponsorship')) {
        return generateMarketingMaterial('sponsorship', hackathonDetails);
      } else {
        return generateMarketingMaterial('general', hackathonDetails);
      }
    }
    
    // Original marketing responses for non-generation questions
    if (prompt.toLowerCase().includes('promote') || prompt.toLowerCase().includes('promotion')) {
      return "To promote your hackathon effectively, I recommend: 1) Create a compelling event page with clear value proposition, 2) Leverage social media with event hashtags and engaging content, 3) Partner with relevant communities and organizations, 4) Use email marketing to reach past participants, and 5) Offer early-bird registration incentives. Would you like more specific strategies for any of these channels?";
    } else if (prompt.toLowerCase().includes('social media') || prompt.toLowerCase().includes('post')) {
      return "For effective social media promotion: 1) Create a content calendar with regular posts leading up to the event, 2) Share speaker announcements, prize details, and sponsor highlights, 3) Use engaging visuals and short videos of past events, 4) Encourage past participants to share their experiences with your hashtag, and 5) Consider running targeted ads on platforms where your ideal participants spend time.";
    } else if (prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('newsletter')) {
      return "For your email campaign, I recommend: 1) Send an announcement email 6-8 weeks before the event, 2) Follow up with highlight emails featuring prizes, judges, and sponsors, 3) Create a 'last chance to register' email 1-2 weeks before registration closes, 4) Send a final preparation email to registered participants, and 5) Follow up with a thank-you email and survey after the event. Each email should have a clear call-to-action and mobile-friendly design.";
    } else if (prompt.toLowerCase().includes('description') || prompt.toLowerCase().includes('copy')) {
      return "For a compelling hackathon description: 1) Start with an attention-grabbing headline that highlights the unique value, 2) Clearly state the theme, dates, location, and prizes in the first paragraph, 3) Include quotes from past participants or judges, 4) Highlight the specific problems participants will solve, 5) Describe the support resources available, and 6) End with a strong call-to-action. Would you like me to help craft specific sections for your hackathon description?";
    } else if (prompt.toLowerCase().includes('sponsor') || prompt.toLowerCase().includes('sponsorship')) {
      return "To attract sponsors for your hackathon: 1) Create a tiered sponsorship package with clear benefits for each level, 2) Highlight the demographics and reach of your expected audience, 3) Offer specific engagement opportunities like workshops or judging panels, 4) Provide case studies from previous sponsors, and 5) Start outreach at least 3-4 months before the event. Would you like help with crafting a sponsorship proposal?";
    } else {
      return "I can help with your hackathon marketing and promotion strategy. I can provide guidance on social media campaigns, email marketing, event descriptions, participant engagement, and sponsor acquisition. I can also generate marketing materials like social media posts, email templates, press releases, posters, sponsorship packages and more. What specific marketing assistance would you like?";
    }
  }
}

module.exports = MockAgent; 