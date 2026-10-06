import type { Division, RegisterState } from "./data";

const STORAGE_KEY = "byte-quest:register-draft:v1";

export interface RegisterDraft {
  state: RegisterState;
  step: number;
  maxStep: number;
  submitted: boolean;
  references: Partial<Record<Division, string>>;
  editTokens: Partial<Record<Division, string>>;
}

/**
 * The wizard has no accounts, so progress only survives a refresh if it's
 * saved to the browser itself. This also carries each submitted division's
 * edit token, which is what lets the MIC/principal come back and revise
 * their registration before the closing date.
 */
export const loadDraft = (): RegisterDraft | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<RegisterDraft>;
    if (!parsed || typeof parsed !== "object" || !parsed.state) {
      return null;
    }
    return parsed as RegisterDraft;
  } catch {
    return null;
  }
};

export const saveDraft = (draft: RegisterDraft): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage can be unavailable (private browsing, quota); losing the
    // draft is non-fatal, so fail silently rather than crash the form.
  }
};

export const clearDraft = (): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Same as above.
  }
};
