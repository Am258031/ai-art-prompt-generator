const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Schema
const PromptSchema = new mongoose.Schema({
    userInput: String,
    aiPrompt: String,
    createdAt: { type: Date, default: Date.now }
});

const Prompt = mongoose.model('Prompt', PromptSchema);

// AI Prompt Generator Logic (Dummy Example)
// function generatePrompt(input) {
//     return `A beautiful digital artwork based on: ${input}. Cinematic lighting, 8K resolution, digital painting.`;
// }
function generatePrompt(input) {
    const styles = [
        "cyberpunk theme",
        "surreal landscape",
        "futuristic design",
        "vintage illustration",
        "anime style",
        "pixel art",
        "steampunk universe",
        "dreamlike fantasy"
    ];

    const environments = [
        "glowing forest",
        "mystical desert",
        "floating island",
        "galactic space",
        "abandoned city",
        "underwater kingdom"
    ];

    const qualities = [
        "ultra-realistic lighting",
        "4K ultra-HD",
        "digital oil painting",
        "concept art",
        "matte painting style",
        "photo-real rendering",
        "neon lighting",
        "cinematic shadows"
    ];

    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return `Imagine ${input} in a ${random(styles)} inside a ${random(environments)}, featuring ${random(qualities)}.`;
}


// POST route to generate and store prompt
app.post('/api/prompt', async (req, res) => {
    const { userInput } = req.body;
    const aiPrompt = generatePrompt(userInput);

    const newPrompt = new Prompt({ userInput, aiPrompt });
    await newPrompt.save();

    res.json({ aiPrompt });
});

// ✅ NEW: GET route to fetch all prompts
app.get('/api/prompts', async (req, res) => {
    try {
        const prompts = await Prompt.find().sort({ createdAt: 1 }); // sorted by oldest first
        res.json(prompts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching prompts' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
