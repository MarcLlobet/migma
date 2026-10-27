// Homepage copy, mirrored from migma.ai (Oct 27, 2026) for a performance prototype.
// Kept identical across the "before" and "after" apps so only the architecture differs.

export const nav = ["Solutions", "Resources", "Agents", "Pricing"];

export const hero = {
  title: ["Create Emails", "Worth Opening"],
  subtitle: "AI that designs and delivers campaigns that actually convert",
  prompts: [
    "Create an email showing our trending products",
    "Create an email about the latest tech news in the AI space",
    "Write a welcome series for new subscribers",
    "Announce our spring launch with a countdown",
  ],
  imports: [
    { label: "Import from Figma" },
    { label: "Clone a Screenshot", badge: "New" },
    { label: "Import from HTML" },
    { label: "Import Claude design" },
  ],
};

export const meet = {
  title: "Meet MigmaAI",
  items: [
    { title: "From idea to inbox", text: "Describe your campaign. Migma designs it in your brand, ready to send." },
    { title: "Edit visually", text: "Click any element or just ask. Change text, images, colors, and styles without code." },
    { title: "See it the way your readers will", text: "Run Preflight to see each email on desktop and phone, light and dark, before it goes out." },
    { title: "Send & track", text: "Send from your own domain and see who opens and clicks, as it happens." },
  ],
};

export const trusted = ["Versace", "Cloudflare", "Adjust", "SumUp", "Vice Golf"];

export const sameTeam = {
  title: ["Next-level email marketing.", "Same team."],
  subtitle: "AI writes, designs and builds campaigns around your brand and products.",
  cards: [
    {
      tag: ["AI", "Copy & design"],
      title: "Turn subscribers into customers.",
      text: "Welcome emails, launches and follow-ups. AI creates the copy and design, with your brand built in.",
      cta: "Create my welcome email",
      tone: "light",
    },
    {
      tag: ["Shopify", "AI campaigns"],
      title: "Make your products worth opening.",
      text: "Connect Shopify. AI brings product images, details and links into emails made for your brand.",
      cta: "Create my product campaign",
      tone: "lavender",
    },
  ],
};

export const campaign = {
  tag: ["1 brief", "Whole campaign"],
  title: "Minimize time spent on creating campaigns",
  text: "Let AI build your launch, follow-up and last call, with copy, images and design in your brand. Refine by asking. Review before sending.",
  cta: "Create my campaign",
  emails: ["Launch", "Follow-up", "Last call"],
};

export const comparison = {
  title: "Why Migma for your email marketing?",
  columns: ["Migma", "ChatGPT / Claude"],
  note: "Compare Migma's built-in email workflow with standalone ChatGPT or Claude, without external email tools. Both include automatic preference memory.",
  rows: [
    ["Localization", "Translate every email into your markets' languages in one step.", false],
    ["AI design, ready to send", "Designs that render correctly in every inbox, not just a browser.", false],
    ["Automatic learning", "Remembers your preferences and brand decisions over time.", true],
    ["Email compatibility", "Code compiled for Outlook, Gmail, Apple Mail and dark mode.", false],
    ["Visual editor", "Click any element to change it, no code needed.", false],
    ["Team collaboration", "Review, comment and approve together.", false],
    ["Brand Kit", "Logo, colors, fonts and voice applied to every email.", false],
    ["Images & GIFs for email", "Create and optimize visuals for inboxes.", false],
    ["Live countdowns", "Timers that update when the email is opened.", false],
    ["Optimized image hosting", "Images resized and served from a CDN.", false],
    ["Shopify integration", "Products, prices and links pulled automatically.", false],
    ["AI audience segments", "Build segments by describing who to reach.", false],
    ["Sending & click maps", "Send from your domain and see where people click.", false],
    ["Dedicated IPs", "Protect your sender reputation at scale.", false],
  ] as [string, string, boolean][],
};

export const integrations = {
  title: ["Your favorite AI.", "Migma behind every email."],
  text: "Create Migma emails from Claude, ChatGPT or Grok Bot. Work with your team in Slack and Telegram.",
  items: ["Claude", "ChatGPT & Codex", "Grok Bot", "Slack", "Telegram"],
  cta: "Create my email",
};

export const gallery = {
  title: "Browse Real Brand Emails",
  text: "See what top brands are sending and remix any email into your own.",
  cta: "Track a competitor",
  items: [
    ["Oura", "The ring that knows you best"],
    ["Restoration Hardware", "Explore Outdoor Collections in Premium Solid Teak"],
    ["Herbivore", "Final hours! Get a holiday head start with 25% off"],
    ["RetroSupply Co.", "We lowered the price on the spooky box"],
    ["Rahua", "Consider Your Gift List Handled"],
    ["LiteSpeed", "Your server, twice as fast"],
    ["Paws Bento", "New flavors your dog will love"],
    ["Starface", "Meet big yellow"],
    ["Northwind Coffee", "Back in stock: the roast you asked for"],
    ["Lumen Skin", "Your new everyday essentials"],
    ["Fieldnote", "Gifts for the considered"],
    ["Kettle & Co.", "The last kettle you'll ever need"],
  ],
};

export const cta = {
  title: "Start creating campaigns that convert.",
  text: "A unified canvas for product, marketing, and transactional email. Set your goals and let MigmaAI handle the rest.",
  button: "Get started free",
};

export const founders = {
  title: "We built Migma because we lived the problem.",
  text: "Creating one marketing email used to take us days and thousands of dollars. We built Migma to replace that entire workflow with one AI platform, pixel-perfect emails in just a few seconds.",
  link: "Learn more about us",
};

export const footer: [string, string[]][] = [
  ["Solutions", ["Marketers", "Designers", "Developers", "Enterprise"]],
  ["Resources", ["Countdowns", "Email gallery", "Pricing", "Docs", "Blog"]],
  ["Company", ["About Us", "Brand guidelines", "Brand kit", "Careers", "Support", "FAQ"]],
  ["Legal", ["Privacy Policy", "Terms & Conditions", "Cookie Settings", "Acceptable Use"]],
];
