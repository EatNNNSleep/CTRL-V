**Tani Agent: The Intelligent Farming Hub**

Empowering Malaysian Farmers with AI-Driven Insights, Accessibility, and Community Prevention.

Tani Agent is an all-in-one, intelligent agricultural assistant designed to bridge the gap between advanced AI technology and everyday farming. Built to simplify farm management, it acts as a personalized agronomist in the farmer's pocket. Whether diagnosing a dying crop, predicting seasonal tasks, or buying the right fertilizer, Tani Agent demystifies agricultural science into simple, actionable steps in the user's native language.

Built during the Hackathon (Track 1), this platform leverages Google's Gemini API, Cloud Run, and Firebase to deliver a high-speed, localized, and highly accessible farming ecosystem.

**Live Demo**

Video Demo: https://www.youtube.com/watch?v=ubjV_O9CxW8

Frontend Web App: https://tani-agent.web.app

Backend API (Cloud Run): https://tani-backend-215077089845.asia-southeast1.run.app

(Note: You can test the app immediately using the Frontend link above. The Local Setup steps below are for developers or judges who wish to review the source code or run the environment locally).

**Core Features**

--Voice-Activated Assistant (Accessibility First)
Designed for farmers working in the field or those who prefer not to type. Users can simply speak their problems in their native dialect or language, and the AI will transcribe, understand, and reply via text or voice.

--Multi-Lingual & Context-Aware AI
Automatically detects the farmer's language (English, Malay, Chinese, etc.) and responds dynamically using optimized prompt engineering. The advice is always concise, polite, and culturally localized to Malaysian agriculture.

--AI Crop Disease Diagnosis
Farmers can upload photos of sick plants or infested soil. The Gemini-powered vision model instantly identifies the disease or pest and provides a step-by-step treatment plan.

--Interactive Map & Outbreak Alerts
A smart mapping system that tracks the geographical spread of crop diseases. If a specific pest or blight is detected in a nearby farm, Tani Agent sends an automated early-warning alert to neighboring farmers so they can take preventive measures.

--Smart AI Task Management
Simplifies the daily routine by automatically generating personalized farming checklists. Based on the crop cycle, weather forecasts, and recent AI diagnoses, it schedules tasks like "Water the tomatoes today" or "Apply pesticide tomorrow."

--Smart Agricultural Store (E-Commerce Integration)
Seamlessly connects diagnosis with solutions. When the AI recommends a specific fertilizer, pesticide, or tool, the Smart Store feature instantly provides localized links to purchase the exact products needed from trusted agricultural suppliers.

**Architectural Overview**

Tani Agent is built on a decoupled, cloud-native architecture optimized for speed and scalability.

1. Frontend (User Interface)

Tech Stack: Next.js, React, Tailwind CSS, Framer Motion

Deployment: Firebase Hosting (Web Frameworks)

Role: Delivers a highly responsive, mobile-first web app. Handles voice recording, image uploads, and real-time map rendering while passing dynamic context to the backend.

2. Backend (Core API)

Tech Stack: Node.js, Express, TypeScript

AI Engine: Google Gemini API (via Firebase Genkit)

Deployment: Google Cloud Run (Dockerized)

Role: Processes multimodal inputs (audio/images/text), dynamically injects prompt constraints, orchestrates the AI logic, and serves JSON responses back to the client with near-zero latency.

**Local Setup & Installation**

1. Backend Setup
···bash
cd backend
npm install
##Create a .env file in the root of the backend folder and add your API key:
GEMINI_API_KEY=your_google_gemini_api_key_here
npm run dev
```
The backend will be available at http://localhost:8000.

2. Frontend Setup
```bash
cd frontend
npm install
##Create a .env.local file in the root of the frontend folder:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm run dev
```
The frontend will run on http://localhost:3000.

**Deployment Guide**

Deploying the Backend (Google Cloud Run)

Ensure your package-lock.json is synced (npm install), then run:

# Set your Google Cloud Project
gcloud config set project your-project-id

# Deploy your containerized Express app
gcloud run deploy tani-backend --source .


(Remember to add your GEMINI_API_KEY in the Google Cloud Run Console under Variables & Secrets).

Deploying the Frontend (Firebase Hosting)

In your frontend directory, create a .env.production file and link your live backend:

NEXT_PUBLIC_API_BASE_URL=[https://your-cloud-run-url.a.run.app](https://your-cloud-run-url.a.run.app)


Initialize and deploy via Firebase CLI:

firebase experiments:enable webframeworks
firebase init hosting
firebase deploy --only hosting


🔮 Future Enhancements (Roadmap)

While we built a fully functional core platform during the hackathon, we have a clear roadmap for scaling Tani Agent into a comprehensive agricultural ecosystem:

🌦️ Real-Time Weather API Integration: We plan to integrate live weather data (e.g., OpenWeatherMap) directly into the dashboard. This will allow the AI to cross-reference crop types with upcoming rain or drought forecasts, automatically adjusting task reminders.

📱 WhatsApp/Telegram Bot Integration: To make the AI even more accessible to rural farmers, we plan to deploy the Tani Agent directly into messaging apps they already use daily.

📊 Community Yield Analytics: An anonymized data dashboard for local agricultural departments to track which diseases are trending in specific regions, allowing for faster government intervention.
