export interface PartnerTier {
  name: string;
  label: string;
  accent: string;
  accentText: string;
  accentHover: string;
  border: string;
  background: string;
  amount: string;
  slots: number;
  slotHeight: string;
  cta: string;
}

export interface PartnerBenefit {
  title: string;
  description: string;
}

export const partnerHero = {
  kicker: "PARTNERS & SPONSORS",
  title: "Power the next generation.",
  lead: "Four sponsorship tiers, each with branding, exhibition space, media visibility and participation opportunities.",
};

export const tiersSection = {
  kicker: "SPONSORSHIP TIERS",
  title: "Four ways to back the quest.",
  lead: "Every tier unlocks programme recognition, exhibition space and a place in the innovation story.",
};

export const partnerTiers: PartnerTier[] = [
  {
    name: "Platinum",
    label: "PLATINUM",
    accent: "#e6f2ec",
    accentText: "text-[#e6f2ec]",
    accentHover: "hover:text-[#e6f2ec]",
    border: "rgba(230,242,236,0.3)",
    background: "linear-gradient(160deg,#16231f,#030f0b)",
    amount: "400,000+",
    slots: 2,
    slotHeight: "h-[72px]",
    cta: "Enquire about Platinum →",
  },
  {
    name: "Gold",
    label: "GOLD",
    accent: "#d4af37",
    accentText: "text-gold",
    accentHover: "hover:text-gold",
    border: "rgba(212,175,55,0.38)",
    background: "linear-gradient(160deg,#1c190b,#030f0b)",
    amount: "300,000+",
    slots: 3,
    slotHeight: "h-16",
    cta: "Enquire about Gold →",
  },
  {
    name: "Silver",
    label: "SILVER",
    accent: "#b8c4bf",
    accentText: "text-[#b8c4bf]",
    accentHover: "hover:text-[#b8c4bf]",
    border: "rgba(184,196,191,0.22)",
    background: "#030f0b",
    amount: "200,000+",
    slots: 4,
    slotHeight: "h-14",
    cta: "Enquire about Silver →",
  },
  {
    name: "Bronze",
    label: "BRONZE",
    accent: "#c98b5a",
    accentText: "text-[#c98b5a]",
    accentHover: "hover:text-[#c98b5a]",
    border: "rgba(201,139,90,0.28)",
    background: "#030f0b",
    amount: "100,000+",
    slots: 5,
    slotHeight: "h-12",
    cta: "Enquire about Bronze →",
  },
];

export const partnerWall = {
  kicker: "OUR PARTNERS",
};

export const enquireSection = {
  kicker: "PARTNER WITH US",
  title: "Support young innovators across Sri Lanka.",
  body: "Sponsorship and partnership enquiries are handled by the organising committee. Contact details will be published shortly.",
  sponsorAction: "Become a sponsor →",
  sponsorSubject: "BYTE%20QUEST%20Sponsorship%20Enquiry",
  partnerAction: "Become a partner",
  partnerSubject: "BYTE%20QUEST%20Partnership%20Enquiry",
};

export const partnerBenefits: PartnerBenefit[] = [
  {
    title: "Brand visibility",
    description: "Branding across programme materials by tier.",
  },
  {
    title: "Exhibition space",
    description: "Presence at the Grand Final Innovation Expo.",
  },
  {
    title: "Media visibility",
    description: "Recognition in programme communications.",
  },
  {
    title: "Mentorship",
    description: "Your experts can guide student teams.",
  },
  {
    title: "Industry engagement",
    description: "Meet emerging talent directly.",
  },
  {
    title: "Community impact",
    description: "Support youth development nationally.",
  },
];
