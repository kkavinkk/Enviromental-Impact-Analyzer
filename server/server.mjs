import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const app = express();
const port = 3001; // Choose a different port from your Vite app (e.g., 3001)

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini with the API key from .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/api/analyze', async (req, res) => {
    try {
        const { productQuery } = req.body;
        if (!productQuery) {
            return res.status(400).json({ error: 'Product query is required' });
        }

        const prompt = `
            Provide environmental impact data for: "${productQuery}"
            Please return ONLY a JSON object with the following structure (no other text):
            {
                "carbon": [number in kg CO2e],
                "water": [number in liters],
                "energy": [number in MJ],
                "resource": [number in kg Sb eq],
                "description": "[brief description of the product/service]",
                "assumptions": "[key assumptions made in the calculation]"
            }
            Use realistic estimates based on lifecycle assessment data. If exact data isn't available, provide reasonable estimates with clear assumptions.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Use a more robust regex to find the JSON object
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            res.json(data);
        } else {
            res.status(500).json({ error: 'Could not parse environmental data from response.' });
        }

    } catch (error) {
        console.error('Error in /api/analyze:', error);
        res.status(500).json({ error: 'Failed to fetch environmental data.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});