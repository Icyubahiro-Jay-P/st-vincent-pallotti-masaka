// Central place for nav, contact and social data shared across the header,
// footer and individual pages. Phone/email are placeholders for this demo.
// Swap in the school's real admissions line and inbox before going live.

export const siteConfig = {
  name: "Saint Vincent Pallotti School Masaka",
  shortName: "Pallotti Masaka",
  motto: "Strive Beyond",
  spiritualMotto: "The love of Christ urges us on",
  spiritualMottoLatin: "Caritas Christi urget nos",
  foundedBy: "Pallottine Missionary Sisters, Our Lady of Kibeho Region",
  location: "Masaka, Kigali, Rwanda",
  phoneDisplay: "+250 788 000 000",
  phoneHref: "+250788000000",
  whatsappNumber: "250788000000",
  email: "admissions@pallottimasaka.org",
  mapsQuery: "https://www.google.com/maps/search/?api=1&query=Saint+Vincent+Pallotti+School+Masaka+Kigali+Rwanda",
} as const

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/tvet", label: "TVET" },
  { href: "/news", label: "School Life" },
  { href: "/admissions", label: "Admissions" },
  { href: "/contact", label: "Contact" },
] as const

export const socialLinks = {
  instagram: "https://www.instagram.com/saintvincentpallottimasaka",
  youtube: "https://www.youtube.com/@saintvincentpallottimasaka",
  facebook: "https://www.facebook.com/saintvincentpallottimasaka",
} as const

export const schoolStats = [
  { value: "1,400+", label: "Students enrolled" },
  { value: "2022", label: "New campus inaugurated" },
  { value: "5", label: "TVET trades offered" },
  { value: "2", label: "Curricula: Cambridge & National" },
] as const

export const programs = [
  {
    slug: "day-care",
    name: "Day Care",
    ageRange: "3 months – 2 years",
    description:
      "A warm, secure nursery environment for our youngest learners, with qualified caregivers and Montessori-inspired play.",
    icon: "Baby",
  },
  {
    slug: "kindergarten",
    name: "Kindergarten",
    ageRange: "3 – 5 years",
    description:
      "Play-based early learning that builds language, number sense and social skills ahead of Primary One.",
    icon: "Blocks",
  },
  {
    slug: "special-needs",
    name: "Special Needs Education",
    ageRange: "All ages",
    description:
      "Individualised support and an inclusive classroom model so every child learns at their own pace, with dignity.",
    icon: "HeartHandshake",
  },
  {
    slug: "cambridge-primary",
    name: "Cambridge Primary",
    ageRange: "P1 – P6",
    description:
      "An internationally benchmarked curriculum in English, Mathematics and Science for globally minded families.",
    icon: "Globe2",
  },
  {
    slug: "national-primary",
    name: "National Nursery & Primary",
    ageRange: "N1 – P6",
    description:
      "The Rwandan competence-based curriculum, delivered in a disciplined, values-led classroom.",
    icon: "BookOpen",
  },
  {
    slug: "national-secondary",
    name: "National Secondary",
    ageRange: "S1 – S6",
    description:
      "O-Level and A-Level pathways that prepare students for national examinations and university entry.",
    icon: "GraduationCap",
  },
  {
    slug: "tvet",
    name: "TVET / Vocational",
    ageRange: "Post-S3",
    description:
      "Hands-on trade training in Welding, Tailoring, Hairdressing, Carpentry and Culinary Arts.",
    icon: "Hammer",
  },
] as const

export const tvetTrades = [
  {
    name: "Welding & Fabrication",
    icon: "Flame",
    description:
      "Metal joining, structural fabrication and workshop safety, building toward RTB trade certification.",
  },
  {
    name: "Tailoring & Fashion Design",
    icon: "Scissors",
    description:
      "Garment construction, pattern-making and small-business skills for Rwanda's growing fashion sector.",
  },
  {
    name: "Hairdressing & Beauty",
    icon: "Sparkles",
    description:
      "Modern salon techniques alongside client care and the basics of running a beauty business.",
  },
  {
    name: "Carpentry & Joinery",
    icon: "Hammer",
    description:
      "Furniture-making, structural woodwork and precision tool use, from hand tools to power equipment.",
  },
  {
    name: "Culinary Arts",
    icon: "ChefHat",
    description:
      "Professional kitchen practice, food safety and hospitality skills for restaurants and catering.",
  },
] as const

export const educationPathway = [
  {
    step: "01",
    stage: "Day Care",
    range: "3 months – 2 yrs",
    description: "Nurturing care and early stimulation in a safe, loving environment.",
  },
  {
    step: "02",
    stage: "Kindergarten",
    range: "3 – 5 yrs",
    description: "Foundational literacy, numeracy and social skills through guided play.",
  },
  {
    step: "03",
    stage: "Primary",
    range: "P1 – P6",
    description: "Cambridge or National curriculum, building strong academic fundamentals.",
  },
  {
    step: "04",
    stage: "Secondary",
    range: "S1 – S6",
    description: "O-Level and A-Level study, character formation and leadership.",
  },
  {
    step: "05",
    stage: "TVET & Beyond",
    range: "Post-S3",
    description: "A trade certification or university-ready graduate, prepared to strive beyond.",
  },
] as const

export const newsItems = [
  {
    slug: "new-campus-inauguration",
    title: "New Campus Officially Inaugurated",
    date: "2022",
    excerpt:
      "Our expanded campus was blessed and opened by Cardinal Antoine Kambanda alongside the Ministry of Education, raising capacity to over 1,200 students.",
    category: "School Life",
  },
  {
    slug: "cambridge-results",
    title: "Strong Results Across Cambridge & National Streams",
    date: "This Year",
    excerpt:
      "Pallotti students continue to place among the stronger-performing schools in the Kigali area across both curricula.",
    category: "Academics",
  },
  {
    slug: "tvet-open-day",
    title: "TVET Workshops Open Day",
    date: "This Term",
    excerpt:
      "Families visited our Welding, Tailoring, Hairdressing, Carpentry and Culinary workshops to see hands-on trade training in action.",
    category: "TVET",
  },
] as const
