export interface PartnerTier {
  name: string;
  label: string;
  accent: string;
  accentHover: string;
  border: string;
  background: string;
  amount: string;
  slots: number;
  slotHeight: string;
}

export interface PartnerBenefit {
  title: string;
  description: string;
}

export const partnerHero = {
  kicker: "PARTNERS & SPONSORS",
  title: "Power the next generation.",
  lead: "Five sponsorship tiers, each with branding, exhibition space, media visibility and participation opportunities.",
};

export const partnerTiers: PartnerTier[] = [
  {
    name: "Platinum",
    label: "PLATINUM",
    accent: "#E6F2EC",
    accentHover: "hover:text-[#E6F2EC]",
    border: "rgba(230,242,236,0.3)",
    background: "linear-gradient(160deg,#16231F,#030F0B)",
    amount: "800K / 500K",
    slots: 2,
    slotHeight: "72px",
  },
  {
    name: "Gold",
    label: "GOLD",
    accent: "#D4AF37",
    accentHover: "hover:text-gold",
    border: "rgba(212,175,55,0.38)",
    background: "linear-gradient(160deg,#1C190B,#030F0B)",
    amount: "400,000+",
    slots: 3,
    slotHeight: "64px",
  },
  {
    name: "Silver",
    label: "SILVER",
    accent: "#B8C4BF",
    accentHover: "hover:text-[#B8C4BF]",
    border: "rgba(184,196,191,0.22)",
    background: "#030F0B",
    amount: "300,000+",
    slots: 4,
    slotHeight: "56px",
  },
  {
    name: "Bronze",
    label: "BRONZE",
    accent: "#C98B5A",
    accentHover: "hover:text-[#C98B5A]",
    border: "rgba(201,139,90,0.28)",
    background: "#030F0B",
    amount: "200,000+",
    slots: 5,
    slotHeight: "48px",
  },
  {
    name: "Title",
    label: "TITLE",
    accent: "#F2F7F4",
    accentHover: "hover:text-[#F2F7F4]",
    border: "rgba(242,247,244,0.2)",
    background: "#030F0B",
    amount: "100,000+",
    slots: 6,
    slotHeight: "44px",
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
