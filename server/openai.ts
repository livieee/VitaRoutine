import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-your-api-key-here" 
});

export async function generateRecommendations(healthGoals, lifestyle) {
  try {
    const prompt = `
    Please analyze the following user profile and generate personalized supplement recommendations and food suggestions:

    Health Goals: ${JSON.stringify(healthGoals)}
    Lifestyle Information: ${JSON.stringify(lifestyle)}

    Based on this profile, generate a supplement routine and food suggestions with timing, dosage, food pairing, and scientific reasoning.

    Provide the information in the following JSON format:
    {
      "supplementRoutine": [
        {
          "timeOfDay": "Morning/Midday/Evening",
          "supplement": "Name and dosage",
          "instructions": "How to take (with food, etc.)",
          "reasoning": "Scientific explanation for the recommendation",
          "time": "Specific time (e.g., '7:30 AM')"
        }
      ],
      "foodSuggestions": {
        "breakfast": ["Option 1 with nutrient explanation", "Option 2 with nutrient explanation"],
        "lunch": ["Option 1 with nutrient explanation", "Option 2 with nutrient explanation"],
        "snacks": ["Option 1 with nutrient explanation", "Option 2 with nutrient explanation"]
      }
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a nutrition and supplement expert with extensive knowledge of scientific research. Provide evidence-based, personalized recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
}
