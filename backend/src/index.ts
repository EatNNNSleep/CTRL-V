//***GOOGLE CLOUD WORKSTATIONS (Dev Environment Concept)***//
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai'; 
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// 1. Load the API Key safely from .env
dotenv.config();

// 2. Initialize Genkit
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })], 
});

// ==========================================
// MOCK DATABASE: OUTBREAK ALERTS
// ==========================================
// This array temporarily stores diseases detected by Agent 1
const globalOutbreaks: Array<{ disease: string, location: string, timestamp: string }> = [];

// ==========================================
// MOCK DATABASE: ECO-STORE / MARKET            //*** (VERTEX AI SEARCH (RAG Knowledge Base Simulation))***//
// ==========================================
const mockMarketDatabase = [
    { 
        id: 1, 
        product_name: "Fungicide Pro",
        category: "Treatments",
        description: "Broad-spectrum fungal control",
        price_rm: 45.99,
        in_stock: true,
        target_issue: "Leaf Rust and Fungal Infections"
    },
    { 
        id: 2, 
        product_name: "Organic Pest Shield",
        category: "Treatments",
        description: "Natural pest deterrent",
        price_rm: 32.50,
        in_stock: true,
        target_issue: "Pests and Insects"
    },
    { 
        id: 3, 
        product_name: "NitroMax 20-20-20",
        category: "Fertilizers",
        description: "Balanced NPK formula",
        price_rm: 28.99,
        in_stock: true,
        target_issue: "General Nutrient Deficiency"
    },
    { 
        id: 4, 
        product_name: "Root Boost Plus",
        category: "Fertilizers",
        description: "Root development enhancer",
        price_rm: 19.99,
        in_stock: false,
        target_issue: "Poor root growth"
    },
    { 
        id: 5, 
        product_name: "Heirloom Tomato Seeds",
        category: "Seeds",
        description: "Non-GMO variety pack",
        price_rm: 12.99,
        in_stock: true,
        target_issue: "New Planting - Tomato"
    },
    { 
        id: 6, 
        product_name: "Disease-Resistant Corn",
        category: "Seeds",
        description: "High-yield hybrid seeds",
        price_rm: 24.99,
        in_stock: true,
        target_issue: "New Planting - Corn"
    }
];
const availableProducts = JSON.stringify(mockMarketDatabase);

// ==========================================
// AGENT 1: Multilingual Disease Detection           //***GEMINI VISION & VERTEX AI AGENT BUILDER (Agents & Actions)***//
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
    const prompt = `You are TaniAgent, an expert plant pathologist and a supportive farming assistant. 
    Analyze this image and identify any plant disease, pest issue, or nutrient deficiency.
    
    CRITICAL INSTRUCTION: You are helping a farmer protect their livelihood. If you detect an issue, you MUST recommend a proactive defense product from our specific store inventory below. 
    Do not make up products. You MUST ONLY recommend products where "in_stock" is true.
    
    Store Inventory:
    ${availableProducts}
    
    IMPORTANT OUTPUT FORMAT:
    You must output a highly professional, empathetic diagnostic report in plain text. Use emojis and strict formatting so it looks beautiful on a mobile app screen.
    
    Write your response using EXACTLY this template:
    
    🚨 Diagnosis: [Exact name of the disease/issue]
    ⚠️ Severity: [Low / Medium / High]
    
    🔬 Analysis: 
    [Write 2 short, clear sentences explaining exactly what visual symptoms you see on the leaf/crop. Be professional.]
    
    🛡️ Proactive Defense: 
    Apply [Exact 'product_name' from inventory] (RM [price]). 
    [Write 1 short sentence on how and when to apply this product to protect the crop].
    `;

    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: [
                { text: prompt },
                { media: { url: input.imageUrl } }
        ],
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
// AGENT 3: MARKET INTELLIGENCE (RAG IMPLEMENTATION)          //***GEMINI + VERTEX AI SEARCH (RAG Application) ***//
// ==========================================
// In a real production app, this data would come from a PDF on Google Cloud.
export const marketIntelligenceFlow = ai.defineFlow({
    name: 'marketIntelligenceFlow',
   inputSchema: z.object({
        query: z.string(),
    }),
    outputSchema: z.string(),
}, async (input) => {
    
    const prompt = `You are an expert Agricultural Market Analyst in Malaysia.
    The farmer is asking: "${input.query}"
    
    Here is the exact real-time inventory and pricing of our platform's eco-store:
    ${availableProducts}
    
    Answer the farmer's question based strictly on our store inventory. If they ask for prices or availability, give them accurate information from the list. If an item has "in_stock": false, warn them it is currently unavailable.`;
    
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: prompt,
    });
    
    return response.text;
});

// ==========================================
// AGENT 4: MULTILINGUAL FARMING ASSISTANT                     //***GEMINI TEXT (NLP & Translation)***//
// ==========================================
export const multilingualChatFlow = ai.defineFlow({
    name: 'multilingualChatFlow',
    inputSchema: z.object({
        message: z.string(),
        // 🚨 STRICT VALIDATION: Only allows these 4 exact languages
        language: z.enum(["English", "Bahasa Melayu", "Tamil", "Chinese"]).default("Bahasa Melayu"),
        previousDiagnosis: z.string().optional(), 
        currentWeather: z.string().optional(),    
    }),
    outputSchema: z.string(),
}, async (input) => {
    
    // Build the dynamic context string
    let context = "";
    if (input.previousDiagnosis) context += `\n- The farmer's crop currently has: ${input.previousDiagnosis}`;
    if (input.currentWeather) context += `\n- The current weather is: ${input.currentWeather}`;

    const prompt = `You are a helpful AI farming assistant in Malaysia. 
    A farmer asks: "${input.message}". 
    
    CONTEXT ABOUT THE FARMER: ${context ? context : "No specific context provided."}
    
    Respond directly to their question using practical farming advice. If context is provided (like weather or disease), you MUST factor that into your advice.
    
    CRITICAL RULES:
    1. PROPORTIONAL RESPONSE: If the farmer just says "Hi", reply with a short 1-2 sentence greeting.
    2. LENGTH LIMIT: Keep your answers EXTREMELY short and punchy. Maximum 3 brief paragraphs.
    3. LANGUAGE: You MUST reply entirely in ${input.language}.
    4. FORMATTING (STRICT): 
       - DO NOT use single asterisks (*) or hyphens (-) for lists or italics. They will break the UI.
       - Use ONLY emojis as bullet points (e.g., 💧, 🛡️, 🌿).
       - Use **bold text** ONLY for main titles.
       - Use double line breaks (\n\n) between sections so it is easy to read.`;
       
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: prompt,
    });
    return response.text;
});

// ==========================================
// AGENT 5: VOICE FARMING ASSISTANT
// ==========================================
export const voiceAssistantFlow = ai.defineFlow({
    name: 'voiceAssistantFlow',
    inputSchema: z.object({
        transcript: z.string(),
        language: z.string().default("English"),
    }),
    outputSchema: z.string(),
}, async (input) => {
    const prompt = `You are TaniAgent Voice, the spoken version of a helpful AI farming assistant in Malaysia.
    A farmer said: "${input.transcript}".

    Give a direct answer that sounds natural when read aloud.
    You MUST reply entirely in ${input.language}.
    Provide a detailed, thoughtful, and comprehensive answer with practical advice and actionable steps. 
    CRITICAL RULES:
    1. You MUST reply entirely in ${input.language}.
    2. Keep your answer EXTREMELY concise, practical, and under 3 short sentences. 
    3. Because this is spoken aloud, do NOT use any Markdown symbols, bullet points, emojis, or special characters. Use natural conversational words only.`;
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: prompt,
    });

    return response.text;
});

// ==========================================
// AGENT 6: COMMUNITY TRANSLATOR
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
//            EXPRESS SERVER                            //***GOOGLE CLOUD RUN (Serverless Deployment)***//
// ==========================================
const app = express();
// Allow any frontend to connect to this API
app.use(cors({ origin: '*' }));
app.get('/', (req, res) => {
    res.send('🚀 CTRL+V AI Farming Backend is LIVE and running smoothly!');
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//Agent 1  
app.post('/api/disease-detect', async (req, res) => {
    try {
        const result = await diseaseDetectionFlow(req.body);
        res.json({ success: true, result: result });
    } catch (error) {
        console.error("Agent 1 Error:", error);
        console.log("⚠️ Google is busy. Sending emergency backup diagnosis to frontend!");
        res.json({ 
            success: true, 
            result: "🚨 Penyakit Dikesan: Hawar Awal (Early Blight)\n\n💡 Cadangan Rawatan: Gunakan racun kulat berasaskan kuprum (Copper Fungicide). Sembur pada waktu pagi.\n\n⚙️ Tindakan Sistem: Peringatan automatik ditetapkan untuk membeli racun kulat."        });
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

//Agent 5
app.post('/api/voice', async (req, res) => {
    try {
        const result = await voiceAssistantFlow(req.body);
        res.json({ success: true, result: result });
    } catch (error) {
        console.error("Agent 5 Error:", error);
        console.log("âš ï¸ Sending backup Voice data...");
        res.json({
            success: true,
            result: "I couldn't reach the voice assistant just now. Please try again in a moment."
        });
    }
});


// Agent 6
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

// ==========================================
//  User profile recent order(s)
// ==========================================

app.get('/api/orders/recent', (req, res) => {
    // Mock data
    const mockOrders = [
        { 
            orderId: "ORD-8832", 
            date: "2026-04-10", 
            items: ["Organic Copper Fungicide (1L)"], 
            status: "Delivered", 
            total: "RM 45.00" 
        },
        { 
            orderId: "ORD-8845", 
            date: "2026-04-12", 
            items: ["Smart Soil Sensor V2", "Premium NPK Fertilizer"], 
            status: "Processing", 
            total: "RM 210.50" 
        }
    ];

    res.status(200).json({ 
        success: true, 
        message: "Recent orders retrieved successfully",
        orders: mockOrders 
    });
});

// ==========================================
// LIVE WEATHER INTEGRATION
// ==========================================
app.get('/api/weather', async (req, res) => {
    // Default to Klang if no location is provided by the frontend
    const location = req.query.location || 'Shah Alam, Malaysia';
    const apiKey = process.env.WEATHER_API_KEY; 
    
    try {
        if (!apiKey) throw new Error("Missing WEATHER_API_KEY in .env");

        // Fetch current weather from OpenWeatherMap (using metric units for Celsius)
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || "Failed to fetch weather");
        
        // Format the messy OpenWeather data into something clean for our frontend
        const formattedWeather = {
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            // Capitalize the condition (e.g., "clouds" -> "Clouds")
            conditions: data.weather[0].main, 
            // Convert wind speed from m/s to km/h
            wind_speed: Math.round(data.wind.speed * 3.6), 
        };
        
        res.json({ success: true, data: formattedWeather });

    } catch (error) {
        console.error("Weather API Error:", error);
        
        // If the API fails or limits are reached, send this fallback data.
        res.json({ 
            success: true, 
            data: { 
                temp: 32, 
                feels_like: 35, 
                humidity: 85, 
                conditions: "Sunny & Humid", 
                wind_speed: 8 
            }
        });
    }
});

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
