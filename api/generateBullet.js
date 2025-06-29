import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Missing description" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in writing Air Force-style bullets. Respond in concise action-impact-result format."
        },
        {
          role: "user",
          content: `Turn this description into an Air Force-style bullet: ${description}`
        }
      ],
    });

    const bullet = completion.choices[0].message.content.trim();

    return res.status(200).json({ bullet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generating bullet" });
  }
}
