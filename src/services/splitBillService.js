import {
  createSplitBill,
  createOrderItem,
  createFriend,
  calculateSplitAmounts,
  recalcTotal,
  getBillStatus,
} from '../utils/splitBillModel';

const STORAGE_KEY = 'splitBills';

const loadBills = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveBills = (bills) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
};

export const createBill = (data) => {
  const bill = createSplitBill(data);
  const bills = loadBills();
  bills.push(bill);
  saveBills(bills);
  return bill;
};

export const getBill = (id) => {
  return loadBills().find((b) => b.id === id) || null;
};

export const getAllBills = () => {
  return loadBills().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

export const updateBill = (id, updates) => {
  const bills = loadBills();
  const idx = bills.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bills[idx] = { ...bills[idx], ...updates, status: getBillStatus({ ...bills[idx], ...updates }) };
  saveBills(bills);
  return bills[idx];
};

export const deleteBill = (id) => {
  const bills = loadBills().filter((b) => b.id !== id);
  saveBills(bills);
};

export const markFriendPaid = (billId, friendId) => {
  const bills = loadBills();
  const bill = bills.find((b) => b.id === billId);
  if (!bill) return null;

  const friend = bill.friends.find((f) => f.id === friendId);
  if (!friend) return null;

  friend.status = 'paid';
  friend.paidAt = new Date().toISOString();
  bill.status = getBillStatus(bill);
  if (bill.status === 'fully-paid') {
    bill.confirmedAt = new Date().toISOString();
  }

  saveBills(bills);
  return bill;
};

export const findBillByPaymentLink = (paymentLinkId) => {
  return loadBills().find((b) =>
    b.friends.some((f) => f.paymentLinkId === paymentLinkId)
  ) || null;
};

export const getFriendByPaymentLink = (billId, paymentLinkId) => {
  const bill = getBill(billId);
  if (!bill) return null;
  return bill.friends.find((f) => f.paymentLinkId === paymentLinkId) || null;
};

export const buildPaymentLink = (billId, paymentLinkId) => {
  return `${window.location.origin}/#/split-bill/checkout/${billId}/${paymentLinkId}`;
};

export const addItems = (billId, items) => {
  const bill = getBill(billId);
  if (!bill) return null;

  const newItems = items.map((i) => createOrderItem(i));
  const updatedItems = [...bill.items, ...newItems];
  const { subtotal, total } = recalcTotal(updatedItems);

  return updateBill(billId, { items: updatedItems, subtotal, total });
};

export const removeItem = (billId, itemId) => {
  const bill = getBill(billId);
  if (!bill) return null;

  const updatedItems = bill.items.filter((i) => i.id !== itemId);
  const { subtotal, total } = recalcTotal(updatedItems);

  return updateBill(billId, { items: updatedItems, subtotal, total });
};

export const updateFriendAmount = (billId, friendId, amount) => {
  const bill = getBill(billId);
  if (!bill) return null;

  const updatedFriends = bill.friends.map((f) =>
    f.id === friendId ? { ...f, amountOwed: Math.round(amount * 100) / 100 } : f
  );

  return updateBill(billId, { friends: updatedFriends });
};

export const editBillDetails = (billId, updates) => {
  const bill = getBill(billId);
  if (!bill) return null;

  const { subtotal, total } = recalcTotal(bill.items);

  return updateBill(billId, { ...updates, subtotal, total });
};

export const addFriends = (billId, friends) => {
  const bill = getBill(billId);
  if (!bill) return null;

  const newFriends = friends.map((f) => createFriend(f));
  const updatedFriends = [...bill.friends, ...newFriends];
  const split = calculateSplitAmounts({ ...bill, friends: updatedFriends }, bill.splitMethod);

  return updateBill(billId, { friends: split });
};

export const removeFriend = (billId, friendId) => {
  const bill = getBill(billId);
  if (!bill) return null;

  const updatedFriends = bill.friends.filter((f) => f.id !== friendId);
  const split = calculateSplitAmounts({ ...bill, friends: updatedFriends }, bill.splitMethod);

  return updateBill(billId, { friends: split });
};
