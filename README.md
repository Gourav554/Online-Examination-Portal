# Online Examination Portal

## Phase 1: Authentication

### Setup

**Database**
1. Run `server/database/schema.sql` in MySQL to create the database and tables.

**Backend**
```
cd server
copy .env.example .env   # then fill in your MySQL credentials and a JWT secret
npm install
npm run dev               # http://localhost:5000
npm run seed:admin        # creates the first admin account (see Phase 6)
```

**Frontend**
```
cd client
npm install
npm run dev               # http://localhost:5173
```

### API Endpoints

**Auth**
| Method | Endpoint                  | Description                    | Auth |
|--------|----------------------------|---------------------------------|------|
| POST   | /api/auth/register         | Register as student or teacher | No   |
| POST   | /api/auth/login             | Login (email, password, role)  | No   |
| POST   | /api/auth/forgot-password   | Request a password reset link  | No   |
| GET    | /api/auth/me                | Get the logged-in user         | Yes  |
| POST   | /api/auth/logout            | Logout                         | No   |

## Phase 2: Teacher Module

**Exams** (teacher only)
| Method | Endpoint                    | Description               |
|--------|-------------------------------|----------------------------|
| POST   | /api/exams                    | Create exam (draft)       |
| GET    | /api/exams                    | List my exams             |
| GET    | /api/exams/:id                | Exam details + questions  |
| PUT    | /api/exams/:id                | Update exam                |
| DELETE | /api/exams/:id                | Delete exam                |
| PATCH  | /api/exams/:id/publish         | Publish/unpublish exam    |
| POST   | /api/exams/:examId/questions   | Add question to exam      |

**Questions** (teacher only)
| Method | Endpoint             | Description     |
|--------|------------------------|------------------|
| PUT    | /api/questions/:id     | Edit question   |
| DELETE | /api/questions/:id     | Delete question |

## Phase 3: Student Module

**Exams** (student only)
| Method | Endpoint                  | Description                                  |
|--------|-----------------------------|------------------------------------------------|
| GET    | /api/student/exams          | List published exams + my attempt status      |
| GET    | /api/student/exams/:id      | Exam details (meta only, no questions)         |
| POST   | /api/student/exams/:id/start | Start or resume an attempt (returns questions) |

**Submissions** (student only)
| Method | Endpoint                              | Description                     |
|--------|------------------------------------------|-----------------------------------|
| POST   | /api/student/submissions/:id/answers     | Save one answer                 |
| POST   | /api/student/submissions/:id/submit      | Submit (or auto-submit) the exam |

## Phase 4: Result Module & Certificates

Results are generated automatically the moment a submission is graded (Phase 3's
`submissionService.gradeSubmission`) — no separate manual step is required.

**Results** (student, unless noted)
| Method | Endpoint                        | Description                                         |
|--------|-------------------------------------|--------------------------------------------------------|
| GET    | /api/results                        | Previous results (my exam history)                     |
| GET    | /api/results/performance            | Aggregate performance report                            |
| POST   | /api/results/:submissionId/generate | Idempotent fallback to (re)generate a result            |
| GET    | /api/results/:submissionId          | Result details + per-question breakdown (student owner or the exam's teacher) |

**Teacher analytics**
| Method | Endpoint                  | Description                                  |
|--------|------------------------------|--------------------------------------------------|
| GET    | /api/exams/:id/results        | Statistics + individual student results for one exam (teacher, owns exam) |
| GET    | /api/teacher/analytics        | Summary stats across all of the teacher's exams   |

**Certificates** (student only)
| Method | Endpoint                              | Description                                  |
|--------|------------------------------------------|--------------------------------------------------|
| GET    | /api/certificates                        | List my certificate-eligible (passed) results, with certificate code/issue date once generated |
| GET    | /api/certificates/:submissionId/download | Generates (if needed) and downloads a PDF certificate with an embedded QR code — only available for a passed exam |

Exams are free to start — `POST /api/student/exams/:id/start` begins an attempt immediately
for any published exam, no payment step involved.

## Phase 5: Email

**Emails** — sent via `services/emailService.js` (Nodemailer). Configure `EMAIL_HOST`,
`EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` in `server/.env`. Without SMTP
configured, emails are skipped and logged to the console instead of failing the request
that triggered them (registration, submission, etc. still succeed).

| Email                     | Triggered by                                      |
|---------------------------|-----------------------------------------------------|
| Registration Email        | `POST /api/auth/register`                            |
| Password Reset Email      | `POST /api/auth/forgot-password`                      |
| Exam Confirmation Email   | First `POST /api/student/exams/:id/start` (new attempt) |
| Result Email              | Grading completion (`submissionService.gradeSubmission`) |

## Phase 6: Admin Module

Admins aren't self-registered (same reasoning as Phase 1). Create the first one with:
```
cd server
npm run seed:admin   # admin@examportal.com / Admin@123 by default — override via
                      # ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env
```
Then log in on the normal Login page with the **Admin** role tab selected.

**Admin** (admin only) — no new tables; built entirely on existing data.
| Method | Endpoint                       | Description                                  |
|--------|-----------------------------------|--------------------------------------------------|
| GET    | /api/admin/statistics              | Total students, teachers, exams                  |
| GET    | /api/admin/ongoing-exams           | Exams currently in progress, platform-wide       |
| GET    | /api/admin/students                | List all students                                |
| DELETE | /api/admin/students/:id            | Remove a student                                 |
| GET    | /api/admin/teachers                | List all teachers                                |
| DELETE | /api/admin/teachers/:id            | Remove a teacher                                 |
| GET    | /api/admin/exams                   | List every exam (all teachers)                   |
| DELETE | /api/admin/exams/:id               | Remove an exam                                   |
| PATCH  | /api/admin/exams/:id/unpublish     | Force an exam back to draft                      |
| GET    | /api/admin/certificates            | All issued certificates, platform-wide           |

### Notes on this final phase
- Fixed a real bug: `config/db.js` never set a MySQL `port`, silently defaulting to
  3306. Added `DB_PORT` (see `.env.example`).
- Added a global toast notification system (`context/ToastContext.jsx`), wired into
  admin actions and the most important existing flows (exam publish/delete, question
  add/edit/delete, exam submission).
- Consolidated duplicated CSS (`page-header`, `stat-cards`, `exam-table`, `badge*`,
  `empty-state`, `btn-secondary`, `link-btn`) from the Teacher/Student stylesheets into
  the shared `index.css`, and merged `TeacherLayout` + a would-be `AdminLayout` into one
  generic `DashboardLayout`.
- Removed the unused Phase 1 placeholder `pages/Dashboard.jsx` and its `/dashboard`
  route now that every role has a real dashboard.
