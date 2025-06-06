import axios from 'axios';

// Access the API key from the environment variables
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body; // Extract the message from the frontend request

    try {
      // Log the incoming message for debugging purposes
      console.log("Incoming message:", message);

      // Send the request to Google Gemini API
      const response = await axios.post(
        'https://api.googleapis.com/gemini/v1/endpoint', // The correct Google Gemini API endpoint (ensure it's correct)
        {
          prompt: message, // The message the user typed (passed as prompt)
          maxTokens: 150,   // Limit on the response length (can adjust as needed)
          temperature: 0.7, // Adjust the creativity of the response
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // Use the API key from .env.local
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response from Gemini API for debugging purposes
      console.log("Gemini API response:", response.data);

      // Send the reply from Gemini API back to the frontend
      res.status(200).json({ reply: response.data.reply }); // Assuming 'reply' is the key returned by Gemini
    } catch (error) {
      console.error('Error interacting with Google Gemini API:', error);
      res.status(500).json({ error: 'Something went wrong while processing the message.' });
    }
  } else {
    // If the method is not POST, return 405 (Method Not Allowed)
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
