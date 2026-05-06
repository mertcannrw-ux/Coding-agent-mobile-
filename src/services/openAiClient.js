const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const CODING_AGENT_INSTRUCTIONS = `You are a mobile coding agent assistant.
Return practical coding help for mobile developers.
When the user asks for a feature, produce:
1. A concise summary.
2. Implementation steps.
3. Files likely to change.
4. Risks or checks.
Do not claim that you edited files unless a backend tool actually edited them.`;

export async function callOpenAiCodingAgent({ apiKey, model, task }) {
  if (!apiKey) {
    throw new Error("Add an API key first.");
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-5-mini",
      instructions: CODING_AGENT_INSTRUCTIONS,
      input: task,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || `OpenAI request failed with ${response.status}`;
    throw new Error(message);
  }

  return extractOutputText(data);
}

function extractOutputText(response) {
  if (response.output_text) {
    return response.output_text;
  }

  const textParts = [];
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join("\n").trim() || "No text response returned.";
}
