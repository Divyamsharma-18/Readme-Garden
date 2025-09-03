const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

// Minimal OpenAI chat wrapper to replace the AI SDK usage.
// Requires process.env.OPENAI_API_KEY (server-side only).
export async function generateWithOpenAI({
  prompt,
  system,
  model = "gpt-4o-mini",
  maxTokens = 2500,
  temperature = 0.8,
}: {
  prompt: string
  system?: string
  model?: string
  maxTokens?: number
  temperature?: number
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY")
  }

  const messages: Array<{ role: "system" | "user"; content: string }> = []
  if (system) messages.push({ role: "system", content: system })
  messages.push({ role: "user", content: prompt })

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`OpenAI error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content?.trim?.() || ""
  return text
}
