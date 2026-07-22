import { useState, useEffect } from 'react';
import {
  createBill,
  getAllBills,
  getBill,
  addItems,
  removeItem,
  addFriends,
  removeFriend,
  updateFriendAmount,
  editBillDetails,
  buildPaymentLink,
  deleteBill,
  updateBill,
} from '../services/splitBillService';
import { calculateSplitAmounts } from '../utils/splitBillModel';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  partial: 'bg-blue-500/20 text-blue-300',
  'fully-paid': 'bg-green-500/20 text-green-300',
  expired: 'bg-red-500/20 text-red-300',
};

export default function SplitBill() {
  const [bills, setBills] = useState([]);
  const [activeBillId, setActiveBillId] = useState(null);
  const [view, setView] = useState('list');
  const [form, setForm] = useState({
    hostName: '',
    hostEmail: '',
    restaurantName: '',
    tax: '',
    tip: '',
  });
  const [itemForm, setItemForm] = useState({ name: '', price: '', quantity: 1 });
  const [friendForm, setFriendForm] = useState({ name: '', email: '' });
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [editingBill, setEditingBill] = useState(false);
  const [editForm, setEditForm] = useState({ restaurantName: '', tax: '', tip: '' });
  const [customAmounts, setCustomAmounts] = useState({});

  useEffect(() => {
    setBills(getAllBills());
  }, []);

  const activeBill = activeBillId ? getBill(activeBillId) : null;

  const refresh = () => {
    setBills(getAllBills());
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    const bill = createBill({
      ...form,
      tax: parseFloat(form.tax) || 0,
      tip: parseFloat(form.tip) || 0,
    });
    setActiveBillId(bill.id);
    setView('detail');
    refresh();
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const price = parseFloat(itemForm.price);
    if (!itemForm.name || isNaN(price) || price <= 0) return;
    addItems(activeBillId, [{ name: itemForm.name, price, quantity: parseInt(itemForm.quantity) || 1 }]);
    setItemForm({ name: '', price: '', quantity: 1 });
    refresh();
  };

  const handleRemoveItem = (itemId) => {
    removeItem(activeBillId, itemId);
    refresh();
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!friendForm.name.trim()) return;
    addFriends(activeBillId, [{ name: friendForm.name, email: friendForm.email }]);
    setFriendForm({ name: '', email: '' });
    refresh();
  };

  const handleSplitMethodChange = (method) => {
    updateBill(activeBillId, { splitMethod: method });
    if (method === 'equal') {
      const bill = getBill(activeBillId);
      const recalculated = calculateSplitAmounts({ ...bill, friends: bill.friends }, 'equal');
      updateBill(activeBillId, { friends: recalculated });
      setCustomAmounts({});
    } else {
      const bill = getBill(activeBillId);
      const amounts = {};
      bill.friends.forEach((f) => { amounts[f.id] = f.amountOwed.toString(); });
      setCustomAmounts(amounts);
    }
    refresh();
  };

  const handleCustomAmountChange = (friendId, value) => {
    setCustomAmounts((prev) => ({ ...prev, [friendId]: value }));
  };

  const handleCustomAmountBlur = (friendId) => {
    const val = parseFloat(customAmounts[friendId]);
    if (!isNaN(val) && val >= 0) {
      updateFriendAmount(activeBillId, friendId, val);
      refresh();
    }
  };

  const handleStartEditBill = () => {
    if (!activeBill) return;
    setEditForm({
      restaurantName: activeBill.restaurantName,
      tax: activeBill.tax.toString(),
      tip: activeBill.tip.toString(),
    });
    setEditingBill(true);
  };

  const handleSaveBillEdit = () => {
    editBillDetails(activeBillId, {
      restaurantName: editForm.restaurantName,
      tax: parseFloat(editForm.tax) || 0,
      tip: parseFloat(editForm.tip) || 0,
    });
    setEditingBill(false);
    refresh();
  };

  const handleCopyLink = (friendId) => {
    const friend = activeBill.friends.find((f) => f.id === friendId);
    if (!friend) return;
    const link = buildPaymentLink(activeBillId, friend.paymentLinkId);
    navigator.clipboard.writeText(link);
    setCopiedLinkId(friendId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleDelete = (id) => {
    deleteBill(id);
    if (activeBillId === id) {
      setActiveBillId(null);
      setView('list');
    }
    refresh();
  };

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setView('list')} className="text-gray-400 hover:text-white mb-4 text-sm">
            &larr; Back to bills
          </button>
          <h1 className="text-3xl font-bold mb-6">Create Split Bill</h1>
          <form onSubmit={handleCreateBill} className="space-y-4 bg-gray-800 p-6 rounded-xl">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your Name</label>
              <input
                type="text"
                value={form.hostName}
                onChange={(e) => setForm({ ...form, hostName: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your Email</label>
              <input
                type="email"
                value={form.hostEmail}
                onChange={(e) => setForm({ ...form, hostEmail: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={form.restaurantName}
                onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tax ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.tax}
                  onChange={(e) => setForm({ ...form, tax: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tip ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.tip}
                  onChange={(e) => setForm({ ...form, tip: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Create Bill
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'detail' && activeBill) {
    const allPaid = activeBill.friends.length > 0 && activeBill.friends.every((f) => f.status === 'paid');
    const isUnequal = activeBill.splitMethod === 'custom';
    const splitTotal = activeBill.friends.reduce((sum, f) => sum + f.amountOwed, 0);
    const splitDiffers = Math.abs(splitTotal - activeBill.total) > 0.01;

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => { setView('list'); setActiveBillId(null); setEditingBill(false); }} className="text-gray-400 hover:text-white mb-4 text-sm">
            &larr; Back to bills
          </button>

          <div className="flex items-center gap-3 mb-6">
            {editingBill ? (
              <input
                type="text"
                value={editForm.restaurantName}
                onChange={(e) => setEditForm({ ...editForm, restaurantName: e.target.value })}
                className="text-3xl font-bold bg-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <h1 className="text-3xl font-bold">{activeBill.restaurantName}</h1>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[activeBill.status] || ''}`}>
              {activeBill.status}
            </span>
            {allPaid && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/30 text-green-200">
                Order Confirmed
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Items Section */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Order Items</h2>
                {editingBill ? (
                  <div className="flex gap-2">
                    <button onClick={handleSaveBillEdit} className="text-green-400 hover:text-green-300 text-sm font-medium">Save</button>
                    <button onClick={() => setEditingBill(false)} className="text-gray-400 hover:text-white text-sm">Cancel</button>
                  </div>
                ) : (
                  <button onClick={handleStartEditBill} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Edit Bill</button>
                )}
              </div>

              <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="$"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  className="w-20 bg-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  min="1"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                  className="w-14 bg-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add
                </button>
              </form>

              {activeBill.items.length === 0 ? (
                <p className="text-gray-500 text-sm">No items added yet</p>
              ) : (
                <div className="space-y-2">
                  {activeBill.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-700/50 rounded-lg px-3 py-2">
                      <span className="text-sm">
                        {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-300 text-xs">X</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-700 mt-4 pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${activeBill.subtotal.toFixed(2)}</span>
                </div>
                {editingBill ? (
                  <>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Tax</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.tax}
                        onChange={(e) => setEditForm({ ...editForm, tax: e.target.value })}
                        className="w-24 bg-gray-700 rounded px-2 py-1 text-white text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Tip</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.tip}
                        onChange={(e) => setEditForm({ ...editForm, tip: e.target.value })}
                        className="w-24 bg-gray-700 rounded px-2 py-1 text-white text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {activeBill.tax > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Tax</span>
                        <span>${activeBill.tax.toFixed(2)}</span>
                      </div>
                    )}
                    {activeBill.tip > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Tip</span>
                        <span>${activeBill.tip.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between text-white font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${activeBill.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Friends Section */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Split With</h2>
                <div className="flex bg-gray-700 rounded-lg p-0.5">
                  <button
                    onClick={() => handleSplitMethodChange('equal')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${!isUnequal ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Equal
                  </button>
                  <button
                    onClick={() => handleSplitMethodChange('custom')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${isUnequal ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Unequal
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddFriend} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Friend's name"
                  value={friendForm.name}
                  onChange={(e) => setFriendForm({ ...friendForm, name: e.target.value })}
                  className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={friendForm.email}
                  onChange={(e) => setFriendForm({ ...friendForm, email: e.target.value })}
                  className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add
                </button>
              </form>

              {activeBill.friends.length === 0 ? (
                <p className="text-gray-500 text-sm">No friends added yet</p>
              ) : (
                <div className="space-y-3">
                  {activeBill.friends.map((friend) => (
                    <div key={friend.id} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{friend.name}</span>
                          {friend.email && (
                            <span className="text-gray-400 text-xs ml-2">{friend.email}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            friend.status === 'paid'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {friend.status}
                          </span>
                          <button
                            onClick={() => handleCopyLink(friend.id)}
                            className="text-gray-400 hover:text-white text-xs"
                          >
                            {copiedLinkId === friend.id ? 'Copied!' : 'Copy Link'}
                          </button>
                          <button
                            onClick={() => removeFriend(activeBillId, friend.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {isUnequal ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={customAmounts[friend.id] ?? friend.amountOwed}
                            onChange={(e) => handleCustomAmountChange(friend.id, e.target.value)}
                            onBlur={() => handleCustomAmountBlur(friend.id)}
                            className="w-24 bg-gray-600 rounded px-2 py-1 text-lg font-bold text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-indigo-300">
                          ${friend.amountOwed.toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isUnequal && activeBill.friends.length > 0 && (
                <div className={`mt-3 text-sm ${splitDiffers ? 'text-red-400' : 'text-green-400'}`}>
                  Split total: ${splitTotal.toFixed(2)} / ${activeBill.total.toFixed(2)}
                  {splitDiffers && ' (does not match)'}
                </div>
              )}

              <div className="mt-4 space-y-2">
                {!isUnequal && (
                  <button
                    onClick={() => {
                      const bill = getBill(activeBillId);
                      const recalculated = calculateSplitAmounts({ ...bill, friends: bill.friends }, 'equal');
                      updateBill(activeBillId, { friends: recalculated });
                      refresh();
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
                  >
                    Recalculate Split
                  </button>
                )}
                <button
                  onClick={() => { handleDelete(activeBillId); }}
                  className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-300 py-2 rounded-lg text-sm transition-colors"
                >
                  Delete Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Split the Bill</h1>
          <button
            onClick={() => setView('create')}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + New Bill
          </button>
        </div>

        {bills.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No split bills yet</p>
            <p className="text-sm">Create a bill to start splitting costs with friends</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                onClick={() => { setActiveBillId(bill.id); setView('detail'); }}
                className="bg-gray-800 rounded-xl p-5 cursor-pointer hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{bill.restaurantName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[bill.status] || ''}`}>
                    {bill.status}
                  </span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Hosted by {bill.hostName}</p>
                  <p>{bill.friends.length} friend{bill.friends.length !== 1 ? 's' : ''} &middot; {bill.items.length} item{bill.items.length !== 1 ? 's' : ''}</p>
                  <p className="text-white font-bold text-lg mt-2">${bill.total.toFixed(2)}</p>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  {new Date(bill.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
