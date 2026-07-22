import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { findBillByPaymentLink, markFriendPaid } from '../services/splitBillService';

export default function SplitBillCheckout() {
  const { billId, paymentLinkId } = useParams();
  const [bill, setBill] = useState(null);
  const [friend, setFriend] = useState(null);
  const [error, setError] = useState(null);
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const foundBill = findBillByPaymentLink(paymentLinkId);
    if (!foundBill) {
      setError('Invalid or expired payment link');
      return;
    }
    const foundFriend = foundBill.friends.find((f) => f.paymentLinkId === paymentLinkId);
    if (!foundFriend) {
      setError('Payment link not recognized');
      return;
    }
    if (foundFriend.status === 'paid') {
      setPaid(true);
    }
    setBill(foundBill);
    setFriend(foundFriend);
  }, [billId, paymentLinkId]);

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    markFriendPaid(billId, friend.id);
    setPaid(true);
    setProcessing(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-400 text-5xl mb-4">!</div>
          <h1 className="text-xl font-bold text-white mb-2">Payment Link Invalid</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!bill || !friend) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-green-400 text-5xl mb-4">&#10003;</div>
          <h1 className="text-xl font-bold text-white mb-2">Payment Confirmed</h1>
          <p className="text-gray-400 mb-4">
            Thank you, {friend.name}! Your payment of <span className="text-white font-bold">${friend.amountOwed.toFixed(2)}</span> has been recorded.
          </p>
          <p className="text-gray-500 text-sm">
            {bill.friends.filter((f) => f.status === 'paid').length} of {bill.friends.length} have paid
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Split Bill</h1>
          <p className="text-gray-400">{bill.restaurantName}</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Hi, {friend.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Your share</span>
            <span className="text-3xl font-bold text-indigo-300">${friend.amountOwed.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-6 space-y-1">
          <p>Hosted by <span className="text-white">{bill.hostName}</span></p>
          <p>Total bill: ${bill.total.toFixed(2)} &middot; {bill.friends.length} people</p>
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition-colors text-lg"
        >
          {processing ? 'Processing...' : `Pay $${friend.amountOwed.toFixed(2)}`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          This is a demo. No real payment is processed.
        </p>
      </div>
    </div>
  );
}
