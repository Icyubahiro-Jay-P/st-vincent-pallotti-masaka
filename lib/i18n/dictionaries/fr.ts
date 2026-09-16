import type { Dictionary } from "./en"

// French translation. Typed as `Dictionary` so TypeScript enforces the exact
// same shape as en.ts, keys included.
const fr: Dictionary = {
  programs: {
    "day-care": {
      name: "Garderie",
      ageRange: "3 mois – 2 ans",
      description:
        "Un environnement de garderie chaleureux et sécurisé pour nos plus jeunes élèves, avec du personnel qualifié et des activités d'inspiration Montessori.",
      overview:
        "Notre garderie accueille les nourrissons et les tout-petits dans un cadre sécurisé et familial, où du personnel formé se concentre sur le confort, les routines et l'éveil précoce. Les activités d'inspiration Montessori posent les premières bases de l'autonomie et de la curiosité, dans un espace conçu et supervisé pour nos plus jeunes élèves.",
      highlights: [
        "Un faible nombre d'enfants par éducatrice",
        "Éveil sensoriel d'inspiration Montessori",
        "Routines quotidiennes structurées pour les repas, le repos et l'hygiène",
        "Un environnement de garderie sécurisé et familial",
      ],
    },
    kindergarten: {
      name: "Maternelle",
      ageRange: "3 – 5 ans",
      description:
        "Un apprentissage précoce par le jeu qui développe le langage, le sens des nombres et les compétences sociales avant la première primaire.",
      overview:
        "La maternelle prolonge la garderie avec un apprentissage structuré par le jeu qui développe le langage, le sens des nombres et les compétences sociales. Les enfants en sortent prêts pour le cadre de la première primaire, confiants et curieux du monde qui les entoure.",
      highlights: [
        "Bases de la lecture et du calcul par le jeu",
        "Développement des compétences sociales et émotionnelles",
        "Préparation à la première primaire",
        "Arts créatifs, musique et mouvement",
      ],
    },
    "special-needs": {
      name: "Éducation spécialisée",
      ageRange: "Tous âges",
      description:
        "Un accompagnement individualisé et une classe inclusive pour que chaque enfant apprenne à son rythme, dans la dignité.",
      overview:
        "Chaque élève mérite une classe conçue autour de lui. Notre programme d'éducation spécialisée associe des plans d'apprentissage individualisés à du personnel formé, afin que des élèves aux capacités variées apprennent ensemble dans la dignité, conformément à la conviction pallottine que nul élève ne doit être laissé de côté.",
      highlights: [
        "Plans d'apprentissage individualisés",
        "Éducateurs spécialisés formés",
        "Classes inclusives et de niveaux mixtes",
        "Disponible à tous les niveaux, de la garderie au secondaire",
      ],
    },
    "cambridge-primary": {
      name: "Primaire Cambridge",
      ageRange: "P1 – P6",
      description:
        "Un programme reconnu à l'international, en anglais, mathématiques et sciences, pour les familles tournées vers le monde.",
      overview:
        "Notre filière Cambridge suit le programme Cambridge Primary en anglais, mathématiques et sciences, offrant aux familles tournées vers le monde une éducation reconnue à l'international dès les premières classes.",
      highlights: [
        "Anglais, mathématiques et sciences du programme Cambridge Primary",
        "Évaluation reconnue à l'international",
        "Classes à effectif réduit et enseignants dédiés par matière",
        "Un chemin clair vers le secondaire Cambridge",
      ],
    },
    "national-primary": {
      name: "Maternelle et primaire nationaux",
      ageRange: "N1 – P6",
      description:
        "Le programme rwandais basé sur les compétences, enseigné dans une classe disciplinée et fondée sur des valeurs.",
      overview:
        "La maternelle et le primaire nationaux suivent le programme rwandais basé sur les compétences, enseigné dans une classe disciplinée et fondée sur des valeurs, qui construit des bases académiques solides en kinyarwanda, anglais et mathématiques.",
      highlights: [
        "Programme officiel rwandais basé sur les compétences",
        "Bases en kinyarwanda, anglais et mathématiques",
        "Une culture de classe disciplinée et fondée sur des valeurs",
        "Un chemin clair vers le secondaire national",
      ],
    },
    "national-secondary": {
      name: "Secondaire national",
      ageRange: "S1 – S6",
      description:
        "Les filières O-Level et A-Level qui préparent les élèves aux examens nationaux et à l'entrée à l'université.",
      overview:
        "Le secondaire national accompagne les élèves à travers les études O-Level et A-Level, les préparant aux examens nationaux, à l'entrée à l'université et au monde du travail par une formation académique rigoureuse et la formation du caractère.",
      highlights: [
        "Filières O-Level et A-Level",
        "Préparation aux examens nationaux",
        "Orientation universitaire et professionnelle",
        "Formation au leadership et au caractère",
      ],
    },
    tvet: {
      name: "TVET / Formation professionnelle",
      ageRange: "Après la S3",
      description:
        "Une formation professionnelle pratique en soudure, couture, coiffure, menuiserie et arts culinaires.",
      overview:
        "En complément de nos filières académiques, le TVET propose une formation professionnelle pratique dans cinq ateliers, menant vers une véritable certification et un chemin direct vers l'emploi.",
      highlights: [
        "Cinq métiers pratiques au choix",
        "Formation menant à une certification",
        "De vrais équipements d'atelier et de la pratique",
        "Un chemin direct vers l'emploi ou l'auto-entrepreneuriat",
      ],
    },
  },

  meta: {
    home: {
      title: "Saint Vincent Pallotti School Masaka | Strive Beyond",
      description:
        "Saint Vincent Pallotti School Masaka est une école des Sœurs Missionnaires Pallottines à Masaka, Kigali, proposant la garderie, la maternelle, le primaire Cambridge, la maternelle, le primaire et le secondaire nationaux, l'éducation spécialisée et la formation professionnelle (TVET).",
      ogDescription:
        "Une école des Sœurs Missionnaires Pallottines à Masaka, Kigali, de la garderie au secondaire, avec les programmes Cambridge et national, l'éducation spécialisée et la formation professionnelle (TVET).",
    },
    about: {
      title: "À propos",
      description:
        "L'histoire de Saint Vincent Pallotti School Masaka, dirigée par les Sœurs Missionnaires Pallottines à Masaka, Kigali, au Rwanda.",
    },
    academics: {
      title: "Programmes académiques",
      description:
        "Les programmes Cambridge et national, ainsi que l'éducation spécialisée, à Saint Vincent Pallotti School Masaka.",
    },
    tvet: {
      title: "TVET / Formation professionnelle",
      description:
        "Formation professionnelle pratique à Saint Vincent Pallotti School Masaka : soudure, couture, coiffure, menuiserie et arts culinaires.",
    },
    admissions: {
      title: "Admissions",
      description:
        "Commencez une demande d'admission à Saint Vincent Pallotti School Masaka : garderie, maternelle, primaire et secondaire Cambridge et national, éducation spécialisée et TVET.",
    },
    news: {
      title: "Actualités et vie scolaire",
      description:
        "Actualités, réussites et vie scolaire de Saint Vincent Pallotti School Masaka.",
    },
    contact: {
      title: "Contact",
      description:
        "Contactez Saint Vincent Pallotti School Masaka : téléphone, WhatsApp, e-mail et localisation du campus à Masaka, Kigali.",
    },
  },

  site: {
    spiritualMotto: "L'amour du Christ nous presse",
    foundedBy: "Sœurs Missionnaires Pallottines, Région Notre-Dame de Kibeho",
  },

  nav: {
    primaryLabel: "Principal",
    home: "Accueil",
    about: "À propos",
    academics: "Programmes",
    tvet: "TVET",
    news: "Vie scolaire",
    admissions: "Admissions",
    contact: "Contact",
    applyNow: "Postuler",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer",
    sheetDescription: "Strive Beyond · Masaka, Kigali",
  },

  themeToggle: {
    toggle: "Changer de thème",
    switchToLight: "Passer au mode clair",
    switchToDark: "Passer au mode sombre",
  },

  languageSwitcher: {
    label: "Langue",
  },

  common: {
    viewFullProgramPage: "Voir la page complète du programme",
    applyTo: "Postuler à",
  },

  footer: {
    exploreHeading: "Explorer",
    programsHeading: "Programmes",
    contactHeading: "Contact",
    runByPrefix: "Dirigée par les",
  },

  whatsapp: {
    ariaLabel: "Discuter avec nous sur WhatsApp",
    tooltip: "Discuter avec les admissions",
    prefillMessage:
      "Bonjour Saint Vincent Pallotti School Masaka, je souhaite me renseigner sur les admissions.",
  },

  notFound: {
    code: "404",
    title: "Cette page s'est absentée",
    description:
      "La page que vous recherchez n'existe pas. Revenons sur le bon chemin.",
    cta: "Retour à l'accueil",
  },

  home: {
    hero: {
      eyebrow: "Sœurs Missionnaires Pallottines · Masaka, Kigali",
      headline: "Strive",
      headlineEmphasis: "Beyond.",
      paragraph:
        "De la garderie au secondaire et à la formation professionnelle (TVET), Saint Vincent Pallotti School Masaka forme des diplômés confiants et compétents sur un nouveau campus conçu pour plus de 1 400 élèves : programmes Cambridge et national, éducation spécialisée et formation professionnelle pratique, le tout enraciné dans les valeurs catholiques.",
      applyNow: "Postuler",
      ourStory: "Notre histoire",
      stats: [
        { value: "1 400+", label: "Élèves" },
        { value: "2022", label: "Nouveau campus" },
        { value: "2", label: "Programmes" },
        { value: "5", label: "Filières TVET" },
      ],
      panelEstablished: "Fondée par les Sœurs Pallottines",
      calloutValue: "1 200+",
      calloutText:
        "places ajoutées à l'ouverture de notre nouveau campus, béni par le cardinal Antoine Kambanda",
    },
    programs: {
      eyebrow: "Ce que nous offrons",
      title: "Un seul campus, toutes les étapes du parcours",
      description:
        "Sept programmes sous un même toit, du premier jour de garderie de votre enfant jusqu'à un certificat de métier ou une admission à l'université.",
    },
    pathway: {
      eyebrow: "Le parcours Pallotti",
      title: "Le parcours de votre enfant, étape par étape",
      steps: [
        {
          stage: "Garderie",
          range: "3 mois – 2 ans",
          description:
            "Des soins attentifs et un éveil précoce dans un environnement sûr et bienveillant.",
        },
        {
          stage: "Maternelle",
          range: "3 – 5 ans",
          description:
            "Bases de la lecture, du calcul et des compétences sociales par le jeu guidé.",
        },
        {
          stage: "Primaire",
          range: "P1 – P6",
          description:
            "Programme Cambridge ou national, construisant des bases académiques solides.",
        },
        {
          stage: "Secondaire",
          range: "S1 – S6",
          description:
            "Études O-Level et A-Level, formation du caractère et du leadership.",
        },
        {
          stage: "TVET et au-delà",
          range: "Après la S3",
          description:
            "Une certification professionnelle ou un diplômé prêt pour l'université, préparé à aller plus loin.",
        },
      ],
    },
    why: {
      eyebrow: "Pourquoi les familles choisissent Pallotti",
      title: "Conçue pour grandir, enracinée dans nos valeurs",
      features: [
        {
          title: "Un campus construit pour durer",
          description:
            "Agrandi en 2022 et inauguré par le cardinal Antoine Kambanda avec le ministère de l'Éducation, notre campus compte désormais plus de 1 200 places supplémentaires : salles de classe modernes, ateliers et espaces conçus pour grandir.",
        },
        {
          title: "Cambridge et national, côte à côte",
          description:
            "Les familles choisissent le programme Cambridge, reconnu à l'international, ou le programme national rwandais, tous deux enseignés avec la même exigence.",
        },
        {
          title: "Formés dans les valeurs catholiques",
          description:
            "Guidés par les Sœurs Missionnaires Pallottines, la formation du caractère et de la foi accompagne les apprentissages académiques.",
        },
        {
          title: "Une classe inclusive",
          description:
            "Notre programme dédié d'éducation spécialisée garantit à chaque élève, quelle que soit sa capacité, une place à Pallotti.",
        },
      ],
    },
    news: {
      eyebrow: "Vie scolaire",
      title: "Dernières nouvelles de Pallotti",
      viewAll: "Voir toutes les actualités",
      followText: "Suivez la vie quotidienne du campus sur Instagram et YouTube.",
      youtubeAriaLabel: "YouTube",
    },
    cta: {
      eyebrow: "Admissions ouvertes",
      title: "Offrez à votre enfant une place pour se dépasser",
      paragraph:
        "Les places sont limitées en garderie, maternelle, primaire, secondaire et TVET. Commencez une demande dès aujourd'hui et notre équipe des admissions vous accompagnera pour la suite.",
      startApplication: "Commencer votre candidature",
      chatWhatsapp: "Discuter sur WhatsApp",
    },
  },

  about: {
    hero: {
      eyebrow: "À propos",
      title: "Notre histoire",
      description:
        "Saint Vincent Pallotti School Masaka est dirigée par les Sœurs Missionnaires Pallottines, Région Notre-Dame de Kibeho, une mission de foi, d'excellence académique et d'opportunités à Masaka, Kigali.",
    },
    charism: {
      eyebrow: "Notre charisme",
      quote: "L'amour du Christ nous presse",
      citation: "Caritas Christi urget nos (2 Corinthiens 5, 14)",
      paragraph:
        "Nous sommes dirigés par les Sœurs Missionnaires Pallottines, membres de l'Union de l'Apostolat Catholique fondée sur la vision de saint Vincent Pallotti. Ce charisme, cet amour du Christ qui nous presse d'agir, guide la manière dont notre personnel enseigne, dont nos Sœurs prennent soin des élèves, et la raison pour laquelle l'éducation spécialisée et le TVET accompagnent nos programmes académiques : chacun mérite un chemin pour aller au-delà de sa condition.",
      glanceTitle: "En bref",
      runBy: "Dirigée par",
      runByValue: "Sœurs Missionnaires Pallottines",
      region: "Région",
      location: "Lieu",
      motto: "Devise",
      regionValue: "Notre-Dame de Kibeho",
    },
    values: {
      eyebrow: "Ce que nous défendons",
      title: "Foi, excellence, inclusion, opportunité",
      items: [
        {
          title: "Foi",
          description:
            "L'identité catholique et le charisme pallottin façonnent la vie quotidienne du campus, présents sans jamais s'imposer aux familles de tous horizons.",
        },
        {
          title: "Excellence",
          description:
            "Des exigences élevées dans les programmes Cambridge et national, soutenues par un enseignement rigoureux et une évaluation constante.",
        },
        {
          title: "Inclusion",
          description:
            "Notre programme dédié d'éducation spécialisée garantit à chaque élève, quel que soit son point de départ, une place pour s'épanouir et grandir.",
        },
        {
          title: "Opportunité",
          description:
            "Des filières TVET au secondaire préparant à l'université, chaque diplômé repart avec un véritable chemin d'avenir.",
        },
      ],
    },
    milestones: {
      eyebrow: "Notre parcours",
      title: "Étapes clés",
      items: [
        {
          year: "Fondation",
          title: "Une mission commence",
          description:
            "Les Sœurs Missionnaires Pallottines de la Région Notre-Dame de Kibeho fondent une école à Masaka, Kigali, enracinée dans le charisme de saint Vincent Pallotti.",
        },
        {
          year: "Croissance",
          title: "Extension des programmes",
          description:
            "La garderie, la maternelle, le primaire et le secondaire nationaux, ainsi que l'éducation spécialisée, se développent avec la communauté environnante.",
        },
        {
          year: "2022",
          title: "Inauguration du nouveau campus",
          description:
            "Une importante extension du campus est officiellement inaugurée par le cardinal Antoine Kambanda et le ministère de l'Éducation, portant la capacité à plus de 1 200 élèves supplémentaires.",
        },
        {
          year: "Aujourd'hui",
          title: "Toujours plus loin",
          description:
            "Plus de 1 400 élèves étudient désormais dans les filières Cambridge, nationale et TVET sur un campus en pleine croissance.",
        },
      ],
    },
  },

  academics: {
    hero: {
      eyebrow: "Programmes académiques",
      title: "Deux programmes. Une même exigence d'excellence.",
      description:
        "Les familles choisissent entre les programmes Cambridge et national à Pallotti, tous deux enseignés avec la même exigence, de la maternelle au secondaire.",
    },
    curricula: [
      {
        slug: "cambridge-primary",
        name: "Programme Cambridge",
        tagline: "Reconnu à l'international",
        description:
          "Notre filière Cambridge suit le programme Cambridge Primary en anglais, mathématiques et sciences, préparant les élèves à une progression reconnue à l'international.",
        subjects: [
          "Anglais",
          "Mathématiques",
          "Sciences",
          "TIC",
          "Perspectives mondiales",
        ],
      },
      {
        slug: "national-primary",
        name: "Programme national",
        tagline: "Le programme rwandais basé sur les compétences",
        description:
          "La maternelle, le primaire et le secondaire nationaux suivent le programme officiel rwandais basé sur les compétences, enseigné dans une classe disciplinée et fondée sur des valeurs.",
        subjects: [
          "Kinyarwanda",
          "Anglais",
          "Mathématiques",
          "Sciences sociales",
          "Sciences",
        ],
      },
    ],
    subjectHighlights: [
      "Mathématiques et sciences",
      "Anglais et kinyarwanda",
      "Sciences intégrées",
      "Arts créatifs et du spectacle",
    ],
    specialNeeds: {
      title: "Éducation spécialisée",
      paragraph:
        "Chaque enfant mérite une classe conçue autour de lui. Notre programme d'éducation spécialisée offre des plans d'apprentissage individualisés, du personnel formé et un environnement inclusif où des élèves aux capacités variées apprennent ensemble, conformément à la conviction pallottine que nul élève ne doit être laissé de côté.",
      items: [
        "Plans de soutien individualisés",
        "Éducateurs spécialisés formés",
        "Classes inclusives et de niveaux mixtes",
        "Disponible de la garderie au secondaire",
      ],
    },
    allPrograms: {
      eyebrow: "Tous les programmes",
      title: "Trouvez le programme de votre enfant",
      description:
        "Chaque programme ci-dessous dispose de sa propre page avec la tranche d'âge, ce que les élèves apprennent et comment postuler.",
    },
    closing: {
      paragraph:
        "Les élèves de Pallotti figurent régulièrement parmi les cohortes les plus performantes de la région de Kigali, dans les filières Cambridge comme nationale, un résultat que nos enseignants s'efforcent de consolider chaque trimestre.",
      cta: "Postuler pour une place",
    },
    detail: {
      ageRangeLabel: "Tranche d'âge",
      exploreMoreEyebrow: "Découvrir aussi",
      exploreMoreTitle: "Les autres programmes de Pallotti",
    },
  },

  tvet: {
    hero: {
      eyebrow: "TVET / Formation professionnelle",
      title: "Un métier, c'est un avenir",
      description:
        "En plus de nos filières académiques, Pallotti propose une formation technique et professionnelle (TVET) dans cinq métiers pratiques : un véritable chemin certifiant vers l'emploi.",
    },
    trades: [
      {
        name: "Soudure et fabrication",
        description:
          "Assemblage des métaux, fabrication structurelle et sécurité en atelier, en vue d'une certification RTB.",
      },
      {
        name: "Couture et création de mode",
        description:
          "Confection de vêtements, création de patrons et compétences entrepreneuriales pour le secteur de la mode en plein essor au Rwanda.",
      },
      {
        name: "Coiffure et esthétique",
        description:
          "Techniques modernes de salon, relation client et bases de la gestion d'un commerce de beauté.",
      },
      {
        name: "Menuiserie et ébénisterie",
        description:
          "Fabrication de meubles, travail structurel du bois et maîtrise des outils, à main comme électroportatifs.",
      },
      {
        name: "Arts culinaires",
        description:
          "Pratique professionnelle en cuisine, sécurité alimentaire et compétences en hôtellerie-restauration.",
      },
    ],
    enrolCard: {
      eyebrow: "Prêt à vous inscrire ?",
      paragraph:
        "Parlez à notre équipe des admissions du placement, des visites d'ateliers et des conditions d'entrée pour chaque métier.",
      cta: "Postuler au TVET",
    },
    reasons: {
      eyebrow: "Pourquoi le TVET à Pallotti",
      title: "Des compétences qui mènent à l'emploi",
      items: [
        {
          title: "Pratique dès le premier jour",
          description:
            "De vrais équipements d'atelier et des évaluations pratiques, pas seulement de la théorie.",
        },
        {
          title: "Formation certifiante",
          description:
            "Un programme conçu pour mener aux normes de certification professionnelle reconnues.",
        },
        {
          title: "Un chemin direct vers l'emploi",
          description:
            "Les diplômés repartent prêts à créer leur propre activité ou à rejoindre le secteur des métiers en pleine croissance au Rwanda.",
        },
      ],
    },
  },

  admissions: {
    hero: {
      eyebrow: "Admissions",
      title: "Rejoignez la famille Pallotti",
      description:
        "Des places sont ouvertes en garderie, maternelle, primaire et secondaire Cambridge et national, éducation spécialisée et TVET. Voici comment postuler, avec un formulaire pour commencer dès aujourd'hui.",
    },
    process: {
      eyebrow: "Comment ça marche",
      title: "Un processus simple en quatre étapes",
      steps: [
        {
          title: "Envoyez une demande",
          description:
            "Remplissez le formulaire ci-dessous avec les informations de votre enfant et le programme souhaité.",
        },
        {
          title: "Visite du campus et évaluation",
          description:
            "Notre équipe des admissions organise une visite du campus et, si nécessaire, une évaluation de positionnement simple.",
        },
        {
          title: "Transmettez les documents",
          description:
            "Apportez les documents requis pour le programme de votre enfant (voir la liste ci-dessous).",
        },
        {
          title: "Inscription confirmée",
          description:
            "Une fois les documents vérifiés, vous recevrez une confirmation ainsi que les informations tarifaires pour sécuriser la place.",
        },
      ],
    },
    requirements: {
      eyebrow: "Documents requis",
      title: "Ce qu'il faut apporter, par niveau",
      description:
        "Un guide général. Notre équipe des admissions confirmera les documents exacts pour votre enfant lors de votre visite du campus.",
      levels: [
        {
          value: "early-years",
          label: "Garderie et maternelle",
          items: [
            "Acte de naissance de l'enfant (copie)",
            "Carnet de vaccination / dossier médical",
            "4 photos d'identité de l'enfant",
            "Copie de la carte d'identité ou du passeport du parent/tuteur",
          ],
        },
        {
          value: "primary",
          label: "Primaire (Cambridge et national)",
          items: [
            "Acte de naissance (copie)",
            "Bulletin / relevé de notes de l'école précédente",
            "Lettre de transfert, en cas de changement d'école",
            "4 photos d'identité de l'élève",
            "Carnet de vaccination",
          ],
        },
        {
          value: "secondary",
          label: "Secondaire (O-Level et A-Level)",
          items: [
            "Certificat de fin de primaire / de l'école précédente",
            "Bulletin ou relevé de notes le plus récent",
            "Lettre de transfert de l'école précédente",
            "4 photos d'identité de l'élève",
            "Copie de la pièce d'identité de l'élève et du parent/tuteur",
          ],
        },
        {
          value: "tvet",
          label: "TVET / Formation professionnelle",
          items: [
            "Certificat académique le plus élevé obtenu",
            "Copie de la carte d'identité ou du passeport",
            "4 photos d'identité",
            "Déclaration du métier souhaité",
          ],
        },
      ],
    },
    form: {
      eyebrow: "Commencer maintenant",
      title: "Formulaire de demande d'admission",
      description:
        "Parlez-nous de votre enfant et nous vous recontacterons pour organiser une visite du campus.",
      parentName: "Nom du parent / tuteur",
      parentNamePlaceholder: "ex. Jean Mukamana",
      childName: "Nom de l'élève",
      childNamePlaceholder: "ex. Aline Mukamana",
      email: "Adresse e-mail",
      emailPlaceholder: "vous@exemple.com",
      phone: "Numéro de téléphone",
      phonePlaceholder: "+250 7xx xxx xxx",
      program: "Programme souhaité",
      programPlaceholder: "Sélectionnez un programme",
      preferredTerm: "Trimestre de rentrée souhaité",
      preferredTermPlaceholder: "Sélectionnez un trimestre",
      terms: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Pas encore décidé"],
      message: "Message (facultatif)",
      messagePlaceholder:
        "Indiquez-nous tout ce qui pourrait aider notre équipe des admissions, comme le niveau actuel ou un besoin de soutien spécialisé.",
      sending: "Envoi en cours…",
      submit: "Envoyer la demande",
      receivedTitle: "Demande reçue",
    },
    sidebar: {
      talkTitle: "Vous préférez parler à quelqu'un ?",
      talkParagraph:
        "Notre bureau des admissions répond volontiers à vos questions directement.",
      whatsapp: "Nous écrire sur WhatsApp",
      goodToKnowTitle: "Bon à savoir",
      goodToKnow: [
        "Admissions continues sur les trois trimestres.",
        "Les évaluations sont adaptées à l'âge et sans stress.",
        "Des places en éducation spécialisée sont disponibles à tous les niveaux.",
        "Les demandes pour la fratrie et le personnel sont les bienvenues.",
      ],
    },
    errors: {
      parentName: "Indiquez le nom du parent ou du tuteur.",
      email: "Indiquez une adresse e-mail.",
      emailInvalid: "Indiquez une adresse e-mail valide.",
      phone: "Indiquez un numéro de téléphone.",
      childName: "Indiquez le nom de l'élève.",
      program: "Sélectionnez un programme.",
      formError: "Veuillez corriger les champs ci-dessous et réessayer.",
    },
    success:
      "Merci, {parentName}. Nous avons bien reçu votre demande pour {childName} et vous recontacterons sous 2 jours ouvrés.",
  },

  news: {
    hero: {
      eyebrow: "Vie scolaire",
      title: "Actualités",
      description:
        "Ce qui se passe sur le campus : programmes académiques, TVET et vie communautaire à Pallotti.",
    },
    items: [
      {
        slug: "new-campus-inauguration",
        title: "Inauguration officielle du nouveau campus",
        date: "2022",
        excerpt:
          "Notre campus agrandi a été béni et inauguré par le cardinal Antoine Kambanda et le ministère de l'Éducation, portant la capacité à plus de 1 200 élèves.",
        category: "Vie scolaire",
      },
      {
        slug: "cambridge-results",
        title: "De solides résultats dans les filières Cambridge et nationale",
        date: "Cette année",
        excerpt:
          "Les élèves de Pallotti continuent de figurer parmi les écoles les plus performantes de la région de Kigali, dans les deux programmes.",
        category: "Académique",
      },
      {
        slug: "tvet-open-day",
        title: "Journée portes ouvertes des ateliers TVET",
        date: "Ce trimestre",
        excerpt:
          "Les familles ont visité nos ateliers de soudure, couture, coiffure, menuiserie et arts culinaires pour découvrir la formation professionnelle en action.",
        category: "TVET",
      },
    ],
    follow: {
      eyebrow: "Suivez-nous",
      title: "Plus de vie scolaire sur Instagram et YouTube",
      instagram: "Instagram",
      youtube: "YouTube",
    },
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Nous serions ravis de vous entendre",
      description:
        "Appelez, écrivez sur WhatsApp, envoyez un e-mail ou visitez notre campus à Masaka, Kigali, selon ce qui vous convient le mieux.",
    },
    cards: {
      call: "Appelez-nous",
      whatsapp: "WhatsApp",
      whatsappValue: "Discuter avec les admissions",
      email: "E-mail",
      visit: "Rendez-nous visite",
    },
    findUs: {
      eyebrow: "Nous trouver",
      title: "Masaka, Kigali, Rwanda",
      paragraph:
        "Notre campus se trouve à Masaka, à la périphérie de Kigali. Touchez la carte pour ouvrir l'itinéraire dans Google Maps.",
      officeHoursTitle: "Heures d'ouverture",
      officeHoursValue: "Lundi – vendredi, 7h30 – 16h30",
      goToAdmissions: "Aller aux admissions",
      mapTitle: "Carte montrant Saint Vincent Pallotti School Masaka",
    },
  },
}

export default fr
