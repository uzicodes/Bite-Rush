import mongoose from "mongoose";

// Define the schema for the order logs
const OrderLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },  // The ID of the user
    userName: { type: String, required: true },  // The name of the user
    actionType: { type: String, enum: ["Update", "Cancel"], required: true },  // Action type
    orderId: { type: [String], required: true },  // Multiple order IDs (array of strings)
    timestamp: { type: Date, default: Date.now },  // Timestamp of the action
  },
  { timestamps: true } // Mongoose will add createdAt and updatedAt fields automatically
);

// Define the model for the OrderLog schema
const OrderLog =
  mongoose.models.OrderLog || mongoose.model("OrderLog", OrderLogSchema);

export default OrderLog;
