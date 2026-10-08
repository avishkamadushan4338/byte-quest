import { BecomeMentor } from "./become-mentor";
import { Directory } from "./directory";
import { MentorsHero } from "./hero";

export const Mentors = () => (
  <main className="bg-ink">
    <MentorsHero />
    <Directory />
    <BecomeMentor />
  </main>
);
