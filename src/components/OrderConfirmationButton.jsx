// src/components/OrderConfirmationButton.jsx
import React, { useState } from 'react';
import axios from 'axios';

const OrderConfirmationButton = ({ customerEmail, orderDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // This function will be triggered when the customer clicks the button
  const handleConfirmOrder = async () => {
    setIsLoading(true);

    try {
      // Make the POST request to the backend
      const response = await axios.post('http://localhost:3000/confirm-order', {
        customerEmail,
        orderDetails,
      });

      // Handle the response from the server
      setMessage(response.data.message);  // 'Confirmation email sent successfully!'
    } catch (error) {
      console.error('Error confirming order:', error);
      setMessage('There was an error confirming your order.');
    }

    setIsLoading(false);
  };

  return (
    <div>
      {/* Button to confirm order */}
      <button onClick={handleConfirmOrder} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Confirm Order'}
      </button>

      {/* Message to show success or error */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default OrderConfirmationButton;
