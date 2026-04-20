import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateRecipe = async (ingredients) => {
  const chat = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",   
    messages: [
      {
        role: "system",
        content: `Sos un chef experto. Cuando el usuario te dé una lista de ingredientes, 
        respondé SOLO con un JSON válido con este formato exacto, sin texto adicional:
        {
          "title": "nombre de la receta",
          "description": "descripción apetitosa en 2-3 oraciones",
          "ingredients": ["ingrediente 1", "ingrediente 2", "ingrediente 3"]
        }`
      },
      {
        role: "user",
        content: `Tengo estos ingredientes: ${ingredients}. Sugerí una receta.`
      }
    ],
    temperature: 0.7,
  });

  const text = chat.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};