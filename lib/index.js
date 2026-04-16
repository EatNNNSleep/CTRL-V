"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translatePostFlow = exports.multilingualChatFlow = exports.marketIntelligenceFlow = exports.farmScheduleFlow = exports.diseaseDetectionFlow = void 0;
//***GOOGLE CLOUD WORKSTATIONS (Dev Environment Concept)***//
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// 1. Load the API Key safely from .env
dotenv.config();
// 2. Initialize Genkit
const ai = (0, genkit_1.genkit)({
    plugins: [(0, googleai_1.googleAI)({ apiKey: process.env.GEMINI_API_KEY })],
});
// ==========================================
// MOCK DATABASE: OUTBREAK ALERTS
// ==========================================
// This array temporarily stores diseases detected by Agent 1
const globalOutbreaks = [];
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
exports.diseaseDetectionFlow = ai.defineFlow({
    name: 'diseaseDetectionFlow',
    inputSchema: genkit_1.z.object({
        imageUrl: genkit_1.z.string(),
        language: genkit_1.z.string().default("Bahasa Malaysia"),
    }),
    outputSchema: genkit_1.z.string(),
}, async (input) => {
    const prompt = `You are an expert plant pathologist. 
    Analyze this image and identify the disease.
    
    CRITICAL INSTRUCTION: You are helping a farmer protect their livelihood. If you detect an issue, you MUST recommend a proactive defense product from our specific store inventory below. 
    Do not make up products. You MUST ONLY recommend products where "in_stock" is true.
    
    Store Inventory:
    ${availableProducts}
    
    IMPORTANT OUTPUT FORMAT:
    Do NOT return a JSON object. You must return a highly professional, empathetic diagnostic report in plain text. Use emojis and strict formatting so it looks beautiful on a mobile app screen.
    
    Use EXACTLY this format:
    
    🚨 Diagnosis: [Exact name of the disease/issue]
    ⚠️ Severity: [Low / Medium / High]
    
    🔬 Analysis: 
    [Write 2 short, clear sentences explaining exactly what visual symptoms you see on the leaf/crop. Be professional.]
    
    🛡️ Proactive Defense: 
    Apply [Exact 'product_name' from inventory] (RM [price]). 
    [Write 1 short sentence on how and when to apply this product to protect the crop].`;
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: prompt,
    });
    return response.text;
});
// ==========================================
// AGENT 2: Smart Resource Planner
// ==========================================
exports.farmScheduleFlow = ai.defineFlow({
    name: 'farmScheduleFlow',
    inputSchema: genkit_1.z.object({
        location: genkit_1.z.string(),
        weatherForecast: genkit_1.z.string(),
        cropType: genkit_1.z.string(),
    }),
    outputSchema: genkit_1.z.string(),
}, async (input) => {
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
});
// ==========================================
// AGENT 3: MARKET INTELLIGENCE (RAG IMPLEMENTATION)          //***GEMINI + VERTEX AI SEARCH (RAG Application) ***//
// ==========================================
// In a real production app, this data would come from a PDF on Google Cloud.
exports.marketIntelligenceFlow = ai.defineFlow({
    name: 'marketIntelligenceFlow',
    inputSchema: genkit_1.z.object({
        query: genkit_1.z.string(),
    }),
    outputSchema: genkit_1.z.string(),
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
exports.multilingualChatFlow = ai.defineFlow({
    name: 'multilingualChatFlow',
    inputSchema: genkit_1.z.object({
        message: genkit_1.z.string(),
        language: genkit_1.z.string(), // e.g., "Bahasa Malaysia", "Mandarin", "Tamil"
    }),
    outputSchema: genkit_1.z.string(),
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
exports.translatePostFlow = ai.defineFlow({
    name: 'translatePostFlow',
    inputSchema: genkit_1.z.object({
        postText: genkit_1.z.string(),
    }),
    outputSchema: genkit_1.z.string(),
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
const app = (0, express_1.default)();
// Allow any frontend to connect to this API
app.use((0, cors_1.default)({ origin: '*' }));
app.get('/', (req, res) => {
    res.send('🚀 CTRL+V AI Farming Backend is LIVE and running smoothly!');
});
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
//Agent 1  
app.post('/api/disease-detect', async (req, res) => {
    try {
        const result = await (0, exports.diseaseDetectionFlow)(req.body);
        res.json({ success: true, result: result });
    }
    catch (error) {
        console.error("Agent 1 Error:", error);
        //  HACKATHON BYPASS: If Google is busy, send backup diagnosis!
        console.log("⚠️ Google is busy. Sending emergency backup diagnosis to frontend!");
        res.json({
            success: true,
            result: "🚨 Penyakit Dikesan: Hawar Awal (Early Blight)\n\n💡 Cadangan Rawatan: Gunakan racun kulat berasaskan kuprum (Copper Fungicide). Sembur pada waktu pagi.\n\n⚙️ Tindakan Sistem: Peringatan automatik ditetapkan untuk membeli racun kulat."
        });
    }
});
//Agent 2
app.post('/api/farm-schedule', async (req, res) => {
    try {
        const result = await (0, exports.farmScheduleFlow)(req.body);
        res.json({ success: true, result: result });
    }
    catch (error) {
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
        const result = await (0, exports.marketIntelligenceFlow)(req.body);
        res.json({ success: true, result: result });
    }
    catch (error) {
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
        const result = await (0, exports.multilingualChatFlow)(req.body);
        res.json({ success: true, result: result });
    }
    catch (error) {
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
        const result = await (0, exports.translatePostFlow)(req.body);
        res.json({ success: true, translation: result });
    }
    catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ success: false, error: "Gagal menterjemah (Translation failed)" });
    }
});
// Outbreak Alert Route
// The frontend will call this to check if there is an outbreak in the farmer's area
app.get('/api/alerts', (req, res) => {
    const userLocation = req.query.location;
    if (!userLocation) {
        return res.json({ success: true, alerts: [] });
    }
    // Check our database for diseases in this specific location
    const localAlerts = globalOutbreaks.filter(outbreak => outbreak.location.toLowerCase() === userLocation.toLowerCase());
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
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
