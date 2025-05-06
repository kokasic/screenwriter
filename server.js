const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate', async (req, res) => {
  const { genre, idea, continuation } = req.body;

  let prompt = '';

  if (continuation) {
    prompt = `
Continue the following screenplay from where it left off.
Make sure to continue the story coherently in proper screenplay format (Courier, industry-standard layout).
Write the next 5 pages.

${continuation}
    `;
  } else {
    prompt = `
You are a professional Hollywood screenwriter.

Your task is to write a feature-length screenplay of 100–120 pages, formatted to industry standards (Courier 12pt, proper structure), based on the following concept:

Genre: ${genre}
Core Idea: ${idea}

Your output should include:
1. Title
2. Genre
3. Logline (a 1-2 sentence pitch)
4. Main Characters
5. 3-Act Structure Summary
6. First 5 script pages written in proper screenplay format

Be vivid, cinematic, and adhere to Hollywood formatting rules.
    `;
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });

    const screenplayOutput = response.data.choices[0].message.content;
    res.json({ idea: screenplayOutput });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate screenplay.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
