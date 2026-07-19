/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Lazy initialization of GoogleGenAI to prevent startup crash if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoint for Gemini insights
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { sensors, weather } = req.body;
      if (!sensors || !weather) {
        res.status(400).json({ error: 'Sensors and weather data are required' });
        return;
      }

      const client = getAiClient();
      const prompt = `
        You are an expert Smart Agriculture and Greenhouse AI assistant.
        Analyze the following live sensor telemetry and current weather conditions:
        
        SENSOR TELEMETRY:
        ${JSON.stringify(sensors, null, 2)}
        
        WEATHER FORECAST:
        ${JSON.stringify(weather, null, 2)}
        
        Based on this data, provide intelligent control recommendations for the smart agriculture devices:
        - Water Pump (targetDevice: "water-pump")
        - Irrigation System (targetDevice: "irrigation")
        - Cooling Fan (targetDevice: "cooling-fan")
        - Exhaust Fan (targetDevice: "exhaust-fan")
        - Grow Light (targetDevice: "grow-light")
        - Window Controller (targetDevice: "window-controller")
        - Misting System (targetDevice: "misting")

        Ensure your recommendations are highly practical for crops or greenhouse management.
        Generate exactly 3 or 4 relevant, actionable recommendations.
        For each recommendation, assign a unique temporary ID (e.g., "rec-1", "rec-2").
        Use the requested JSON schema.
      `;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                trigger: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                reason: { type: Type.STRING },
                targetDevice: { type: Type.STRING },
                suggestedState: { 
                  type: Type.STRING, 
                  description: 'Must be ON, OFF, or AUTO' 
                },
              },
              required: ['id', 'trigger', 'recommendation', 'reason', 'targetDevice', 'suggestedState'],
            }
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const recommendations = JSON.parse(responseText);
        res.json({ recommendations });
      } else {
        res.status(500).json({ error: 'Empty response from Gemini' });
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ 
        error: 'Failed to generate recommendations using Gemini AI',
        details: error.message 
      });
    }
  });

  // API endpoint for plant disease prediction and diagnosis
  app.post('/api/gemini/predict-disease', async (req, res) => {
    try {
      const { image, plantHint } = req.body;
      if (!image) {
        res.status(400).json({ error: 'Foliage image data is required' });
        return;
      }

      const client = getAiClient();
      
      // Extract clean base64 data and mime type
      const base64Data = image.split(',')[1] || image;
      const mimeType = image.split(';')[0]?.split(':')[1] || 'image/jpeg';

      const prompt = `
        You are an expert plant pathologist and NESA smart agricultural advisory system.
        Analyze the provided plant foliage leaf image (User crop indicator: ${plantHint || 'Unknown'}).
        
        Please diagnose this plant for any health issues, pathogens, nutrient deficiencies, or pests.
        Your diagnosis must include:
        1. Clean crop plant name and common scientific name in parentheses.
        2. Status: Either 'Healthy', 'Diseased', or 'Warning'.
        3. Disease Name: The specific disease/issue, or 'None Detected' if healthy.
        4. Scientific Name: The scientific name of the pathogen, or 'N/A' if healthy.
        5. Confidence: Integer rating from 0 to 100 on diagnostic confidence.
        6. Severity: One of 'None', 'Low', 'Moderate', 'High', or 'Critical'.
        7. Symptoms: Array of key visual symptoms identified on the leaf structure.
        8. Organic Treatment: List of organic/biological curatives and culture steps.
        9. Chemical Treatment: List of synthetic fungicides/pesticides or 'None' if healthy.
        10. Preventative Measures: Standard farm procedures to avoid recurring infection.
        11. Health Score: Estimated integer rating from 0 to 100 for overall plant vigor.
        12. NESA Adaptive Measures: Precise microclimate actuator adjust recommendations (e.g. "Reduce misting duration by 30%", "Increase circulation fans to constant high-flow", etc.) that coordinate with our automated greenhouse systems to stop the disease vector.

        Output your response matching the requested JSON structure exactly.
      `;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plant: { type: Type.STRING },
              status: { type: Type.STRING }, // 'Healthy' | 'Diseased' | 'Warning'
              diseaseName: { type: Type.STRING },
              scientificName: { type: Type.STRING },
              confidence: { type: Type.INTEGER },
              severity: { type: Type.STRING }, // 'None' | 'Low' | 'Moderate' | 'High' | 'Critical'
              symptoms: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              organicTreatment: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              chemicalTreatment: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              preventativeMeasures: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              healthScore: { type: Type.INTEGER },
              nesaMeasures: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: [
              'plant', 'status', 'diseaseName', 'scientificName', 'confidence', 
              'severity', 'symptoms', 'organicTreatment', 'chemicalTreatment', 
              'preventativeMeasures', 'healthScore', 'nesaMeasures'
            ]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const diagnosis = JSON.parse(responseText);
        res.json({ diagnosis });
      } else {
        res.status(500).json({ error: 'Empty response from Gemini disease predictor' });
      }
    } catch (error: any) {
      console.error('Gemini Disease Predictor Error:', error);
      res.status(500).json({ 
        error: 'Failed to diagnose crop disease using Gemini AI',
        details: error.message 
      });
    }
  });

  // Mock OpenWeather endpoint to keep client calls self-contained & secure
  app.get('/api/weather', (req, res) => {
    // Return high-fidelity realistic dynamic data or mock telemetry
    res.json({
      location: 'Greenhouse Zone A, CA',
      temp: 26.8,
      condition: 'Partly Cloudy',
      conditionCode: 'cloudy',
      humidity: 62,
      windSpeed: 12.4,
      rainProb: 15,
      pressure: 1012,
      uvIndex: 4,
      aqi: 42,
      sunrise: '06:14 AM',
      sunset: '08:22 PM',
    });
  });

  // Vite Integration
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
