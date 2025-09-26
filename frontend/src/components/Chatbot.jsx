import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  // 1. State for the proactive pop-up visibility
  const [showPopup, setShowPopup] = useState(true);

  const [messages, setMessages] = useState([
    {
      sender: "Bot",
      text: "Welcome! How can I help you with your plants today? 🌿"
    }
  ]);

  // 2. useEffect to automatically hide the pop-up after a delay
  useEffect(() => {
    // Only set the timer if the popup is currently visible
    if (showPopup && !open) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000); // Popup disappears after 5 seconds

      // Cleanup function to clear the timer if the component unmounts
      // or the dependencies change (though we only use it on mount/show)
      return () => clearTimeout(timer);
    }
  }, [showPopup, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput(""); // Clear input immediately for better UX

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: input });
      setMessages([...newMessages, { sender: "Bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "Bot", text: "Sorry, I'm having trouble connecting to the server." }]);
    }
  };

  // Function to handle the icon click
  const toggleChat = () => {
    // Hide the proactive popup immediately when the user opens the chat
    if (!open) {
      setShowPopup(false);
    }
    setOpen(!open);
  };

  return (
    <>
      {/* 3. Proactive Pop-up Cloud Message JSX */}
      {showPopup && !open && (
        <div 
          className="chatbot-popup-cloud" 
          onClick={toggleChat}
        >
          Hi! I'm your Plant Care Assistant. 🪴
        </div>
      )}

      <button
        // 4. Update the toggle button to use the new handler
        className="btn btn-success chatbot-toggle"
        onClick={toggleChat}
      >
        🤖
      </button>

      {open && (
        <div className="chatbot-window card shadow-sm p-2">
          <div className="chat-messages mb-2">
            {messages.map((m, i) => (
              <div key={i} className={m.sender === "You" ? "text-end" : "text-start"}>
                <b>{m.sender}:</b> {m.text}
              </div>
            ))}
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about plant care..."
            />
            <button className="btn btn-success" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}