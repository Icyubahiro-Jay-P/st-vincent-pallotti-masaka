// The English dictionary is the source of truth for shape: every other
// dictionary (see fr.ts) is typed as `Dictionary`, so TypeScript errors on
// any missing or extra key. To add a language, copy this file, translate
// every string value, and leave the keys, slugs and icon names untouched.

const en = {
  // Lets any component holding a dict identify the current language without
  // needing a separate `locale` prop threaded down from the layout.
  locale: "en",

  a11y: {
    skipToContent: "Skip to main content",
  },

  // Translatable text for the programs, keyed by the slug defined in
  // lib/site-config.ts (which also owns the locale-independent icon name and
  // route). Keep the keys identical across locales.
  programs: {
    "day-care": {
      name: "Day Care",
      ageRange: "3 months – 2 years",
      description:
        "A warm, secure nursery environment for our youngest learners, with qualified caregivers and Montessori-inspired play.",
      overview:
        "Our Day Care welcomes infants and toddlers into a secure, home-like setting where trained caregivers focus on comfort, routine and early stimulation. Montessori-inspired activities build the first foundations of independence and curiosity, in a space designed and supervised for our youngest learners.",
      highlights: [
        "Low caregiver-to-child ratios",
        "Montessori-inspired sensory play",
        "Structured daily routines for feeding, rest and hygiene",
        "A secure, home-like nursery environment",
      ],
    },
    kindergarten: {
      name: "Kindergarten",
      ageRange: "N1 – N3",
      description:
        "Play-based early learning that builds language, number sense and social skills ahead of Primary One.",
      overview:
        "Kindergarten builds on Day Care with structured, play-based learning that develops language, number sense and social skills. Children leave ready for the structure of Primary One, confident and curious about the world around them.",
      highlights: [
        "Play-based literacy and numeracy foundations",
        "Social and emotional skill building",
        "Preparation for Primary One",
        "Creative arts, music and movement",
      ],
    },
    "special-needs": {
      name: "Special Needs Education",
      ageRange: "All levels",
      description:
        "Individualised support and an inclusive classroom model so every child learns at their own pace, with dignity.",
      overview:
        "Every learner deserves a classroom built around them. Our Special Needs Education program pairs individualised learning plans with trained support staff, so students with a range of abilities learn alongside their peers with dignity, consistent with the Pallottine belief that no learner should be left behind.",
      highlights: [
        "Individualised learning plans",
        "Trained special needs educators",
        "Inclusive, mixed-ability classrooms",
        "Available at every level, from Day Care to Secondary",
      ],
    },
    "cambridge-primary": {
      name: "Cambridge Primary",
      ageRange: "Grade 1 – Grade 8",
      description:
        "An internationally benchmarked curriculum in English, Mathematics and Science for globally minded families.",
      overview:
        "Our Cambridge stream follows the Cambridge Primary framework in English, Mathematics and Science, giving globally minded families an internationally benchmarked education from the earliest grades.",
      highlights: [
        "Cambridge Primary English, Mathematics and Science",
        "Internationally benchmarked assessment",
        "Small class sizes and dedicated subject teachers",
        "Primary through Lower Secondary, Grade 1 to Grade 8",
      ],
    },
    "national-nursery": {
      name: "National Nursery",
      ageRange: "N1 – N3",
      description:
        "Early years on Rwanda's competence-based curriculum, building language, number sense and social skills ahead of Primary One.",
      overview:
        "National Nursery follows Rwanda's competence-based curriculum from N1 to N3, using guided play and structured activities to build early literacy in Kinyarwanda and English, number sense and social skills, so children arrive in P1 confident and ready to learn.",
      highlights: [
        "Nursery 1 to Nursery 3 (N1 – N3)",
        "Rwanda's official competence-based curriculum",
        "Early literacy in Kinyarwanda and English",
        "Preparation for Primary One",
      ],
    },
    "national-primary": {
      name: "National Primary",
      ageRange: "P1 – P6",
      description:
        "The Rwandan competence-based curriculum, delivered in a disciplined, values-led classroom.",
      overview:
        "National Primary follows Rwanda's competence-based curriculum from P1 to P6, taught in a disciplined, values-led classroom that builds strong academic fundamentals in Kinyarwanda, English and Mathematics.",
      highlights: [
        "Rwanda's official competence-based curriculum",
        "Kinyarwanda, English and Mathematics foundations",
        "Values-led, disciplined classroom culture",
        "A clear pathway into National Secondary",
      ],
    },
    "national-secondary": {
      name: "Ordinary Level (O'Level)",
      ageRange: "S1 – S3",
      description:
        "Three years of lower secondary on Rwanda's national curriculum, building toward the O'Level national examinations.",
      overview:
        "Our Ordinary Level (O'Level) program carries students from Senior 1 to Senior 3 on Rwanda's competence-based curriculum, preparing them for the O'Level national examinations and their next step, whether further study or TVET, through rigorous academics and character formation.",
      highlights: [
        "Senior 1 to Senior 3 (S1 – S3)",
        "Preparation for the O'Level national examinations",
        "Guidance toward further study or TVET",
        "Leadership and character formation",
      ],
    },
    tvet: {
      name: "TVET / Vocational",
      ageRange: "Post-S3",
      description:
        "Hands-on trade training in Welding, Tailoring, Hairdressing, Carpentry and Culinary Arts.",
      overview:
        "Alongside our academic tracks, TVET offers hands-on trade training in five workshops, building toward real certification and a direct path to work.",
      highlights: [
        "Five hands-on trades to choose from",
        "Certification-track training",
        "Real workshop equipment and practice",
        "A direct path to employment or self-employment",
      ],
    },
  },

  meta: {
    home: {
      title: "Saint Vincent Pallotti School Masaka | Strive Beyond",
      description:
        "Saint Vincent Pallotti School Masaka is a Pallottine Missionary Sisters school in Masaka, Kigali offering Day Care, Kindergarten, Cambridge Primary, National Nursery, Primary & Secondary, Special Needs Education and TVET vocational training.",
      ogDescription:
        "A Pallottine Missionary Sisters school in Masaka, Kigali, covering Day Care through Secondary, Cambridge and National curricula, Special Needs Education, and TVET.",
    },
    about: {
      title: "About Us",
      description:
        "The story of Saint Vincent Pallotti School Masaka, run by the Pallottine Missionary Sisters in Masaka, Kigali, Rwanda.",
    },
    academics: {
      title: "Academics",
      description:
        "Cambridge and National curricula, plus Special Needs Education, at Saint Vincent Pallotti School Masaka.",
    },
    tvet: {
      title: "TVET / Vocational Programs",
      description:
        "Hands-on trade training at Saint Vincent Pallotti School Masaka: Welding, Tailoring, Hairdressing, Carpentry and Culinary Arts.",
    },
    admissions: {
      title: "Admissions",
      description:
        "Start an admissions inquiry at Saint Vincent Pallotti School Masaka: Day Care, Kindergarten, Cambridge and National Primary & Secondary, Special Needs Education, and TVET.",
    },
    news: {
      title: "News & School Life",
      description:
        "News, achievements and school life updates from Saint Vincent Pallotti School Masaka.",
    },
    gallery: {
      title: "Photo Gallery",
      description:
        "Photos from events, classes and school life at Saint Vincent Pallotti School Masaka.",
    },
    contact: {
      title: "Contact",
      description:
        "Get in touch with Saint Vincent Pallotti School Masaka: phone, WhatsApp, email and campus location in Masaka, Kigali.",
    },
    privacy: {
      title: "Privacy Policy",
      description:
        "How Saint Vincent Pallotti School Masaka collects, uses and protects personal data submitted through this website.",
    },
    terms: {
      title: "Terms of Service",
      description:
        "The terms that govern your use of the Saint Vincent Pallotti School Masaka website.",
    },
    cookiePolicy: {
      title: "Cookie Policy",
      description:
        "The cookies used on the Saint Vincent Pallotti School Masaka website and how to control them.",
    },
    accessibility: {
      title: "Accessibility Statement",
      description:
        "Saint Vincent Pallotti School Masaka's commitment to an accessible website and how to report issues.",
    },
  },

  site: {
    spiritualMotto: "The love of Christ urges us on",
    foundedBy: "Pallottine Missionary Sisters, Our Lady of Kibeho Region",
  },

  nav: {
    primaryLabel: "Primary",
    home: "Home",
    about: "About",
    academics: "Academics",
    tvet: "TVET",
    news: "School Life",
    gallery: "Gallery",
    admissions: "Admissions",
    contact: "Contact",
    applyNow: "Apply Now",
    openMenu: "Open menu",
    closeMenu: "Close",
    sheetDescription: "Strive Beyond · Masaka, Kigali",
  },

  themeToggle: {
    toggle: "Toggle theme",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },

  languageSwitcher: {
    label: "Language",
  },

  common: {
    viewFullProgramPage: "View full program page",
    applyTo: "Apply to",
    loading: "Loading",
    programsHelp: {
      title: "Not sure which program fits?",
      description:
        "Tell us about your child and our admissions team will help you choose the right level.",
      cta: "Talk to admissions",
    },
  },

  footer: {
    exploreHeading: "Explore",
    programsHeading: "Programs",
    contactHeading: "Contact",
    runByPrefix: "Run by the",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Service",
    cookiePolicyLink: "Cookie Policy",
    accessibilityLink: "Accessibility",
  },

  cookieConsent: {
    message:
      "We use strictly necessary cookies to remember your language and keep the admin portal secure. We don't use analytics or advertising cookies.",
    acceptAll: "Accept",
    necessaryOnly: "Necessary only",
    privacyLink: "Privacy Policy",
  },

  whatsapp: {
    ariaLabel: "Chat with us on WhatsApp",
    tooltip: "Chat with Admissions",
    prefillMessage:
      "Hello Saint Vincent Pallotti School Masaka, I would like to ask about admissions.",
    bookTourLabel: "Book a Tour",
    bookTourMessage:
      "Hello Saint Vincent Pallotti School Masaka, I would like to book a school tour.",
  },

  notFound: {
    code: "404",
    title: "This page has stepped out",
    description:
      "The page you’re looking for doesn’t exist. Let’s get you back on the path.",
    cta: "Back to Homepage",
  },

  home: {
    hero: {
      applyNow: "Apply Now",
      ourStory: "Our Story",
    },
    programs: {
      eyebrow: "What We Offer",
      title: "One campus, every stage of the journey",
      description:
        "Eight programs under one roof, from a child's first day of care through to a trade certificate or university placement.",
    },
    pathway: {
      eyebrow: "The Pallotti Pathway",
      title: "Your child’s journey, stage by stage",
      steps: [
        {
          stage: "Day Care",
          range: "3 months – 2 yrs",
          description:
            "Nurturing care and early stimulation in a safe, loving environment.",
        },
        {
          stage: "Nursery & Kindergarten",
          range: "N1 – N3",
          description:
            "Foundational literacy, numeracy and social skills through guided play.",
        },
        {
          stage: "Primary",
          range: "P1 – P6 · Grade 1 – 8",
          description:
            "Cambridge (Grade 1 – 8) or National (P1 – P6) curriculum, building strong academic fundamentals.",
        },
        {
          stage: "Secondary",
          range: "S1 – S3",
          description:
            "Ordinary Level (O'Level) study, character formation and leadership.",
        },
        {
          stage: "TVET & Beyond",
          range: "Post-S3",
          description:
            "A trade certification or a strong foundation for further study, prepared to strive beyond.",
        },
      ],
    },
    why: {
      eyebrow: "Why Families Choose Pallotti",
      visitCard: {
        title: "See it for yourself",
        description:
          "Walk the campus, meet our teachers and ask anything on a guided school tour.",
      },
      title: "Built for growth, rooted in values",
      features: [
        {
          title: "A Campus Built to Last",
          description:
            "Expanded in 2022 and inaugurated by Cardinal Antoine Kambanda with the Ministry of Education, our campus now holds over 1,200 additional seats: modern classrooms, workshops and grounds designed for growth.",
        },
        {
          title: "Cambridge & National, Side by Side",
          description:
            "Families choose the internationally benchmarked Cambridge curriculum or the Rwandan National curriculum, both delivered to a high standard.",
        },
        {
          title: "Formed in Catholic Values",
          description:
            "Guided by the Pallottine Missionary Sisters, character and faith formation sit alongside academics.",
        },
        {
          title: "An Inclusive Classroom",
          description:
            "Dedicated Special Needs Education means every learner, regardless of ability, has a place at Pallotti.",
        },
      ],
    },
    news: {
      eyebrow: "School Life",
      title: "Latest from Pallotti",
      viewAll: "View all news",
      followText: "Follow daily life on campus on Instagram and YouTube.",
      youtubeAriaLabel: "YouTube",
    },
    cta: {
      eyebrow: "Admissions Open",
      title: "Give your child a place to strive beyond",
      paragraph:
        "Seats are limited across Day Care, Kindergarten, Primary, Secondary and TVET. Start an inquiry today and our admissions team will guide you through the rest.",
      startApplication: "Start Your Application",
      chatWhatsapp: "Chat on WhatsApp",
    },
  },

  about: {
    hero: {
      eyebrow: "About Us",
      title: "Our Story",
      description:
        "Saint Vincent Pallotti School Masaka is run by the Pallottine Missionary Sisters, Our Lady of Kibeho Region, a mission of faith, academics and opportunity in Masaka, Kigali.",
    },
    charism: {
      eyebrow: "Our Charism",
      quote: "The love of Christ urges us on",
      citation: "Caritas Christi urget nos (2 Corinthians 5:14)",
      paragraph:
        "We are run by the Pallottine Missionary Sisters, part of the Union of Catholic Apostolate founded on the vision of St. Vincent Pallotti. That charism, that Christ’s love compels us to act, shapes how our staff teach, how our Sisters care for students, and why Special Needs Education and TVET sit alongside our academic curricula: everyone deserves a path to strive beyond their circumstances.",
      glanceTitle: "At a glance",
      runBy: "Run by",
      runByValue: "Pallottine Missionary Sisters",
      region: "Region",
      location: "Location",
      motto: "Motto",
      regionValue: "Our Lady of Kibeho",
    },
    values: {
      eyebrow: "What We Stand For",
      title: "Faith, excellence, inclusion, opportunity",
    },
    headmistress: {
      eyebrow: "Leadership",
      title: "Message from the Headmistress",
      message:
        "Welcome to Saint Vincent Pallotti School Masaka. Together with our Sisters, staff and families, we walk with every child in faith, learning and service.",
      photoAlt: "The Headmistress of Saint Vincent Pallotti School Masaka",
    },
    milestones: {
      eyebrow: "Our Journey",
      title: "Milestones",
    },
  },

  academics: {
    hero: {
      eyebrow: "Academics",
      title: "Two Curricula. One Standard of Excellence.",
      description:
        "Families choose between the Cambridge and National curricula at Pallotti, both taught to the same high standard, from Nursery through Secondary.",
    },
    curricula: [
      {
        name: "Cambridge Curriculum",
        tagline: "Internationally benchmarked",
        range: "Kindergarten · Grade 1 – Grade 8",
        levels: ["kindergarten", "cambridge-primary"],
        description:
          "Our Cambridge stream follows the Cambridge Primary framework in English, Mathematics and Science, preparing students for globally recognised progression.",
        subjects: [
          "English",
          "Mathematics",
          "Science",
          "ICT",
          "Global Perspectives",
        ],
      },
      {
        name: "National Curriculum",
        tagline: "Rwanda's competence-based curriculum",
        range: "N1 – S3 · TVET",
        levels: [
          "national-nursery",
          "national-primary",
          "national-secondary",
          "tvet",
        ],
        description:
          "National Nursery, Primary and Secondary follow Rwanda's official competence-based curriculum, taught in a disciplined, values-led classroom.",
        subjects: [
          "Kinyarwanda",
          "English",
          "Mathematics",
          "Social Studies",
          "Sciences",
        ],
      },
    ],
    chooseLevel: "Choose a level",
    subjectHighlights: [
      "Mathematics & Sciences",
      "English & Kinyarwanda",
      "Integrated Science",
      "Creative & Performing Arts",
    ],
    specialNeeds: {
      title: "Special Needs Education",
      paragraph:
        "Every child deserves a classroom built around them. Our Special Needs Education program provides individualised learning plans, trained support staff and an inclusive environment where students with a range of abilities learn alongside their peers, consistent with the Pallottine belief that no learner should be left behind.",
      items: [
        "Individualised support plans",
        "Trained special needs educators",
        "Inclusive, mixed-ability classrooms",
        "Available across Day Care to Secondary",
      ],
    },
    allPrograms: {
      eyebrow: "Every Program",
      title: "Find your child's program",
      description:
        "Every program below has its own page with class range, what students learn, and how to apply.",
    },
    closing: {
      paragraph:
        "Pallotti students are consistently among the stronger-performing cohorts in the Kigali area, across both the Cambridge and National streams, a track record our teachers work hard to build on every term.",
      cta: "Apply for a Place",
    },
    detail: {
      ageRangeLabel: "Class Range",
      exploreMoreEyebrow: "Explore More",
      exploreMoreTitle: "Other programs at Pallotti",
    },
  },

  tvet: {
    hero: {
      eyebrow: "TVET / Vocational",
      title: "A Trade Is a Future",
      description:
        "Alongside our academic tracks, Pallotti offers Technical and Vocational Education and Training in five hands-on trades: a real, certifiable path to work.",
    },
    trades: [
      {
        name: "Welding & Fabrication",
        description:
          "Metal joining, structural fabrication and workshop safety, building toward RTB trade certification.",
      },
      {
        name: "Tailoring & Fashion Design",
        description:
          "Garment construction, pattern-making and small-business skills for Rwanda's growing fashion sector.",
      },
      {
        name: "Hairdressing & Beauty",
        description:
          "Modern salon techniques alongside client care and the basics of running a beauty business.",
      },
      {
        name: "Carpentry & Joinery",
        description:
          "Furniture-making, structural woodwork and precision tool use, from hand tools to power equipment.",
      },
      {
        name: "Culinary Arts",
        description:
          "Professional kitchen practice, food safety and hospitality skills for restaurants and catering.",
      },
    ],
    enrolCard: {
      eyebrow: "Ready to enrol?",
      paragraph:
        "Speak to our admissions team about placement, workshop tours and entry requirements for each trade.",
      cta: "Apply to TVET",
    },
    reasons: {
      eyebrow: "Why TVET at Pallotti",
      title: "Skills that put students to work",
      items: [
        {
          title: "Hands-On From Day One",
          description:
            "Real workshop equipment and practical assessments, not just theory.",
        },
        {
          title: "Certification-Track Training",
          description:
            "Curriculum built toward recognised trade certification standards.",
        },
        {
          title: "A Direct Path to Work",
          description:
            "Graduates leave ready to employ themselves or join Rwanda's growing trades sector.",
        },
      ],
    },
  },

  admissions: {
    hero: {
      eyebrow: "Admissions",
      title: "Join the Pallotti Family",
      description:
        "Seats are open across Day Care, Kindergarten, Cambridge and National Primary & Secondary, Special Needs Education, and TVET. Here's how to apply, plus a form to get started today.",
    },
    process: {
      eyebrow: "How It Works",
      title: "A simple, four-step process",
      steps: [
        {
          title: "Submit an Inquiry",
          description:
            "Complete the form below with your child's details and program of interest.",
        },
        {
          title: "Campus Visit & Assessment",
          description:
            "Our admissions team schedules a campus tour and, where applicable, a simple placement assessment.",
        },
        {
          title: "Submit Documents",
          description:
            "Bring the required documents for your child's program (see the checklist below).",
        },
        {
          title: "Enrollment Confirmed",
          description:
            "Once documents are verified, you'll receive confirmation and fee information to secure the place.",
        },
      ],
    },
    requirements: {
      eyebrow: "Requirements",
      title: "What to bring, by level",
      description:
        "A general guide. Our admissions team will confirm the exact documents for your child during your campus visit.",
      levels: [
        {
          value: "early-years",
          label: "Day Care & Kindergarten",
          items: [
            "Child's birth certificate (copy)",
            "Immunization / health record",
            "4 passport-size photos of the child",
            "Copy of parent/guardian national ID or passport",
          ],
        },
        {
          value: "primary",
          label: "Primary (Cambridge & National)",
          items: [
            "Birth certificate (copy)",
            "Report form / transcript from previous school",
            "Transfer letter, if changing schools",
            "4 passport-size photos of the student",
            "Immunization record",
          ],
        },
        {
          value: "secondary",
          label: "Secondary (O'Level, S1 – S3)",
          items: [
            "Primary Leaving / previous school certificate",
            "Most recent report card or transcript",
            "Transfer letter from previous school",
            "4 passport-size photos of the student",
            "Copy of student and parent/guardian ID",
          ],
        },
        {
          value: "tvet",
          label: "TVET / Vocational",
          items: [
            "Highest academic certificate obtained",
            "National ID or passport copy",
            "4 passport-size photos",
            "Statement of the trade of interest",
          ],
        },
      ],
    },
    form: {
      eyebrow: "Start Now",
      title: "Admissions Inquiry Form",
      description:
        "Tell us about your child and we’ll reach out to arrange a campus visit.",
      parentName: "Parent / Guardian Name",
      parentNamePlaceholder: "e.g. Jean Mukamana",
      childName: "Student's Name",
      childNamePlaceholder: "e.g. Aline Mukamana",
      email: "Email Address",
      emailPlaceholder: "you@example.com",
      phone: "Phone Number",
      phonePlaceholder: "+250 7xx xxx xxx",
      program: "Program of Interest",
      programPlaceholder: "Select a program",
      preferredTerm: "Preferred Start Term",
      preferredTermPlaceholder: "Select a term",
      terms: ["Term 1", "Term 2", "Term 3", "Not sure yet"],
      message: "Message (optional)",
      messagePlaceholder:
        "Tell us anything that would help our admissions team, such as current grade or special needs support required.",
      sending: "Sending…",
      submit: "Submit Inquiry",
      receivedTitle: "Inquiry received",
    },
    sidebar: {
      talkTitle: "Prefer to talk to someone?",
      talkParagraph:
        "Our admissions office is happy to answer questions directly.",
      whatsapp: "WhatsApp Us",
      goodToKnowTitle: "Good to know",
      goodToKnow: [
        "Rolling admissions across three terms.",
        "Assessments are age-appropriate and stress-free.",
        "Special Needs Education places are available at every level.",
        "Sibling and staff-family inquiries are welcome.",
      ],
    },
    errors: {
      parentName: "Enter the parent or guardian's name.",
      email: "Enter an email address.",
      emailInvalid: "Enter a valid email address.",
      phone: "Enter a phone number.",
      childName: "Enter the student's name.",
      program: "Select a program.",
      formError: "Please fix the fields below and try again.",
      rateLimited: "Too many submissions. Please try again in a bit.",
    },
    // {parentName} and {childName} are replaced at submit time; keep both
    // placeholders somewhere in the sentence when translating.
    success:
      "Thank you, {parentName}. We've received your inquiry for {childName} and will be in touch within 2 business days.",
  },

  news: {
    hero: {
      eyebrow: "School Life",
      title: "News & Updates",
      description:
        "What's happening on campus: academics, TVET and community life at Pallotti.",
    },
    empty: "No news yet, check back soon.",
    galleryHeading: "Photos",
    backToNews: "Back to News",
    galleryCarousel: "Event photos",
    galleryPrev: "Previous photo",
    galleryNext: "Next photo",
    galleryGoTo: "Go to photo {n}",
    gallerySlideOf: "{n} of {total}",
    follow: {
      eyebrow: "Follow Along",
      title: "More school life on Instagram & YouTube",
      instagram: "Instagram",
      youtube: "YouTube",
      facebook: "Facebook",
    },
  },

  gallery: {
    hero: {
      eyebrow: "Gallery",
      title: "Photo Gallery",
      description:
        "Moments from events, classes and community life at Pallotti.",
    },
    empty: "No photos yet, check back soon.",
  },

  newsletter: {
    footerHeading: "Stay in the loop",
    footerDescription:
      "Term dates, admissions windows, and school news in your inbox.",
    placeholder: "Your email address",
    button: "Subscribe",
    invalidEmail: "Enter a valid email address.",
    success: "Thanks! You'll hear about our next updates.",
    rateLimited: "Too many attempts. Please try again in a bit.",
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      title: "We'd Love to Hear From You",
      description:
        "Call, WhatsApp, email or visit our campus in Masaka, Kigali, whichever is easiest for your family.",
    },
    cards: {
      call: "Call Us",
      whatsapp: "WhatsApp",
      whatsappValue: "Chat with Admissions",
      email: "Email",
      visit: "Visit Us",
    },
    findUs: {
      eyebrow: "Find Us",
      title: "Masaka, Kigali, Rwanda",
      paragraph:
        "Our campus sits in Masaka, on the outskirts of Kigali. Tap the map to open directions in Google Maps.",
      officeHoursTitle: "Office Hours",
      officeHoursValue: "Monday – Friday, 7:30 AM – 4:30 PM",
      goToAdmissions: "Go to Admissions",
      mapTitle: "Map showing Saint Vincent Pallotti School Masaka",
    },
  },
}

export default en

export type Dictionary = typeof en
