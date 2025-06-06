// pages/api/recommendations.js
export default function handler(req, res) {
    const { message } = req.body; // Get the user message

    // For now, we'll just simulate a recommendation based on the message.
    // You can integrate more complex logic or a database query here.
    let recommendations = [];

    if (message.toLowerCase().includes("spicy")) {
        recommendations = ["Spicy Chicken Wings", "Spicy Tacos"];
    } else if (message.toLowerCase().includes("vegan")) {
        recommendations = ["Vegan Burger", "Vegan Salad"];
    } else {
        recommendations = ["Pizza", "Pasta", "Burger"];
    }

    // Send the response
    res.status(200).json({ recommendation: recommendations });
}
