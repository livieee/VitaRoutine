import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-your-api-key-here" 
});

export async function generateRecommendations(healthGoals: any, lifestyle: any) {
  try {
    const prompt = `
    Please analyze the following user profile and generate comprehensive, personalized supplement recommendations and food suggestions:

    Health Goals: ${JSON.stringify(healthGoals)}
    Lifestyle Information: ${JSON.stringify(lifestyle)}

    Based on this profile, generate a detailed supplement routine and food suggestions with timing, dosage, food pairing, and scientific reasoning. 
    
    IMPORTANT INSTRUCTIONS:
    - Include at least 7-9 different supplements distributed across morning, midday, and evening
    - Provide specific dosages (e.g., "500mg") and exact timing
    - Include both essential vitamins/minerals and specialized supplements that target the specific health goals
    - For each supplement, provide detailed scientific reasoning explaining its benefits and mechanism of action
    - For food suggestions, include nutrient-dense options with explanations of how they complement the supplement regimen
    - Consider potential supplement interactions and optimal absorption times
    - Take into account the user's waking and sleeping times to create a schedule
    - Include a mix of both general health supplements and targeted ones for specific goals

    Provide the information in the following JSON format:
    {
      "supplementRoutine": [
        {
          "timeOfDay": "Morning/Midday/Evening",
          "supplement": "Name and detailed dosage (including measurement units)",
          "instructions": "Comprehensive instructions on how to take (with food, empty stomach, etc.)",
          "reasoning": "Detailed scientific explanation for the recommendation, including research background and mechanism of action",
          "time": "Specific time based on user's schedule (e.g., '7:30 AM')"
        }
      ],
      "foodSuggestions": {
        "breakfast": ["Detailed option 1 with specific nutrients and benefits explanation", "Detailed option 2 with specific nutrients and benefits explanation", "Detailed option 3 with specific nutrients and benefits explanation"],
        "lunch": ["Detailed option 1 with specific nutrients and benefits explanation", "Detailed option 2 with specific nutrients and benefits explanation", "Detailed option 3 with specific nutrients and benefits explanation"],
        "snacks": ["Detailed option 1 with specific nutrients and benefits explanation", "Detailed option 2 with specific nutrients and benefits explanation", "Detailed option 3 with specific nutrients and benefits explanation"],
        "dinner": ["Detailed option 1 with specific nutrients and benefits explanation", "Detailed option 2 with specific nutrients and benefits explanation", "Detailed option 3 with specific nutrients and benefits explanation"]
      }
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a leading nutritionist and clinical supplement specialist with expertise in integrative medicine, biochemistry, and personalized health optimization.

You have extensive knowledge of:
- Evidence-based supplement protocols for various health conditions and goals
- Nutrigenomics and personalized nutrition
- Latest clinical research on micronutrients and bioactive compounds
- Optimal timing, dosing, and combinations for maximum bioavailability
- Potential interactions between supplements and medications
- Food-based approaches to enhance nutrient absorption and cellular function

For each recommendation you provide, include:
- Specific mechanisms of action at the cellular and molecular level
- Scientific evidence supporting dosage recommendations
- Potential synergistic effects between nutrients
- Optimal timing for absorption based on circadian rhythms and meal timing
- How each supplement and food directly supports the user's stated health goals

Your responses should be comprehensive, scientifically sound, and personalized to the individual's specific health profile.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI API");
    }
    const result = JSON.parse(content);
    return result;
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate recommendations: ${error?.message || 'Unknown error'}`);
  }
}
