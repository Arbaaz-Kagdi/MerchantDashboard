// Synthetic Indian Merchant Financial Dataset
// 100+ realistic transaction records with varied statuses, payment methods, and timestamps

export const initialTransactions = [
  {
    id: "TXN_IND_1001",
    orderRef: "ORD_BLR_98214",
    merchantRef: "MER_ZEPTO_01",
    amount: 1450.00,
    currency: "INR",
    paymentMethod: "UPI",
    paymentDetails: {
      provider: "Google Pay",
      vpa: "rohit.sharma@okaxis",
      bankRrn: "432109876541"
    },
    status: "Success",
    createdAt: "2026-11-13T12:28:00.000Z",
    updatedAt: "2026-11-13T12:28:04.000Z",
    customer: {
      name: "Rohit Sharma",
      email: "rohit.sharma@example.com",
      phone: "+91 98765 43210"
    },
    storeName: "Zepto Quick Mart - Indiranagar",
    fee: 26.10,
    gst: 4.70,
    settlementAmount: 1419.20,
    refund: null
  },
  {
    id: "TXN_IND_1002",
    orderRef: "ORD_MUM_48912",
    merchantRef: "MER_SWIG_99",
    amount: 680.50,
    currency: "INR",
    paymentMethod: "UPI",
    paymentDetails: {
      provider: "PhonePe",
      vpa: "ananya.pandey@ybl",
      bankRrn: "432109876542"
    },
    status: "Success",
    createdAt: "2026-11-13T12:25:00.000Z",
    updatedAt: "2026-11-13T12:25:04.000Z",
    customer: {
      name: "Ananya Pandey",
      email: "ananya.p@example.com",
      phone: "+91 98111 22334"
    },
    storeName: "Swiggy Gourmet - Bandra",
    fee: 12.25,
    gst: 2.21,
    settlementAmount: 666.04,
    refund: null
  },
  {
    id: "TXN_IND_1003",
    orderRef: "ORD_DEL_77319",
    merchantRef: "MER_CROMA_12",
    amount: 42999.00,
    currency: "INR",
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardBrand: "HDFC Visa Signature",
      cardLast4: "8412",
      cardType: "Credit",
      authCode: "HDFC9982"
    },
    status: "Pending",
    createdAt: "2026-11-13T12:20:00.000Z",
    updatedAt: "2026-11-13T12:20:00.000Z",
    customer: {
      name: "Vikramaditya Singhal",
      email: "vikram.s@example.com",
      phone: "+91 99200 88776"
    },
    storeName: "Croma Retail Electronics - Saket",
    fee: 859.98,
    gst: 154.80,
    settlementAmount: 41984.22,
    refund: null
  },
  {
    id: "TXN_IND_1004",
    orderRef: "ORD_HYD_33102",
    merchantRef: "MER_MYNT_44",
    amount: 3249.00,
    currency: "INR",
    paymentMethod: "Debit Card",
    paymentDetails: {
      cardBrand: "SBI RuPay Platinum",
      cardLast4: "5019",
      cardType: "Debit",
      authCode: "SBI4412"
    },
    status: "Failed",
    createdAt: "2026-11-13T12:15:00.000Z",
    updatedAt: "2026-11-13T12:15:30.000Z",
    customer: {
      name: "Kavita Reddy",
      email: "kavita.r@example.com",
      phone: "+91 97000 11223"
    },
    storeName: "Myntra Fashion Hub - Hyderabad",
    fee: 0,
    gst: 0,
    settlementAmount: 0,
    failureReason: "PAYMENT_DECLINED_BY_BANK: Insufficient funds or daily e-mandate limit exceeded (Error Code: B04)",
    refund: null
  },
  {
    id: "TXN_IND_1005",
    orderRef: "ORD_PUN_61209",
    merchantRef: "MER_BMS_78",
    amount: 1120.00,
    currency: "INR",
    paymentMethod: "Net Banking",
    paymentDetails: {
      bankName: "ICICI Bank Corporate",
      referenceNumber: "ICICI_NET_998124"
    },
    status: "Refunded",
    createdAt: "2026-11-13T12:10:00.000Z",
    updatedAt: "2026-11-13T12:12:00.000Z",
    customer: {
      name: "Amit Deshmukh",
      email: "amit.deshmukh@example.com",
      phone: "+91 94220 99881"
    },
    storeName: "BookMyShow Experiences - Pune",
    fee: 20.16,
    gst: 3.63,
    settlementAmount: 0,
    refund: {
      refundId: "REF_SIM_88192",
      amount: 1120.00,
      reason: "Show cancelled by organizer - automatic synthetic refund triggered",
      initiatedBy: "Operations Team",
      processedAt: "2026-11-13T02:00:00.000Z",
      isMock: true
    }
  },
  {
    id: "TXN_IND_1006",
    orderRef: "ORD_CHE_11094",
    merchantRef: "MER_NYK_09",
    amount: 2890.00,
    currency: "INR",
    paymentMethod: "Wallet",
    paymentDetails: {
      walletProvider: "Paytm Wallet",
      walletTxnId: "PTM_WAL_883109"
    },
    status: "Success",
    createdAt: "2026-11-12T17:15:30.000Z",
    updatedAt: "2026-11-12T17:15:34.000Z",
    customer: {
      name: "Meenakshi Sundaram",
      email: "meenakshi.s@example.com",
      phone: "+91 98400 33445"
    },
    storeName: "Nykaa Beauty Lounge - Chennai",
    fee: 52.02,
    gst: 9.36,
    settlementAmount: 2828.62,
    refund: null
  },
  {
    id: "TXN_IND_1007",
    orderRef: "ORD_BLR_76124",
    merchantRef: "MER_FLIP_65",
    amount: 18499.00,
    currency: "INR",
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardBrand: "Axis Bank Magnus",
      cardLast4: "1983",
      cardType: "Credit",
      authCode: "AXIS993"
    },
    status: "Success",
    createdAt: "2026-11-12T15:05:00.000Z",
    updatedAt: "2026-11-12T15:05:08.000Z",
    customer: {
      name: "Sandeep Nair",
      email: "sandeep.nair@example.com",
      phone: "+91 98860 12345"
    },
    storeName: "Flipkart Supermart - Koramangala",
    fee: 369.98,
    gst: 66.60,
    settlementAmount: 18062.42,
    refund: null
  },
  {
    id: "TXN_IND_1008",
    orderRef: "ORD_KOL_44521",
    merchantRef: "MER_BLINK_22",
    amount: 495.00,
    currency: "INR",
    paymentMethod: "UPI",
    paymentDetails: {
      provider: "Paytm UPI",
      vpa: "sourav.ganguly@paytm",
      bankRrn: "432109876543"
    },
    status: "Success",
    createdAt: "2026-11-12T13:40:12.000Z",
    updatedAt: "2026-11-12T13:40:15.000Z",
    customer: {
      name: "Sourav Ghosh",
      email: "sourav.ghosh@example.com",
      phone: "+91 98300 44556"
    },
    storeName: "Blinkit Quick Delivery - Salt Lake",
    fee: 8.91,
    gst: 1.60,
    settlementAmount: 484.49,
    refund: null
  },
  {
    id: "TXN_IND_1009",
    orderRef: "ORD_NOI_99834",
    merchantRef: "MER_UBER_15",
    amount: 345.00,
    currency: "INR",
    paymentMethod: "UPI",
    paymentDetails: {
      provider: "BHIM UPI",
      vpa: "priya.verma@upi",
      bankRrn: "432109876544"
    },
    status: "Failed",
    createdAt: "2026-11-12T11:22:00.000Z",
    updatedAt: "2026-11-12T11:23:05.000Z",
    customer: {
      name: "Priya Verma",
      email: "priya.verma@example.com",
      phone: "+91 99100 23456"
    },
    storeName: "Uber Rides India - Delhi NCR",
    fee: 0,
    gst: 0,
    settlementAmount: 0,
    failureReason: "TRANSACTION_TIMEOUT: User did not enter UPI PIN within the stipulated 3-minute window (NPCI Timeout)",
    refund: null
  },
  {
    id: "TXN_IND_1010",
    orderRef: "ORD_GUR_88321",
    merchantRef: "MER_ZOM_31",
    amount: 890.00,
    currency: "INR",
    paymentMethod: "UPI",
    paymentDetails: {
      provider: "Google Pay",
      vpa: "arjun.kapoor@okhdfcbank",
      bankRrn: "432109876545"
    },
    status: "Success",
    createdAt: "2026-11-12T09:12:45.000Z",
    updatedAt: "2026-11-12T09:12:48.000Z",
    customer: {
      name: "Arjun Kapoor",
      email: "arjun.k@example.com",
      phone: "+91 98100 77665"
    },
    storeName: "Zomato Gold Dining - Cyber Hub",
    fee: 16.02,
    gst: 2.88,
    settlementAmount: 871.10,
    refund: null
  }
];

// Helper to generate an additional 70+ diverse historical transactions across the last 30 days
const customerNames = [
  "Rohan Gupta", "Pooja Hegde", "Manoj Tiwari", "Deepika Padukone",
  "Nikhil Kamath", "Tanvi Bhatia", "Aditya Birla", "Sunita Rao",
  "Devendra Jha", "Anil Ambani", "Ritu Kumar", "Harish Salve",
  "Smriti Mandhana", "Jasprit Bumrah", "Suresh Raina", "Neeraj Chopra",
  "Ayesha Takia", "Farhan Akhtar", "Shreya Ghoshal", "Arijit Singh",
  "Kunal Shah", "Bhavish Aggarwal", "Deepinder Goyal", "Falguni Nayar",
  "Sridhar Vembu", "Vijay Shekhar Sharma", "Girish Mathrubootham"
];

const paymentMethods = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet"];
const statuses = ["Success", "Success", "Success", "Pending", "Failed", "Refunded"]; // realistic distribution
const stores = [
  "Zepto Quick Mart - Indiranagar",
  "Swiggy Gourmet - Bandra",
  "Croma Retail Electronics - Saket",
  "Myntra Fashion Hub - Hyderabad",
  "BookMyShow Experiences - Pune",
  "Nykaa Beauty Lounge - Chennai",
  "Flipkart Supermart - Koramangala",
  "Blinkit Quick Delivery - Salt Lake",
  "Zomato Gold Dining - Cyber Hub",
  "Tata 1mg Pharmacy - Powai"
];

const now = new Date("2026-11-13T12:00:00.000Z");

export function generateSyntheticDataset() {
  const transactions = [...initialTransactions];

  for (let i = 11; i <= 85; i++) {
    const id = `TXN_IND_${1000 + i}`;
    const orderRef = `ORD_IN_${70000 + (i * 37) % 25000}`;
    const merchantRef = `MER_STORE_${(i % 10) + 1}`;
    const customerName = customerNames[i % customerNames.length];
    const email = `${customerName.toLowerCase().replace(/\s+/g, '.')}${i % 7}@example.com`;
    const phone = `+91 ${98000 + (i * 13) % 1999} ${10000 + (i * 97) % 89999}`;
    
    // Amount range ₹99 to ₹65,000
    const rawAmount = (i % 6 === 0) 
      ? 15000 + (i * 617) % 45000 
      : 199 + (i * 143) % 4800;
    const amount = Math.round(rawAmount * 100) / 100;

    const method = paymentMethods[i % paymentMethods.length];
    const status = statuses[i % statuses.length];
    const store = stores[i % stores.length];

    // Timestamp distributed over last 30 days
    const minutesAgo = (i - 10) * 480 + ((i * 37) % 360);
    const txnDate = new Date(now.getTime() - minutesAgo * 60 * 1000);
    const createdAt = txnDate.toISOString();
    const updatedAt = new Date(txnDate.getTime() + 45000).toISOString();

    const fee = Math.round(amount * 0.018 * 100) / 100;
    const gst = Math.round(fee * 0.18 * 100) / 100;
    const settlementAmount = status === "Success" ? Math.round((amount - fee - gst) * 100) / 100 : 0;

    let paymentDetails = {};
    if (method === "UPI") {
      const providers = ["Google Pay", "PhonePe", "Paytm UPI", "CRED UPI", "BHIM"];
      const vpaHandles = ["okaxis", "ybl", "paytm", "ibl", "upi"];
      paymentDetails = {
        provider: providers[i % providers.length],
        vpa: `${customerName.toLowerCase().replace(/\s+/g, '')}@${vpaHandles[i % vpaHandles.length]}`,
        bankRrn: `4321${10000000 + i}`
      };
    } else if (method === "Credit Card" || method === "Debit Card") {
      const banks = ["HDFC", "ICICI", "SBI", "Axis", "Kotak"];
      const brands = ["Visa Signature", "Mastercard World", "RuPay Platinum"];
      paymentDetails = {
        cardBrand: `${banks[i % banks.length]} ${brands[i % brands.length]}`,
        cardLast4: `${1000 + (i * 89) % 8999}`,
        cardType: method === "Credit Card" ? "Credit" : "Debit",
        authCode: `AUTH${5000 + i}`
      };
    } else if (method === "Net Banking") {
      const banks = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Kotak Mahindra", "Axis Bank"];
      paymentDetails = {
        bankName: banks[i % banks.length],
        referenceNumber: `NET_${88000 + i * 19}`
      };
    } else {
      paymentDetails = {
        walletProvider: i % 2 === 0 ? "Paytm Wallet" : "Mobikwik",
        walletTxnId: `WAL_${990000 + i}`
      };
    }

    let refund = null;
    if (status === "Refunded") {
      refund = {
        refundId: `REF_SIM_${90000 + i}`,
        amount: amount,
        reason: (i % 2 === 0) ? "Customer returned package during return window" : "Duplicate order placed by user",
        initiatedBy: (i % 3 === 0) ? "Admin Lead" : "Store Manager",
        processedAt: new Date(txnDate.getTime() + 1200000).toISOString(),
        isMock: true
      };
    }

    let failureReason = undefined;
    if (status === "Failed") {
      const reasons = [
        "PAYMENT_DECLINED_BY_BANK: 3DS OTP verification failed (Code: ERR_AUTH_3DS)",
        "LIMIT_EXCEEDED: Daily card velocity or transaction threshold exceeded",
        "INSUFFICIENT_FUNDS: Bank reported inadequate balance in primary account",
        "SYSTEM_UNAVAILABLE: Issuer bank CBS switch temporarily offline"
      ];
      failureReason = reasons[i % reasons.length];
    }

    transactions.push({
      id,
      orderRef,
      merchantRef,
      amount,
      currency: "INR",
      paymentMethod: method,
      paymentDetails,
      status,
      createdAt,
      updatedAt,
      customer: {
        name: customerName,
        email,
        phone
      },
      storeName: store,
      fee,
      gst,
      settlementAmount,
      failureReason,
      refund
    });
  }

  // Sort descending by createdAt by default
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
