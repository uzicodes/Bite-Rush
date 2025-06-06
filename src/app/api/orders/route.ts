import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB client setup
const client = new MongoClient(process.env.MONGODB_URI as string);

interface Order {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderItems: {
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  deliveryMethod: string;
  paymentMethod: string;
  total: number;
  tip: number;
  createdAt: Date;
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Get order data from frontend
    
    console.log("Received Order Data:", data); // Log received data

    // Validate required fields
    if (!data.customerName || !data.customerEmail || !data.orderItems) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db("biterush"); // Your database name

    // Log the database connection
    console.log("Connected to MongoDB. Inserting data...");

    // Insert the order into the "orders" collection
    const result = await db.collection("orders").insertOne({
      ...data,
      createdAt: new Date(), // Add the creation date
    });

    console.log("Order saved with ID:", result.insertedId); // Log the inserted order ID

    // Return success response
    return NextResponse.json({ message: "Order confirmed!", orderId: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json({ message: "Failed to confirm order" }, { status: 500 });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
