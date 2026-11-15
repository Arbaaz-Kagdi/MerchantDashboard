import { generateClientDataset } from './mockData.js';

// Fallback in-memory store for standalone client mode or testing
let clientStore = generateClientDataset();
let isClientChaosMode = false;

// Check if Express backend is running
let backendAvailable = null;
let isSimulatedOnly = false;

export function setSimulatedMode(enabled) {
  isSimulatedOnly = enabled;
  backendAvailable = !enabled;
}

async function checkBackendAvailability() {
  if (isSimulatedOnly) return false;
  if (backendAvailable !== null) return backendAvailable;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);
    const res = await fetch('/api/health', { signal: controller.signal });
    clearTimeout(timeoutId);
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

// Reset client-side dataset
// Also resets the Express backend if it is running
export async function resetClientStore() {
  clientStore = generateClientDataset();
  isClientChaosMode = false;
  // Reset backend data too so subsequent fetches return fresh data
  try {
    await fetch('/api/admin/reset', { method: 'POST' });
  } catch {
    // Backend not running — client-side reset is sufficient
  }
}

export function setClientChaosMode(enabled) {
  isClientChaosMode = enabled;
}

export function getClientChaosMode() {
  return isClientChaosMode;
}

/**
 * Filter and sort transactions in-memory (Exact match with server logic)
 */
function filterAndSortClientData(params) {
  let list = [...clientStore];

  // 1. Search
  if (params.search && params.search.trim()) {
    const s = params.search.trim().toLowerCase();
    list = list.filter(t =>
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

  // 2. Status
  if (params.status && params.status !== 'All') {
    list = list.filter(t => t.status.toLowerCase() === params.status.toLowerCase());
  }

  // 3. Payment Method
  if (params.paymentMethod && params.paymentMethod !== 'All') {
    list = list.filter(t => t.paymentMethod.toLowerCase() === params.paymentMethod.toLowerCase());
  }

  // 4. Date Range
  if (params.startDate) {
    const start = new Date(params.startDate);
    list = list.filter(t => new Date(t.createdAt) >= start);
  }
  if (params.endDate) {
    const end = new Date(params.endDate);
    if (params.endDate.length === 10) {
      end.setHours(23, 59, 59, 999);
    }
    list = list.filter(t => new Date(t.createdAt) <= end);
  }

  // 5. Sorting
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';

  list.sort((a, b) => {
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

  const totalVolume = list
    .filter(t => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  return { results: list, totalVolume };
}

/**
 * Fetch transactions with server-side pagination, sorting & race-condition cancellation
 */
export async function fetchTransactions(params = {}, signal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const isBackendUp = await checkBackendAvailability();

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  // If deliberate simulation requested
  if (params.simulateError || isClientChaosMode) {
    await new Promise((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Simulated Core Banking Failure (HTTP 500): NPCI Switch Connection Timeout.'));
      }, 300);
      signal?.addEventListener('abort', () => clearTimeout(timer));
    });
  }

  if (isBackendUp) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.paymentMethod && params.paymentMethod !== 'All') query.set('paymentMethod', params.paymentMethod);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.simulateError) query.set('simulateError', 'true');

    try {
      const res = await fetch(`/api/transactions?${query.toString()}`, { signal });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch transactions (HTTP ${res.status})`);
      }
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.warn('[ArbaazPay] Backend fetch failed, falling back to simulated engine:', err.message);
    }
  }

  // --- Simulated In-Browser Engine (with latency simulation & cancellation) ---
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timeoutId = setTimeout(() => {
      const page = Math.max(1, params.page || 1);
      const limit = Math.max(1, Math.min(100, params.limit || 10));

      const { results, totalVolume } = filterAndSortClientData(params);
      const totalItems = results.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pageData = results.slice(startIndex, endIndex);

      resolve({
        data: pageData,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          startIndex: totalItems > 0 ? startIndex + 1 : 0,
          endIndex: Math.min(endIndex, totalItems),
        },
        meta: {
          filteredVolume: Math.round(totalVolume * 100) / 100,
          totalFiltered: totalItems,
        },
      });
    }, 200);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
}

/**
 * Fetch single transaction by ID
 */
export async function fetchTransactionById(id, signal) {
  const isBackendUp = await checkBackendAvailability();

  if (isBackendUp) {
    try {
      const res = await fetch(`/api/transactions/${id}`, { signal });
      if (res.ok) return await res.json();
    } catch (e) {
      if (e.name === 'AbortError') throw e;
    }
  }

  const txn = clientStore.find(t => t.id === id);
  if (!txn) throw new Error(`Transaction with ID "${id}" was not found.`);
  return txn;
}

/**
 * Mock Refund Request
 * Validates in memory and returns updated transaction. NEVER initiates real payment.
 */
export async function requestMockRefund(id, payload) {
  const isBackendUp = await checkBackendAvailability();

  if (isBackendUp) {
    try {
      const res = await fetch(`/api/transactions/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process refund');
      const idx = clientStore.findIndex(t => t.id === id);
      if (idx !== -1) clientStore[idx] = data.transaction;
      return data;
    } catch (err) {
      console.warn('[ArbaazPay] Server refund failed, applying simulated fallback:', err.message);
    }
  }

  // Client-side simulation
  await new Promise(r => setTimeout(r, 400));
  const idx = clientStore.findIndex(t => t.id === id);
  if (idx === -1) throw new Error(`Transaction "${id}" not found for refund.`);

  const txn = clientStore[idx];
  if (txn.status === 'Refunded') {
    throw new Error('This transaction has already been refunded.');
  }
  if (txn.status !== 'Success') {
    throw new Error(`Only successful transactions can be refunded. Current status is ${txn.status}.`);
  }

  const refundAmount = payload.amount ? Number(payload.amount) : txn.amount;
  if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > txn.amount) {
    throw new Error(`Invalid refund amount ₹${refundAmount}. Must be between ₹1 and ₹${txn.amount}.`);
  }

  const updatedTxn = {
    ...txn,
    status: 'Refunded',
    settlementAmount: 0,
    updatedAt: new Date().toISOString(),
    refund: {
      refundId: `REF_SIM_${Date.now().toString().slice(-6)}`,
      amount: refundAmount,
      reason: payload.reason || 'Customer requested refund (Simulated)',
      initiatedBy: payload.initiatedBy || 'Merchant Portal User',
      processedAt: new Date().toISOString(),
      isMock: true,
      safetyNotice: 'Simulated refund executed in memory. No banking API or money movement occurred.',
    },
  };

  clientStore[idx] = updatedTxn;

  return {
    success: true,
    message: 'Mock refund processed successfully in sandbox.',
    transaction: updatedTxn,
    safetyNotice: 'This is a synthetic refund. No real financial payment was debited or credited.',
  };
}

/**
 * Fetch Overview KPI stats
 */
export async function fetchOverviewStats(signal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const isBackendUp = await checkBackendAvailability();

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (isBackendUp) {
    try {
      const res = await fetch('/api/stats/overview', { signal });
      if (res.ok) return await res.json();
    } catch (e) {
      if (e.name === 'AbortError') throw e;
    }
  }

  // Simulated metrics calculation
  const totalVolume = clientStore
    .filter(t => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = clientStore
    .filter(t => t.status === 'Refunded')
    .reduce((sum, t) => sum + (t.refund ? t.refund.amount : t.amount), 0);

  const pendingVolume = clientStore
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const countSuccess = clientStore.filter(t => t.status === 'Success').length;
  const countPending = clientStore.filter(t => t.status === 'Pending').length;
  const countFailed = clientStore.filter(t => t.status === 'Failed').length;
  const countRefunded = clientStore.filter(t => t.status === 'Refunded').length;

  const totalCount = clientStore.length;
  const successRate = totalCount > 0
    ? Math.round(((countSuccess + countRefunded) / totalCount) * 1000) / 10
    : 0;

  return {
    totalVolume: Math.round(totalVolume * 100) / 100,
    totalRefunded: Math.round(totalRefunded * 100) / 100,
    pendingVolume: Math.round(pendingVolume * 100) / 100,
    totalTransactions: totalCount,
    successRate,
    breakdown: {
      success: countSuccess,
      pending: countPending,
      failed: countFailed,
      refunded: countRefunded,
    },
  };
}

/**
 * Export to CSV
 */
export async function exportTransactionsCsv(params) {
  const isBackendUp = await checkBackendAvailability();

  if (isBackendUp) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.paymentMethod && params.paymentMethod !== 'All') query.set('paymentMethod', params.paymentMethod);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    try {
      const res = await fetch(`/api/transactions/export/csv?${query.toString()}`);
      if (res.ok) {
        const blob = await res.blob();
        triggerDownload(blob, `arbaazpay_transactions_${Date.now()}.csv`);
        return;
      }
    } catch {
      
    }
  }

  // Client-side CSV generator fallback
  const { results } = filterAndSortClientData(params);
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
    'Failure / Refund Details',
  ];

  const rows = results.map(t => [
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
    `"${(t.failureReason || t.refund?.reason || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `arbaazpay_transactions_${Date.now()}.csv`);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const REGISTERED_USERS_KEY = 'arbaazpay_registered_users';

export const DEFAULT_USERS = [
  {
    id: 'usr_mer_007',
    name: 'Test Merchant',
    email: 'user@merchant.com',
    password: '00001234',
    role: 'merchant',
    title: 'Store Operations Manager',
    permissions: ['read:store', 'request:refund', 'export:data'],
    storeName: 'Zepto Quick Mart - Indiranagar',
  },
  {
    id: 'usr_admin_001',
    name: 'Arbaaz Admin',
    email: 'arbaaz@admin.com',
    password: '00006789',
    role: 'admin',
    title: 'Platform Operations Lead',
    permissions: ['read:all', 'write:refund', 'admin:system', 'admin:chaos', 'export:data'],
    storeName: 'ArbaazPay Gateway Platform (Super Admin)',
  },
];

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(u => {
          if (u.email === 'user@merchant.com') {
            return { ...u, name: 'Test Merchant' };
          }
          return u;
        });
      }
    }
  } catch {
    
  }
  return [];
}

export function saveRegisteredUser(userRecord) {
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(
    u => u.email.toLowerCase() === userRecord.email.toLowerCase()
  );
  if (existingIdx !== -1) {
    users[existingIdx] = userRecord;
  } else {
    users.push(userRecord);
  }
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to persist user credentials', err);
  }
}

/**
 * Register a new merchant or admin user account [works between page refresh]
 */
export async function registerUser({ name, email, password, role = 'merchant', storeName }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  const cleanName = (name || '').trim();
  const cleanRole = role === 'admin' ? 'admin' : 'merchant';
  const cleanStoreName =
    (storeName || '').trim() ||
    (cleanRole === 'admin'
      ? 'ArbaazPay Gateway Platform (Super Admin)'
      : `${cleanName}'s Merchant Store`);

  if (!cleanName) {
    throw new Error('Please enter your full name or merchant name.');
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  // Attempt backend registration if active
  const isBackendUp = await checkBackendAvailability();
  if (isBackendUp) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          role: cleanRole,
          storeName: cleanStoreName,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      // Mirror to persistent localStorage so credentials survive page refreshes
      saveRegisteredUser({
        id: data.user.id,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: cleanRole,
        storeName: cleanStoreName,
        permissions: data.user.permissions,
        title: data.user.title,
      });
      return data.user;
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  // Client-side persistent registration:
  const isDefault = DEFAULT_USERS.some(u => u.email.toLowerCase() === cleanEmail);
  const existing = getRegisteredUsers();
  const isExisting = existing.some(u => u.email.toLowerCase() === cleanEmail);

  if (isDefault || isExisting) {
    throw new Error(`An account with email "${cleanEmail}" already exists. Please sign in instead.`);
  }

  const newUserRecord = {
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

  saveRegisteredUser(newUserRecord);

  // Return user object without sensitive raw password
  const { password: _, ...publicUser } = newUserRecord;
  return publicUser;
}

/**
 * Authentication login validation
 */
export async function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  const isBackendUp = await checkBackendAvailability();

  if (isBackendUp) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }
      return data.user;
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      // If network fails, fallback to client verification below
    }
  }

  // 1. Check default built-in credentials
  const defaultFound = DEFAULT_USERS.find(
    u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
  );
  if (defaultFound) {
    const { password: _, ...publicUser } = defaultFound;
    return publicUser;
  }

  // 2. Check registered accounts in localStorage
  const registeredUsers = getRegisteredUsers();
  const regFound = registeredUsers.find(
    u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
  );
  if (regFound) {
    const { password: _, ...publicUser } = regFound;
    return publicUser;
  }

  throw new Error('Invalid email or password.');
}

