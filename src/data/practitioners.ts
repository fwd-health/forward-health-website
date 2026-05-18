import joeImg from "../assets/team/joe.jpg";
import joePersonal1 from "../assets/team/personal/joe/photo-1.png";
import joePersonal2 from "../assets/team/personal/joe/photo-2.png";
import joePersonal3 from "../assets/team/personal/joe/photo-3.jpg";

import stephImg from "../assets/team/steph.jpg";
import stephPersonal1 from "../assets/team/personal/steph/photo-1.jpg";
import stephPersonal2 from "../assets/team/personal/steph/photo-2.png";
import stephPersonal3 from "../assets/team/personal/steph/photo-3.jpg";

import briannaImg from "../assets/team/brianna.jpg";
import briannaPersonal1 from "../assets/team/personal/brianna/photo-1.jpg";
import briannaPersonal2 from "../assets/team/personal/brianna/photo-2.jpg";
import briannaPersonal3 from "../assets/team/personal/brianna/photo-3.jpg";

import jarrodImg from "../assets/team/jarrod.jpg";
import jarrodPersonal1 from "../assets/team/personal/jarrod/photo-1.png";
import jarrodPersonal2 from "../assets/team/personal/jarrod/photo-2.png";
import jarrodPersonal3 from "../assets/team/personal/jarrod/photo-3.jpg";

import hollyImg from "../assets/team/holly.jpg";
import hollyPersonal1 from "../assets/team/personal/holly/photo-1.jpg";
import hollyPersonal2 from "../assets/team/personal/holly/photo-2.jpg";
import hollyPersonal3 from "../assets/team/personal/holly/photo-3.jpg";

import ellaImg from "../assets/team/ella.jpg";
import ellaPersonal1 from "../assets/team/personal/ella/photo-1.jpg";
import ellaPersonal2 from "../assets/team/personal/ella/photo-2.jpg";
import ellaPersonal3 from "../assets/team/personal/ella/photo-3.jpg";

import catalinaImg from "../assets/team/catalina.jpg";
import catalinaPersonal1 from "../assets/team/personal/catalina/photo-1.jpg";
import catalinaPersonal2 from "../assets/team/personal/catalina/photo-2.jpg";
import catalinaPersonal3 from "../assets/team/personal/catalina/photo-3.jpg";

import carlyImg from "../assets/team/carly.jpg";
import carlyPersonal1 from "../assets/team/personal/carly/photo-1.jpg";
import carlyPersonal2 from "../assets/team/personal/carly/photo-2.jpg";
import carlyPersonal3 from "../assets/team/personal/carly/photo-3.jpg";

import taraImg from "../assets/team/tara.jpg";

import suzieImg from "../assets/team/suzie.jpg";
import suzieBeach from "../assets/team/personal/suzie/beach.jpg";

import erinImg from "../assets/team/erin.jpg";
import chloeImg from "../assets/team/chloe.jpg";

import lucyImg from "../assets/team/lucy.jpg";
import lucyPersonal1 from "../assets/team/personal/lucy/photo-1.png";
import lucyPersonal2 from "../assets/team/personal/lucy/photo-2.jpg";
import lucyPersonal3 from "../assets/team/personal/lucy/photo-3.jpg";

import maddieImg from "../assets/team/maddie.jpg";

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
      "Joe has spent more than a decade working with active people who want to keep moving, runners chasing their next race, weekend athletes, parents who want to play with their kids without grimacing. His clinical interest sits at the intersection of running performance and injury rehab, but he also brings deep skill to vestibular conditions and chronic headaches. Outside the clinic, you'll find him leading the Forward Run Club at Aurenda Coffee Co.",
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
    personalPhotos: [joePersonal1, joePersonal2, joePersonal3],
  },
  {
    name: "Steph",
    role: "Physiotherapist",
    locations: "Currimundi · Sandstone Point",
    blurb:
      "Women's health and pelvic floor physio, including pessary fittings. Sees paediatric clients across both clinics.",
    fullBio:
      "With several years of experience treating women's health and pelvic floor physio, along with paediatric patients, Steph's clinical heart sits with women navigating pregnancy, postnatal recovery, and the pelvic health concerns that often go undiscussed. She fits pessaries, runs pre-and-post natal pelvic floor consultations, and treats paediatric clients from babies through teens. Patients describe her as warm, thorough and genuinely unhurried, qualities that matter most when the questions feel sensitive.",
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
    personalPhotos: [stephPersonal1, stephPersonal2, stephPersonal3],
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
    personalPhotos: [briannaPersonal1, briannaPersonal2, briannaPersonal3],
  },
  {
    name: "Jarrod Palmer-Brown",
    role: "Physiotherapist",
    locations: "Currimundi · Sandstone Point · Home visits",
    blurb:
      "4+ years working with knee and hip osteoarthritis and post-operative rehab. Leads our home-visit program.",
    fullBio:
      "Jarrod runs Forward Health's home-visit physiotherapy service across the Sunshine Coast and Moreton Bay. His clinical wheelhouse is knee and hip osteoarthritis and post-surgical rehab, the kind of work where progress is measured in steps gained rather than reps logged. He works with NDIS plan-managed clients, Home Care Package recipients, post-discharge programs and DVA card holders.",
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
    personalPhotos: [jarrodPersonal1, jarrodPersonal2, jarrodPersonal3],
  },
  {
    name: "Holly Dalton",
    role: "Physiotherapist",
    locations: "Sandstone Point",
    blurb:
      "General musculoskeletal physiotherapy, clinical pilates and our strength & balance class lead at Sandstone Point.",
    fullBio:
      "Holly is the heart of the Sandstone Point physiotherapy team, equally at home on the treatment table, on the reformer, or running our strength-and-balance group classes. She brings warmth and clear communication to general musculoskeletal cases and has built a loyal community of regulars who come back week after week for her classes.",
    qualifications: ["Bachelor of Physiotherapy (Australian Catholic University)"],
    specialties: [
      "General musculoskeletal physio",
      "Clinical pilates",
      "Strength & balance classes",
    ],
    href: "/team/holly-dalton",
    photo: hollyImg,
    personalPhotos: [hollyPersonal1, hollyPersonal2, hollyPersonal3],
  },
  {
    name: "Ella Gubesch",
    role: "Physiotherapist · Currently on maternity leave",
    locations: "Currimundi",
    blurb:
      "Currimundi physiotherapist currently on maternity leave. Back with us when ready.",
    fullBio:
      "Ella is part of the Currimundi physiotherapy team and is currently away on maternity leave. We're looking forward to welcoming her back when she's ready to return to clinical practice.",
    qualifications: [],
    specialties: [],
    href: "/team/ella-gubesch",
    photo: ellaImg,
    personalPhotos: [ellaPersonal1, ellaPersonal2, ellaPersonal3],
  },
];

export const massageTherapists: Practitioner[] = [
  {
    name: "Tara Donnolley",
    role: "Remedial Massage Therapist · Myotherapist",
    locations: "Currimundi",
    blurb:
      "Over 20 years in the health and fitness industry. Qualified Myotherapist and Remedial Massage Therapist with a warm, nurturing approach to pain, mobility and wellbeing.",
    fullBio:
      "With over 20 years of experience in the health and fitness industry, Tara brings a depth of knowledge and a genuine passion for helping people feel and move better in their everyday lives. As a qualified Myotherapist and Remedial Massage Therapist, Tara enjoys working with people from all walks of life, tailoring each treatment to support their individual needs. Her approach is centred on creating a supportive, welcoming and nurturing environment where clients feel comfortable and cared for. She uses a range of remedial and relaxation techniques to address pain, improve mobility and enhance general wellbeing.\n\nTara believes that quality of life is closely tied to how we move and feel, and is committed to empowering clients to improve their everyday life through massage and movement.\n\nOutside of the clinic, Tara enjoys spending time with her husband and four children, going for a recreational run, and keeping active in everyday life.",
    qualifications: [
      "Advanced Diploma of Myotherapy (Q Academy, 2017)",
      "Diploma of Remedial Massage (Q Academy, 2013)",
      "20+ years in the health and fitness industry",
    ],
    specialties: [
      "Pain management",
      "Mobility and movement",
      "Remedial and relaxation techniques",
      "Myotherapy",
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
      "Carly is one of the most-requested therapists at Currimundi, known for the right balance of firm and intuitive pressure, and an ability to find the knot you've been carrying without you needing to point it out. She's currently studying to become a Myotherapist alongside her clinic work.",
    qualifications: [
      "Diploma of Remedial Massage",
      "Studying Advanced Diploma of Myotherapy",
    ],
    specialties: ["Deep tissue", "Sports & recovery", "Tension headaches"],
    href: "/team/carly-wilson",
    photo: carlyImg,
    personalPhotos: [carlyPersonal1, carlyPersonal2, carlyPersonal3],
  },
  {
    name: "Catalina Paredes Ramirez",
    role: "Remedial Massage Therapist",
    locations: "Sandstone Point",
    blurb:
      "Diploma of Remedial Massage. Several years previous experience as a physiotherapist in Colombia. Special interest in lymphatic drainage.",
    fullBio:
      "Before becoming a remedial massage therapist in Australia, Catalina spent several years practising as a physiotherapist in Colombia. She brings that clinical lens to her massage practice, particularly skilled at lymphatic drainage and post-surgical recovery work. She's currently working towards AHPRA recognition of her overseas physiotherapy qualifications.",
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
    personalPhotos: [catalinaPersonal1, catalinaPersonal2, catalinaPersonal3],
  },
  {
    name: "Suzie Irwin",
    role: "Remedial Massage Therapist",
    locations: "Currimundi · Tuesdays",
    blurb:
      "Trained in New Zealand, on the Sunshine Coast since 2010. Remedial massage therapist with a nursing background and a calm, nurturing approach.",
    fullBio:
      "Suzie brings deep experience as a remedial massage therapist, coupled with her knowledge working as an assistant nurse in the community and in residential care.\n\nShe trained in New Zealand through the Wellington School of Massage Therapy before moving to the Sunshine Coast in 2010, and has worked across many multidisciplinary clinics since. Her treatments draw on a variety of techniques including trigger point therapy, myofascial release, joint mobilisation, and active and passive stretching. She loves making her clients feel valued.\n\nOutside the clinic, Suzie is into all things wellbeing: yoga, the gym, walking in nature, meditation, sound baths, travel and time with her loved ones.\n\nHer approach to health care and her genuine interest in helping others make her a compassionate and nurturing therapist.",
    qualifications: [
      "Diploma of Remedial Massage (Wellington School of Massage Therapy, NZ)",
      "Assistant Nurse, community and residential care experience",
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
      "Erin is the first friendly face you meet when you walk into Currimundi. The person who'll find you a parking spot, sort your HICAPS claim, and make sure your favourite practitioner has the slot you need.",
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
      "Chloe runs reception at Sandstone Point, bookings, callbacks, claims, and everything in between. She's the reason the day stays on time.",
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
      "Lucy keeps the Sandstone Point front desk running smoothly, patient communications, health-fund claims, and the everyday warmth that makes a clinic feel like a clinic, not a corporation.",
    qualifications: [],
    specialties: [],
    href: "/team/lucy-chung",
    photo: lucyImg,
    personalPhotos: [lucyPersonal1, lucyPersonal2, lucyPersonal3],
  },
  {
    name: "Maddie McCulloch",
    role: "Client Care Coordinator",
    locations: "Currimundi",
    blurb: "Friendly front-of-house at Currimundi reception.",
    fullBio:
      "Maddie joined the Currimundi reception team in 2026. She'll be one of the first faces you meet, sorting bookings, answering questions about pricing and health-fund claims, and making sure your visit runs smoothly from the moment you walk in.",
    qualifications: [],
    specialties: [],
    href: "/team/maddie-mcculloch",
    photo: maddieImg,
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
