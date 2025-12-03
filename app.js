import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';

// Ensure JSON body parsing middleware is used before routes
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body || {};
    if (!prompt) {
        return res.status(400).json({ error: "Missing 'prompt' in request body" });
    }
    try {
        const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt
        });
        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'Failed to generate text' });
    }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Missing 'image' file in request" });
    }
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString('base64');
    try {
        
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {text : prompt, type: "text"},
                {inlineData:{data: base64Image, mimeType: req.file.mimetype}}
            ],

        });
        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
        const { prompt } = req.body;
        const base64Document = req.file.buffer.toString('base64');
        try {
            
            const response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: [
                    {text : prompt ?? "tolong jelaskan isi dokumen berikut secara rinci", type: "text"},
                    {inlineData:{data: base64Document, mimeType: req.file.mimetype}}
                ],
    
            });
            res.status(200).json({ result: response.text });
        } catch (error) {
            console.error('Error generating document:', error);
            res.status(500).json({ error: 'Failed to generate document' });
        }
});


app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Missing 'audio' file in request" });
    }
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString('base64');
    try {
        
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {text : prompt ?? "tolong buatkan transkrip dari rekaman berikut", type: "text"},
                {inlineData:{data: base64Audio, mimeType: req.file.mimetype}}
            ],

        });
        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).json({ error: 'Failed to generate audio' });
    }
});