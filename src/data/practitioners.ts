import joeImg from "../assets/team/joe.jpg";
import stephImg from "../assets/team/steph.jpg";
import briannaImg from "../assets/team/brianna.jpg";
import jarrodImg from "../assets/team/jarrod.jpg";
import hollyImg from "../assets/team/holly.jpg";
import ellaImg from "../assets/team/ella.jpg";
import catalinaImg from "../assets/team/catalina.jpg";
import carlyImg from "../assets/team/carly.jpg";
import taraImg from "../assets/team/tara.jpg";
import suzieImg from "../assets/team/suzie.jpg";
import suzieBeach from "../assets/team/personal/suzie/beach.jpg";
import erinImg from "../assets/team/erin.jpg";
import chloeImg from "../assets/team/chloe.jpg";
import lucyImg from "../assets/team/lucy.jpg";

import type { ImageMetadata } from "astro";

export interface Practitioner {
  name: string;
  role: string;
  locations: string;
  blurb: string;
  fullBio: string;
  qualifications: string[];
  specialties: string[];
  href: string;
  photo: ImageMetadata;
  personalPhotos?: ImageMetadata[];
}

export const physiotherapists: Practitioner[] = [
  {
    name: "Joe",
    role: "Physiotherapist",
    locations: "Currimundi · Sandstone Point",
    blurb:
      "10+ years in health and wellness. Special interest in running injury, performance and the active population. Also treats vertigo, headaches and migraines.",
    fullBio:
      "Joe has spent more than a decade working with active people who want to keep moving — runners chasing their next race, weekend athletes, parents who want to play with their kids without grimacing. His clinical interest sits at the intersection of running performance and injury rehab, but he also brings deep skill to vestibular conditions and chronic headaches. Outside the clinic, you'll find him leading the Forward Run Club at Aurenda Coffee Co.",
    qualifications: [
      "BSc Kinesiology (University of Alberta)",
      "Master of Physiotherapy Studies (University of Queensland)",
      "Dry needling certified",
    ],
    specialties: [
      "Running injury & performance",
      "Sports & active population",
      "Vertigo & vestibular",
      "Headaches & migraine",
    ],
    href: "/team/joe",
    photo: joeImg,
  },
  {
    name: "Steph",
    role: "Physiotherapist",
    locations: "Currimundi · Sandstone Point",
    blurb:
      "Women's health and pelvic floor physio, including pessary fittings. Sees paediatric clients across both clinics.",
    fullBio:
      "Steph's clinical heart sits with women navigating pregnancy, postnatal recovery, and the pelvic health concerns that often go undiscussed. She fits pessaries, runs pre-and-post natal pelvic floor consultations, and treats paediatric clients from babies through teens. Patients describe her as warm, thorough and genuinely unhurried — qualities that matter most when the questions feel sensitive.",
    qualifications: [
      "Bachelor of Biomedical Science (QUT)",
      "Master of Physiotherapy Studies (University of Queensland)",
      "Pelvic health post-grad training",
      "Dry needling certified",
    ],
    specialties: [
      "Pelvic floor & women's health",
      "Pessary fittings",
      "Paediatrics (all ages)",
      "Vertigo & vestibular",
    ],
    href: "/team/steph",
    photo: stephImg,
  },
  {
    name: "Brianna Bourne",
    role: "Physiotherapist",
    locations: "Currimundi · Sandstone Point",
    blurb:
      "Women's health and pelvic floor, clinical pilates and paediatrics. Background working with sporting and active populations.",
    fullBio:
      "Brianna brings together two clinical worlds that don't often share a room: women's health and the active sporting population. She runs much of our clinical pilates program and is a go-to for postnatal women returning to exercise. Bri is methodical, calm and excellent at translating clinical reasoning into a plan people actually want to follow.",
    qualifications: [
      "Bachelor of Physiotherapy",
      "Clinical pilates training",
      "Dry needling certified",
    ],
    specialties: [
      "Pelvic floor & women's health",
      "Clinical pilates",
      "Paediatrics",
      "Active & sporting populations",
    ],
    href: "/team/brianna-bourne",
    photo: briannaImg,
  },
  {
    name: "Jarrod Palmer-Brown",
    role: "Physiotherapist",
    locations: "Currimundi · Sandstone Point · Home visits",
    blurb:
      "4+ years working with knee and hip osteoarthritis and post-operative rehab. Leads our home-visit program.",
    fullBio:
      "Jarrod runs Forward Health's home-visit physiotherapy service across the Sunshine Coast and Moreton Bay. His clinical wheelhouse is knee and hip osteoarthritis and post-surgical rehab — the kind of work where progress is measured in steps gained rather than reps logged. He works with NDIS plan-managed clients, Home Care Package recipients, post-discharge programs and DVA card holders.",
    qualifications: [
      "Bachelor of Physiotherapy (Charles Sturt University)",
    ],
    specialties: [
      "Home visits & mobile rehab",
      "Knee & hip osteoarthritis",
      "Post-operative rehabilitation",
      "Active & sporting populations",
    ],
    href: "/team/jarrod-palmer-brown",
    photo: jarrodImg,
  },
  {
    name: "Holly Dalton",
    role: "Physiotherapist",
    locations: "Sandstone Point",
    blurb:
      "General musculoskeletal physiotherapy, clinical pilates and our strength & balance class lead at Sandstone Point.",
    fullBio:
      "Holly is the heart of the Sandstone Point physiotherapy team — equally at home on the treatment table, on the reformer, or running our strength-and-balance group classes. She brings warmth and clear communication to general musculoskeletal cases and has built a loyal community of regulars who come back week after week for her classes.",
    qualifications: ["Bachelor of Physiotherapy (Australian Catholic University)"],
    specialties: [
      "General musculoskeletal physio",
      "Clinical pilates",
      "Strength & balance classes",
    ],
    href: "/team/holly-dalton",
    photo: hollyImg,
  },
  {
    name: "Ella Gubesch",
    role: "Physiotherapist · Currently on maternity leave",
    locations: "Currimundi",
    blurb:
      "Currimundi physiotherapist currently on maternity leave — back with us when ready.",
    fullBio:
      "Ella is part of the Currimundi physiotherapy team and is currently away on maternity leave. We're looking forward to welcoming her back when she's ready to return to clinical practice.",
    qualifications: [],
    specialties: [],
    href: "/team/ella-gubesch",
    photo: ellaImg,
  },
];

export const massageTherapists: Practitioner[] = [
  {
    name: "Tara Donnolley",
    role: "Remedial Massage Therapist · Myotherapist",
    locations: "Currimundi",
    blurb:
      "13+ years as a remedial massage therapist with an advanced diploma of Myotherapy. Treats complex chronic pain and post-injury recovery.",
    fullBio:
      "Tara is the most experienced bodyworker on our team, with more than thirteen years of remedial massage practice and an advanced diploma of Myotherapy. She's the right call for chronic, complex or stubborn cases that haven't shifted with general massage — combining soft tissue, dry needling, cupping and joint mobilisation depending on what your body needs.",
    qualifications: [
      "Diploma of Remedial Massage (Q Academy, 2013)",
      "Advanced Diploma of Myotherapy (Q Academy, 2017)",
    ],
    specialties: [
      "Complex chronic pain",
      "Myotherapy",
      "Post-injury recovery",
      "Dry needling & cupping",
    ],
    href: "/team/tara-donnolley",
    photo: taraImg,
  },
  {
    name: "Carly Wilson",
    role: "Remedial Massage Therapist",
    locations: "Currimundi",
    blurb:
      "Multiple years as a remedial massage therapist, currently studying to become a Myotherapist.",
    fullBio:
      "Carly is one of the most-requested therapists at Currimundi — known for the right balance of firm and intuitive pressure, and an ability to find the knot you've been carrying without you needing to point it out. She's currently studying to become a Myotherapist alongside her clinic work.",
    qualifications: [
      "Diploma of Remedial Massage",
      "Studying Advanced Diploma of Myotherapy",
    ],
    specialties: ["Deep tissue", "Sports & recovery", "Tension headaches"],
    href: "/team/carly-wilson",
    photo: carlyImg,
  },
  {
    name: "Catalina Paredes Ramirez",
    role: "Remedial Massage Therapist",
    locations: "Sandstone Point",
    blurb:
      "Diploma of Remedial Massage. Several years previous experience as a physiotherapist in Colombia. Special interest in lymphatic drainage.",
    fullBio:
      "Before becoming a remedial massage therapist in Australia, Catalina spent several years practising as a physiotherapist in Colombia. She brings that clinical lens to her massage practice — particularly skilled at lymphatic drainage and post-surgical recovery work. She's currently working towards AHPRA recognition of her overseas physiotherapy qualifications.",
    qualifications: [
      "Diploma of Remedial Massage (Mastery Institute Australia, 2025)",
      "Physiotherapy training (Colombia)",
    ],
    specialties: [
      "Lymphatic drainage",
      "Pregnancy massage",
      "Post-surgical recovery",
    ],
    href: "/team/catalina-paredes-ramirez",
    photo: catalinaImg,
  },
  {
    name: "Suzie Irwin",
    role: "Remedial Massage Therapist",
    locations: "Currimundi · Tuesdays",
    blurb:
      "Trained in New Zealand, on the Sunshine Coast since 2010. Trigger point therapy, myofascial release, joint mobilisation and stretching — with a calm, nurturing approach.",
    fullBio:
      "Suzie brings deep experience as a remedial massage therapist alongside her background as an assistant nurse working in community and residential care. She trained in New Zealand through the Wellington School of Massage Therapy before moving to the Sunshine Coast in 2010, and has worked across many multi-disciplinary clinics since. Her treatments draw on trigger point therapy, myofascial release, joint mobilisation, and active and passive stretching — all delivered with the kind of compassionate, unhurried presence her clients come back for. Outside work, you'll find Suzie at yoga, the gym, walking in nature, meditating, at sound baths, travelling or with her loved ones.",
    qualifications: [
      "Diploma of Remedial Massage (Wellington School of Massage Therapy, NZ)",
      "Assistant Nurse — community and residential care experience",
    ],
    specialties: [
      "Trigger point therapy",
      "Myofascial release",
      "Joint mobilisation",
      "Active & passive stretching",
    ],
    href: "/team/suzie-irwin",
    photo: suzieImg,
    personalPhotos: [suzieBeach],
  },
];

export const careTeam: Practitioner[] = [
  {
    name: "Erin Gadsby",
    role: "Client Care Coordinator",
    locations: "Currimundi",
    blurb: "First friendly face you meet at Currimundi reception.",
    fullBio:
      "Erin is the first friendly face you meet when you walk into Currimundi — the person who'll find you a parking spot, sort your HICAPS claim, and make sure your favourite practitioner has the slot you need.",
    qualifications: [],
    specialties: [],
    href: "/team/erin-gadsby",
    photo: erinImg,
  },
  {
    name: "Chloe Becker",
    role: "Client Care Coordinator",
    locations: "Sandstone Point",
    blurb: "First friendly face you meet at Sandstone Point reception.",
    fullBio:
      "Chloe runs reception at Sandstone Point — bookings, callbacks, claims, and everything in between. She's the reason the day stays on time.",
    qualifications: [],
    specialties: [],
    href: "/team/chloe-becker",
    photo: chloeImg,
  },
  {
    name: "Lucy Chung",
    role: "Client Care Coordinator",
    locations: "Sandstone Point",
    blurb: "Bookings, claims and a calm front-of-house presence.",
    fullBio:
      "Lucy keeps the Sandstone Point front desk running smoothly — patient communications, health-fund claims, and the everyday warmth that makes a clinic feel like a clinic, not a corporation.",
    qualifications: [],
    specialties: [],
    href: "/team/lucy-chung",
    photo: lucyImg,
  },
];

const allPractitioners = [
  ...physiotherapists,
  ...massageTherapists,
  ...careTeam,
];

export const practitioners: Record<string, Practitioner> = Object.fromEntries(
  allPractitioners.map((p) => [
    p.name.toLowerCase().split(" ")[0],
    p,
  ])
);
