# ArbaazPay | Merchant Transaction Dashboard

A responsive React merchant dashboard that uses synthetic Indian financial data (INR `₹`), a mock Node.js/Express API with server-side pagination, sorting and filtering, a login screen with Merchant/Admin roles, and a mock refund workflow.

**Stack:** React, Tailwind CSS, Vite, Node.js/Express

---

## Table of Contents
1. [Features](#features)
2. [Setup](#setup)
3. [Architecture Notes](#architecture-notes)
4. [Simulated API Failure](#simulated-api-failure)
5. [Refund Workflow](#mock-refund-workflow)
6. [Why Frontend Permissions Alone Do Not Provide Security](#why-frontend-permissions-alone-do-not-provide-security)
7. [Assumptions & Limitations](#assumptions--limitations)

---

## Features

**Transaction table**
- Columns: Transaction ID (click to copy), Date/Time (IST), Order / Merchant Reference, Amount (INR), Payment Method, Status badge (`Success`, `Pending`, `Failed`, `Refunded`).
- Desktop `<table>` with ARIA sort attributes; cards on screens narrower than 768px.

**Search & filters**
- Search by Transaction ID, order/merchant reference, customer name, email and UPI VPA.
- Filter by status, date range (presets plus custom start/end date pickers) and payment method.
- One-click filter reset.

**Server-side pagination & sorting**
- Page navigation with page-size selector (10 / 25 / 50).
- Sort by Date/Time, Amount, Transaction ID, Order Ref and Status (ASC/DESC).

**UI states**
- Loading: skeleton loaders for table rows and mobile cards.
- Empty: message with a reset-filters action.
- Error: alert banner with error code and a **Retry Request** button.
- Deliberate failure: **Simulate API Failure** button (see below).

**Login & role-based UI**
- Login screen shown on first load; invalid credentials show an inline error.
- Demo accounts:

Merchant (Store Manager): Email - `user@merchant.com`, Pwd - `00001234`
Admin (Operations Lead): Email - `arbaaz@admin.com`, Pwd - `00006789`

- Merchant: sales monitoring, transaction details and refund requests.
- Admin: everything a merchant sees, plus an Admin Operations Console (dataset reset, server failure simulation).

**Transaction details view**
- Drawer showing customer details, payment details, and the financial breakdown, with a **Request Refund** action.

**Accessibility & responsiveness**
- Labelled form controls, feedback for actions, responsive layout for desktop and mobile.

**Bonus**
- CSV export of the filtered transaction set.

---

## Setup

**Prerequisites:** Node.js 18+ and npm 9+.

```bash
# 1. Install dependencies
npm install

# 2. Run frontend (localhost:5173) and Express API (localhost:5000) together
npm run dev
```

Open http://localhost:5173.

  `npm run dev` - Frontend + backend together
  `npm run client` - Frontend only (port 5173)
  `npm run server` - Backend only (port 5000)

---

## Architecture Notes

- **Frontend:** React 18 (JavaScript/JSX) with Tailwind CSS, served by Vite on port 5173.
- **Backend:** Node.js/Express mock API (`server/index.js`) on port 5000, holding 85 synthetic transactions in memory.
- **Routing of requests:** the Vite dev server proxies `/api/*` to the Express backend.
- **Server-side logic:** filtering, sorting and pagination run in the API. The client sends `page`, `limit`, `sortBy`, `sortOrder` and filter parameters and renders only the returned page.
- **API service layer:** `src/services/api.js` is the single place the UI makes requests through.
- **Fallback:** if the Express server is not running, `src/services/api.js` switches to an in-browser simulated API with the same filtering, sorting, pagination and latency behaviour.
- **Data fetching:** the `useTransactions` hook owns fetching, loading/error state and retry. It uses `AbortController` to cancel in-flight requests when a newer one starts, so stale responses never overwrite newer ones.
- **Auth and roles:** `AuthContext` holds the session and role (Merchant or Admin) and the UI shows or hides actions based on it.
- **Failure simulation:** latency and failure middleware on the server (and the matching logic in the fallback) returns an HTTP 500 on demand.
- **Refunds:** the refund endpoint only updates the in-memory record and audit entry; no external payment service is called.

---

## Sample Mock Data & API

The project creates 85 synthetic transactions (10 sample records plus 75 generated records). The server dataset is defined in `server/mockData.js`. Transaction updates and refunds are stored in memory and are lost when the server or page is restarted.

Example:

```json
{
  "id": "TXN_IND_1001",
  "orderRef": "ORD_BLR_98214",
  "merchantRef": "MER_ZEPTO_01",
  "amount": 1450,
  "currency": "INR",
  "paymentMethod": "UPI",
  "paymentDetails": {
    "provider": "Google Pay",
    "vpa": "rohit.sharma@okaxis",
    "bankRrn": "432109876541"
  },
  "status": "Success",
  "createdAt": "2026-11-13T12:28:00.000Z",
  "customer": {
    "name": "Rohit Sharma",
    "email": "rohit.sharma@example.com",
    "phone": "+91 98765 43210"
  },
  "storeName": "Zepto Quick Mart - Indiranagar",
  "fee": 26.1,
  "gst": 4.7,
  "settlementAmount": 1419.2,
  "refund": null
}
```

To add sample records, edit `initialTransactions` in both mock-data files.

### Try the API

With `npm run dev` running, the API is available at `http://localhost:5000`.

```bash
# Check that the API is running
curl http://localhost:5000/api/health

# Fetch one transaction
curl http://localhost:5000/api/transactions/TXN_IND_1001

# Get dashboard totals
curl http://localhost:5000/api/stats/overview
```

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Sign in with a demo account. |
| `POST` | `/api/auth/register` | Add an in-memory demo user. |
| `GET` | `/api/transactions/export/csv` | Download the filtered transaction set as CSV. |
| `POST` | `/api/transactions/:id/refund` | Simulate a refund. |
| `POST` | `/api/admin/reset` | Restore the initial synthetic transaction data. |
| `POST` | `/api/admin/chaos` | Toggle simulated transaction API failures. |

For example, `POST /api/transactions/TXN_IND_1001/refund` with `{"amount":500,"reason":"Customer request"}` updates the in memory transaction to `Refunded`.

---

## Simulated API Failure

1. Simulate **Simulate API Failure** by signing as Admin and selecting Simulate API Failure from Admin Operations Console.
2. The API returns an HTTP 500 (`Simulated Core Banking Failure (HTTP 500): NPCI Switch Connection Timeout`).
3. The dashboard shows the error alert with a **Retry Request** button.
4. Turn the simulation off and click **Retry Request** to recover.

---

## Refund Workflow

The refund is entirely simulated. It changes a transaction's status from `Success` to `Refunded` in memory and records an audit entry. It **never calls a bank, payment gateway or card network**.

1. Open a `Success` transaction (e.g. `TXN_IND_1001`) and click **Request Refund**.
2. Choose a full or partial amount and a reason, then confirm.
3. The status changes to `Refunded`, net settlement becomes `₹0.00`, KPI cards update, and confirms the result.

---

## Why Frontend Permissions Alone Do Not Provide Security

The browser is an untrusted environment under the user's full control. Role checks in the UI only hide buttons and menus, they are not a security boundary.

DevTools tampering - Edit `localStorage` or React state to set `role: 'admin'` which can cause hidden buttons (Refund, Admin Console) to appear.
Direct API calls - Send `POST /api/transactions/:id/refund` with `curl` or Postman, this skips all React guards.
Tampered payloads - Intercept the refund request and change `amount` to a negative or huge value causing Balance manipulation, draining funds.
Race conditions - Fire many parallel refund requests for one transaction.

**Controls a real backend must enforce:**
1. **Signed sessions:** verify a signed JWT or `HttpOnly`, `SameSite=Strict` cookie on every request.
2. **Server-side authorization:** check role and permission on every endpoint (e.g. `requireRole('admin')`).
3. **Input validation:** validate refund amount (positive, not above the refundable balance) and status server-side.
4. **Idempotency keys:** require an `Idempotency-Key` header so a refund executes at most once.
5. **Audit logging:** append-only logs of sensitive actions with user, IP, timestamp and before/after state.

## Assumptions & Limitations

1. **In-memory data:** all data and refunds live in server/client memory; restarting resets to the initial 85 records.
2. **No real payments:** no payment gateway or banking API is contacted; all values and refund IDs are synthetic.
3. **Demo authentication:** login uses hard-coded demo credentials and the session is kept in `localStorage`. There is no OTP/OAuth, no password hashing and no token verification on the API.
4. **UI-only role enforcement:** Merchant/Admin differences are applied in the UI; the backend does not enforce them (see the security section above).
5. **Single-tenant dataset:** transactions are not scoped per merchant.
6. **Fallback engine:** when the Express server is unavailable, the in-browser simulation replaces it, so data changes in that mode do not persist on the server.