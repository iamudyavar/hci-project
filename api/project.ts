import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from '@google/genai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// ===== API KEY AND MODEL ROTATION SETUP =====

// Pool of API keys
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY_1!,
  process.env.GEMINI_API_KEY_2!,
  process.env.GEMINI_API_KEY_3!,
  process.env.GEMINI_API_KEY_4!,
  process.env.GEMINI_API_KEY_5!
].filter(key => key && key !== 'undefined'); // Filter out undefined keys

// Models that support image input 
const IMAGE_SUPPORTED_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-pro",
  "gemini-2.0-flash-001",
  "gemini-flash-latest",
  "gemini-2.5-flash-image",
];

// Track current indices for rotation
let currentKeyIndex = 0;
let currentModelIndex = 0;

/**
 * Get the next API key in rotation
 */
function getNextApiKey(): string {
  if (GEMINI_API_KEYS.length === 0) {
    throw new Error("No Gemini API keys configured");
  }
  const key = GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
  return key;
}

/**
 * Get the next model in rotation
 */
function getNextModel(): string {
  const model = IMAGE_SUPPORTED_MODELS[currentModelIndex];
  currentModelIndex = (currentModelIndex + 1) % IMAGE_SUPPORTED_MODELS.length;
  return model;
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code || error?.status;

  return (
    errorCode === 429 ||
    errorCode === 'RESOURCE_EXHAUSTED' ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('resource exhausted') ||
    errorMessage.includes('too many requests')
  );
}

/**
 * Call Gemini API with automatic retry logic for rate limits
 * Rotates through API keys and models on rate limit errors
 */
async function callGeminiWithRetry(
  prompt: string,
  imagePart?: any,
  maxRetries: number = GEMINI_API_KEYS.length * IMAGE_SUPPORTED_MODELS.length
): Promise<any> {
  let lastError: any;

  // Try up to maxRetries times (all key/model combinations)
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = getNextApiKey();
    const model = getNextModel();

    try {
      console.log(`Attempt ${attempt + 1}: Using model ${model} with key ending in ...${apiKey.slice(-4)}`);

      const ai = new GoogleGenAI({ apiKey });

      const contents = imagePart ? [prompt, imagePart] : [prompt];

      const result = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
        }
      });

      console.log(`Success with model ${model}`);
      return result;

    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed with model ${model}:`, error.message);
      lastError = error;

      // If it's a rate limit error, try next key/model combination
      if (isRateLimitError(error)) {
        console.log('Rate limit detected, rotating to next API key and model...');
        continue;
      }

      // If it's not a rate limit error, throw immediately
      throw error;
    }
  }

  // All retries exhausted
  throw new Error(`All API keys and models exhausted. Last error: ${lastError?.message || 'Unknown error'}`);
}

// ===== END ROTATION SETUP =====

async function listModels() {
  try {
    // Use first available key to list models
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEYS[0] });
    const modelsPager = await ai.models.list();

    console.log('\n=== Available Gemini Models ===');
    for await (const model of modelsPager) {
      console.log(model.name);
      console.log(`Supported Actions: ${model.supportedActions?.join(', ') || 'N/A'}`);
      console.log('---');
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
          case "saveQuizScore":
            return await handleSaveQuizScore(payload, res);
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

// helper to test UUID
function isUuid(value: any) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// Resolve userId to actual UUID (or null)
async function resolveUserUuid(rawUserId: any) {
  if (!rawUserId) return null;
  if (isUuid(rawUserId)) return rawUserId;

  const { data: found, error: lookupErr } = await supabase
    .from('users')
    .select('id, email, username')
    .or(`email.eq.${rawUserId},username.eq.${rawUserId}`)
    .limit(1)
    .single();

  if (lookupErr) {
    console.warn('User lookup failed when resolving non-UUID id:', lookupErr);
    return null;
  }

  if (!found?.id) {
    console.warn('No user matched the provided non-UUID userId:', rawUserId);
    return null;
  }

  return found.id;
}

// Gemini food analysis handler with rotation
async function handleAnalyzeFood(payload: any, res: any) {
  const { imageData, mimeType, userId, userGuess } = payload;

  if (!imageData) {
    return res.status(400).json({ message: "Image data is required" });
  }

  if (GEMINI_API_KEYS.length === 0) {
    return res.status(500).json({ message: "Gemini API keys not configured" });
  }

  try {
    console.log("Starting Gemini food analysis...");

    // Prepare the image part for Gemini
    const imagePart = {
      inlineData: {
        data: imageData,
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

    // Use retry logic with rotation
    const result = await callGeminiWithRetry(prompt, imagePart);

    const text = result.text;
    if (!text) {
      return res.status(500).json({ message: "No AI response text returned." });
    }

    console.log("Gemini raw response:", text);

    // Parse the JSON response
    let nutritionalData;
    try {
      const cleanedText = text.replace(/``````\n?/g, '').trim();
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

    // Store the analysis in database
    if (userId) {
      const resolvedUserId = await resolveUserUuid(userId);

      console.log('DEBUG: userId input:', userId);
      console.log('DEBUG: resolvedUserId:', resolvedUserId);
      console.log('DEBUG: resolvedUserId type:', typeof resolvedUserId);
      console.log('DEBUG: resolvedUserId null?', resolvedUserId === null);

      // Verify the user actually exists
      const { data: userCheck, error: checkError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', resolvedUserId)
        .single();

      console.log('DEBUG: User check result:', userCheck);
      console.log('DEBUG: User check error:', checkError);

      if (!resolvedUserId) {
        return res.status(400).json({
          message: "User ID could not be resolved",
          debug: { userId, resolvedUserId }
        });
      }

      console.log('Inserting food analysis. original userId:', userId, 'resolvedUserId:', resolvedUserId);

      const rawUserGuess = userGuess;

      const { data: dbData, error: dbError } = await supabase
        .from('food_analyses')
        .insert([{
          user_id: resolvedUserId as unknown as any,
          user_guess: typeof rawUserGuess === 'number' ? rawUserGuess : null,
          user_guess_raw: userGuess ?? null,
          food_name: nutritionalData?.food ?? null,
          calories: typeof nutritionalData?.calories === 'number' ? nutritionalData.calories : null,
          analysis_data: nutritionalData,
          created_at: new Date().toISOString(),
        }])
        .select();

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        if (process.env.NODE_ENV === 'development') {
          console.log('AI raw response (for debugging):', text);
        }
      } else {
        console.log('DB insert succeeded:', dbData);
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

// AI feedback handler with rotation
async function handleAIFeedback(payload: any, res: any) {
  const { image, guess, answerCalories } = payload || {};

  if (!image) return res.status(400).json({ message: 'Image URL is required' });
  if (typeof guess !== 'number' && typeof guess !== 'string') return res.status(400).json({ message: 'Guess is required' });
  if (typeof answerCalories !== 'number') return res.status(400).json({ message: 'Answer calories are required' });

  if (GEMINI_API_KEYS.length === 0) {
    return res.status(500).json({ message: 'Gemini API keys not configured' });
  }

  try {
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

    // Use retry logic with rotation (no image part for URL-based feedback)
    const result = await callGeminiWithRetry(prompt);

    const text = result.text;
    if (!text) {
      return res.status(500).json({ message: 'No AI response text returned.' });
    }

    // Clean and parse JSON
    let parsed;
    try {
      const cleaned = text.replace(/``````\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse aiFeedback response:', parseErr);
      return res.status(500).json({
        message: 'Failed to parse AI feedback response',
        debug: process.env.NODE_ENV === 'development' ? text : undefined
      });
    }

    if (parsed?.error) {
      return res.status(400).json({ message: parsed.error });
    }

    return res.status(200).json({
      success: true,
      feedback: parsed.feedback,
      estimatedCalories: parsed.estimatedCalories,
      confidence: parsed.confidence
    });

  } catch (err: any) {
    console.error('AI feedback failed:', err);
    return res.status(500).json({
      message: "AI feedback failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

// Save quiz score to scores table
async function handleSaveQuizScore(payload: any, res: any) {
  const { userId, quizNumber, score, avgTime } = payload;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });
  if (typeof quizNumber !== 'number' || ![1, 2, 3].includes(quizNumber)) {
    return res.status(400).json({ message: 'Quiz number must be 1, 2, or 3' });
  }
  if (typeof score !== 'number') return res.status(400).json({ message: 'Score is required' });
  if (typeof avgTime !== 'number') return res.status(400).json({ message: 'Average time is required' });

  try {
    // Determine which columns to update based on quiz number
    const scoreColumn = `score${quizNumber}`;
    const timeColumn = `time${quizNumber}`;

    // Check if user already has a scores row
    const { data: existing, error: selectError } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // Error other than "not found"
      throw selectError;
    }

    if (existing) {
      // Update existing row
      const { error: updateError } = await supabase
        .from('scores')
        .update({
          [scoreColumn]: score,
          [timeColumn]: avgTime
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // Insert new row
      const { error: insertError } = await supabase
        .from('scores')
        .insert([{
          user_id: userId,
          [scoreColumn]: score,
          [timeColumn]: avgTime
        }]);

      if (insertError) throw insertError;
    }

    return res.status(200).json({ success: true, message: 'Quiz score saved' });

  } catch (err: any) {
    console.error('Failed to save quiz score:', err);
    return res.status(500).json({
      message: 'Failed to save quiz score',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
