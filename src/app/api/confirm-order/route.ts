import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Get MongoDB URI from environment variables
const client = new MongoClient(process.env.MONGODB_URI as string);

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Get order data from the frontend
    
    // Validate the received order data
    if (!data.customerName || !data.customerEmail || !data.orderDetails) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db("biterush"); // Your database name

    // Insert the order into the "orders" collection
    const result = await db.collection("orders").insertOne(data);

    // Return a success response
    return NextResponse.json({ message: "Order confirmed!", orderId: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json({ message: "Failed to confirm order" }, { status: 500 });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
