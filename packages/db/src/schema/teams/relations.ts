import { defineRelationsPart } from "drizzle-orm";

import { school } from "../schools/school";
import { joinRequest, team, teamMember } from "./team";

export const teamRelations = defineRelationsPart(
  { school, team, teamMember, joinRequest },
  (r) => ({
    team: {
      school: r.one.school({
        from: r.team.schoolId,
        to: r.school.id,
      }),
      // `many` relations derive their columns from the reverse `one`.
      members: r.many.teamMember(),
      joinRequests: r.many.joinRequest(),
    },
    teamMember: {
      team: r.one.team({
        from: r.teamMember.teamId,
        to: r.team.id,
      }),
    },
    joinRequest: {
      team: r.one.team({
        from: r.joinRequest.teamId,
        to: r.team.id,
      }),
    },
    school: {
      teams: r.many.team(),
    },
  })
);
