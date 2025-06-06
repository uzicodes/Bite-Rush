import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (userInput.trim() !== "") {
      // Show user message in the chat
      setMessages([...messages, { sender: "user", text: userInput }]);

      try {
        // Send the user message to the backend API (/api/chat)
        const response = await axios.post("/api/chat", {
          message: userInput,
        });

        // Add the bot's response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: response.data.reply }, // Assuming the API returns a 'reply' key
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Sorry, I couldn't understand that." },
        ]);
      }

      // Clear the input field after sending the message
      setUserInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatWindow}>
        <div style={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={msg.sender === "user" ? styles.userMessage : styles.botMessage}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          style={styles.inputField}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>
    </div>
  );
};

// Inline styles for the chatbot
const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "330px", // Adjust width for a sleeker look
    height: "450px",
    backgroundColor: "#F0F9FF",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out",
  },
  chatWindow: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    backgroundColor: "#E1F5FE",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#1976D2",
    color: "white",
    padding: "12px 18px",
    borderRadius: "20px",
    maxWidth: "75%",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#BBDEFB",
    color: "#1976D2",
    padding: "12px 18px",
    borderRadius: "20px",
    maxWidth: "75%",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "12px",
    backgroundColor: "#F0F9FF",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
  },
  inputField: {
    width: "90%",
    padding: "12px 18px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#81D4FA",
    color: "#1976D2",
    fontSize: "14px",
    outline: "none",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default Chatbot;
