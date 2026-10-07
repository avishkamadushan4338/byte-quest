import { randomBytes, randomUUID, scrypt } from "node:crypto";
import { promisify } from "node:util";

import { eq } from "drizzle-orm";

import {
  createDb,
  account,
  school,
  submission,
  team,
  teamMember,
  user,
  userProfile,
} from "../src/index";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>;

/**
 * Replicates better-auth's scrypt password hash format (`salt:key` hex) so
 * seeded accounts can log in through Better-Auth without new dependencies.
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const key = await scryptAsync(password.normalize("NFKC"), salt, 64, {
    N: 16_384,
    r: 16,
    p: 1,
    maxmem: 128 * 16_384 * 16 * 2,
  });
  return `${salt}:${key.toString("hex")}`;
};

const db = await createDb();

const ensureUser = async (
  email: string,
  name: string,
  password: string
): Promise<string> => {
  const [existing] = await db.select().from(user).where(eq(user.email, email));
  if (existing) {
    return existing.id;
  }
  const [created] = await db
    .insert(user)
    .values({ id: randomUUID(), name, email })
    .returning();
  if (!created) {
    throw new Error(`Failed to create user ${email}`);
  }
  await db.insert(account).values({
    id: randomUUID(),
    accountId: created.id,
    providerId: "credential",
    userId: created.id,
    password: await hashPassword(password),
  });
  return created.id;
};

const ensureProfile = async (
  userId: string,
  data: {
    fullName: string;
    nationalId: string;
    birthday: string;
    grade: string;
    role: "admin" | "student";
  }
) => {
  const [existing] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId));
  if (existing) {
    return existing;
  }
  const [created] = await db
    .insert(userProfile)
    .values({ userId, ...data })
    .returning();
  if (!created) {
    throw new Error("Failed to create profile");
  }
  return created;
};

const ensureSchool = async (name: string, city: string): Promise<string> => {
  const [existing] = await db
    .select()
    .from(school)
    .where(eq(school.name, name));
  if (existing) {
    return existing.id;
  }
  const [created] = await db.insert(school).values({ name, city }).returning();
  if (!created) {
    throw new Error(`Failed to create school ${name}`);
  }
  return created.id;
};

const ensureTeam = async (
  name: string,
  division: "primary" | "secondary",
  schoolId: string
): Promise<string> => {
  const [existing] = await db.select().from(team).where(eq(team.name, name));
  if (existing) {
    return existing.id;
  }
  const [created] = await db
    .insert(team)
    .values({ name, division, schoolId })
    .returning();
  if (!created) {
    throw new Error(`Failed to create team ${name}`);
  }
  return created.id;
};

const ensureSubmission = async (data: {
  teamId: string;
  title: string;
  description: string;
  status: "draft" | "submitted";
  schoolId: string | null;
}) => {
  const [existing] = await db
    .select()
    .from(submission)
    .where(eq(submission.teamId, data.teamId));
  if (existing) {
    return existing;
  }
  const [created] = await db
    .insert(submission)
    .values({
      teamId: data.teamId,
      title: data.title,
      description: data.description,
      status: data.status,
      schoolId: data.schoolId,
      forwardedAt: data.status === "submitted" ? new Date() : null,
    })
    .returning();
  if (!created) {
    throw new Error("Failed to create submission");
  }
  return created;
};

type SeedProfile = Awaited<ReturnType<typeof ensureProfile>>;

const ensureTeamMember = async (values: {
  teamId: string;
  userId: string;
  teamRole: "leader" | "developer";
  specialty: SeedProfile["specialty"];
  grade: string;
  fullName: string;
  nationalId: string;
  birthday: string;
}) => {
  const [existing] = await db
    .select()
    .from(teamMember)
    .where(eq(teamMember.userId, values.userId));
  if (existing) {
    return existing;
  }
  const [created] = await db.insert(teamMember).values(values).returning();
  if (!created) {
    throw new Error("Failed to create team member");
  }
  return created;
};

interface SeedStudent {
  email: string;
  name: string;
  grade: string;
  birthday: string;
  nationalId: string;
}

const STUDENTS: SeedStudent[] = [
  {
    email: "leader1@hack.local",
    name: "Ada Lead",
    grade: "8",
    birthday: "2011-03-14",
    nationalId: "STU-1001",
  },
  {
    email: "member1@hack.local",
    name: "Bo Dev",
    grade: "7",
    birthday: "2012-06-02",
    nationalId: "STU-1002",
  },
  {
    email: "member2@hack.local",
    name: "Cy Dev",
    grade: "9",
    birthday: "2010-11-21",
    nationalId: "STU-1003",
  },
  {
    email: "member3@hack.local",
    name: "Dee Dev",
    grade: "8",
    birthday: "2011-01-30",
    nationalId: "STU-1004",
  },
  {
    email: "leader2@hack.local",
    name: "Eli Lead",
    grade: "12",
    birthday: "2007-09-09",
    nationalId: "STU-2001",
  },
  {
    email: "member4@hack.local",
    name: "Fay Dev",
    grade: "10",
    birthday: "2009-04-17",
    nationalId: "STU-2002",
  },
  {
    email: "member5@hack.local",
    name: "Gus Dev",
    grade: "11",
    birthday: "2008-12-05",
    nationalId: "STU-2003",
  },
  {
    email: "member6@hack.local",
    name: "Hal Dev",
    grade: "10",
    birthday: "2009-07-23",
    nationalId: "STU-2004",
  },
];

const main = async () => {
  console.log("Seeding database...");

  // --- Admin (role-based access control) ---
  const adminUserId = await ensureUser(
    "admin@hack.local",
    "Hack Admin",
    "admin1234"
  );
  await ensureProfile(adminUserId, {
    fullName: "Hack Admin",
    nationalId: "ADM-0001",
    birthday: "1990-01-01",
    grade: "13",
    role: "admin",
  });
  console.log("✓ admin@hack.local / admin1234 (admin)");

  // --- Students ---
  const seededStudents = await Promise.all(
    STUDENTS.map(async (student) => {
      const userId = await ensureUser(
        student.email,
        student.name,
        "student1234"
      );
      const profile = await ensureProfile(userId, {
        fullName: student.name,
        nationalId: student.nationalId,
        birthday: student.birthday,
        grade: student.grade,
        role: "student",
      });
      return { email: student.email, userId, profile };
    })
  );
  console.log(`✓ ${STUDENTS.length} students / student1234`);

  const profileByEmail = new Map(
    seededStudents.map((seeded) => [seeded.email, seeded.profile])
  );

  const profileFor = (email: string): SeedProfile => {
    const profile = profileByEmail.get(email);
    if (!profile) {
      throw new Error(`No seeded profile for ${email}`);
    }
    return profile;
  };

  // --- Schools ---
  const schoolId0 = await ensureSchool(
    "Atatürk Anatolian High School",
    "Ankara"
  );
  const schoolId1 = await ensureSchool("Bilge Science High School", "İstanbul");
  await ensureSchool("Çınar Private High School", "İzmir");
  console.log("✓ 3 schools");

  // --- Teams + memberships (identification snapshot copied from profile) ---
  const teamSpecs = [
    {
      name: "Byte Sharks",
      division: "primary" as const,
      schoolId: schoolId0,
      leaderEmail: "leader1@hack.local",
      members: [
        { email: "member1@hack.local", specialty: "ui" as const },
        { email: "member2@hack.local", specialty: "architecture" as const },
        { email: "member3@hack.local", specialty: "business" as const },
      ],
    },
    {
      name: "Quantum Foxes",
      division: "secondary" as const,
      schoolId: schoolId1,
      leaderEmail: "leader2@hack.local",
      members: [
        { email: "member4@hack.local", specialty: "ui" as const },
        { email: "member5@hack.local", specialty: "architecture" as const },
        { email: "member6@hack.local", specialty: "business" as const },
      ],
    },
  ];

  const teamIds = await Promise.all(
    teamSpecs.map(async (spec) => {
      const teamId = await ensureTeam(spec.name, spec.division, spec.schoolId);

      const leader = profileFor(spec.leaderEmail);
      await ensureTeamMember({
        teamId,
        userId: leader.userId,
        teamRole: "leader",
        specialty: null,
        grade: leader.grade,
        fullName: leader.fullName,
        nationalId: leader.nationalId,
        birthday: leader.birthday,
      });

      await Promise.all(
        spec.members.map(async (member) => {
          const profile = profileFor(member.email);
          await ensureTeamMember({
            teamId,
            userId: profile.userId,
            teamRole: "developer",
            specialty: member.specialty,
            grade: profile.grade,
            fullName: profile.fullName,
            nationalId: profile.nationalId,
            birthday: profile.birthday,
          });
        })
      );

      console.log(`✓ team ${spec.name} (${spec.division}) with 4 members`);
      return teamId;
    })
  );

  const [primaryTeamId, secondaryTeamId] = teamIds;
  if (!(primaryTeamId && secondaryTeamId)) {
    throw new Error("Expected two seeded teams");
  }

  // --- Submissions ---
  await ensureSubmission({
    teamId: primaryTeamId,
    title: "RecycleQuest",
    description: "A gamified recycling tracker for primary schools.",
    status: "draft",
    schoolId: null,
  });
  await ensureSubmission({
    teamId: secondaryTeamId,
    title: "CampusPulse",
    description: "Real-time school club discovery and event platform.",
    status: "submitted",
    schoolId: schoolId1,
  });
  console.log("✓ 2 submissions (1 draft, 1 submitted)");

  console.log("Done.");
};

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
