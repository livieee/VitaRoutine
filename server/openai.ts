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
          "brand": "Recommended high-quality brand (e.g., 'Nature Made', 'NOW Foods', 'Thorne Research', etc.)",
          "instructions": "Concise but complete instructions on how to take (with food, empty stomach, etc.)",
          "reasoning": "Clear scientific explanation for the recommendation (use bullet points where appropriate)",
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

Follow these guidelines to make your recommendations more accessible and easy to understand:

1. Use plain language - translate complex concepts into clear, simple explanations
2. Keep scientific reasoning concise and focused on the most important benefits
3. Use bullet points or short paragraphs for better readability
4. For supplement brands, recommend well-established, trusted names with good quality control
5. Format food suggestions clearly with the most important nutrients highlighted
6. Be specific with dosages and timing for maximum clarity

Your recommendations should be:
- Scientifically accurate but expressed in accessible language
- Visually scannable (use bullet points when appropriate)
- Focused on practical application rather than excessive technical detail
- Clear about what's most important vs. what's supplementary information
- Specific about brands, dosages, and timing for easy implementation

When explaining scientific concepts, focus on the 1-2 most relevant mechanisms rather than an exhaustive explanation. Use analogies or comparisons when helpful.`
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
