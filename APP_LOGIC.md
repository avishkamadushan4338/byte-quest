# BYTE QUEST — Application Logic & System Architecture

This document describes the core architecture, data flows, operational rules, and access control patterns across the Byte Quest platform.

---

## 1. Volunteer Lifecycle & Access Flow

### 1.1 Application Submission (`/volunteers`)

1. **Public Intake**:
   - Students select one or more volunteer teams (Content Creator, Video Editor, Presenters, Media Crew, Design Team, Logistics, Showcase Team).
   - Student details collected: Full Name, Admission Number, Grade, Class, Contact Number, and optional Email.
   - **School Field**: By default pinned to `St. Aloysius' College, Galle` for student volunteers (no public school selector needed).
   - Guardian details collected: Full Name, Relationship, Contact Number, and Alternate Contact.
   - Consent confirmation and photo upload.
2. **Immediate Submission State (`SuccessPanel`)**:
   - **No active badge or ID card** is rendered at submission time.
   - The user receives an Application Reference Number (`BQV-...`).
   - Status clearly shows **"Pending Review"** (`status: pending`).
   - Explains that the organizing committee must review and approve the application before official volunteer status and ID card access are granted.

### 1.2 Administrative Review & Approval (`/admin/volunteers`)

1. **Coordinator Review**:
   - Admin/Coordinators inspect pending submissions in the Admin Volunteers table.
   - Can approve with notes or reject submissions.
2. **Account Provisioning on Approval**:
   - When an application is approved (`volunteers.review` with `decision: "approved"`):
     - Better-Auth creates a user account (`signUpEmail`) with a generated unique username (`@<firstname>.<suffix>`) and secure one-time password.
     - Email is provisioned as `<username>@volunteers.bytequest.lk`.
     - A `userProfile` is linked with role `"volunteer"` and National ID `VOL-<id>`.
     - Application status updates to `"approved"`, linking `userId`.
     - The admin receives the temporary credentials to share with the volunteer.

### 1.3 Volunteer Portal & ID Card Access (`/volunteer-portal`)

1. **Authenticated Access Only**:
   - Volunteers sign in via `/auth/login`.
   - The `/volunteer-portal` route calls `volunteers.mine`.
2. **Gating Rule**:
   - Only records where `status === "approved"` and linked to the authenticated user's ID are returned.
   - If not approved or pending: Access to the official ID card is withheld, displaying an informative pending notice.
   - If approved: Displays the full interactive **BYTE QUEST Volunteer ID Card** with reference barcode, school insignia, grade/class details, and download capability.

---

## 2. User & Access Management (`/admin/users`)

### 2.1 User Roles

- **admin**: Full system access (admin dashboard, schools, events, applications, user provisioning, rotation).
- **coordinator / mentor**: Operational and team review access.
- **volunteer**: Volunteer portal and personal ID card access.
- **student**: Standard participant registration and submission access.

### 2.2 Admin User Provisioning (`access.createUser`)

- Admins can provision new team/admin accounts directly from the Admin Users panel without requiring self-registration.
- System automatically generates a sanitized username handle and random 14-character secure temporary password.
- Assigns initial role (`admin`, `coordinator`, `mentor`, `volunteer`, or `student`).
- Returns username, email, and password to the administrator in a modal with one-click copy functionality.

### 2.3 Password Security & Rotation Rules

- **Admin Password Rotation Protection**: Direct unprompted rotation of root admin passwords is protected. When credentials rotate, new generated passwords are displayed in a secured dialog allowing copy before closing.

---

## 3. Schools Catalog & Combobox (`/admin/schools`)

1. **Dataset Backing**:
   - Backed by Sri Lanka national schools dataset (`apps/web/src/data/schools.csv`) via `school-catalog.ts`.
2. **Searchable Combobox**:
   - Fast, fuzzy search filtering across thousands of Sri Lankan schools by name and province/district.
   - Allows instant selection of school name and automatically populates the city/district when matched.
   - Supports free-text custom entry if an unlisted or international school is entered.

---

## 4. Public Registration & Participation Flow (`/register`)

1. **Sector & Division Selection**:
   - Junior, Senior, and Open divisions.
   - Dynamic registration wizard supporting individual and team submissions.
2. **Registration Controls**:
   - Can be toggled open/closed via admin configuration or designated launch phases.
   - Clear banner and guidance directs applicants to volunteer or showcase tracks when competitor registrations are closed.

---

## 5. UI, Motion & Server-Side Rendering (SSR)

1. **Loading Suspense**:
   - Page transitions and async data fetching use TanStack Router `PendingComponent` with the unified `LoadingScreen` spinner component.
2. **SSR Consistency**:
   - Core subpages (`/mentors`, `/programme`, `/projects`, etc.) render clean SSR placeholder headers / skeletons preventing layout shifts before dynamic content hydrates.
3. **Scrollbar & Layout Polishing**:
   - Fixed dual-scrollbar issues by ensuring only the top-level viewport (`html, body`) controls primary scroll, removing nested `overflow-y-scroll` on child containers.
