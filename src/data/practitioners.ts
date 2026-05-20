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
    name: "Joe Vos",
    role: "Physiotherapist\nRunning Injury & Performance Physio",
    locations: "Currimundi · Sandstone Point",
    blurb:
      "10+ years in health and wellness. Special interest in running injury, performance and the active population. Also treats vertigo, headaches and migraines.",
    fullBio:
      "As a multi-sport athlete, Joe's physiotherapy journey started at an early age. After undergoing non-surgical management of a PCL tear in his knee during his teenage years, he developed a strong belief and understanding of how physiotherapy can enable patients to return to their regular activities.\n\nIn 2015, Joe completed his Bachelor of Science in Kinesiology at the University of Alberta and worked as a Kinesiologist and Personal Trainer. He moved to Australia in 2015 and completed his Master of Physiotherapy Studies at the University of Queensland in 2017. He spent 3 years on beautiful Bribie Island treating a variety of injuries including chronic pain, young athletes, and acute rugby injury management.\n\nJoe enjoys working with people from all walks of life as long as they are committed to reaching their goals. In particular, he has a strong interest in treating headaches and migraines, and athletes on the elite and recreational level.\n\nIn his spare time, you can find Joe doing anything he can to stay active, or 'practicing what he preaches'. This includes resistance training, running, yoga, pilates and calisthenics, playing beach volleyball, snowboarding, racket sports, or getting outdoors hiking, camping, and fishing. On top of staying active, Joe enjoys playing guitar and singing, brewing his own beer, and enjoying a nice glass of wine. He also leads the Forward Run Club at Aurenda Coffee Co in Kings Beach, with his wife (and business partner) Steph, their little boy Noah, and their dog Fraser (unofficial co-leader of the run club).\n\nJoe's warm and friendly personality allows him to provide quality, effective treatment and care. In a typical session with Joe, you can expect to receive a balance of manual therapy, education on your injury, treatment planning, goal setting, development of self-management strategies, and an exercise program to get you back to what you love doing.",
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
    name: "Steph Pyle",
    role: "Physiotherapist\nPelvic floor physiotherapist",
    locations: "Currimundi · Sandstone Point",
    blurb:
      "Women's health and pelvic floor physio, including pessary fittings. Sees paediatric clients across both clinics.",
    fullBio:
      "Stephanie graduated with a Masters in Physiotherapy Studies from the University of Queensland in 2017. Previously, she completed her Bachelor of Biomedical Science at the Queensland University of Technology.\n\nSteph enjoys treating a wide variety of conditions, however has found a special interest in women's health as well as complex pain conditions. She has completed extra training in treating incontinence, prolapse and pregnancy, and can perform pessary fittings. She has also worked overseas in a specialist women's health clinic.\n\nIn her spare time, Steph will be walking along the beach, finding pastry shops, and picking up her one-year-old Noah's toys.",
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
    role: "Physiotherapist\nPelvic floor physiotherapist",
    locations: "Currimundi · Sandstone Point",
    blurb:
      "Women's health and pelvic floor, clinical pilates and paediatrics. Background working with sporting and active populations.",
    fullBio:
      "Brianna, originally from the Sunshine Coast, discovered her interest in physiotherapy through her lifelong involvement in sport and fitness. Having grown up playing a wide range of sports including touch, netball, rugby and volleyball, she inevitably experienced injury herself and was supported through rehabilitation by a physiotherapist. This experience highlighted the profound impact physiotherapy can have on a person's wellbeing and inspired her to pursue the profession.\n\nBrianna completed a Bachelor of Physiotherapy at the Australian Catholic University, undertaking clinical placements across Neurorehabilitation, Women's Health, Cardiorespiratory, Musculoskeletal Injuries and Surgical Rehabilitation. These experiences strengthened her commitment to supporting individuals through their recovery and helping them return to the activities that bring them joy. During her studies, she also worked as a sports trainer, gaining valuable insight into complex musculoskeletal conditions and developing a passion for guiding young athletes through their rehabilitation journeys.\n\nWith a particular interest in Women's Health Physiotherapy, Brianna has completed additional qualifications in this specialty. She is dedicated to empowering women through all stages of life, providing evidence-based, compassionate care tailored to each person's needs.\n\nOutside of work, Brianna enjoys spending time with her dog, getting to the beach whenever she can, and participating in social sports. Her drive for self-improvement and her personal experiences shape her commitment to delivering high-quality care and helping every patient achieve their goals and live their healthiest, happiest life.",
    qualifications: [
      "Bachelor of Physiotherapy",
      "Pelvic floor post-graduate training",
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
      "Jarrod completed his Bachelor of Physiotherapy at Charles Sturt University in Orange, New South Wales, and has since developed a broad background in musculoskeletal private practice and acute orthopaedic rehabilitation. He has worked in both outpatient and hospital settings, gaining experience in the management of post-operative hip and knee replacements, as well as a range of other surgical and orthopaedic conditions.\n\nIn addition to his orthopaedic expertise, Jarrod has worked with acute and chronic neurological clients, particularly those living in the community, helping individuals regain function and independence through movement-based rehabilitation.\n\nJarrod particularly enjoys working with knee and hip conditions from early-stage osteoarthritis management and pre-habilitation before surgery, through to post-operative recovery. He has a keen interest in helping people maintain active, healthy lifestyles and believes strongly in empowering his clients with the knowledge and tools to look after their bodies for the long term. You can see him at either clinic for a regular appointment, or book him for a home visit.\n\nOutside of work, Jarrod enjoys keeping fit through gym-based training, running, and hiking, and his favourite way to unwind is by camping and exploring the great outdoors.",
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
      "Holly completed her Bachelor of Physiotherapy at the Australian Catholic University, where she developed a strong interest in musculoskeletal and women's health. Through her clinical placements, she gained valuable experience in these areas, which further strengthened her passion for helping people move better, build resilience, and return to the activities they value through all stages of life.\n\nHolly's interest in musculoskeletal and women's health physiotherapy is deeply personal, inspired by her own experience of the positive impact a women's health physiotherapist can have during the postnatal period. She is passionate about providing empathetic, evidence-based care and empowering her clients to feel confident and strong in their bodies.\n\nOutside of the clinic, Holly enjoys spending time with her two daughters, riding and competing on her horse, and jet ski racing.",
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
    role: "Physiotherapist\nPelvic floor physiotherapist · Currently on maternity leave",
    locations: "Sandstone Point",
    blurb:
      "Sandstone Point physiotherapist currently on maternity leave with her young family.",
    fullBio:
      "Ella's passion for health and wellness blossomed early, fuelled by her active involvement in sports teams and dedication to gym and pilates classes during her teenage years. After enduring her own share of sporting injuries and witnessing the profound impact of physiotherapy in her grandparents' lives, Ella was inspired by the meaningful impact physical therapy can have across the lifespan and pursued a Bachelor's degree in Physiotherapy at the Australian Catholic University.\n\nHer professional journey began with roles as a sports trainer, rehabilitation coach, and pilates instructor, where she gained insights into diverse conditions and admired the body's innate healing capacity. A pivotal moment in her journey came when she served as an Allied Health Assistant in a paediatrics therapy clinic, igniting her passion for paediatric care. Here, she discovered the power of child-led play in fostering patient engagement and rapport, firmly advocating that therapy should be enjoyable and fun. Subsequently, following her personal experiences during pregnancy and postnatal recovery, her empathy, understanding, and enthusiasm for women's and pelvic health physiotherapy have flourished.\n\nElla is currently on maternity leave with her young family, her little boy and her recently-born baby girl. We can't wait for her return. Outside of work, Ella can be found spending time with her family, cheering on her local football team, or soaking in the beach vibes year-round. Committed to providing holistic care, Ella approaches each rehabilitation journey with empathy and an open ear, ensuring that every concern is acknowledged and supported.",
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
    role: "Remedial Massage Therapist",
    locations: "Currimundi · Tuesdays & Fridays",
    blurb:
      "Over 20 years in the health and fitness industry, with a warm, nurturing approach to pain, mobility and wellbeing.",
    fullBio:
      "With over 20 years of experience in the health and fitness industry, Tara brings a depth of knowledge and a genuine passion for helping people feel and move better in their everyday lives. As a qualified Myotherapist and Remedial Massage Therapist (currently focusing on remedial massage), Tara enjoys working with people from all walks of life, tailoring each treatment to support their individual needs. Her approach is centred on creating a supportive, welcoming and nurturing environment where clients feel comfortable and cared for. She uses a range of remedial and relaxation techniques to address pain, improve mobility and enhance general wellbeing.\n\nTara believes that quality of life is closely tied to how we move and feel, and is committed to empowering clients to improve their everyday life through massage and movement.\n\nOutside of the clinic, Tara enjoys spending time with her husband and four children, going for a recreational run, and keeping active in everyday life.",
    qualifications: [
      "Advanced Diploma of Myotherapy (Q Academy, 2017)",
      "Diploma of Remedial Massage (Q Academy, 2013)",
      "20+ years in the health and fitness industry",
    ],
    specialties: [
      "Pain management",
      "Mobility and movement",
      "Remedial and relaxation techniques",
    ],
    href: "/team/tara-donnolley",
    photo: taraImg,
  },
  {
    name: "Carly Wilson",
    role: "Remedial Massage Therapist",
    locations: "Currimundi · Thursdays",
    blurb:
      "Multiple years as a remedial massage therapist, known for the right balance of firm and intuitive pressure.",
    fullBio:
      "Introducing Carly, a dedicated remedial massage therapist with a genuine passion for utilising movement as a form of therapeutic medicine. Carly seamlessly blends her remedial massage skills with 15 years of invaluable nursing experience, and a vast understanding of surgery and various health conditions.\n\nCarly's approach to massage therapy is comprehensive and tailored to individual needs. Drawing from her extensive background, she employs a diverse range of modalities, including dry needling, stretch therapy, myofascial release, trigger point therapy, cupping and exercise prescription. This unique combination allows her to address a spectrum of concerns and provide holistic healing.\n\nWith a commitment to ongoing education and additional certifications, Carly is continually learning the latest techniques and incorporating them into effective, personalised treatments for her clients.\n\nBeyond her professional pursuits, Carly enjoys practicing aerial arts, pilates and functional strength training. Her love for movement extends into her personal life, where she enjoys exploring the beach and the great outdoors with her husband and their energetic Pointer puppy, Torvi. Carly's holistic approach to movement and wellness is a great fit alongside our physio team, and she's dedicated to helping you achieve the balance and movement your life and body needs.",
    qualifications: [
      "Diploma of Remedial Massage",
    ],
    specialties: ["Deep tissue", "Sports & recovery", "Tension headaches"],
    href: "/team/carly-wilson",
    photo: carlyImg,
    personalPhotos: [carlyPersonal1, carlyPersonal2, carlyPersonal3],
  },
  {
    name: "Catalina Paredes Ramirez",
    role: "Remedial Massage Therapist",
    locations: "Sandstone Point · Tuesdays, Thursdays, Fridays + monthly Saturdays",
    blurb:
      "Diploma of Remedial Massage. Several years previous experience as a physiotherapist in Colombia. Special interest in lymphatic drainage.",
    fullBio:
      "Catalina is a caring and dedicated remedial massage therapist with a strong background in physiotherapy and over ten years of experience in health, rehabilitation, and wellness. She combines her deep understanding of the human body with a compassionate approach to help clients relieve pain, restore balance, and improve their overall wellbeing.\n\nHer treatments are tailored to each client's individual needs and may include deep tissue massage, lymphatic drainage, pregnancy and postnatal massage, and relaxation techniques. Catalina's goal is always to provide a safe, nurturing space where clients can relax, heal, and reconnect with their bodies.\n\nOriginally from Colombia, Catalina has worked with people from all walks of life, from athletes recovering from injuries to individuals seeking stress relief and improved mobility. She believes that massage is not only a treatment for the body but also a way to restore harmony between body and mind.\n\nBeyond her professional life, Catalina loves travelling, exploring new places, and going on adventures. She enjoys spending time outdoors and values meaningful moments with her friends and family. She also has a deep love for animals and finds joy in caring for them and being surrounded by nature. Warm, attentive, and passionate about helping others, Catalina is committed to making every treatment a restorative and uplifting experience.",
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
    locations: "Currimundi · Tuesdays + monthly Saturdays",
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
      "Erin is the first friendly face you meet when you walk into Currimundi. The person who'll find you a parking spot, sort your HICAPS claim, and make sure your favourite practitioner has the slot you need.\n\nOutside reception, Erin's most likely to be found at the beach, with her family, or planning her next coffee stop.",
    qualifications: [],
    specialties: [],
    href: "/team/erin-gadsby",
    photo: erinImg,
  },
  {
    name: "Lucy Chung",
    role: "Client Care Coordinator",
    locations: "Sandstone Point",
    blurb: "Bookings, claims and a calm front-of-house presence.",
    fullBio:
      "Lucy keeps the Sandstone Point front desk running smoothly, patient communications, health-fund claims, and the everyday warmth that makes a clinic feel like a clinic, not a corporation.\n\nLucy uses her free-time away from studying and working to be with family and friends, and enjoys exploring new places. She also enjoys reading and knitting.",
    qualifications: [],
    specialties: [],
    href: "/team/lucy-chung",
    photo: lucyImg,
    personalPhotos: [lucyPersonal1, lucyPersonal2, lucyPersonal3],
  },
  {
    name: "Chloe Becker",
    role: "Client Care Coordinator",
    locations: "Sandstone Point",
    blurb: "First friendly face you meet at Sandstone Point reception.",
    fullBio:
      "Chloe runs reception at Sandstone Point, bookings, callbacks, claims, and everything in between. She's the reason the day stays on time.\n\nOutside the clinic, Chloe loves a long walk with friends, weekend trips up and down the coast, and any excuse for a beach day.",
    qualifications: [],
    specialties: [],
    href: "/team/chloe-becker",
    photo: chloeImg,
  },
  {
    name: "Maddie McCulloch",
    role: "Client Care Coordinator",
    locations: "Currimundi",
    blurb: "Friendly front-of-house at Currimundi reception.",
    fullBio:
      "Maddie joined the Currimundi reception team in 2026. She'll be one of the first faces you meet, sorting bookings, answering questions about pricing and health-fund claims, and making sure your visit runs smoothly from the moment you walk in.\n\nOutside the clinic, Maddie is a big music and movie person, and never says no to a beach swim or a long weekend with friends.",
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
