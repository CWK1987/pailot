# pailot

AI-powered study companion for South African students. Summarizes notes, builds quizzes,
flashcards and exams, includes an AI Tutor chat, supports English/Afrikaans/isiZulu/isiXhosa,
has real sign-up/login accounts, a live leaderboard, profile pictures, and an admin screen
for uploading past papers, study guides, and videos.

## What's new in this version

- **Real accounts**: sign up, log in, forgot password — powered by Supabase
- **Real leaderboard**: pulls actual signed-up learners, ranked by XP
- **Profile pictures + bio**: stored in Supabase Storage
- **Admin resource uploads**: anyone marked as admin can upload PDFs/videos and tag them by
  grade, subject, and plan tier — directly from the website, no coding needed
- **New colors**: dark navy (#0d173b) + olive green (#84ac64)
- **Spotlight reveal effect**: a glowing, cursor/touch-following highlight on dark sections

## What's new in this update (branding + smarter uploads)

- **Renamed to pailot**, with the new logo (graduation-cap paper plane) used everywhere:
  browser tab icon, home screen icon, top nav, login screen, loading screens.
- **Background is now plain white** (with a very light neutral-grey canvas behind white
  cards for contrast) — the old cream tone is gone everywhere.
- **Multi-photo capture**: tapping "Take a photo" now lets you keep adding photos ("Take
  another photo") before continuing, instead of processing after every single shot.
- **All file types for upload**: PDF, Word (.doc/.docx), and plain text/CSV/Markdown files
  are now accepted, not just images. Word docs are read with the `mammoth` library; PDFs are
  sent to Claude directly (Claude reads PDFs natively); large photos are automatically
  resized/compressed in the browser first.
- **"What would you like to do first?" screen**: after any input (photos, files, typed
  notes, or voice), pailot now reads/transcribes the material and then asks whether to
  generate a Summary, Flashcards, a Quiz, or a Practice Exam — it no longer jumps straight
  to summarizing. Whichever you pick generates immediately; the other three are still one
  tap away from the material's tab bar afterwards.

### A known platform limit worth knowing about
Vercel serverless functions (which is what `/api/claude.js` runs as) reject any request
body over **4.5MB** — this is a hard Vercel platform limit, not something this code can
raise. To stay safely under that:
- Photos are automatically downscaled/recompressed in the browser before upload.
- The app tracks the combined size of everything queued in a batch and will politely
  refuse to add more once it's close to the limit, asking for a smaller file or fewer
  photos at once instead.
- In practice this comfortably covers "photos of a few pages of notes" or "one exam-paper
  PDF" per material. Extremely long PDFs (30+ scanned pages) may need to be split into two
  uploads.

## Project structure

```
pailot/
├── api/
│   └── claude.js          ← serverless function, holds your Anthropic key, talks to Claude
├── public/
│   ├── logo-horizontal.png       ← main logo, navy/green, for light backgrounds
│   ├── logo-horizontal-light.png ← white/green logo, for dark (navy) backgrounds
│   ├── icon.png / icon-light.png ← the graduation-cap mark on its own (no wordmark)
│   ├── favicon-*.png, apple-touch-icon.png, icon-maskable-512.png ← app icons
│   └── manifest.json             ← lets people "Add to Home Screen" as an app
├── src/
│   ├── App.jsx              ← the entire app (UI, logic, i18n, auth, admin upload)
│   ├── supabaseClient.js    ← connects the app to your Supabase project
│   └── main.jsx              ← React entry point
├── supabase-setup.sql       ← run this ONCE in Supabase to create tables/storage/security
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
└── .gitignore
```

## Setup overview — three services, all free to start

| Service | What it's for |
|---|---|
| **Vercel** | Hosts the website, runs the AI proxy function |
| **Anthropic** | Powers the AI summarizing, quizzes, and tutor chat |
| **Supabase** | Stores accounts, passwords, leaderboard, profile pictures, resource files |

## Step-by-step setup

### 1. Create your Supabase project
1. Go to **supabase.com** → sign up → "New project"
2. Pick a name (e.g. `pailot`), a database password (save it somewhere), and a region close to South Africa (e.g. Frankfurt or London)
3. Wait about 2 minutes for it to finish setting up

### 2. Run the database setup script
1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `supabase-setup.sql` from this project, copy the entire contents, paste into the editor
4. Click **Run**

This creates everything: the accounts table, the resources table, storage for files and
profile pictures, and all the security rules. You only do this once.

### 3. Get your Supabase API keys
1. In Supabase, go to **Project Settings → API**
2. Copy the **Project URL** and the **anon public key** — you'll need both shortly

### 4. Get your Anthropic API key
1. Go to **console.anthropic.com** → sign up → add billing → create an API key

### 5. Run locally to test (optional but recommended)
```bash
npm install
cp .env.example .env.local
```
Open `.env.local` and paste in your real Anthropic key and Supabase URL/key, then:
```bash
npm install -g vercel
vercel dev
```
Visit `http://localhost:3000` — sign up, pick a language, try uploading notes.

### 6. Push to GitHub
```bash
git init
git add .
git commit -m "pailot with accounts, leaderboard, and admin uploads"
```
Create an empty repo on **github.com**, then:
```bash
git remote add origin https://github.com/yourusername/pailot.git
git push -u origin main
```

### 7. Deploy on Vercel
1. **vercel.com** → sign up with GitHub → "Add New Project" → select your repo → Deploy
2. Go to **Settings → Environment Variables** and add all three:
   - `ANTHROPIC_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Go to **Deployments → "..." → Redeploy** so the new variables take effect

### 8. Make yourself an admin
1. Open your live website, sign up with your real email
2. Go back to Supabase → **SQL Editor** → New query → run:
   ```sql
   update public.profiles set is_admin = true where email = 'your-email@example.com';
   ```
3. Refresh your website — you'll now see an "Upload resource" button on the Resources tab

### 9. Add your own domain (optional)
Buy a domain (domains.co.za, Namecheap), then in Vercel: **Settings → Domains → add it** →
follow the DNS instructions shown (usually 1-2 records, live within a few hours).

## Uploading resources (past papers, guides, videos)

Once you're an admin:
1. Go to the **Resources** tab on the live website
2. Click **"+ Upload resource"**
3. Fill in the title, type (paper/guide/notes/video), subject, grade, and who can access it
   (Free / Advanced+ / Premium only)
4. Choose your file and click Upload

That's it — it appears immediately for everyone with the right plan tier, sectioned exactly
as you set it. No coding, no Supabase dashboard needed for this day-to-day task.

## Security notes

- Never put your Anthropic API key inside `/src` — it would ship to every visitor's browser
- The Supabase URL and anon key ARE safe to expose in frontend code — that's how Supabase is
  designed; real protection comes from the security rules in `supabase-setup.sql`
- Passwords are never stored or handled by this code directly — Supabase's auth system
  manages that securely

## Payments

The R99/R149 checkout flow is fully designed but still simulated — no real money moves yet.
To accept real payments, integrate PayFast or Yoco's SDK into the `UpgradeModal` component.
