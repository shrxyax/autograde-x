import Groq from "groq-sdk"

const groq=new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function gradeAssignment(
  text: string,
  topic: string,
  rubric: string,
  difficulty: string
) {

  const trimmedText = text.slice(0,12000); // limit to 12k chars
  const prompt = `
You are an experienced university professor grading a student assignment.

The assignment may belong to ANY academic field (engineering, science, humanities, business, etc.).

Your job is to evaluate the submission fairly using the rubric provided.

Assignment Topic:
${topic}

Difficulty Level:
${difficulty}

Grading Rubric:
${rubric}

Student Submission:
${trimmedText}

Grading Guidelines:

. Bad assignments typically score below 40-60
• Average assignments typically score between 65–80
• Good assignments score between 85-95
• Excellent assignments score between 95–100
• Only extremely poor submissions should score below 60

if difficulty is "Easy", be more lenient and generous with scoring.
if difficulty is "Hard", be more strict and critical with scoring.  
if difficulty is "Medium", use normal grading standards.

Evaluation Instructions:

1. Analyze the submission carefully
2. Compare it against the rubric
3. Identify strengths and weaknesses
4. Estimate whether the writing appears AI-generated
5. Provide a fair academic score

Return ONLY valid JSON in this exact format:

{
  "score": number,
  "aiProbability": number,
  "strengths": ["point1","point2"],
  "weaknesses": ["point1","point2"]
}

Rules:
- score must be between 0 and 100
- aiProbability must be between 0 and 100
- strengths must contain 2–4 items
- weaknesses must contain 2–4 items
- DO NOT include explanations outside JSON
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "You are an academic assignment grading AI."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content;
}