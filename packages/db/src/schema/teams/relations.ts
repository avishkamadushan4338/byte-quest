import { relations } from "drizzle-orm";

import { school } from "../schools/school";
import { joinRequest, team, teamMember } from "./team";

export const teamRelations = relations(team, ({ one, many }) => ({
  school: one(school, {
    fields: [team.schoolId],
    references: [school.id],
  }),
  members: many(teamMember),
  joinRequests: many(joinRequest),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
}));

export const joinRequestRelations = relations(joinRequest, ({ one }) => ({
  team: one(team, {
    fields: [joinRequest.teamId],
    references: [team.id],
  }),
}));
