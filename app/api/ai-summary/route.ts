import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      )
    }

    const profileData = await req.json()

    const systemPrompt = `You are a senior developer analyst who writes insightful, witty, and professional GitHub profile reviews. You analyze developer profiles based on their GitHub data and produce a structured personality assessment.

Your tone is: thoughtful, slightly playful, technically credible, and encouraging. Think "senior engineer giving a thorough but kind code review of someone's career." Never be harsh or discouraging — frame weaknesses as growth opportunities.

You MUST respond with valid JSON only. No markdown, no code fences, no explanation outside the JSON.`

    const userPrompt = `Analyze this GitHub developer profile and return a structured JSON assessment.

PROFILE DATA:
- Username: ${profileData.username}
- Name: ${profileData.name || profileData.username}
- Bio: ${profileData.bio || 'Not provided'}
- Location: ${profileData.location || 'Unknown'}
- Company: ${profileData.company || 'Independent'}
- GitHub since: ${profileData.joinYear}
- Years on GitHub: ${profileData.yearsOnGH}
- Public repos: ${profileData.publicRepos}
- Followers: ${profileData.followers}
- Following: ${profileData.following}
- Total stars earned: ${profileData.totalStars}
- Total forks: ${profileData.totalForks}
- Source (non-fork) repos: ${profileData.sourceRepos}
- Forked repos: ${profileData.forkedRepos}
- Developer archetype: ${profileData.archetype}
- Activity level: ${profileData.activityLevel}

TOP LANGUAGES (by repo count):
${profileData.languages?.map((l: any) => `  - ${l.lang}: ${l.count} repos`).join('\n') || '  None detected'}

TOP REPOSITORIES (by stars):
${profileData.topRepos?.map((r: any) => `  - ${r.name} (${r.language || 'unknown'}): ★${r.stars}, ${r.forks} forks, ${r.description || 'no description'}`).join('\n') || '  None'}

RECENT ACTIVITY:
- Repos updated in last 7 days: ${profileData.recentActivity?.last7days || 0}
- Repos updated in last 30 days: ${profileData.recentActivity?.last30days || 0}
- Repos updated in last 90 days: ${profileData.recentActivity?.last90days || 0}

Respond with ONLY this exact JSON structure (no markdown fences):
{
  "codingPersonality": "A creative 2-4 word personality title (e.g. 'The Midnight Architect', 'The Polyglot Explorer', 'The Open Source Evangelist')",
  "summary": "A 2-3 sentence natural language profile summary that captures who this developer is, what they build, and what drives them. Make it read like a compelling bio.",
  "strengths": [
    "Strength 1 — a specific, data-backed observation (1 sentence)",
    "Strength 2 — another specific insight (1 sentence)",
    "Strength 3 — one more (1 sentence)"
  ],
  "growthAreas": [
    "Growth area 1 — a constructive suggestion tied to their data (1 sentence)",
    "Growth area 2 — another area to level up (1 sentence)"
  ],
  "funFact": "One surprising or interesting observation about their profile, phrased in a memorable way (1 sentence).",
  "verdict": "A one-line 'hiring manager verdict' — what kind of team would love this developer? (1 sentence)"
}`

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      }),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('Groq API error:', groqRes.status, errText)
      return NextResponse.json(
        { error: `AI service error (${groqRes.status})` },
        { status: 502 }
      )
    }

    const groqData = await groqRes.json()
    const content = groqData.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI service' },
        { status: 502 }
      )
    }

    const parsed = JSON.parse(content)
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('AI summary error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI summary' },
      { status: 500 }
    )
  }
}
