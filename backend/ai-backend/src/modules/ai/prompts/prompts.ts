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
      Create exactly 10 flashcards from the content below.
      Return ONLY a valid JSON array, no extra text.
      Format:
     [
        {
          "question":"...",
          "answer":"..."
        }
      ]
        Rules:

      - Questions must cover important concepts
      - Keep answers concise
      - Avoid duplicate cards
      - Cover entire document
      
      Content:
      ${content}
    `,

  QUIZ: (content: string) => `
      You are an educational assessment generator.

      Generate EXACTLY 10 multiple-choice questions.
      Return ONLY valid JSON.
      No markdown.
      No explanations.
      No extra text.

      Rules:
      - Exactly 10 questions
      - One correct answer
      - 3 believable wrong answers
      - Hint must help without revealing answer
      - Explanation must explain WHY answer is correct
      - Cover important concepts
      - No markdown
      - No text outside JSON

      Schema:
      [
        {
          "question":"...",
          "options":{
            "A":"...",
            "B":"...",
            "C":"...",
            "D":"..."
          },
          "answer":"A",
          "hint":"...",
          "explanation":"..."
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
