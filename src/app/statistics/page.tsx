"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function StatisticsPage() {
  const [data, setData] = useState([
    { name: "Burger", count: 0 },
    { name: "Pizza", count: 0 },
    { name: "Drink", count: 0 },
    { name: "Other", count: 0 }, // Added Other category
  ]);
  const [otherItems, setOtherItems] = useState<string[]>([]); // State to store other items
  const [isClient, setIsClient] = useState(false); // Prevents server-side rendering issues

  useEffect(() => {
    setIsClient(true); // Ensures the chart renders only on the client
    async function fetchStats() {
      const res = await fetch("/api/statistics");
      const stats = await res.json();
      setData([
        { name: "Burger", count: stats?.burger || 0 },
        { name: "Pizza", count: stats?.pizza || 0 },
        { name: "Drink", count: stats?.drink || 0 },
        { name: "Other", count: stats?.other || 0 }, // Fetch Other category data
      ]);

      // Fetch the items that fall under 'Other'
      const otherItemsList = await fetchOtherItems(); // Fetch items categorized as "Other"
      setOtherItems(otherItemsList);
    }

    fetchStats();
  }, []);

  const fetchOtherItems = async () => {
    // This function should fetch the names of items in the "Other" category
    // In this case, I'm hardcoding Shawarma and Biriyani as examples
    return ["Shawarma", "Biriyani"];
  };

  if (!isClient) {
    return null; // Prevents rendering until the client-side data is ready
  }

  // Custom tooltip to show item names when hovering over 'Other'
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const itemName = item.name === "Other" ? "Items in Other: " + otherItems.join(", ") : item.name;
      return (
        <div className="bg-gray-700 text-white p-2 rounded">
          <p>{itemName}</p>
          <p>Count: {item.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-12">
      <h1 className="text-5xl font-extrabold text-white mb-8 text-shadow-lg">
        Food Statistics
      </h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        <BarChart width={600} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 14, fill: "#444" }} />
          <YAxis tick={{ fontSize: 14, fill: "#444" }} />
          <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}
          <Bar dataKey="count" fill="#f87171" radius={[10, 10, 0, 0]} />
        </BarChart>
      </div>

      <div className="mt-10 text-white">
        <p className="text-xl">Check the popular items based on customer selections.</p>
      </div>
    </div>
  );
}
