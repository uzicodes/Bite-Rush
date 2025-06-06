import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

// Define the type of the statistics document
interface StatDoc {
  burger: number;
  pizza: number;
  drink: number;
  other: number; // Added Other category
}

// Connect MongoDB and get DB
async function getDB() {
  await client.connect(); // 🔥 SAFE in MongoDB v4/v5 – even if already connected
  return client.db("biterush");
}

// Handle GET request (fetch statistics)
export async function GET() {
  try {
    const db = await getDB();
    const statsCollection = db.collection<StatDoc>("statistics");

    const stats = await statsCollection.findOne({});

    if (!stats) {
      return NextResponse.json(
        { burger: 0, pizza: 0, drink: 0, other: 0 }, // Added Other
        { status: 200 }
      );
    }

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ message: "Error fetching statistics" }, { status: 500 });
  }
}

// Handle POST request (update statistics)
export async function POST(request: Request) {
  try {
    const { category } = await request.json(); // Get category from the request body

    if (!category) {
      return NextResponse.json({ message: "Missing category" }, { status: 400 });
    }

    const db = await getDB();
    const statsCollection = db.collection<StatDoc>("statistics");

    // Define the update data object with explicit typing
    const updateData: { [key in 'burger' | 'pizza' | 'drink' | 'other']: number } = {
      burger: 0,
      pizza: 0,
      drink: 0,
      other: 0, // Added Other
    };

    // Increment the relevant category counter
    if (category === "burger") {
      updateData.burger = 1;
    } else if (category === "pizza") {
      updateData.pizza = 1;
    } else if (category === "drink") {
      updateData.drink = 1;
    } else {
      updateData.other = 1; // All other categories are considered as 'other'
    }

    // Update the statistics in the database
    const result = await statsCollection.updateOne(
      {},
      { $inc: updateData }, // Increment the counter for the category
      { upsert: true } // Create the document if it doesn't exist
    );

    return NextResponse.json({ message: "Statistics updated", result }, { status: 200 });
  } catch (error) {
    console.error("Error updating statistics:", error);
    return NextResponse.json({ message: "Error updating statistics" }, { status: 500 });
  }
}
