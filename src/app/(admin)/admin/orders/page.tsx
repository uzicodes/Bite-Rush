"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderItems: CartItem[];
  subtotal: number;
  deliveryMethod: string;
  paymentMethod: string;
  total: number;
  tip: number;
  createdAt: Date;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch orders from the backend API
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: Order[] = await response.json();
        setOrders(data); // Set the fetched orders into state
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred");
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="font-semibold text-lg">Order ID: {order._id}</h2>
              <p>Customer Name: {order.customerName}</p>
              <p>Email: {order.customerEmail}</p>
              <p>Phone: {order.customerPhone}</p>
              <p>Delivery Method: {order.deliveryMethod}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Subtotal: ৳{order.subtotal}</p>
              <p>Tip: ৳{order.tip}</p>
              <p>Total: ৳{order.total}</p>
              <p>Order Items:</p>
              <ul>
                {order.orderItems.map((item, index) => (
                  <li key={index}>
                    {item.quantity} x {item.name} @ ৳{item.price} each
                  </li>
                ))}
              </ul>
              <p>Order Placed: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
