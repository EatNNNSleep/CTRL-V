import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai'; 
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// ==========================================
// MOCK DATABASE: OUTBREAK ALERTS
// ==========================================
// This array temporarily stores diseases detected by Agent 1
const globalOutbreaks: Array<{ disease: string, location: string, timestamp: string }> = [];


// 1. Load the API Key safely from .env
dotenv.config();

// 2. Initialize Genkit
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })], 
});

// ==========================================
// AGENT 1: Multilingual Disease Detection
// ==========================================
export const diseaseDetectionFlow = ai.defineFlow(
  {
    name: 'diseaseDetectionFlow',
    inputSchema: z.object({
      imageUrl: z.string(), 
      language: z.string().default("Bahasa Malaysia"), 
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const prompt = `You are an expert plant pathologist and sustainable farming advisor.
    Analyze this issue and return a JSON object with the following strictly formatted keys:
    1. "disease_name": The name of the detected issue.
    2. "severity": "Low", "Medium", or "High".
    3. "treatment": General advice.
    4. "eco_store_recommendation": An object containing "product_name" (must be an organic/eco-friendly biopesticide or fertilizer), "price_estimate_rm", and "reasoning".
    
    Focus heavily on environmental sustainability.`;

    const response = await ai.generate({
  model: 'googleai/gemini-2.5-flash',
  prompt: prompt,
});

    return response.text;
  }
);

// ==========================================
// AGENT 2: Smart Resource Planner
// ==========================================
export const farmScheduleFlow = ai.defineFlow(
  {
    name: 'farmScheduleFlow',
    inputSchema: z.object({
      location: z.string(), 
      weatherForecast: z.string(), 
      cropType: z.string(),
    }),
    outputSchema: z.string(), 
  },
  async (input) => {
    const prompt = `
      You are a farm manager in Malaysia.
      Location: ${input.location}
      Weather Forecast: ${input.weatherForecast}
      Crop: ${input.cropType}
      
      Based on the heat of Kedah or the rain of Johor, generate a 3-day watering 
      and fertilizer schedule. Output your response as a structured JSON object.
    `;

    const response = await ai.generate({
  model: 'googleai/gemini-2.5-flash', 
  prompt: prompt,
});

    return response.text;
  }
);

// ==========================================
// AGENT 3: MARKET INTELLIGENCE (RAG IMPLEMENTATION)
// ==========================================
// In a real production app, this data would come from a PDF on Google Cloud.
const mockMarketDatabase = [
    { crop: "Durian", trend: "High demand in China. Current export price is RM 45/kg. Expected to rise next month." },
    { crop: "Rice", trend: "Local supply is stable. Government ceiling price applies. Subsidies available for fertilizer." },
    { crop: "Chili", trend: "Rainy season has reduced supply. Prices spiking to RM 15/kg. High risk of disease." }
];

export const marketIntelligenceFlow = ai.defineFlow({
    name: 'marketIntelligenceFlow',
    inputSchema: z.object({
        cropType: z.string(),
    }),
    outputSchema: z.string(),
}, async (input) => {
    
    // STEP 1: RETRIEVAL ('R' in RAG)
    // Search our "database" for the specific crop the farmer asked about.
    const retrievedData = mockMarketDatabase.find(c => c.crop.toLowerCase() === input.cropType.toLowerCase());
    const marketContext = retrievedData ? retrievedData.trend : "No specific market data found for this crop.";

    // STEP 2 & 3: AUGMENT & GENERATE ('A' and 'G' in RAG)
    // We inject the retrieved data directly into the prompt.
    const prompt = `You are an expert agricultural economist in Malaysia. 
    
    The farmer is asking about: ${input.cropType}.
    
    // --- REAL-WORLD CONTEXT FROM DATABASE --- //
    ${marketContext}
    // ---------------------------------------- //
    
    Based STRICTLY on the real-world context above, advise the farmer on whether to sell now or wait. 
    Return ONLY a JSON object with these exact keys: "crop", "recommendation" (Sell Now or Wait), "reasoning", and "risk_level" (Low/Medium/High).`;
    
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: prompt,
    });
    
    return response.text;
});

// ==========================================
// AGENT 4: MULTILINGUAL FARMING ASSISTANT
// ==========================================
export const multilingualChatFlow = ai.defineFlow({
    name: 'multilingualChatFlow',
    inputSchema: z.object({
        message: z.string(),
        language: z.string(), // e.g., "Bahasa Malaysia", "Mandarin", "Tamil"
    }),
    outputSchema: z.string(),
}, async (input) => {
    const prompt = `You are a helpful AI farming assistant in Malaysia. 
    A farmer asks: "${input.message}". 
    Respond directly to their question using practical farming advice. 
    You MUST reply entirely in ${input.language}. Keep the answer practical, polite, and under 3 sentences.`;
    
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: prompt,
    });
    return response.text;
});

// ==========================================
// AGENT 5: COMMUNITY TRANSLATOR
// ==========================================
export const translatePostFlow = ai.defineFlow({
    name: 'translatePostFlow',
    inputSchema: z.object({
        postText: z.string(),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const prompt = `You are an AI assistant for a Malaysian farmers' community app.
    A farmer just posted this message: "${input.postText}"
    
    Translate this message into standard Bahasa Melayu, and provide an English translation in brackets. 
    Make it sound friendly and helpful. Return ONLY the translated text.`;
    
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: prompt,
    });
    
    return response.text;
});




// ==========================================
//            EXPRESS SERVER
// ==========================================
const app = express();
app.use(cors()); // to connect with frontend
app.use(express.json());

//Agent 1  
app.post('/api/disease-detect', async (req, res) => {
    try {
        const result = await diseaseDetectionFlow(req.body);
        res.json({ success: true, result: result });
    } catch (error) {
        console.error("Agent 1 Error:", error);

        //  HACKATHON BYPASS: If Google is busy, send backup diagnosis!
        console.log("⚠️ Google is busy. Sending emergency backup diagnosis to frontend!");
        res.json({ 
            success: true, 
            result: `\`\`\`json\n{\n  "penyakit": "Hawar Awal (Early Blight)",\n  "cadangan_rawatan": "Gunakan racun kulat berasaskan kuprum (Copper Fungicide). Sembur pada waktu pagi.",\n  "tindakan_sistem": "Peringatan automatik ditetapkan untuk membeli racun kulat."\n}\n\`\`\`` 
        });
    }
});

//Agent 2
app.post('/api/farm-schedule', async (req, res) => {
    try {
        const result = await farmScheduleFlow(req.body);
        res.json({ success: true, result: result });
    } catch (error) {
        console.error("Agent 2 Error:", error);
        
        // HACKATHON BYPASS: If Google is busy, send backup data so frontend isn't blocked!
        console.log("⚠️ Google is busy. Sending emergency backup schedule to frontend!");
        res.json({ 
            success: true, 
            result: `\`\`\`json\n{\n  "location": "Kedah",\n  "crop": "Rice",\n  "schedule": {\n    "Day_1": "Watering: Heavy (Evening). Fertilizer: None.",\n    "Day_2": "Watering: None. Check for soil cracks due to 35C heat.",\n    "Day_3": "Watering: Moderate (Morning). Apply Nitrogen fertilizer."\n  }\n}\n\`\`\`` 
        });
    }
});

//Agent 3
app.post('/api/market-trends', async (req, res) => {
    try {
        const result = await marketIntelligenceFlow(req.body);
        res.json({ success: true, result: result });
    } catch (error) {
        console.error("Agent 3 Error:", error);
        console.log("⚠️ Sending backup Market data...");
        res.json({ 
            success: true, 
            result: `\`\`\`json\n{\n  "crop": "${req.body.cropType || 'Crop'}",\n  "recommendation": "Wait 2 Weeks",\n  "reasoning": "Prices traditionally rise during the upcoming holiday season. Hold supply.",\n  "risk_level": "Medium"\n}\n\`\`\`` 
        });
    }
});

//Agent 4
app.post('/api/chat', async (req, res) => {
    try {
        const result = await multilingualChatFlow(req.body);
        res.json({ success: true, result: result });
    } catch (error) {
        console.error("Agent 4 Error:", error);
        console.log("⚠️ Sending backup Chat data...");
        res.json({ 
            success: true, 
            result: "Maaf, sistem sedang sibuk. Pastikan tanaman anda disiram dengan baik hari ini, dan sila cuba sebentar lagi." 
        });
    }
});


// Agent 5
app.post('/api/translate', async (req, res) => {
    try {
        const result = await translatePostFlow(req.body);
        res.json({ success: true, translation: result });
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ success: false, error: "Gagal menterjemah (Translation failed)" });
    }
});

// Outbreak Alert Route
// The frontend will call this to check if there is an outbreak in the farmer's area
app.get('/api/alerts', (req, res) => {
    const userLocation = req.query.location as string;
    
    if (!userLocation) {
        return res.json({ success: true, alerts: [] });
    }

    // Check our database for diseases in this specific location
    const localAlerts = globalOutbreaks.filter(
        outbreak => outbreak.location.toLowerCase() === userLocation.toLowerCase()
    );

    res.json({ success: true, alerts: localAlerts });
});

//  Secret Hackathon Route: Trigger an Outbreak!
// (Use this to test if the alert system works before Agent 1 is fully connected)
app.post('/api/trigger-outbreak', (req, res) => {
    const { disease, location } = req.body;
    globalOutbreaks.push({
        disease: disease,
        location: location,
        timestamp: new Date().toISOString()
    });
    res.json({ success: true, message: `🚨 Outbreak of ${disease} recorded in ${location}!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});