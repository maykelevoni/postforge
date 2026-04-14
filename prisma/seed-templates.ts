import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Pre-built viral templates for each category
const templates = [
  // Twitter/X Templates (8 templates)
  {
    name: "X Ways to Benefit Without Pain",
    category: "twitter",
    type: "prebuilt",
    template: "{number} ways to {benefit} without {pain} in {time}. 🧵",
    variables: {
      number: { type: "number", required: true, default: 5, description: "Number of ways" },
      benefit: { type: "text", required: true, description: "Desired benefit" },
      pain: { type: "text", required: true, description: "Pain point to avoid" },
      time: { type: "text", required: true, default: "30 days", description: "Timeframe" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["hook", "benefit"],
      hashtagCount: "2-3",
    },
    example: "5 ways to grow your audience without posting daily in 30 days. 🧵",
  },
  {
    name: "Achievement Thread Starter",
    category: "twitter",
    type: "prebuilt",
    template: "I {achieved result} in {time}. Here's how: 🧵",
    variables: {
      achieved: { type: "text", required: true, description: "What you achieved" },
      result: { type: "text", required: true, description: "Specific result" },
      time: { type: "text", required: true, description: "Timeframe" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["hook", "teaser"],
      hashtagCount: "2-3",
    },
    example: "I reached 10k followers in 3 months. Here's how: 🧵",
  },
  {
    name: "Stop Mistake Instead Better",
    category: "twitter",
    type: "prebuilt",
    template: "Stop {common_mistake}. Instead, {better_approach}.",
    variables: {
      common_mistake: { type: "text", required: true, description: "Common mistake" },
      better_approach: { type: "text", required: true, description: "Better alternative" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["problem", "solution"],
      hashtagCount: "2-3",
    },
    example: "Stop posting without a strategy. Instead, use this 3-step content framework.",
  },
  {
    name: "Unpopular Opinion Thread",
    category: "twitter",
    type: "prebuilt",
    template: "Unpopular opinion: {contrarian_view}. Here's why: 🧵",
    variables: {
      contrarian_view: { type: "text", required: true, description: "Contrarian opinion" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["hook", "teaser"],
      hashtagCount: "2-3",
    },
    example: "Unpopular opinion: Engagement rate is more important than follower count. Here's why: 🧵",
  },
  {
    name: "Why X Beats Y for Z",
    category: "twitter",
    type: "prebuilt",
    template: "Why {strategy} beats {alternative} for {goal}.",
    variables: {
      strategy: { type: "text", required: true, description: "Your strategy" },
      alternative: { type: "text", required: true, description: "Alternative approach" },
      goal: { type: "text", required: true, description: "Goal or outcome" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["comparison", "recommendation"],
      hashtagCount: "2-3",
    },
    example: "Why email beats social media for sales.",
  },
  {
    name: "Number Nouns That Will Benefit",
    category: "twitter",
    type: "prebuilt",
    template: "{number} {noun} that will {benefit} instantly.",
    variables: {
      number: { type: "number", required: true, description: "Quantity" },
      noun: { type: "text", required: true, description: "Item or tool" },
      benefit: { type: "text", required: true, description: "Benefit or outcome" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["list", "benefits"],
      hashtagCount: "2-3",
    },
    example: "7 free tools that will 10x your productivity instantly.",
  },
  {
    name: "The Adjective Truth About Topic",
    category: "twitter",
    type: "prebuilt",
    template: "The {adjective} truth about {topic} nobody talks about.",
    variables: {
      adjective: { type: "text", required: true, description: "Descriptive adjective" },
      topic: { type: "text", required: true, description: "Topic or subject" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["hook", "insight"],
      hashtagCount: "2-3",
    },
    example: "The uncomfortable truth about productivity nobody talks about.",
  },
  {
    name: "Result in Time Exact Framework",
    category: "twitter",
    type: "prebuilt",
    template: "{result} in {time}. The exact framework I used:",
    variables: {
      result: { type: "text", required: true, description: "Achievement or result" },
      time: { type: "text", required: true, description: "Timeframe" },
    },
    constraints: {
      maxLength: 280,
      requiredSections: ["result", "framework"],
      hashtagCount: "2-3",
    },
    example: "$10k in 30 days. The exact framework I used:",
  },

  // Reddit Templates (5 templates)
  {
    name: "Genuine Question About Topic",
    category: "reddit",
    type: "prebuilt",
    template: "Has anyone else experienced {problem} with {topic}? I've been {situation} and wondering if there's a better way.",
    variables: {
      problem: { type: "text", required: true, description: "Problem or issue" },
      topic: { type: "text", required: true, description: "Topic or product" },
      situation: { type: "text", required: true, description: "Current situation" },
    },
    constraints: {
      minLength: 100,
      maxLength: 500,
      requiredSections: ["question", "context"],
      customRules: ["no http"],
    },
    example: "Has anyone else experienced burnout with content creation? I've been posting daily for 3 months and wondering if there's a better way.",
  },
  {
    name: "I Found a Solution to Problem",
    category: "reddit",
    type: "prebuilt",
    template: "I struggled with {problem} for {time}. Here's what finally worked for me:",
    variables: {
      problem: { type: "text", required: true, description: "Problem or challenge" },
      time: { type: "text", required: true, description: "Duration of struggle" },
    },
    constraints: {
      minLength: 150,
      maxLength: 600,
      requiredSections: ["problem", "solution", "result"],
      customRules: ["no http"],
    },
    example: "I struggled with getting organic traffic for 8 months. Here's what finally worked for me:",
  },
  {
    name: "Unpopular Opinion in Community",
    category: "reddit",
    type: "prebuilt",
    template: "Unpopular opinion: {opinion}. I know this goes against what most people say about {topic}, but {reasoning}.",
    variables: {
      opinion: { type: "text", required: true, description: "Contrarian opinion" },
      topic: { type: "text", required: true, description: "Topic area" },
      reasoning: { type: "text", required: true, description: "Your reasoning" },
    },
    constraints: {
      minLength: 150,
      maxLength: 600,
      requiredSections: ["opinion", "reasoning"],
    },
    example: "Unpopular opinion: Consistency beats quality for new creators. I know this goes against what most people say about content, but having 100 average posts beats 10 perfect ones when you're starting out.",
  },
  {
    name: "Lessons Learned After Time",
    category: "reddit",
    type: "prebuilt",
    template: "After {time} of {activity}, here are the {number} things I wish I'd known from the start:",
    variables: {
      time: { type: "text", required: true, description: "Time period" },
      activity: { type: "text", required: true, description: "Activity or work" },
      number: { type: "number", required: true, default: 5, description: "Number of lessons" },
    },
    constraints: {
      minLength: 200,
      maxLength: 800,
      requiredSections: ["context", "lessons"],
    },
    example: "After 2 years of freelancing, here are the 5 things I wish I'd known from the start:",
  },
  {
    name: "Request for Community Feedback",
    category: "reddit",
    type: "prebuilt",
    template: "I built {project} to solve {problem}. Looking for honest feedback from {audience}.",
    variables: {
      project: { type: "text", required: true, description: "Project or product" },
      problem: { type: "text", required: true, description: "Problem it solves" },
      audience: { type: "text", required: true, description: "Target community" },
    },
    constraints: {
      minLength: 100,
      maxLength: 400,
      requiredSections: ["description", "feedback request"],
    },
    example: "I built a free keyword research tool to solve the \"where do I start\" problem. Looking for honest feedback from indie makers.",
  },

  // LinkedIn Templates (7 templates)
  {
    name: "Most People But Counterpoint",
    category: "linkedin",
    type: "prebuilt",
    template: "Most people {common_belief}. But {counterpoint}...",
    variables: {
      common_belief: { type: "text", required: true, description: "Common belief" },
      counterpoint: { type: "text", required: true, description: "Counter argument" },
    },
    constraints: {
      minLength: 150,
      maxLength: 300,
      requiredSections: ["hook", "contrarian", "insight"],
    },
    example: "Most people think success requires luck. But success is actually a system you can build...",
  },
  {
    name: "In Past Timeframe Learned Lesson",
    category: "linkedin",
    type: "prebuilt",
    template: "In the past {timeframe}, I've learned {lesson}. Here's the breakdown:",
    variables: {
      timeframe: { type: "text", required: true, description: "Time period" },
      lesson: { type: "text", required: true, description: "Key lesson learned" },
    },
    constraints: {
      minLength: 150,
      maxLength: 300,
      requiredSections: ["context", "lesson", "breakdown"],
    },
    example: "In the past 6 months, I've learned that consistency beats intensity. Here's the breakdown:",
  },
  {
    name: "Here's What Nobody Tells You About Topic",
    category: "linkedin",
    type: "prebuilt",
    template: "Here's what nobody tells you about {topic}:",
    variables: {
      topic: { type: "text", required: true, description: "Topic or subject" },
    },
    constraints: {
      minLength: 150,
      maxLength: 300,
      requiredSections: ["hook", "insight", "advice"],
    },
    example: "Here's what nobody tells you about personal branding:",
  },
  {
    name: "The Number-Step Framework I Used to Result",
    category: "linkedin",
    type: "prebuilt",
    template: "The {number}-step framework I used to {result}:",
    variables: {
      number: { type: "number", required: true, description: "Number of steps" },
      result: { type: "text", required: true, description: "Achievement or result" },
    },
    constraints: {
      minLength: 150,
      maxLength: 300,
      requiredSections: ["introduction", "framework", "results"],
    },
    example: "The 5-step framework I used to 10x my productivity:",
  },
  {
    name: "POV You're Situation Here's What To Do",
    category: "linkedin",
    type: "prebuilt",
    template: "POV: You're {situation}. Here's what to do:",
    variables: {
      situation: { type: "text", required: true, description: "Current situation" },
    },
    constraints: {
      minLength: 150,
      maxLength: 300,
      requiredSections: ["empathy", "solution", "actionable"],
    },
    example: "POV: You're working 60 hour weeks but not seeing results. Here's what to do:",
  },
  {
    name: "After Number Years in Industry Takeaway",
    category: "linkedin",
    type: "prebuilt",
    template: "After {number} years in {industry}, here's my biggest takeaway:",
    variables: {
      number: { type: "number", required: true, description: "Years of experience" },
      industry: { type: "text", required: true, description: "Industry or field" },
    },
    constraints: {
      minLength: 150,
      maxLength: 300,
      requiredSections: ["credibility", "takeaway", "application"],
    },
    example: "After 10 years in marketing, here's my biggest takeaway:",
  },
  {
    name: "The Adjective Guide to Topic That Actually Works",
    category: "linkedin",
    type: "prebuilt",
    template: "The {adjective} guide to {topic} (that actually works):",
    variables: {
      adjective: { type: "text", required: true, description: "Descriptive adjective" },
      topic: { type: "text", required: true, description: "Topic or subject" },
    },
    constraints: {
      minLength: 150,
      maxLength: 300,
      requiredSections: ["introduction", "guide", "results"],
    },
    example: "The practical guide to networking (that actually works):",
  },

  // Email Subject Templates (7 templates)
  {
    name: "Number Ways to Benefit",
    category: "email_subject",
    type: "prebuilt",
    template: "{Number} ways to {benefit}",
    variables: {
      Number: { type: "number", required: true, description: "Quantity" },
      benefit: { type: "text", required: true, description: "Desired benefit" },
    },
    constraints: {
      maxLength: 50,
      requiredSections: ["hook", "value"],
    },
    example: "7 ways to grow your email list",
  },
  {
    name: "Your Noun Is Problem Here's the Fix",
    category: "email_subject",
    type: "prebuilt",
    template: "Your {noun} is {problem}. Here's the fix.",
    variables: {
      noun: { type: "text", required: true, description: "Item or metric" },
      problem: { type: "text", required: true, description: "Problem or issue" },
    },
    constraints: {
      maxLength: 50,
      requiredSections: ["problem", "solution"],
    },
    example: "Your open rates are dropping. Here's the fix.",
  },
  {
    name: "How I Result in Time Exact Steps",
    category: "email_subject",
    type: "prebuilt",
    template: "How I {result} in {time} (exact steps)",
    variables: {
      result: { type: "text", required: true, description: "Achievement or result" },
      time: { type: "text", required: true, description: "Timeframe" },
    },
    constraints: {
      maxLength: 50,
      requiredSections: ["result", "method"],
    },
    example: "How I doubled my revenue in 30 days (exact steps)",
  },
  {
    name: "The Adjective Guide to Topic",
    category: "email_subject",
    type: "prebuilt",
    template: "The {adjective} guide to {topic}",
    variables: {
      adjective: { type: "text", required: true, description: "Descriptive adjective" },
      topic: { type: "text", required: true, description: "Topic or subject" },
    },
    constraints: {
      maxLength: 50,
      requiredSections: ["topic", "value"],
    },
    example: "The complete guide to email marketing",
  },
  {
    name: "Stop Mistake Start Solution",
    category: "email_subject",
    type: "prebuilt",
    template: "Stop {mistake}. Start {solution}.",
    variables: {
      mistake: { type: "text", required: true, description: "Bad practice" },
      solution: { type: "text", required: true, description: "Better alternative" },
    },
    constraints: {
      maxLength: 50,
      requiredSections: ["problem", "solution"],
    },
    example: "Stop guessing with your content. Start using data.",
  },
  {
    name: "Number Noun That Will Benefit",
    category: "email_subject",
    type: "prebuilt",
    template: "{Number} {noun} that will {benefit}",
    variables: {
      Number: { type: "number", required: true, description: "Quantity" },
      noun: { type: "text", required: true, description: "Item or tool" },
      benefit: { type: "text", required: true, description: "Benefit or outcome" },
    },
    constraints: {
      maxLength: 50,
      requiredSections: ["hook", "value"],
    },
    example: "5 tools that will 10x your productivity",
  },
  {
    name: "Why Your Noun Isn't Result and What to Do",
    category: "email_subject",
    type: "prebuilt",
    template: "Why your {noun} isn't {result} (and what to do)",
    variables: {
      noun: { type: "text", required: true, description: "Item or strategy" },
      result: { type: "text", required: true, description: "Expected outcome" },
    },
    constraints: {
      maxLength: 50,
      requiredSections: ["problem", "solution"],
    },
    example: "Why your content isn't converting (and what to do)",
  },

  // Email Body Templates (5 templates)
  {
    name: "Hook Value Bridge CTA Structure",
    category: "email_body",
    type: "prebuilt",
    template: "Hook → Value → Bridge → CTA structure",
    variables: {
      hook: { type: "text", required: true, description: "Opening hook" },
      value: { type: "text", required: true, description: "Value proposition" },
      bridge: { type: "text", required: true, description: "Bridge to product" },
      cta: { type: "text", required: true, description: "Call to action" },
    },
    constraints: {
      minLength: 200,
      maxLength: 500,
      requiredSections: ["hook", "value", "bridge", "CTA"],
    },
    example: "Hook: Are you struggling with...?\n\nValue: Here's what I learned...\n\nBridge: That's why I created...\n\nCTA: Click here to...",
  },
  {
    name: "Problem Agitation Solution Result Framework",
    category: "email_body",
    type: "prebuilt",
    template: "Problem → Agitation → Solution → Result framework",
    variables: {
      problem: { type: "text", required: true, description: "Problem statement" },
      agitation: { type: "text", required: true, description: "Agitate the problem" },
      solution: { type: "text", required: true, description: "Your solution" },
      result: { type: "text", required: true, description: "Expected result" },
    },
    constraints: {
      minLength: 200,
      maxLength: 500,
      requiredSections: ["problem", "agitation", "solution", "result"],
    },
    example: "Problem: Most people struggle with...\n\nAgitation: It gets worse when...\n\nSolution: Here's what works...\n\nResult: You'll finally...",
  },
  {
    name: "Story Lesson Application Format",
    category: "email_body",
    type: "prebuilt",
    template: "Story → Lesson → Application format",
    variables: {
      story: { type: "text", required: true, description: "Personal story" },
      lesson: { type: "text", required: true, description: "Lesson learned" },
      application: { type: "text", required: true, description: "How to apply it" },
    },
    constraints: {
      minLength: 200,
      maxLength: 500,
      requiredSections: ["story", "lesson", "application"],
    },
    example: "Story: Last year I was struggling with...\n\nLesson: Then I discovered...\n\nApplication: Here's how you can use this...",
  },
  {
    name: "Question Insight Action Structure",
    category: "email_body",
    type: "prebuilt",
    template: "Question → Insight → Action structure",
    variables: {
      question: { type: "text", required: true, description: "Provocative question" },
      insight: { type: "text", required: true, description: "Key insight" },
      action: { type: "text", required: true, description: "Action to take" },
    },
    constraints: {
      minLength: 200,
      maxLength: 500,
      requiredSections: ["question", "insight", "action"],
    },
    example: "Question: What if you could...\n\nInsight: The truth is...\n\nAction: Here's what to do...",
  },
  {
    name: "Bullet Point Benefit List Single CTA",
    category: "email_body",
    type: "prebuilt",
    template: "Bullet-point benefit list → Single CTA",
    variables: {
      benefits: { type: "text", required: true, description: "List of benefits" },
      cta: { type: "text", required: true, description: "Call to action" },
    },
    constraints: {
      minLength: 200,
      maxLength: 500,
      requiredSections: ["benefits", "CTA"],
    },
    example: "Here's what you'll get:\n\n• Benefit 1\n• Benefit 2\n• Benefit 3\n\nReady to start? Click here...",
  },

  // Instagram/TikTok Templates (5 templates)
  {
    name: "Wait for It Hook Value CTA",
    category: "instagram",
    type: "prebuilt",
    template: "Hook: 'Wait for it...' / Value / CTA",
    variables: {
      hook: { type: "text", required: true, description: "Hook text" },
      value: { type: "text", required: true, description: "Value proposition" },
      cta: { type: "text", required: true, description: "Call to action" },
    },
    constraints: {
      maxLength: 150,
      requiredSections: ["hook", "value", "CTA"],
      hashtagCount: "3-5",
    },
    example: "Wait for this... 🔥 This changed everything for my business. Link in bio!",
  },
  {
    name: "This Changed Everything Hook Value CTA",
    category: "instagram",
    type: "prebuilt",
    template: "Hook: 'This changed everything...' / Value / CTA",
    variables: {
      hook: { type: "text", required: true, description: "Hook text" },
      value: { type: "text", required: true, description: "Value proposition" },
      cta: { type: "text", required: true, description: "Call to action" },
    },
    constraints: {
      maxLength: 150,
      requiredSections: ["hook", "value", "CTA"],
      hashtagCount: "3-5",
    },
    example: "This changed everything... 💡 Here's what I discovered. Link in bio!",
  },
  {
    name: "Don't Skip This Hook Value CTA",
    category: "instagram",
    type: "prebuilt",
    template: "Hook: 'Don't skip this...' / Value / CTA",
    variables: {
      hook: { type: "text", required: true, description: "Hook text" },
      value: { type: "text", required: true, description: "Value proposition" },
      cta: { type: "text", required: true, description: "Call to action" },
    },
    constraints: {
      maxLength: 150,
      requiredSections: ["hook", "value", "CTA"],
      hashtagCount: "3-5",
    },
    example: "Don't skip this... ⚠️ This tip will save you hours. Link in bio!",
  },
  {
    name: "POV Hook Value CTA",
    category: "tiktok",
    type: "prebuilt",
    template: "Hook: 'POV:' / Value / CTA",
    variables: {
      hook: { type: "text", required: true, description: "POV scenario" },
      value: { type: "text", required: true, description: "Value proposition" },
      cta: { type: "text", required: true, description: "Call to action" },
    },
    constraints: {
      maxLength: 150,
      requiredSections: ["hook", "value", "CTA"],
      hashtagCount: "3-5",
    },
    example: "POV: You finally cracked the algorithm 💪 Here's the secret. Link in bio!",
  },
  {
    name: "The Secret to Hook Value CTA",
    category: "tiktok",
    type: "prebuilt",
    template: "Hook: 'The secret to...' / Value / CTA",
    variables: {
      hook: { type: "text", required: true, description: "Secret or tip" },
      value: { type: "text", required: true, description: "Value proposition" },
      cta: { type: "text", required: true, description: "Call to action" },
    },
    constraints: {
      maxLength: 150,
      requiredSections: ["hook", "value", "CTA"],
      hashtagCount: "3-5",
    },
    example: "The secret to viral growth 🤫 Here's what nobody tells you. Link in bio!",
  },

  // Image Prompt Templates (5 templates)
  {
    name: "Cinematic Style Photo Prompt",
    category: "image_prompt",
    type: "prebuilt",
    template:
      "Cinematic {style} photo of {subject}, {lighting}, {composition}, HD resolution 1250x555, professional photography, {mood}",
    variables: {
      style: { type: "text", required: true, description: "Photography style" },
      subject: { type: "text", required: true, description: "Main subject" },
      lighting: { type: "text", required: true, description: "Lighting description" },
      composition: { type: "text", required: true, description: "Composition style" },
      mood: { type: "text", required: true, description: "Mood or atmosphere" },
    },
    constraints: {
      maxLength: 200,
      requiredSections: ["style", "subject", "quality"],
    },
    example:
      "Cinematic product photo of smartphone, golden hour lighting, rule of thirds, HD resolution 1250x555, professional photography, inspiring mood",
  },
  {
    name: "Professional Type Image Prompt",
    category: "image_prompt",
    type: "prebuilt",
    template:
      "Professional {type} image showing {subject}, {background}, {lighting_style}, sharp focus, {color_palette}, {mood}",
    variables: {
      type: { type: "text", required: true, description: "Image type" },
      subject: { type: "text", required: true, description: "Main subject" },
      background: { type: "text", required: true, description: "Background description" },
      lighting_style: { type: "text", required: true, description: "Lighting style" },
      color_palette: { type: "text", required: true, description: "Color scheme" },
      mood: { type: "text", required: true, description: "Mood or atmosphere" },
    },
    constraints: {
      maxLength: 200,
      requiredSections: ["type", "subject", "quality"],
    },
    example:
      "Professional headshot showing confident entrepreneur, blurred office background, studio lighting, sharp focus, warm tones, professional mood",
  },
  {
    name: "High-Quality Style Photograph Prompt",
    category: "image_prompt",
    type: "prebuilt",
    template:
      "High-quality {style} photograph of {subject}, {composition_rule}, {lighting}, {colors}, professional, 4K quality",
    variables: {
      style: { type: "text", required: true, description: "Photography style" },
      subject: { type: "text", required: true, description: "Main subject" },
      composition_rule: { type: "text", required: true, description: "Composition rule" },
      lighting: { type: "text", required: true, description: "Lighting description" },
      colors: { type: "text", required: true, description: "Color description" },
    },
    constraints: {
      maxLength: 200,
      requiredSections: ["style", "subject", "quality"],
    },
    example:
      "High-quality lifestyle photograph of person working at laptop, rule of thirds, natural window light, warm colors, professional, 4K quality",
  },

  // Video Prompt Templates (3 templates)
  {
    name: "Cinematic Video Prompt",
    category: "video_prompt",
    type: "prebuilt",
    template:
      "Cinematic video of {subject}, {camera_movement}, {lighting_style}, {duration}, high quality, {mood}, smooth transitions",
    variables: {
      subject: { type: "text", required: true, description: "Main subject" },
      camera_movement: { type: "text", required: true, description: "Camera movement" },
      lighting_style: { type: "text", required: true, description: "Lighting style" },
      duration: { type: "text", required: true, description: "Video duration" },
      mood: { type: "text", required: true, description: "Mood or atmosphere" },
    },
    constraints: {
      maxLength: 200,
      requiredSections: ["subject", "movement", "quality"],
    },
    example:
      "Cinematic video of product showcase, slow pan across, studio lighting, 10 seconds, high quality, premium feel, smooth transitions",
  },
  {
    name: "Professional Video Prompt",
    category: "video_prompt",
    type: "prebuilt",
    template:
      "Professional video showing {subject}, {camera_movement}, {action}, {lighting}, {style}, high quality",
    variables: {
      subject: { type: "text", required: true, description: "Main subject" },
      camera_movement: { type: "text", required: true, description: "Camera movement" },
      action: { type: "text", required: true, description: "Action or activity" },
      lighting: { type: "text", required: true, description: "Lighting description" },
      style: { type: "text", required: true, description: "Video style" },
    },
    constraints: {
      maxLength: 200,
      requiredSections: ["subject", "action", "quality"],
    },
    example:
      "Professional video showing person using laptop, slow zoom in, typing and smiling, natural lighting, documentary style, high quality",
  },
  {
    name: "Style Video Prompt",
    category: "video_prompt",
    type: "prebuilt",
    template:
      "{Style} video of {subject}, {movement}, {lighting}, {duration}, cinematic quality, {mood}",
    variables: {
      Style: { type: "text", required: true, description: "Video style" },
      subject: { type: "text", required: true, description: "Main subject" },
      movement: { type: "text", required: true, description: "Movement type" },
      lighting: { type: "text", required: true, description: "Lighting description" },
      duration: { type: "text", required: true, description: "Video duration" },
      mood: { type: "text", required: true, description: "Mood or atmosphere" },
    },
    constraints: {
      maxLength: 200,
      requiredSections: ["style", "subject", "quality"],
    },
    example:
      "Dynamic video of fitness routine, steady shot, bright lighting, 15 seconds, cinematic quality, energetic mood",
  },
];

async function seedTemplates() {
  console.log("🌱 Starting template seeding...");

  let created = 0;
  let skipped = 0;

  for (const template of templates) {
    try {
      // Check if template already exists
      const existing = await prisma.template.findFirst({
        where: {
          name: template.name,
          category: template.category,
        },
      });

      if (existing) {
        console.log(`⏭️  Skipped: "${template.name}" (already exists)`);
        skipped++;
        continue;
      }

      // Create template
      await prisma.template.create({
        data: {
          name: template.name,
          category: template.category,
          type: template.type,
          template: template.template,
          variables: JSON.stringify(template.variables),
          constraints: JSON.stringify(template.constraints),
          example: template.example,
          isFavorite: false,
          usageCount: 0,
        },
      });

      console.log(`✅ Created: "${template.name}" (${template.category})`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating "${template.name}":`, error);
    }
  }

  console.log(`\n📊 Seeding complete:`);
  console.log(`   ✅ Created: ${created} templates`);
  console.log(`   ⏭️  Skipped: ${skipped} templates`);
  console.log(`   📝 Total: ${created + skipped} templates`);
}

// Run seeding if called directly
if (require.main === module) {
  seedTemplates()
    .then(() => {
      console.log("\n✨ Template seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Template seeding failed:", error);
      process.exit(1);
    });
}

export { seedTemplates };