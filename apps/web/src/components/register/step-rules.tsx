import {
  COMPETITION_RULES_PDFS,
  confirmationCopy,
  RULES_LANGUAGES,
} from "./data";
import type { RulesLanguage } from "./data";
import { RulesPreview } from "./rules-preview";

interface StepRulesProps {
  language: RulesLanguage;
  onLanguageChange: (language: RulesLanguage) => void;
}

export const StepRules = ({ language, onLanguageChange }: StepRulesProps) => (
  <div>
    <fieldset className="mb-4 flex gap-2 border-0 p-0">
      <legend className="sr-only">Rules language</legend>
      {RULES_LANGUAGES.map((code) => (
        <button
          aria-pressed={language === code}
          className="cursor-pointer rounded-full border border-[rgba(185,245,208,0.2)] px-4 py-1.5 font-sans text-[14px] font-semibold aria-pressed:border-[var(--accent)] aria-pressed:text-[var(--accent)]"
          key={code}
          onClick={() => onLanguageChange(code)}
          type="button"
        >
          {COMPETITION_RULES_PDFS[code].label}
        </button>
      ))}
    </fieldset>
    <RulesPreview
      src={COMPETITION_RULES_PDFS[language].href}
      title="BYTE QUEST 2027 competition rules"
    />
    <a
      className="text-volt mt-3 inline-block text-[14px] font-semibold"
      download
      href={COMPETITION_RULES_PDFS[language].href}
    >
      {confirmationCopy.rulesLabel}
    </a>
  </div>
);
