"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Utensils } from "lucide-react";

export default function DashboardGreeting() {
  const { data: session, status } = useSession();
  const [chatbotVisible, setChatbotVisible] = useState(false); // State to control visibility of the chatbot

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-orange-600 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4 text-xl">
            You must be logged in to view the dashboard
          </div>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-md font-medium hover:from-orange-600 hover:to-amber-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Extract first name for personalized greeting
  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const timeOfDay = getTimeOfDay();

  // Function to toggle the chatbot visibility
  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image with blur effect */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/dashboard.jpg')", // Path to your background image in the public folder
          filter: "blur(10px)", // Apply blur effect
        }}
      ></div>

      {/* Content overlay */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Greeting Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <Utensils className="h-10 w-10 mr-3" />
              <h1 className="text-3xl font-bold">BiteRush</h1>
            </div>

            <div className="text-center py-8">
              <h2 className="text-4xl font-bold mb-3">
                Good {timeOfDay}, {firstName}!
              </h2>
              <p className="text-xl opacity-90">
                Welcome to your food delivery dashboard
              </p>
              <p className="mt-2 text-lg opacity-80">
                What would you like to order today?
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/menu"
                  className="bg-white text-orange-600 hover:bg-orange-100 transition-colors px-6 py-3 rounded-md font-medium text-lg"
                >
                  Browse Menu
                </Link>
                <Link
                  href="/cart"
                  className="bg-orange-700 text-white hover:bg-orange-800 transition-colors px-6 py-3 rounded-md font-medium text-lg"
                >
                  View Cart
                </Link>
                <Link
                  href="/orders"
                  className="bg-red-700 text-white hover:bg-red-800 transition-colors px-6 py-3 rounded-md font-medium text-lg"
                >
                  View Orders
                </Link>
                <Link
                  href="/Statistics"
                  className="bg-red-700 text-white hover:bg-red-800 transition-colors px-6 py-3 rounded-md font-medium text-lg"
                >
                  Statistics
                </Link>
              </div>
              

              {/* Chatbot Button */}
              <div className="mt-16 flex justify-center items-center gap-4">
                <button
                  onClick={toggleChatbot}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-blue-600 transition-colors"
                >
                  {chatbotVisible ? 'Close Chatbot' : 'Can I help you?'}
                </button>
                <img
                  src="/bot.gif" // Path to the bot gif image in the public folder
                  alt="Bot Cartoon"
                  className="w-24 h-24 ml-4" // Increased size of the gif
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot iframe on the right side, positioned lower */}
      {chatbotVisible && (
        <div className="fixed right-5 bottom-10 w-[320px] h-[600px] bg-white z-50 border-l-2 overflow-hidden">
          {/* Header with title and close button */}
          <div className="bg-blue-500 text-white flex justify-between items-center p-2 rounded-t-lg">
            <div className="text-lg font-semibold pl-2">Chat with BITE-RUSH</div>
            <button
              onClick={toggleChatbot}
              className="text-xl font-semibold hover:text-gray-200 pr-2"
            >
              X
            </button>
          </div>

          {/* Chatbot iframe */}
          <iframe
            src="https://splendorous-starlight-0b9758.netlify.app/"
            width="100%"
            height="100%"
            style={{ border: "none", paddingTop: "20px" }} // Padding added to prevent cutoff
          ></iframe>
        </div>
      )}
    </div>
  );
}

// Helper function to get time of day for greeting
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
