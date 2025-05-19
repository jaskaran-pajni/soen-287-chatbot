// This is the backend server for the SOEN 287 Web Programming Chatbot.
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch'); 
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Domain-specific knowledge base
const courseKnowledge = {
  courseName: 'SOEN 287 - Web Programming',
  topics: [
    'HTML5', 'CSS3', 'JavaScript', 'DOM Manipulation', 
    'Form Validation', 'Responsive Design', 'Bootstrap',
    'Basic PHP', 'MySQL', 'Web Accessibility', 'React Basics'
  ],
  tools: [
    'Visual Studio Code', 'Chrome DevTools', 'Git', 'GitHub',
    'Node.js', 'npm', 'XAMPP/WAMP'
  ],
  assignments: [
    'Static Website Development', 
    'Interactive Form Creation',
    'Database Integration Project',
    'Final Full-Stack Application'
  ]
};

// Keyword filter
function isWithinDomain(query) {
  const domainKeywords = [
    'html', 'css', 'javascript', 'js', 'web', 'programming', 
    'frontend', 'backend', 'dom', 'react', 'node', 'soen', 
    'soen 287', 'web dev', 'website', 'responsive', 'bootstrap',
    'form', 'validation', 'php', 'mysql', 'database', 'concordia',
    'course', 'assignment', 'project', 'git', 'github'
  ];
  return domainKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

// Gemini-powered chatbot route
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!isWithinDomain(message)) {
      return res.json({
        response: "I'm specialized in SOEN 287 Web Programming topics only. Please ask me questions about HTML, CSS, JavaScript, web development, or this specific course content."
      });
    }

    const prompt = `
You are a Web Programming Assistant for SOEN 287 at Concordia University.
Help students understand web development concepts and course content clearly.

Course info: ${JSON.stringify(courseKnowledge)}

Only answer SOEN 287-relevant questions. Provide examples if useful.

User asked: ${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini didn't return a valid response.";
    res.json({ response: reply });

  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({
      response: "Sorry, something went wrong with the Gemini API."
    });
  }
});

// // Serve frontend
// app.use(express.static(path.join(__dirname, '../frontend/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
// });

const frontendPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


