// src/ai/prompts/prompts.ts

export const PROMPTS = {
  SUMMARY: (content: string) => `
     You are an educational AI assistant.
    Create a clean, well-structured summary.

    Formatting rules:
    - Use markdown headings
    - Use bullet points
    - Use short paragraphs
    - Keep it readable for students
    - Avoid huge text blocks

    Content:
    ${content}
    `,

  QNA: (content: string, question: string) => `
      You are a helpful study assistant.
      Answer the following question based ONLY on the provided content.
      If the answer is not in the content, say "I couldn't find that in the document."
      
      Content:
      ${content}
      
      Question: ${question}
    `,

  FLASHCARDS: (content: string) => `
      You are a helpful study assistant.
      Create 5-10 flashcards from the content below.
      Return ONLY a valid JSON array, no extra text.
      Format:
      [
        { "question": "...", "answer": "..." },
        { "question": "...", "answer": "..." }
      ]
      
      Content:
      ${content}
    `,

  QUIZ: (content: string) => `
      You are a strict JSON generator.

      Return ONLY valid JSON.
      No markdown.
      No explanations.
      No extra text.

      Rules:
      - Output must be valid JSON array
      - Each item must follow exact schema
      - Do NOT include commentary

      Schema:
      [
        {
          "question": "string",
          "options": {
            "A": "string",
            "B": "string",
            "C": "string",
            "D": "string"
          },
          "answer": "A" | "B" | "C" | "D"
        }
      ]

      
      Content:
      ${content}
    `,

  CHAT: (
    content: string,
    message: string,
    history: { role: string; text: string }[],
  ) => {
    const historyText = history
      .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
      .join('\n');
    return `
        You are a helpful study assistant for this workspace.
        Use the content below as your knowledge base.
        
        Content:
        ${content}
        
        Conversation so far:
        ${historyText}
        
        User: ${message}
        Assistant:
      `;
  },
};
