const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({
  apiKey: 'AIzaSyACMr4IjJtUTabesq5NeOySgHhvBk0IpRw'
});

let chatHistory = [];

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    chatHistory.push({
      role: 'user',
      content: message
    });

    const response = await groq.chat.completions.create({
      messages: chatHistory,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantMessage = response.choices[0].message.content;

    chatHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

    res.json({ response: assistantMessage });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get response from Groq' });
  }
});

app.post('/api/reset', (req, res) => {
  chatHistory = [];
  res.json({ message: 'Chat reset' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('✅ Gemini API connected');
});
