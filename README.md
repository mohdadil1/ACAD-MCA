# ACAD-MCA

ACAD MCA provides all the essential study materials and placement resources for MCA students. Get organized, up-to-date resources all in one place to enhance your academic and placement journey.

**Live site:** https://acad-mca-h5ut.vercel.app

## Features

- **Courses** — semester-wise class notes and teacher-uploaded slides, organized by course → year → semester → subject
- **Coding Sheet** — curated interview coding questions by topic, with difficulty and practice links
- **Playground** — write and run C, C++, Java, Python or JavaScript right in the browser
- **Blogs** — study tips, placement guidance, and platform updates
- **Placement** — interview experiences and placement resources (coming soon)
- Student sign-in via email/password, Google OAuth, or phone number (SMS OTP)
- A separate **Teacher Portal** for managing courses, subjects, and slides

## Teacher access

Teachers get a separate signed-in portal for creating courses/subjects and uploading slides.

- Sign in: https://acad-mca-h5ut.vercel.app/teacher/signin
- Sign up: https://acad-mca-h5ut.vercel.app/teacher/signup

Teacher signup is invite-gated: enter your email, click **Send Code**, and a 6-digit invite code is emailed to that address (valid for 15 minutes, single-use). Enter it along with your name and password to finish creating the account.

## Tech stack

- **Frontend:** React 18 + Vite, Tailwind CSS, react-router-dom
- **Backend:** Node.js + Express, Mongoose (MongoDB), express-session
- **Auth:** JWT + server-side sessions, Google OAuth, Twilio Verify (phone OTP), Nodemailer (email OTP/invite codes)
- **Other integrations:** Cloudinary (slide uploads)
- **Playground execution:** `exec-service/` — a standalone WebSocket service that compiles/runs submitted code as a real child process and streams stdin/stdout live, for true interactive input (see `exec-service/README` section below)
- **Hosting:** Vercel (frontend + main backend), Render (exec-service), MongoDB Atlas

## Local development

### Backend

```bash
cd back-end
npm install
cp .env.example .env   # fill in the values below
npm start               # nodemon index.js, defaults to port 3000
```

Required `.env` values:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | express-session cookie signing secret |
| `SECRET_KEY` | JWT signing secret |
| `FRONT_END` | Frontend origin, for CORS |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail address + App Password, used to send OTP/invite-code emails |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Google OAuth sign-in |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Slide file uploads |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_VERIFY_SERVICE_SID` | Phone number sign-up (SMS OTP) |

> On Windows, if `mongoose.connect()` hangs on a `mongodb+srv://` URI locally, your machine's DNS resolver may not support the SRV/TXT lookup it needs — `back-end/index.js` already points Node's resolver at `8.8.8.8`/`1.1.1.1` outside of `NODE_ENV=production` to work around this.

### exec-service (Playground code execution)

A separate, always-on WebSocket service — can't run on Vercel serverless since it needs long-lived connections and real child processes. Deployed as its own Render Web Service using its own Dockerfile (installs gcc/g++, OpenJDK, Python 3).

```bash
cd exec-service
npm install
cp .env.example .env   # SECRET_KEY must match the main backend's
npm start               # defaults to port 3001
```

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Same JWT signing secret as the main backend — verifies the token passed on the WebSocket handshake |
| `FRONT_END` | Frontend origin, checked against the WebSocket handshake's `Origin` header |

Runs each submission as a real, resource-limited child process (timeout, memory ceiling, output cap, no inherited secrets) rather than a per-run container — Render's standard web services don't expose a Docker daemon for nested containers. Adequate for a student-project trust level, not a hardened sandbox against a deliberately malicious user.

### Frontend

```bash
cd front-end
npm install
npm run dev   # Vite dev server
```

Set `VITE_API_URL` (e.g. in `front-end/.env`) to your backend URL, such as `http://localhost:3000`, and `VITE_EXEC_API_URL` to the exec-service's WebSocket URL, such as `ws://localhost:3001`.

## Project structure

```
back-end/
  controller/   # route handlers (courses, subjects, slides, blogs, teacher/user auth, playground)
  modals/       # Mongoose schemas
  scripts/      # one-off data migration/seed scripts
  index.js      # Express app + route registration
front-end/
  src/Components/  # page and UI components, organized by feature
  src/App.jsx      # route definitions
```
