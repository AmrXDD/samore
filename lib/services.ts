/**
 * SAMORE service content — sourced verbatim-in-spirit from the official
 * SAMORE service documents. Pages are data-driven from this module so the
 * content stays consistent and is the single source of truth. Nothing here
 * is invented beyond the supplied company material.
 */

export type Capability = { title: string; description: string };
export type ProcessStep = { title: string; description: string };

export type ServiceContent = {
  slug: string;
  title: string;
  division: "engineering-construction" | "steel-oil-trading";
  parentSlug: string | null;
  eyebrow: string;
  lede: string;
  overview: string[];
  capabilities: Capability[];
  process: ProcessStep[];
  benefits: string[];
  /** Trading pages keep sensitive commercial procedures behind an inquiry. */
  gated?: boolean;
  seo: { title: string; description: string };
};

export const SERVICES: Record<string, ServiceContent> = {
  "engineering-construction": {
    slug: "engineering-construction",
    title: "Engineering & Construction",
    division: "engineering-construction",
    parentSlug: null,
    eyebrow: "Division",
    lede: "Construction technical support, conflict resolution, value engineering and engineering education — delivered by a homogeneous, centrally governed team.",
    overview: [
      "We are more than a service provider — we are a partner in success. SAMORE approaches every project with integrity, resilience and vision, considering all variable conditions across the full project lifecycle rather than time and cost alone.",
      "Our engineers operate under stringent guidance from our head office, ensuring uniform quality and performance across all projects, whether small or large. SAMORE prioritises enduring, long-term partnerships over one-off engagements.",
    ],
    capabilities: [
      {
        title: "Project Technical Support",
        description:
          "Project planning, project control systems and value engineering that protect your schedule, budget and contractual rights.",
      },
      {
        title: "Construction Conflict Solutions",
        description:
          "Project claims, court expert engineering and claim guarding — an expert team defending your rights amicably and in time.",
      },
      {
        title: "Engineering Education",
        description:
          "Courses, research support and on-the-job assistance that build capable, proactive engineers.",
      },
    ],
    process: [
      {
        title: "Understand requirements",
        description:
          "Customise our services to your needs — we can engage on a monthly, weekly, daily or hourly basis.",
      },
      {
        title: "Assign the right team",
        description:
          "We assign the best-qualified, well-communicated team, familiar with both construction and pre-construction environments.",
      },
      {
        title: "Deliver & control",
        description:
          "Realistic data analysis and centralised oversight keep decisions timely and informed throughout the project.",
      },
      {
        title: "Sustain the partnership",
        description:
          "Continuous improvement and QA/QC ensure consistent quality and a lasting relationship.",
      },
    ],
    benefits: [
      "Dynamic, effective and precise outcomes that exceed client expectations.",
      "Comprehensive project management across every variable condition.",
      "Centralised oversight from head office for uniform quality.",
      "Transparent, logical and competitive fee structure.",
      "Substantial real-world site experience across residential, roads and infrastructure.",
    ],
    seo: {
      title: "Engineering & Construction",
      description:
        "SAMORE engineering & construction: project technical support, construction conflict solutions and engineering education, delivered by a centrally governed expert team.",
    },
  },

  "project-technical-support": {
    slug: "project-technical-support",
    title: "Project Technical Support",
    division: "engineering-construction",
    parentSlug: "engineering-construction",
    eyebrow: "Engineering & Construction",
    lede: "Planning, control and value engineering that save cost by getting the maximum benefit from your available resources.",
    overview: [
      "Professional and logical planning protects your company against unfair performance during work progress and confirms the project baseline at the earliest stages. Long-term success is built on accurate, full site-progress data collection, analysis, and the experience of what-if scenario techniques.",
      "Our technical office teams review designs, produce high-quality shop and composite drawings, and monitor every document flow so no client right is ever leaked to another party.",
    ],
    capabilities: [
      {
        title: "Project Planning",
        description:
          "CPM target master schedules, monthly updates and two-weeks-ahead look-ahead scheduling.",
      },
      {
        title: "Project Control Systems",
        description:
          "Full PM control format across design and construction phases with time, cost and quality reporting.",
      },
      {
        title: "Value Engineering",
        description:
          "Structured VE workshops that improve function without reducing value.",
      },
    ],
    process: [
      {
        title: "Baseline",
        description:
          "Prepare or modify the CPM target master schedule per contract requirements and customise locations, zones and levels.",
      },
      {
        title: "Plan quality & safety",
        description:
          "Design QC, QA and safety plans that comply with contract specifications.",
      },
      {
        title: "Monitor",
        description:
          "Monthly CPM update reports and weekly follow-up on submittals, approvals and procurement.",
      },
      {
        title: "Control",
        description:
          "Control site performance in detail and adjust the schedule to minimise risk and maximise benefit.",
      },
    ],
    benefits: [
      "Rapid approval of the master CPM schedule confirms the baseline early.",
      "Triggers for delayed activities, submittals, approvals and procurement.",
      "High-quality, approved shop drawings and applicable composite drawings that avoid rework.",
      "Central follow-up that guards every contractual right.",
    ],
    seo: {
      title: "Project Technical Support",
      description:
        "SAMORE project technical support: CPM planning, project control systems, value engineering and technical office services for construction projects.",
    },
  },

  "project-planning": {
    slug: "project-planning",
    title: "Project Planning",
    division: "engineering-construction",
    parentSlug: "project-technical-support",
    eyebrow: "Project Technical Support",
    lede: "Planning is a critical contractual document for future claims, arbitrations and disputes — and your best protection during work progress.",
    overview: [
      "The expert and dynamic planning service saves cost by maximising the benefit of your available resources and delivering accurate follow-ups. Rapid approval of the master CPM schedule confirms the project baseline at the earliest stages.",
      "Long-term project success is based on accurate, full site-progress data collection, the analysis of that data, and the experience of using what-if scenario techniques.",
    ],
    capabilities: [
      {
        title: "Target CPM schedule",
        description:
          "Prepare or modify the project CPM target master schedule per contract requirements, customising locations, zones and levels for optimum time and resource integration.",
      },
      {
        title: "Quality, assurance & safety plans",
        description:
          "Design a QC plan, prepare a QA plan and obtain a safety plan — all compliant with contract statements.",
      },
      {
        title: "Monthly & weekly follow-up",
        description:
          "Monthly CPM update reports and two-weeks-ahead schedules with triggers for delays and pending approvals.",
      },
      {
        title: "Technical support",
        description:
          "Design review, shop drawings, composite services drawings and RFIs prepared with contract-priority awareness.",
      },
    ],
    process: [
      {
        title: "Prepare the baseline",
        description:
          "Build the CPM target master schedule considering all authorities' procedures through every contract phase.",
      },
      {
        title: "Integrate resources",
        description:
          "Estimate optimum time and resource integration for the ideal work plan and resource movement.",
      },
      {
        title: "Update monthly",
        description:
          "Issue monthly CPM updates, a two-weeks-ahead schedule and triggers for delayed activities and submittals.",
      },
      {
        title: "Adjust & protect",
        description:
          "Adjust the schedule to client circumstances and expected local risks to maximise benefit and minimise risk.",
      },
    ],
    benefits: [
      "A logical schedule protecting you against unfair performance by the consultant.",
      "Early confirmation of the project baseline.",
      "Triggers for delayed drawing and material submittals and pending approvals.",
      "Detailed control of site format performance.",
    ],
    seo: {
      title: "Project Planning",
      description:
        "SAMORE project planning: CPM target master schedules, monthly updates, look-ahead scheduling and technical support to protect cost, time and contractual rights.",
    },
  },

  "project-control-systems": {
    slug: "project-control-systems",
    title: "Project Control Systems",
    division: "engineering-construction",
    parentSlug: "project-technical-support",
    eyebrow: "Project Technical Support",
    lede: "A complete project management system — assigning a whole professional team that leads the contract successfully to its aims.",
    overview: [
      "We have wide experience as a PM company in both large and small projects. Our professional technical office teams are carefully selected to control project cost during construction and maximise client benefit.",
      "SAMORE manages the design phase (requirements, consultant selection, design control) and the construction phase (time, cost, quality and claim guarding) under a strict administration procedure for consultant, contractor and owner.",
    ],
    capabilities: [
      {
        title: "Design phase management",
        description:
          "Project requirements, consultant assignment, design management, follow-up, approval and control with budget, milestone and status reports.",
      },
      {
        title: "Construction phase management",
        description:
          "Time, cost and quality management to finish on time, on budget and to high quality — avoiding cost and time claims.",
      },
      {
        title: "Project control system",
        description:
          "Administration, progress, time and cost control with tabular and chart data across every log.",
      },
      {
        title: "Top-management reporting",
        description:
          "Weekly top-management report: administration, time, quality control and progress status.",
      },
    ],
    process: [
      {
        title: "Establish control format",
        description:
          "Create the master programme schedule before construction and the project control format.",
      },
      {
        title: "Monitor & report",
        description:
          "Update the schedule at suitable intervals, report time status and spot delayed activities.",
      },
      {
        title: "Guard cost & quality",
        description:
          "Control cost centres and use submittals and inspection formats to assure compliance with contract documents.",
      },
      {
        title: "Document & inform",
        description:
          "Complete documentation with a quick-retrieval tracking system and monthly progress reports.",
      },
    ],
    benefits: [
      "Project Value Analysis (PVA) reporting to estimate progress and correct flow problems.",
      "Simultaneous web-site aids — a live summarised view of project progress for your board.",
      "Claim guarding embedded within the control system.",
      "Safety violation guarding through all project stages.",
    ],
    seo: {
      title: "Project Control Systems",
      description:
        "SAMORE project control systems: full PM services across design and construction phases with time, cost, quality control and top-management reporting.",
    },
  },

  "value-engineering": {
    slug: "value-engineering",
    title: "Value Engineering",
    division: "engineering-construction",
    parentSlug: "project-technical-support",
    eyebrow: "Project Technical Support",
    lede: "A systematic approach that concentrates on value, not cost — removing unnecessary cost without reducing function. Value = Function / Cost.",
    overview: [
      "Value engineering improves projects, products and processes by achieving balance between required functions, performance, quality, safety and scope against the cost and resources needed. The proper balance results in maximum value for the project.",
      "Our team is certified by SAVE International, with the advantage of experience across different environments. The earlier VE is undertaken, the more effective it is likely to be.",
    ],
    capabilities: [
      {
        title: "Establish VE departments",
        description:
          "Set up value engineering departments for ministries, authorities and companies — scope, strategy, organisation, training and methodology implementation.",
      },
      {
        title: "Organisational VE",
        description:
          "Audit and enhance department performance, apply VE methodology to charts, formats and communication channels.",
      },
      {
        title: "VE consultancy",
        description:
          "Investment ideas, concept & design and construction VE backed by a deep GCC construction database.",
      },
      {
        title: "Workshops, reports & certification",
        description:
          "VE workshops and reports plus training toward CVS, AVS and VMP certifications.",
      },
    ],
    process: [
      {
        title: "Information",
        description:
          "Gather information to better understand the project and identify the elements that benefit most.",
      },
      {
        title: "Function analysis & creativity",
        description:
          "Analyse required functions, then generate ideas on all possible ways to accomplish them.",
      },
      {
        title: "Evaluation",
        description:
          "Synthesise ideas against established criteria and select feasible options in order of merit.",
      },
      {
        title: "Development & presentation",
        description:
          "Develop the best alternatives with full life-cycle costing, then present recommendations to stakeholders.",
      },
    ],
    benefits: [
      "Removal of unnecessary cost without loss of function, quality or appearance.",
      "Savings in time, cost and quality that improve competitive position.",
      "Best applied to costly, complex, repetitive, unique or highly visible projects.",
      "Certified value specialists leading each study.",
    ],
    seo: {
      title: "Value Engineering",
      description:
        "SAMORE value engineering: SAVE-International-certified VE workshops, department set-up, consultancy and certifications that maximise project value.",
    },
  },

  "construction-conflict-solutions": {
    slug: "construction-conflict-solutions",
    title: "Construction Conflict Solutions",
    division: "engineering-construction",
    parentSlug: "engineering-construction",
    eyebrow: "Engineering & Construction",
    lede: "Cumulative experience across 30 expert cases and 60 claim performances — guarding your rights amicably and in time.",
    overview: [
      "Each 1 KD spent on claim guarding can meet 1000 KD of claim cost or 500 KD of added value. As early as the project adds this service, the benefit grows. We keep your rights with all necessary amicable precautions while treating owner and consultant contractual violations.",
      "This rights-guarding service needs wide knowledge, experiments and an expert team working under strong systems, rules and QA/QC from our head office.",
    ],
    capabilities: [
      {
        title: "Project Claims",
        description:
          "Claim review and preparation, contractual and legal referrals, rights calculation, negotiation and submittal.",
      },
      {
        title: "Court Expert Engineer",
        description:
          "Amicable claims, court disputes and arbitration through the First Instance, Appeal and Supreme Court.",
      },
      {
        title: "Project Claim Guarding",
        description:
          "In-time monitoring of every party's contractual performance to protect rights in advance.",
      },
    ],
    process: [
      {
        title: "Review & prepare",
        description:
          "Data collection, contractual and legal referrals, document sorting and analysis.",
      },
      {
        title: "Match & assign bases",
        description:
          "Match cases with contract conditions, document priorities and civil law, then assign contractual and legal bases.",
      },
      {
        title: "Calculate rights",
        description:
          "Upgrade claims with time and cost impact and prepare claim reports and tables.",
      },
      {
        title: "Negotiate",
        description:
          "Cover claim meetings and client replies, upgrading or modifying claims as needed for an amicable solution.",
      },
    ],
    benefits: [
      "Precautionary action prioritised over late claims to protect chances, time, cost and rights.",
      "A team qualified technically, contractually and legally with cumulative court experience.",
      "Awareness of the local construction environment, culture, laws and procedures.",
      "Balanced, elastic negotiation to keep work going smoothly to its targets.",
    ],
    seo: {
      title: "Construction Conflict Solutions",
      description:
        "SAMORE construction conflict solutions: project claims, court expert engineering and claim guarding — protecting your contractual rights amicably and in time.",
    },
  },

  "project-claims": {
    slug: "project-claims",
    title: "Project Claims",
    division: "engineering-construction",
    parentSlug: "construction-conflict-solutions",
    eyebrow: "Construction Conflict Solutions",
    lede: "A main-office team of engineers, contract administrators and lawyers recovering claim cases from all sides — the most amicable way first.",
    overview: [
      "SAMORE has a main-office staff who control all project crews to assure the highest performance and cover all kinds of claims, supporting site teams to deliver the proper action and reaction at the very suitable time.",
      "Our high awareness of contract conditions, law statements and court experience lets us understand every claim case at its earliest stage and treat it in time.",
    ],
    capabilities: [
      {
        title: "Claim review & preparation",
        description:
          "Data collection, contractual and legal referrals, review of project status, document sorting and grouping.",
      },
      {
        title: "Analysis & matching",
        description:
          "Match cases with contract conditions, document priorities and civil law; assign contractual and legal bases.",
      },
      {
        title: "Rights calculation",
        description:
          "Upgrade claims with time and cost impact, producing final results, reports and tables.",
      },
      {
        title: "Negotiation",
        description:
          "Cover claim meetings, client replies and explanation requirements with elastic, balanced skills.",
      },
    ],
    process: [
      {
        title: "Referrals & violations",
        description:
          "Document contractual referrals, responsibility-matrix violations and legal-obligation violations.",
      },
      {
        title: "Bases report",
        description:
          "Deliver a contractual and law bases report detailing each reference used.",
      },
      {
        title: "Submit",
        description:
          "Submit each case in its suitable time, supported by strong proofs and technical schedule impact.",
      },
      {
        title: "Resolve amicably",
        description:
          "Reach the most proper approach for an amicable solution supported by fair study.",
      },
    ],
    benefits: [
      "Complete, clear understanding of the contract conditions related to each case.",
      "Classification of claims under each contract and civil-law condition.",
      "The most optimum method of calculating deserved rights.",
      "Homogeneous claim teams aware of the local environment.",
    ],
    seo: {
      title: "Project Claims",
      description:
        "SAMORE project claims: review, preparation, rights calculation and negotiation by a main-office team of engineers, contract administrators and lawyers.",
    },
  },

  "court-expert-engineer": {
    slug: "court-expert-engineer",
    title: "Court Expert Engineer",
    division: "engineering-construction",
    parentSlug: "construction-conflict-solutions",
    eyebrow: "Construction Conflict Solutions",
    lede: "Specialised in amicable claims, court disputes and arbitration — with real, wide experience across every construction conflict.",
    overview: [
      "We have a high understanding of contract clauses that lets us classify all kinds of construction variations, grounded in high-court sentences that give the right direction to every conflict strategy.",
      "We continuously study high-court judgments to strengthen our cases, and we control the time of the conflict so the opponent cannot enlarge the dispute.",
    ],
    capabilities: [
      {
        title: "Interpretation & strategy",
        description:
          "Interpretation of contracts, local laws and regulations; claim strategy, preparation and negotiation.",
      },
      {
        title: "Evidence & documents",
        description:
          "The power of construction forms and documents as proof tools; document translation to Arabic per Kuwaiti law.",
      },
      {
        title: "Dispute procedure",
        description:
          "Statement of claim, wording of demands, and expert-department procedures through every court stage.",
      },
      {
        title: "Pleading briefs",
        description:
          "Briefs containing demands, claims, calculations and legal & contractual referrals supported by evidence.",
      },
    ],
    process: [
      {
        title: "Court of First Instance",
        description:
          "File the case, prepare the statement of claim and manage the preliminary ruling and expert referral.",
      },
      {
        title: "Expert procedures",
        description:
          "Submit pleading briefs, manage expert meetings and object on procedural, subjective or legal grounds where needed.",
      },
      {
        title: "Court of Appeal",
        description:
          "Repeat the First-Instance procedure at second degree with preliminary ruling and expert procedures.",
      },
      {
        title: "Supreme Court",
        description:
          "The final stage — the Supreme Court's decision carries the highest binding force.",
      },
    ],
    benefits: [
      "Understanding of what must be written to the expert versus the judge at each stage.",
      "Control of dispute time to prevent opponents enlarging the case.",
      "Professional in-house translation ready before the statement of claim.",
      "Case writing strengthened by high-court precedent.",
    ],
    seo: {
      title: "Court Expert Engineer",
      description:
        "SAMORE court expert engineer: construction arbitration and court dispute management through First Instance, Appeal and Supreme Court with expert pleading briefs.",
    },
  },

  "project-claim-guarding": {
    slug: "project-claim-guarding",
    title: "Project Claim Guarding",
    division: "engineering-construction",
    parentSlug: "construction-conflict-solutions",
    eyebrow: "Construction Conflict Solutions",
    lede: "A strict data-collection system that monitors every project document — so no client right is ever leaked to another party.",
    overview: [
      "SAMORE's exclusive data-monitoring system lets us control and audit every project team from head office, with a QA/QC system that firmly avoids any leak of client rights. We draw your attention to any violation that may lead to a loss of rights.",
      "Claim guarding is not only guarding time, cost and rights, but also targeting the best commercial explanation of contract-document priorities to add the optimum benefit. A local firm is stronger here — aware of local environment, culture, laws and procedures.",
    ],
    capabilities: [
      {
        title: "Obligation matrix",
        description:
          "Design the project document circulation, forms and responsibility matrix to fix each party's obligations.",
      },
      {
        title: "In-time monitoring",
        description:
          "Monitor and guard, in time, the contractual performance of all other parties.",
      },
      {
        title: "Rights protection",
        description:
          "Protect client rights against contractual violations in time and in advance.",
      },
      {
        title: "Monthly reporting",
        description:
          "A monthly claim-guarding report covering strategies, chances and areas of concern.",
      },
    ],
    process: [
      {
        title: "Design circulation",
        description:
          "Establish document circulation and the responsibility matrix at project start.",
      },
      {
        title: "Follow & monitor",
        description:
          "Follow the document flow in detail from a central head-office system.",
      },
      {
        title: "Draw attention",
        description:
          "Flag any document that may cause a loss of rights and help solve cases in advance.",
      },
      {
        title: "Collect & submit",
        description:
          "Collect claim files through the project and submit each case in its suitable time with strong proof.",
      },
    ],
    benefits: [
      "Central follow-up that never allows a leak of company rights.",
      "High loyalty to the client with strong, elastic negotiation.",
      "Claim files built with all documents required to prove the case.",
      "Integration with the planning and reporting system for guarding power.",
    ],
    seo: {
      title: "Project Claim Guarding",
      description:
        "SAMORE project claim guarding: central document monitoring, obligation matrices and in-time rights protection against contractual violations.",
    },
  },

  "engineering-education": {
    slug: "engineering-education",
    title: "Engineering Education",
    division: "engineering-construction",
    parentSlug: "engineering-construction",
    eyebrow: "Engineering & Construction",
    lede: "A comprehensive range of engineering education for students, Master's and PhD candidates — deepening core principles and practical skills.",
    overview: [
      "SAMORE offers courses designed to deepen understanding of core engineering principles and enhance practical skills, with targeted support for students preparing research at Master's and PhD levels — mentorship in research methodologies, literature reviews and project development.",
      "Our highly qualified PhD staff provide online education sessions through a convenient payment system, fostering a collaborative learning environment that encourages innovation and critical thinking.",
    ],
    capabilities: [
      {
        title: "Online education sessions",
        description:
          "Live one-to-one engineering sessions delivered by qualified PhD staff.",
      },
      {
        title: "Research support",
        description:
          "Mentorship for Master's and PhD research, literature reviews and project development.",
      },
      {
        title: "Engineering Courses",
        description:
          "A professional catalogue of 22 courses across planning, claims, contracts and value engineering.",
      },
      {
        title: "On Job Assist",
        description:
          "On-the-job assistance and mentorship that turn academic knowledge into workplace performance.",
      },
    ],
    process: [
      {
        title: "Choose a track",
        description:
          "Select an education session, research support, a course, or on-the-job assistance.",
      },
      {
        title: "Match a mentor",
        description:
          "Pair with a qualified PhD mentor tailored to your goals.",
      },
      {
        title: "Learn & apply",
        description:
          "Engage in sessions and hands-on work that reinforce theory with real scenarios.",
      },
      {
        title: "Track progress",
        description:
          "Regular assessment and development plans mark clear goals and next steps.",
      },
    ],
    benefits: [
      "Highly qualified PhD staff available for education services.",
      "Convenient online sessions and clear per-hour pricing.",
      "Research report support for Master's and PhD candidates.",
      "A collaborative environment for future engineering leaders.",
    ],
    seo: {
      title: "Engineering Education",
      description:
        "SAMORE engineering education: online sessions, Master's & PhD research support, a 22-course catalogue and on-the-job assistance by qualified PhD staff.",
    },
  },

  "engineering-courses": {
    slug: "engineering-courses",
    title: "Engineering Courses",
    division: "engineering-construction",
    parentSlug: "engineering-education",
    eyebrow: "Engineering Education",
    lede: "Professional courses for engineers, engineering students, Master's and PhD — with instructors of long, wide and deep construction experience.",
    overview: [
      "SAMORE provides professional courses cooperating with the most experienced instructors in realistic engineering construction industries. Each course runs over five days and twenty hours.",
      "Browse the catalogue below. To enrol in a live, purchasable cohort with bank-transfer checkout, visit the Courses page.",
    ],
    capabilities: [
      {
        title: "Planning & control",
        description:
          "Primavera P6 Levels 01–03 and Project Control Systems Engineer.",
      },
      {
        title: "Claims & disputes",
        description:
          "Construction Claims 01–03, Claim Guarding and Engineering Arbitration.",
      },
      {
        title: "Contracts",
        description:
          "FIDIC, BOT, Maintenance and Contract Administrator Engineer 01–02.",
      },
      {
        title: "Value engineering",
        description:
          "Value Engineering and using VE to minimise project cost.",
      },
    ],
    process: [
      {
        title: "Register",
        description:
          "Submit your name, institute, chosen course, available dates and language.",
      },
      {
        title: "Confirm",
        description: "We confirm dates and the 20-hour, five-day schedule.",
      },
      {
        title: "Attend",
        description:
          "Learn from instructors with realistic construction-industry experience.",
      },
      {
        title: "Certify",
        description: "Complete the course and receive your certification.",
      },
    ],
    benefits: [
      "22 professional courses across the full construction lifecycle.",
      "Consistent five-day, twenty-hour format.",
      "Instructors with deep, realistic industry experience.",
      "Clear USD pricing per course.",
    ],
    seo: {
      title: "Engineering Courses",
      description:
        "SAMORE engineering courses: 22 professional five-day courses across Primavera planning, construction claims, FIDIC/BOT contracts, value engineering and arbitration.",
    },
  },

  "on-job-assist": {
    slug: "on-job-assist",
    title: "On Job Assist",
    division: "engineering-construction",
    parentSlug: "engineering-education",
    eyebrow: "Engineering Education",
    lede: "On-the-job assistance that empowers beginner engineers to translate academic knowledge into recognised workplace performance.",
    overview: [
      "SAMORE understands the hurdles beginner engineers face. Our dedicated on-the-job assistance program enhances job performance and helps professionals become knowledgeable, proactive contributors — because their success advances the engineering profession as a whole.",
      "The program cultivates a mindset of continuous improvement so beginner engineers become known for their expertise and proactive approach.",
    ],
    capabilities: [
      {
        title: "Personalised mentorship",
        description:
          "One-to-one mentorship with an experienced mentor and tailored skill development.",
      },
      {
        title: "Hands-on training",
        description:
          "Practical workshops simulating real-world scenarios and emerging technologies.",
      },
      {
        title: "Resources & knowledge",
        description:
          "Technical manuals, case studies, industry reports and continuous learning opportunities.",
      },
      {
        title: "Feedback & plans",
        description:
          "Regular assessments and tailored development plans with specific goals.",
      },
    ],
    process: [
      {
        title: "Pair a mentor",
        description:
          "Match each engineer with a mentor suited to their specific needs.",
      },
      {
        title: "Identify gaps",
        description:
          "Assess strengths and weaknesses and advise on technical improvement.",
      },
      {
        title: "Practise",
        description:
          "Engage in hands-on projects that reinforce theory and build confidence.",
      },
      {
        title: "Review",
        description:
          "Track progress through regular evaluation and development plans.",
      },
    ],
    benefits: [
      "Confident engineers ready for real workplace scenarios.",
      "Exposure to the latest tools, technologies and best practices.",
      "A supportive environment where questions are welcomed.",
      "Recognition for competence and a proactive approach.",
    ],
    seo: {
      title: "On Job Assist",
      description:
        "SAMORE On Job Assist: mentorship, hands-on training, resources and development plans that turn beginner engineers into proactive, recognised contributors.",
    },
  },

  "steel-oil-trading": {
    slug: "steel-oil-trading",
    title: "Steel & Oil Trading",
    division: "steel-oil-trading",
    parentSlug: null,
    gated: true,
    eyebrow: "Division",
    lede: "A genuine, direct source for steel products and refined petroleum — highly competitive prices with disciplined trade procedures.",
    overview: [
      "SAMORE has a genuine source for steel products such as construction rebar, steel billets, used rails and coils, and represents refineries for refined petroleum and crude products. Our sources are direct, with the best competitive prices in the market.",
      "Commercial terms, live pricing and full purchase procedures (FCO, SPA, MT700 and inspection) are shared with serious, verified buyers on request.",
    ],
    capabilities: [
      {
        title: "Steel Trading",
        description:
          "Construction rebar, steel billets, used rails and hot/cold/galvanised rolled coils — CIF pricing.",
      },
      {
        title: "Oil Trading",
        description:
          "Refined petroleum and crude products on FOB, CIF, TTT, TTV and CIF ASWP terms.",
      },
      {
        title: "Disciplined procedures",
        description:
          "Documented purchase procedures with SGS inspection, proof of product and bank-instrument settlement.",
      },
      {
        title: "Serious buyers only",
        description:
          "We welcome serious buyers or buyer representatives; verified inquiries receive full commercial terms.",
      },
    ],
    process: [
      {
        title: "Inquiry",
        description:
          "Send your inquiry / ICPO with company registration and buyer verification.",
      },
      {
        title: "Offer",
        description:
          "Receive the full commercial offer, current prices and applicable procedure.",
      },
      {
        title: "Contract",
        description:
          "Exchange signed and sealed documents (FCO / SPA / contract) via official channels.",
      },
      {
        title: "Settlement & delivery",
        description:
          "Bank-instrument settlement with SGS inspection, then scheduled delivery.",
      },
    ],
    benefits: [
      "Direct sources with highly competitive prices.",
      "CIF pricing inclusive of tax and bank administrative charges (steel).",
      "No upfront payment required for serious oil buyers.",
      "Structured, transparent trade procedures.",
    ],
    seo: {
      title: "Steel & Oil Trading",
      description:
        "SAMORE steel & oil trading: a direct source for construction rebar, billets, rails and coils, plus refined petroleum and crude products at competitive prices.",
    },
  },

  "steel-trading": {
    slug: "steel-trading",
    title: "Steel Trading",
    division: "steel-oil-trading",
    parentSlug: "steel-oil-trading",
    gated: true,
    eyebrow: "Steel & Oil Trading",
    lede: "A genuine source for construction rebar, steel billets, used rails and coils — CIF prices inclusive of tax and bank administrative charges.",
    overview: [
      "SAMORE supplies used rails, steel billets, new reinforcement bars, and hot-rolled, cold-rolled and galvanised coils at highly competitive, quantity-based CIF pricing. Exceptional prices are available for small-quantity seekers on MT700 / SBLC (MT760) with full quantity.",
      "Live price tables and the full purchase procedure (FCO, proforma invoice, SPA, MT705/MT700 and SGS inspection) are provided to verified buyers on request.",
    ],
    capabilities: [
      {
        title: "Long products",
        description:
          "Used rails, steel billets and new construction reinforcement bars.",
      },
      {
        title: "Flat products",
        description: "Hot-rolled, cold-rolled and galvanised rolled coils.",
      },
      {
        title: "CIF pricing",
        description:
          "Quantity-tiered CIF prices inclusive of VAT and bank administrative charges.",
      },
      {
        title: "Instrument settlement",
        description:
          "MT700 revolving letters of credit and SBLC (MT760) settlement under bank supervision.",
      },
    ],
    process: [
      {
        title: "FCO",
        description:
          "Receive the Full Corporate Offer; sign and stamp all pages to approve forms and procedures.",
      },
      {
        title: "Proforma & SPA",
        description:
          "The main seller issues the performance invoice and SPA; buyer and seller exchange signed contracts.",
      },
      {
        title: "Proof of product",
        description:
          "Under MT705 the seller issues POP video, export license, fresh Q&Q SGS reports and certificates.",
      },
      {
        title: "MT700 & delivery",
        description:
          "Buyer issues a revolving, irrevocable MT700 for full quantity; delivery starts within 7 days of acceptance.",
      },
    ],
    benefits: [
      "Direct, genuine source with competitive prices.",
      "Quantity discounts across rails, billets, rebar and coils.",
      "CIF prices inclusive of VAT and bank charges.",
      "Structured, bank-supervised settlement.",
    ],
    seo: {
      title: "Steel Trading",
      description:
        "SAMORE steel trading: construction rebar, steel billets, used rails and hot/cold/galvanised coils at competitive CIF prices with MT700/SBLC settlement.",
    },
  },

  "oil-trading": {
    slug: "oil-trading",
    title: "Oil Trading",
    division: "steel-oil-trading",
    parentSlug: "steel-oil-trading",
    gated: true,
    eyebrow: "Steel & Oil Trading",
    lede: "Refinery representation for refined petroleum and crude products — very competitive prices with no upfront payment for serious buyers.",
    overview: [
      "SAMORE acts as a refinery's official representative for the sale and supply of refined petroleum and crude oil products such as EN90, Jet Fuel, Diesel, Gasoline, Urea, Sulphur and LPG/LNG on FOB, CIF, Dip-and-Pay, TTO and CIF ASWP terms across major ports.",
      "Our procedures do not require any upfront payment; we welcome serious buyers or buyer representatives. Full TTT, TTV and CIF procedures and current prices are issued against a complete ICPO with the required attachments.",
    ],
    capabilities: [
      {
        title: "Product range",
        description:
          "EN90, Jet Fuel, Gasoline (octane), Urea, Sulphur and LPG/LNG, plus crude products.",
      },
      {
        title: "Global delivery terms",
        description:
          "FOB Rotterdam / Houston / Fujairah / Jurong, CIF ASWP, TTO and Dip-and-Pay.",
      },
      {
        title: "Verified buyers",
        description:
          "ICPO with company registration, owner passport and bank comfort letter (BCL).",
      },
      {
        title: "SGS-inspected settlement",
        description:
          "SGS dip-test and Q&Q inspection with MT103/TT wire settlement and title transfer.",
      },
    ],
    process: [
      {
        title: "ICPO",
        description:
          "Buyer issues the ICPO with company registration certificate and representative ID.",
      },
      {
        title: "CI & tank",
        description:
          "Seller issues the Commercial Invoice; buyer's tank is prepared for injection (TTT).",
      },
      {
        title: "Injection & POP",
        description:
          "Seller injects the product and issues POP documents; SGS conducts the dip test.",
      },
      {
        title: "Payment & title",
        description:
          "Buyer pays by MT103/TT after a positive SGS report; seller transfers title and documents.",
      },
    ],
    benefits: [
      "Competitive refinery-direct prices.",
      "No upfront payment for serious buyers.",
      "Multiple ports and delivery structures (TTT, TTV, CIF).",
      "Independent SGS inspection before payment.",
    ],
    seo: {
      title: "Oil Trading",
      description:
        "SAMORE oil trading: refinery-direct refined petroleum and crude products (EN90, Jet Fuel, Gasoline, Urea, Sulphur, LPG/LNG) on FOB, CIF, TTT and TTV terms.",
    },
  },
};

/** The 22-course catalogue (Engineering Courses document). */
export const COURSE_CATALOG = [
  { code: "P01", name: "Planning by Primavera P6 Level 01", days: 5, hours: 20, price: 300 },
  { code: "P02", name: "Planning by Primavera P6 Level 02", days: 5, hours: 20, price: 500 },
  { code: "P03", name: "Planning by Primavera P6 Level 03 - Use Primavera for Project control system & Payment issue", days: 5, hours: 20, price: 1000 },
  { code: "C01", name: "Construction Claims Basics Level 01", days: 5, hours: 20, price: 500 },
  { code: "C02", name: "Construction Claims Level 02", days: 5, hours: 20, price: 1000 },
  { code: "C03", name: "Claim Guarding during the construction project", days: 5, hours: 20, price: 1000 },
  { code: "C04", name: "Construction Claim Disputes Level 03", days: 5, hours: 20, price: 1000 },
  { code: "PCS", name: "Project Control Systems Engineer", days: 5, hours: 20, price: 750 },
  { code: "FDC", name: "FIDIC Contract", days: 5, hours: 20, price: 300 },
  { code: "BOT", name: "BOT Contracts", days: 5, hours: 20, price: 300 },
  { code: "MNT", name: "Maintenance Contracts", days: 5, hours: 20, price: 300 },
  { code: "CE1", name: "Contract administrator Engineer Level 01", days: 5, hours: 20, price: 500 },
  { code: "CE2", name: "Contract administrator Engineer Level 02", days: 5, hours: 20, price: 1000 },
  { code: "VE1", name: "Value Engineering", days: 5, hours: 20, price: 1500 },
  { code: "VE2", name: "Use Value Engineering to minimize project cost", days: 5, hours: 20, price: 2500 },
  { code: "ARB", name: "Engineering Arbitration", days: 5, hours: 20, price: 500 },
  { code: "PPR", name: "Construction Project Progress Reports", days: 5, hours: 20, price: 300 },
  { code: "MET", name: "Construction site meetings Function & Tanique", days: 5, hours: 20, price: 300 },
  { code: "PCO", name: "Project's professional Close out procedures", days: 5, hours: 20, price: 500 },
  { code: "ISP", name: "Infra structure projects", days: 5, hours: 20, price: 500 },
  { code: "CMP", name: "Crises Management in the delayed Projects", days: 5, hours: 20, price: 500 },
  { code: "GRR", name: "New Methods of Garbage Recycling worldwide", days: 5, hours: 20, price: 300 },
] as const;

/** Engineering education session pricing (Engineering Education document, USD). */
export const EDUCATION_PRICING = [
  { service: "Education Engineering Session", unit: "1 hr", usd: 100 },
  { service: "Education Engineering Student Research", unit: "1 hr", usd: 200 },
  { service: "Master Research Report", unit: "Lump sum", usd: 15000 },
  { service: "PhD Research Report", unit: "Lump sum", usd: 25000 },
  { service: "Master Questionnaire (about 100)", unit: "Lump sum", usd: 5000 },
  { service: "PhD Questionnaire (about 100)", unit: "Lump sum", usd: 10000 },
] as const;

export function getService(slug: string): ServiceContent | null {
  return SERVICES[slug] ?? null;
}
