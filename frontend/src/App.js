import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import logo from './assets/concordia-logo.png';
import ChatMessage from './components/ChatMessage';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm the SOEN 287 Web Programming Assistant. Ask me anything about HTML, CSS, JavaScript, React, or course-related questions!",
      sender: 'bot'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setIsLoading(true);
    setInput('');
    
    try {
      // Send message to API
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
      // const API_BASE = "http://localhost:5000";

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      // Add bot message to chat
      setMessages(prevMessages => [...prevMessages, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="Concordia University Logo" className="logo" />
        <h1>SOEN 287 Web Programming Assistant</h1>
      </header>
      
      <main className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about HTML, CSS, JavaScript, or course topics..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || input.trim() === ''}>
            Send
          </button>
        </form>
      </main>
      
      <footer className="footer">
        <p>SOEN 287 Bonus Assignment - Web Programming Chatbot</p>
        <p>© 2025 Concordia University</p>
      </footer>
    </div>
  );
}

export default App;