import express from 'express';
import cors from 'cors';
import { generateSyntheticDataset } from './mockData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store for transactions
let transactions = generateSyntheticDataset();
let isChaosMode = false;

// Middleware to simulate network latency (150ms - 350ms) for realistic UX
app.use((req, res, next) => {
  // Add small latency unless it's a health check
  if (req.path === '/api/health') return next();
  const latency = Math.floor(Math.random() * 200) + 150;
  setTimeout(next, latency);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ArbaazPay Merchant API', time: new Date().toISOString() });
});

// In-memory registered users (in addition to default accounts)
const registeredUsers = [];

// Registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, storeName } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  const cleanName = (name || '').trim();
  const cleanRole = role === 'admin' ? 'admin' : 'merchant';
  const cleanStoreName =
    (storeName || '').trim() ||
    (cleanRole === 'admin'
      ? 'ArbaazPay Gateway Platform (Super Admin)'
      : `${cleanName}'s Store`);

  if (!cleanName) {
    return res.status(400).json({ success: false, error: 'Full name or merchant name is required.' });
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email address is required.' });
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    return res.status(400).json({ success: false, error: 'Password must be at least 4 characters.' });
  }

  // Check default accounts
  if (cleanEmail === 'user@merchant.com' || cleanEmail === 'arbaaz@admin.com') {
    return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
  }

  // Check existing registered users
  if (registeredUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
    return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
  }

  const user = {
    id: `usr_${cleanRole.slice(0, 3)}_${Date.now().toString().slice(-6)}`,
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword,
    role: cleanRole,
    title: cleanRole === 'admin' ? 'Platform Operations Lead' : 'Store Operations Manager',
    permissions:
      cleanRole === 'admin'
        ? ['read:all', 'write:refund', 'admin:system', 'admin:chaos', 'export:data']
        : ['read:store', 'request:refund', 'export:data'],
    storeName: cleanStoreName,
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(user);

  const { password: _, ...publicUser } = user;
  return res.json({ success: true, user: publicUser });
});

// Authentication endpoint (Strict role-based login)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // 1. Merchant Credentials
  if (cleanEmail === 'user@merchant.com' && cleanPassword === '00001234') {
    return res.json({
      success: true,
      user: {
        id: 'usr_mer_007',
        name: 'Test Merchant',
        email: 'user@merchant.com',
        role: 'merchant',
        title: 'Store Operations Manager',
        permissions: ['read:store', 'request:refund', 'export:data'],
        storeName: 'Zepto Quick Mart - Indiranagar'
      }
    });
  }

  // 2. Admin Credentials
  if (cleanEmail === 'arbaaz@admin.com' && cleanPassword === '00006789') {
    return res.json({
      success: true,
      user: {
        id: 'usr_admin_001',
        name: 'Arbaaz Admin',
        email: 'arbaaz@admin.com',
        role: 'admin',
        title: 'Platform Operations Lead',
        permissions: ['read:all', 'write:refund', 'admin:system', 'admin:chaos', 'export:data'],
        storeName: 'ArbaazPay Gateway Platform (Super Admin)'
      }
    });
  }

  // 3. Registered Users
  const registeredFound = registeredUsers.find(
    u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
  );
  if (registeredFound) {
    const { password: _, ...publicUser } = registeredFound;
    return res.json({ success: true, user: publicUser });
  }

  // Reject all other credentials
  return res.status(401).json({
    success: false,
    error: 'Invalid email or password.'
  });
});

// Chaos toggle endpoint (Admin control to demonstrate error handling)
app.get('/api/admin/chaos', (req, res) => {
  res.json({ isChaosModeActive: isChaosMode });
});

app.post('/api/admin/chaos', (req, res) => {
  const { enabled } = req.body;
  isChaosMode = typeof enabled === 'boolean' ? enabled : !isChaosMode;
  res.json({
    isChaosModeActive: isChaosMode,
    message: isChaosMode
      ? 'Simulated Server Chaos ENABLED. Transaction requests will now fail deliberately.'
      : 'Simulated Server Chaos DISABLED. Transactions API resumed normal operation.'
  });
});

// Reset data back to initial synthetic state
app.post('/api/admin/reset-data', (req, res) => {
  transactions = generateSyntheticDataset();
  res.json({ success: true, message: 'Synthetic dataset re-initialized to default state.' });
});

// Dashboard Overview Stats
app.get('/api/stats/overview', (req, res) => {
  const totalVolume = transactions
    .filter(t => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter(t => t.status === 'Refunded')
    .reduce((sum, t) => sum + (t.refund ? t.refund.amount : t.amount), 0);

  const pendingVolume = transactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const countSuccess = transactions.filter(t => t.status === 'Success').length;
  const countPending = transactions.filter(t => t.status === 'Pending').length;
  const countFailed = transactions.filter(t => t.status === 'Failed').length;
  const countRefunded = transactions.filter(t => t.status === 'Refunded').length;

  const totalCount = transactions.length;
  const successRate = totalCount > 0
    ? Math.round(((countSuccess + countRefunded) / totalCount) * 1000) / 10
    : 0;

  res.json({
    totalVolume: Math.round(totalVolume * 100) / 100,
    totalRefunded: Math.round(totalRefunded * 100) / 100,
    pendingVolume: Math.round(pendingVolume * 100) / 100,
    totalTransactions: totalCount,
    successRate,
    breakdown: {
      success: countSuccess,
      pending: countPending,
      failed: countFailed,
      refunded: countRefunded
    }
  });
});

// Helper for filtering & sorting
function getFilteredAndSortedTransactions(query) {
  const {
    search,
    status,
    paymentMethod,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = query;

  let results = [...transactions];

  // 1. Search filter
  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    results = results.filter(t =>
      t.id.toLowerCase().includes(s) ||
      t.orderRef.toLowerCase().includes(s) ||
      t.merchantRef.toLowerCase().includes(s) ||
      (t.customer?.name && t.customer.name.toLowerCase().includes(s)) ||
      (t.customer?.email && t.customer.email.toLowerCase().includes(s)) ||
      (t.paymentDetails?.vpa && t.paymentDetails.vpa.toLowerCase().includes(s)) ||
      (t.paymentDetails?.cardLast4 && t.paymentDetails.cardLast4.includes(s)) ||
      (t.storeName && t.storeName.toLowerCase().includes(s))
    );
  }

  // 2. Status filter
  if (status && status !== 'All') {
    results = results.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  // 3. Payment Method filter
  if (paymentMethod && paymentMethod !== 'All') {
    results = results.filter(t => t.paymentMethod.toLowerCase() === paymentMethod.toLowerCase());
  }

  // 4. Date range filter
  if (startDate) {
    const start = new Date(startDate);
    results = results.filter(t => new Date(t.createdAt) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    // Include the entire end day if time is not specified
    if (endDate.length === 10) {
      end.setHours(23, 59, 59, 999);
    }
    results = results.filter(t => new Date(t.createdAt) <= end);
  }

  // 5. Sorting
  results.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'createdAt') {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    } else if (sortBy === 'amount') {
      aVal = Number(a.amount);
      bVal = Number(b.amount);
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return results;
}

// GET /api/transactions with server-side pagination, sorting, search, filtering
app.get('/api/transactions', (req, res) => {
  // Check for intentional simulated error
  const shouldSimulateError =
    isChaosMode ||
    req.query.simulateError === 'true' ||
    req.headers['x-simulate-error'] === 'true';

  if (shouldSimulateError) {
    return res.status(500).json({
      error: 'Simulated Payment Gateway Error: Core banking switch connection timed out (HTTP 500).',
      code: 'ERR_SIMULATED_GATEWAY_FAILURE',
      retryable: true,
      timestamp: new Date().toISOString()
    });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));

  const filtered = getFilteredAndSortedTransactions(req.query);
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageData = filtered.slice(startIndex, endIndex);

  // Compute metrics for the current filtered view
  const filteredVolume = filtered
    .filter(t => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  res.json({
    data: pageData,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      startIndex: totalItems > 0 ? startIndex + 1 : 0,
      endIndex: Math.min(endIndex, totalItems)
    },
    meta: {
      filteredVolume: Math.round(filteredVolume * 100) / 100,
      totalFiltered: totalItems
    }
  });
});

// GET /api/transactions/export/csv
app.get('/api/transactions/export/csv', (req, res) => {
  const filtered = getFilteredAndSortedTransactions(req.query);

  const headers = [
    'Transaction ID',
    'Date & Time (UTC)',
    'Order Reference',
    'Merchant Reference',
    'Store Name',
    'Customer Name',
    'Customer Email',
    'Payment Method',
    'Amount (INR)',
    'Gateway Fee (INR)',
    'GST (INR)',
    'Settlement (INR)',
    'Status',
    'Failure / Refund Details'
  ];

  const rows = filtered.map(t => [
    `"${t.id}"`,
    `"${t.createdAt}"`,
    `"${t.orderRef}"`,
    `"${t.merchantRef}"`,
    `"${(t.storeName || '').replace(/"/g, '""')}"`,
    `"${(t.customer?.name || '').replace(/"/g, '""')}"`,
    `"${t.customer?.email || ''}"`,
    `"${t.paymentMethod}"`,
    t.amount.toFixed(2),
    t.fee.toFixed(2),
    t.gst.toFixed(2),
    t.settlementAmount.toFixed(2),
    `"${t.status}"`,
    `"${(t.failureReason || t.refund?.reason || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="arbaazpay_transactions_${Date.now()}.csv"`);
  res.send(csvContent);
});

// GET /api/transactions/:id
app.get('/api/transactions/:id', (req, res) => {
  const transaction = transactions.find(t => t.id === req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found', id: req.params.id });
  }
  res.json(transaction);
});

// POST /api/transactions/:id/refund - Refund request
app.post('/api/transactions/:id/refund', (req, res) => {
  const { id } = req.params;
  const { amount, reason, initiatedBy } = req.body;

  const txnIndex = transactions.findIndex(t => t.id === id);
  if (txnIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found for refund', id });
  }

  const txn = transactions[txnIndex];

  // Business logic validations
  if (txn.status === 'Refunded') {
    return res.status(400).json({
      error: 'Transaction has already been refunded.',
      refundDetails: txn.refund
    });
  }

  if (txn.status !== 'Success') {
    return res.status(400).json({
      error: `Only successful transactions can be refunded. Current status is '${txn.status}'.`
    });
  }

  const refundAmount = amount ? Number(amount) : txn.amount;
  if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > txn.amount) {
    return res.status(400).json({
      error: `Invalid refund amount ₹${refundAmount}. Must be between ₹1 and ₹${txn.amount}.`
    });
  }

  // Create simulated refund entry (NEVER initiates a real banking payment)
  const refundEntry = {
    refundId: `REF_SIM_${Date.now().toString().slice(-6)}`,
    amount: refundAmount,
    reason: reason || 'Merchant initiated customer satisfaction refund',
    initiatedBy: initiatedBy || 'Merchant Portal User',
    processedAt: new Date().toISOString(),
    isMock: true,
    safetyNotice: 'Simulated refund executed in memory. No banking API or money movement occurred.'
  };

  // Update in-memory record
  const updatedTxn = {
    ...txn,
    status: 'Refunded',
    settlementAmount: 0,
    updatedAt: new Date().toISOString(),
    refund: refundEntry
  };

  transactions[txnIndex] = updatedTxn;

  return res.json({
    success: true,
    message: 'Refund requested and processed successfully.',
    safetyNotice: 'This is a synthetic refund. No real financial payment was debited or credited.',
    transaction: updatedTxn
  });
});

// POST /api/admin/reset - Reset all transaction data back to initial synthetic dataset
app.post('/api/admin/reset', (req, res) => {
  transactions = generateSyntheticDataset();
  isChaosMode = false;
  res.json({
    success: true,
    message: 'Transaction database reset to initial synthetic state.',
    count: transactions.length,
  });
});

app.listen(PORT, () => {
  console.log(`[ArbaazPay API] Server running on http://localhost:${PORT}`);
  console.log(`[ArbaazPay API] Initialized with ${transactions.length} synthetic transactions`);
});

