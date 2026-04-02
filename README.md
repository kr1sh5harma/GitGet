# RepoLens — GitHub Profile Analyzer

A clean, insightful GitHub profile analyzer built with **Next.js 14**, **Tailwind CSS**, and the **GitHub REST API**.

## Features

- 🚀 **Animated starfield** on the home page
- 🧠 **Developer archetype detection** (Frontend, Backend, Systems, Data, Mobile, Polyglot…)
- 📊 **Language breakdown** with visual bars across all repos
- ⚡ **Activity scoring** — Hyper Active → Dormant
- 💡 **Commit rhythm & style analysis** per repo
- 🏥 **Repository health scores** with checklists
- 📈 **Commit activity heatmap** (12 weeks)
- 🤝 **Collaboration score** based on PRs, forks, contributors
- 📄 **Separate page for every repo** with 4 tabs: Overview, Commits, PRs, Contributors
- 🔀 **Full breadcrumb navigation** + compact search in navbar
- 🌙 **Pure dark Notion-inspired UI** — black, gray, clean

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional but recommended) Add GitHub token to avoid rate limits
cp .env.example .env.local
# Edit .env.local and add your token from https://github.com/settings/tokens
# No scopes needed — public repos only

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter any GitHub username.

## Project Structure

```
repolens/
├── app/
│   ├── page.tsx                  # Home page (starfield + search)
│   ├── layout.tsx                # Root layout with fonts
│   ├── not-found.tsx             # 404 page
│   ├── error.tsx                 # Error boundary
│   ├── [username]/
│   │   ├── page.tsx              # User profile + repos grid
│   │   ├── loading.tsx           # Loading skeleton
│   │   └── [repo]/
│   │       ├── page.tsx          # Repo detail page
│   │       └── loading.tsx       # Loading skeleton
├── components/
│   ├── Navbar.tsx                # Fixed nav with breadcrumbs
│   ├── StarField.tsx             # Animated canvas starfield
│   ├── SearchBar.tsx             # Search input (hero + compact)
│   ├── RepoCard.tsx              # Repo card for the grid
│   └── RepoTabs.tsx              # Tabbed repo detail (Overview/Commits/PRs/Contributors)
├── lib/
│   ├── github.ts                 # GitHub API functions (server-side)
│   └── utils.ts                  # Insight engine + helpers
```

## Rate Limits

| Mode | Limit |
|------|-------|
| No token | 60 requests / hour |
| With `GITHUB_TOKEN` | 5,000 requests / hour |

Generate a token at [github.com/settings/tokens](https://github.com/settings/tokens) — no scopes needed.

## Deploy to Vercel

```bash
npx vercel
```

Add `GITHUB_TOKEN` as an environment variable in the Vercel dashboard.
