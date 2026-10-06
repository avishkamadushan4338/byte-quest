/**
 * Shared account-provisioning helpers for every admin-issued login (admin
 * applications, team captains, volunteers): a memorable one-time password
 * and a URL/username-safe slug seeded from a person's name. Not
 * cryptographically unguessable — these are shown once to an admin to relay
 * by hand, not emailed, so a short memorable password beats a long opaque
 * one for this handoff.
 */

const PASSWORD_WORDS = [
  "anchor",
  "beacon",
  "circuit",
  "delta",
  "ember",
  "falcon",
  "granite",
  "harbor",
  "ion",
  "juniper",
  "kernel",
  "lumen",
  "meadow",
  "nimbus",
  "orbit",
  "prism",
  "quartz",
  "ripple",
  "summit",
  "tidal",
  "umbra",
  "vector",
  "willow",
  "xenon",
  "yield",
  "zephyr",
];

const randomWord = () =>
  PASSWORD_WORDS[Math.floor(Math.random() * PASSWORD_WORDS.length)];

export const generatePassword = (): string =>
  `${randomWord()}-${randomWord()}-${Math.floor(1000 + Math.random() * 9000)}`;

const MAX_USERNAME_LENGTH = 32;
const MIN_SLUG_LENGTH = 3;

/**
 * Slugifies `base` (lowercase, hyphens, letters/digits only) and appends a
 * random 4-digit suffix so repeated names don't collide. Truncates the slug
 * portion to stay within better-auth's 32-character username limit.
 */
export const generateUsername = (base: string): string => {
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  const slug =
    base
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/gu, "-")
      .replaceAll(/^-+|-+$/gu, "")
      .slice(0, MAX_USERNAME_LENGTH - suffix.length - 1) || "user";
  const normalized =
    slug.length >= MIN_SLUG_LENGTH ? slug : `${slug}-user`.slice(0, 20);
  return `${normalized}-${suffix}`;
};
