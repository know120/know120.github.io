/**
 * Split Bill Data Models and Validation
 * Schema for food order cost splitting with friends
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {Object} Friend
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {number} amountOwed
 * @property {string} paymentLinkId
 * @property {'pending'|'paid'|'declined'} status
 * @property {string|null} paidAt - ISO timestamp or null
 */

/**
 * @typedef {Object} SplitBill
 * @property {string} id
 * @property {string} orderId
 * @property {string} hostName
 * @property {string} hostEmail
 * @property {string} restaurantName
 * @property {OrderItem[]} items
 * @property {number} subtotal
 * @property {number} tax
 * @property {number} tip
 * @property {number} total
 * @property {string} splitMethod - 'equal' | 'custom' | 'by-item'
 * @property {Friend[]} friends
 * @property {'pending'|'partial'|'fully-paid'|'expired'} status
 * @property {string} createdAt - ISO timestamp
 * @property {string} expiresAt - ISO timestamp
 * @property {string|null} confirmedAt - ISO timestamp when all paid
 */

export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createOrderItem = (data = {}) => ({
  id: data.id || generateId(),
  name: data.name || '',
  price: data.price || 0,
  quantity: data.quantity || 1,
});

export const createFriend = (data = {}) => ({
  id: data.id || generateId(),
  name: data.name || '',
  email: data.email || '',
  amountOwed: data.amountOwed || 0,
  paymentLinkId: data.paymentLinkId || generateId(),
  status: data.status || 'pending',
  paidAt: data.paidAt || null,
});

export const createSplitBill = (data = {}) => {
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: data.id || generateId(),
    orderId: data.orderId || generateId(),
    hostName: data.hostName || '',
    hostEmail: data.hostEmail || '',
    restaurantName: data.restaurantName || '',
    items: data.items || [],
    subtotal: data.subtotal || 0,
    tax: data.tax || 0,
    tip: data.tip || 0,
    total: data.total || 0,
    splitMethod: data.splitMethod || 'equal',
    friends: data.friends || [],
    status: data.status || 'pending',
    createdAt: data.createdAt || now,
    expiresAt: data.expiresAt || expires,
    confirmedAt: data.confirmedAt || null,
  };
};

export const calculateSplitAmounts = (bill, method = 'equal') => {
  const { total, friends } = bill;
  if (!friends.length) return [];

  if (method === 'equal') {
    const share = total / friends.length;
    return friends.map((f) => ({ ...f, amountOwed: Math.round(share * 100) / 100 }));
  }

  return friends.map((f) => ({ ...f, amountOwed: Math.round((f.amountOwed || 0) * 100) / 100 }));
};

export const recalcTotal = (items, tax = 0, tip = 0) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { subtotal, total: subtotal + tax + tip };
};

export const validateSplitBill = (bill) => {
  const errors = [];

  if (!bill.hostName?.trim()) errors.push('Host name is required');
  if (!bill.hostEmail?.trim()) errors.push('Host email is required');
  if (!bill.restaurantName?.trim()) errors.push('Restaurant name is required');
  if (!bill.items?.length) errors.push('At least one item is required');
  if (bill.total <= 0) errors.push('Total must be greater than zero');
  if (!bill.friends?.length) errors.push('At least one friend is required');
  if (bill.friends?.some((f) => !f.name?.trim())) errors.push('All friends must have a name');
  if (bill.friends?.some((f) => f.amountOwed <= 0)) errors.push('All split amounts must be positive');

  return { isValid: errors.length === 0, errors };
};

export const getBillStatus = (bill) => {
  if (new Date(bill.expiresAt) < new Date()) return 'expired';
  const allPaid = bill.friends.every((f) => f.status === 'paid');
  if (allPaid) return 'fully-paid';
  const anyPaid = bill.friends.some((f) => f.status === 'paid');
  if (anyPaid) return 'partial';
  return 'pending';
};
