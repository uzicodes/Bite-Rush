const express = require("express");
const axios = require("axios");

const app = express();
const port = 5000; // You can change the port number

// Middleware to parse JSON body data
app.use(express.json());

// Your Google Gemini API key
const apiKey = "AIzaSyC-LbaXKkdufDE0jsqqdkCxIInCmm3QpNY"; // Replace this with your actual API key

// API endpoint to interact with Google Gemini API
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Send request to Google Gemini API
    const response = await axios.post(
      "https://api.googleapis.com/gemini/v1/endpoint", // Use the correct Gemini API endpoint
      {
        prompt: message,
        maxTokens: 150, // Adjust based on your preference
        temperature: 0.7, // Adjust for creativity (higher = more creative)
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send the response from Gemini back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error interacting with Google Gemini API:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
