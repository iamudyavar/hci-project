import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from '@google/genai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });


async function listModels() {
  try {


    const modelsPager = await ai.models.list();
    for await (const model of modelsPager) {
      console.log(model.name);
      console.log(`Supported Actions: ${model.supportedActions?.join(', ') || 'N/A'}`);
    }

  } catch (error) {
    console.error('Failed to list models:', error);
  }
}

// Call this once to see available models
listModels();

export default async function handler(req: any, res: any) {
  const { action, payload } = req.body || {};

  if (!action) {
    return res.status(400).json({ message: "Action is required" });
  }

  try {
    switch (req.method) {
      case "POST":
        switch (action) {
          case "createUser":
            return await handleCreateUser(payload, res);
          case "analyzeFood":
            return await handleAnalyzeFood(payload, res);
          case "aiFeedback":
            return await handleAIFeedback(payload, res);
          default:
            return res.status(400).json({ message: "Unknown POST action" });
        }

      case "PUT":
        switch (action) {
          case "updateUsername":
            return await handleUpdateUser(payload, res);
          default:
            return res.status(400).json({ message: "Unknown PUT action" });
        }

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}


async function handleCreateUser(payload: any, res: any) {
  const { email } = payload;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // check if email already exists
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // ignore not found error
  if (selectError && selectError.code !== "PGRST116") throw selectError;

  let userId = existingUser?.id;
  let username = existingUser?.username;
  let quiz3 = existingUser?.quiz3;
  let alreadyExists = !!existingUser;

  if (!existingUser) {
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([{ email }])
      .select()
      .single();

    if (insertError) throw insertError;

    userId = data.id;
    alreadyExists = false;
  }

  return res.status(200).json({ user: { id: userId, email, username, quiz3 }, alreadyExists });
}

async function handleUpdateUser(payload: any, res: any) {
  const { userId, username } = payload;

  const { data, error } = await supabase
    .from("users")
    .update({ username })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return res.status(200).json({ message: "Username updated", user: data });
}

// Gemini food analysis handler
async function handleAnalyzeFood(payload: any, res: any) {
  const { imageData, mimeType, userId } = payload;

  if (!imageData) {
    return res.status(400).json({ message: "Image data is required" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: "Gemini API key not configured" });
  }

  try {
    console.log("Starting Gemini food analysis...");

    // Prepare the image part for Gemini
    const imagePart = {
      inlineData: {
        data: imageData, // Base64 image data (without data: prefix)
        mimeType: mimeType || "image/jpeg",
      },
    };


    const prompt = `
      You are an expert nutritionist and food analyst. Analyze this food image and provide a comprehensive nutritional breakdown.

      Please analyze the image and return ONLY a valid JSON object with the following structure (no markdown formatting, no backticks, just pure JSON):

      {
        "food": "Name of the main dish/food item",
        "confidence": "High/Medium/Low based on image clarity and recognizability",
        "calories": 000,
        "macros": {
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "fiber": 0
        },
        "details": "Detailed breakdown of ingredients and portion estimation",
        "healthRating": "Excellent/Good/Fair/Poor with brief explanation",
        "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
        "servingSize": "Estimated serving size description",
        "nutritionalHighlights": "Key nutritional benefits or concerns"
      }

      Important guidelines:
      - Estimate calories for the typical serving size shown in the image
      - Provide macros in grams
      - Be realistic with portion sizes
      - If multiple food items are visible, focus on the main/largest item
      - If no food is detected, return: {"error": "No food items detected in the image"}
      - Ensure all numbers are realistic and evidence-based
      - Consider cooking methods that might affect nutritional content
    `;


    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt, imagePart],
      config: {
        responseMimeType: "application/json",
      }
    });


    const text = result.text;
    if (!text) {
      // Return a clear error response if theres no text returned
      return res.status(500).json({ message: "No AI response text returned." });
    }

    console.log("Gemini raw response:", text);

    // Parse the JSON response
    let nutritionalData;
    try {
      // Clean the response - remove any markdown formatting if present
      const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
      nutritionalData = JSON.parse(cleanedText);

      if (nutritionalData.error) {
        return res.status(400).json({ message: nutritionalData.error });
      }

    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.log("Raw response that failed to parse:", text);
      return res.status(500).json({
        message: "Failed to parse AI response. Please try again.",
        debug: process.env.NODE_ENV === 'development' ? text : undefined
      });
    }

    // store the analysis in database
    if (userId) {
      try {
        await supabase
          .from("food_analyses")
          .insert([{
            user_id: userId,
            food_name: nutritionalData.food,
            calories: nutritionalData.calories,
            analysis_data: nutritionalData,
            created_at: new Date().toISOString()
          }]);
      } catch (dbError) {
        console.error("Failed to store analysis in database:", dbError);
        // Don't fail the request if database storage fails
      }
    }

    console.log("Analysis completed successfully:", nutritionalData.food);

    return res.status(200).json({
      success: true,
      analysis: nutritionalData,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Gemini analysis failed:', err);
    return res.status(500).json({
      message: `Analysis failed: ${err.message || 'Unknown error occurred'}`,
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
}

// AI feedback handler for quiz (estimate calories & give feedback comparing to user's guess)
async function handleAIFeedback(payload: any, res: any) {
  const { image, guess, answerCalories } = payload || {};

  if (!image) return res.status(400).json({ message: 'Image URL is required' });
  if (typeof guess !== 'number' && typeof guess !== 'string') return res.status(400).json({ message: 'Guess is required' });
  if (typeof answerCalories !== 'number') return res.status(400).json({ message: 'Answer calories are required' });
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: 'Gemini API key not configured' });
  }

  try {
    // 3. Update the prompt to use answerCalories
    const prompt = `
      You are an expert nutritionist providing feedback for a calorie-guessing quiz.
      Given the image URL for context, the user's calorie guess, and the ACTUAL calorie count, provide a concise JSON response with constructive feedback.

      Return ONLY a JSON object (no extra text, no markdown) with the structure:
      {
        "actualCalories": ${answerCalories},
        "feedback": "Encouraging and actionable feedback. If the user is close, praise them. If they are far off, gently correct them and **explain which specific ingredients (like the sauce, cheese, or cooking oil) are the primary contributors to the calorie count. Provide a brief, memorable tip for future estimations.**"
      }

      Image URL: ${image}
      User guess: ${guess}
      Actual Calories: ${answerCalories}
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt],
      config: { responseMimeType: 'application/json' }
    });

    const text = result.text;
    if (!text) {
      return res.status(500).json({ message: 'No AI response text returned.' });
    }

    // Clean and parse JSON
    let parsed;
    try {
      const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse aiFeedback response:', parseErr);
      return res.status(500).json({ message: 'Failed to parse AI feedback response', debug: process.env.NODE_ENV === 'development' ? text : undefined });
    }

    if (parsed?.error) {
      return res.status(400).json({ message: parsed.error });
    }

    return res.status(200).json({ success: true, feedback: parsed.feedback, estimatedCalories: parsed.estimatedCalories, confidence: parsed.confidence });

  } catch (err: any) {
    console.error('AI feedback failed:', err);
    return res.status(500).json({ message: "AI feedback failed", error: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
}