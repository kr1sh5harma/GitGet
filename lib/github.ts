const BASE = 'https://api.github.com'

function headers() {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }
}

async function gh<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(),
    next: { revalidate: 1800 },
    ...options,
  })
  if (!res.ok) {
    const msg = res.status === 404 ? 'Not found' : res.status === 403 ? 'Rate limit exceeded — add a GITHUB_TOKEN to .env' : `GitHub API error ${res.status}`
    throw new Error(msg)
  }
  return res.json()
}

export type GHUser = {
  login: string; name: string | null; avatar_url: string; bio: string | null
  public_repos: number; followers: number; following: number
  location: string | null; blog: string | null; company: string | null
  html_url: string; created_at: string; twitter_username: string | null
}

export type GHRepo = {
  id: number; name: string; full_name: string; description: string | null
  html_url: string; homepage: string | null; language: string | null
  stargazers_count: number; forks_count: number; watchers_count: number
  open_issues_count: number; topics: string[]; fork: boolean; private: boolean
  archived: boolean; pushed_at: string; created_at: string; updated_at: string
  owner: { login: string; avatar_url: string }
  license: { name: string } | null; size: number
  default_branch: string; has_wiki: boolean; has_pages: boolean
}

export type GHCommit = {
  sha: string
  commit: {
    message: string
    author: { name: string; date: string; email: string }
  }
  author: { login: string; avatar_url: string } | null
  html_url: string
}

export type GHPR = {
  number: number; title: string; state: string; merged_at: string | null
  created_at: string; closed_at: string | null
  user: { login: string; avatar_url: string }
  html_url: string; body: string | null; draft: boolean
  comments: number; review_comments: number; commits: number
  additions: number; deletions: number; changed_files: number
  labels: { name: string; color: string }[]
}

export type GHContributor = {
  login: string; avatar_url: string; contributions: number; html_url: string
}

export type GHLanguages = Record<string, number>

export const getUser = (username: string) =>
  gh<GHUser>(`/users/${username}`)

export const getUserRepos = (username: string) =>
  gh<GHRepo[]>(`/users/${username}/repos?sort=updated&per_page=100`)

export const getRepo = (owner: string, repo: string) =>
  gh<GHRepo>(`/repos/${owner}/${repo}`)

export const getCommits = (owner: string, repo: string, per_page = 30) =>
  gh<GHCommit[]>(`/repos/${owner}/${repo}/commits?per_page=${per_page}`)

export const getPRs = (owner: string, repo: string) =>
  gh<GHPR[]>(`/repos/${owner}/${repo}/pulls?state=all&per_page=20`)

export const getLanguages = (owner: string, repo: string) =>
  gh<GHLanguages>(`/repos/${owner}/${repo}/languages`)

export const getContributors = (owner: string, repo: string) =>
  gh<GHContributor[]>(`/repos/${owner}/${repo}/contributors?per_page=10`)
