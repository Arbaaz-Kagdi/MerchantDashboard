import { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchTransactions,
  fetchOverviewStats,
  requestMockRefund,
  exportTransactionsCsv,
} from '../services/api.js';

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  startIndex: 0,
  endIndex: 0,
};

export function useTransactions() {
  // Filter & pagination states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [simulateError, setSimulateError] = useState(false);

  // Data & UI states
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filteredVolume, setFilteredVolume] = useState(0);
  const [overviewStats, setOverviewStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Selected transaction for detailed view & refund workflow
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // AbortController ref to cancel obsolete pending requests
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const loadData = useCallback(async () => {
    // 1. Cancel previous in-flight request to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    const params = {
      search,
      status,
      paymentMethod,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page,
      limit,
      simulateError,
    };

    try {
      const [txnResponse, statsResponse] = await Promise.all([
        fetchTransactions(params, controller.signal),
        fetchOverviewStats(controller.signal),
      ]);

      // Only update state if this is still the freshest request
      if (currentReqId === requestIdRef.current) {
        setTransactions(txnResponse.data);
        setPagination(txnResponse.pagination);
        setFilteredVolume(txnResponse.meta.filteredVolume);
        setOverviewStats(statsResponse);
        setIsLoading(false);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was aborted by newer search/filter action - intentionally silence
        return;
      }
      if (currentReqId === requestIdRef.current) {
        setError(err.message || 'An unexpected error occurred while fetching transactions.');
        setIsLoading(false);
      }
    }
  }, [search, status, paymentMethod, startDate, endDate, sortBy, sortOrder, page, limit, simulateError]);

  useEffect(() => {
    loadData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  // Handlers
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1); // Reset to page 1 on sort change
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setPaymentMethod('All');
    setStartDate('');
    setEndDate('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
    setSimulateError(false);
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await exportTransactionsCsv({
        search,
        status,
        paymentMethod,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      });
      setToastMessage({
        type: 'success',
        text: 'Transaction dataset exported to CSV successfully.',
      });
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: err.message || 'Failed to export CSV file.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleProcessRefund = async (payload) => {
    if (!selectedTxn) return;

    try {
      setRefundSubmitting(true);
      const result = await requestMockRefund(selectedTxn.id, payload);

      // Update in current list
      setTransactions(prev =>
        prev.map(t => (t.id === selectedTxn.id ? result.transaction : t))
      );
      setSelectedTxn(result.transaction);
      setIsRefundModalOpen(false);

      setToastMessage({
        type: 'success',
        text: `Refund of ₹${result.transaction.refund?.amount.toFixed(2)} recorded successfully.`,
      });

      // Refresh overview stats
      const refreshedStats = await fetchOverviewStats();
      setOverviewStats(refreshedStats);
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: err.message || 'Failed to process refund.',
      });
    } finally {
      setRefundSubmitting(false);
    }
  };

  return {
    // States
    search,
    setSearch: (val) => {
      setSearch(val);
      setPage(1);
    },
    status,
    setStatus: (val) => {
      setStatus(val);
      setPage(1);
    },
    paymentMethod,
    setPaymentMethod: (val) => {
      setPaymentMethod(val);
      setPage(1);
    },
    startDate,
    setStartDate: (val) => {
      setStartDate(val);
      setPage(1);
    },
    endDate,
    setEndDate: (val) => {
      setEndDate(val);
      setPage(1);
    },
    sortBy,
    sortOrder,
    handleSort,
    page,
    setPage,
    limit,
    setLimit: (val) => {
      setLimit(val);
      setPage(1);
    },
    simulateError,
    setSimulateError,
    transactions,
    pagination,
    filteredVolume,
    overviewStats,
    isLoading,
    error,
    isExporting,
    toastMessage,
    setToastMessage,

    // Modal & Refund states
    selectedTxn,
    setSelectedTxn,
    isRefundModalOpen,
    setIsRefundModalOpen,
    refundSubmitting,

    // Actions
    retry: loadData,
    handleResetFilters,
    handleExportCsv,
    handleProcessRefund,
  };
}

