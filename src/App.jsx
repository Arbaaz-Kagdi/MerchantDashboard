import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { useTransactions } from './hooks/useTransactions.js';
import { Navbar } from './components/layout/Navbar.jsx';
import { StatsOverview } from './components/layout/StatsOverview.jsx';
import { AdminControls } from './components/common/AdminControls.jsx';
import { TransactionFilters } from './components/transactions/TransactionFilters.jsx';
import { TransactionTable } from './components/transactions/TransactionTable.jsx';
import { TransactionMobileCards } from './components/transactions/TransactionMobileCards.jsx';
import { Pagination } from './components/transactions/Pagination.jsx';
import { TransactionDetailModal } from './components/transactions/TransactionDetailModal.jsx';
import { RefundRequestModal } from './components/transactions/RefundRequestModal.jsx';
import { LoadingSkeleton } from './components/common/LoadingSkeleton.jsx';
import { EmptyState } from './components/common/EmptyState.jsx';
import { ErrorState } from './components/common/ErrorState.jsx';
import { LoginModal } from './components/auth/LoginModal.jsx';
import { LoginPage } from './components/auth/LoginPage.jsx';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AuthenticatedDashboard = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const {
    search,
    setSearch,
    status,
    setStatus,
    paymentMethod,
    setPaymentMethod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    sortOrder,
    handleSort,
    setPage,
    setLimit,
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
    selectedTxn,
    setSelectedTxn,
    isRefundModalOpen,
    setIsRefundModalOpen,
    refundSubmitting,
    retry,
    handleResetFilters,
    handleExportCsv,
    handleProcessRefund,
  } = useTransactions();

  const handleSelectTransaction = (txn) => {
    setSelectedTxn(txn);
    setDetailModalOpen(true);
  };

  const handleOpenRefund = (txn) => {
    setSelectedTxn(txn);
    setIsRefundModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in"
        >
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                : toastMessage.type === 'error'
                  ? 'bg-rose-950 text-rose-100 border-rose-800'
                  : 'bg-slate-300 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-brand-400 shrink-0" />
            )}
            <p>{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar onOpenLogin={() => setIsLoginModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* KPI Stats Overview Cards */}
        <StatsOverview stats={overviewStats} filteredVolume={filteredVolume} />

        {/* Admin Operations Console (When in Admin mode) */}
        <AdminControls
          onRefreshData={retry}
          simulateError={simulateError}
          setSimulateError={setSimulateError}
        />

        {/* Search, Date presets, Status & Method Filters */}
        <TransactionFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          simulateError={simulateError}
          setSimulateError={setSimulateError}
          onReset={handleResetFilters}
          onExportCsv={handleExportCsv}
          isExporting={isExporting}
          totalFiltered={pagination.totalItems}
        />

        {/* Transaction Content Section */}
        <section aria-label="Transaction records">
          {/* Error State with Retry Button */}
          {error ? (
            <ErrorState message={error} onRetry={retry} isSimulated={simulateError} />
          ) : isLoading ? (
            /* Loading State */
            <LoadingSkeleton rows={pagination.limit || 8} />
          ) : transactions.length === 0 ? (
            /* Empty State */
            <EmptyState onReset={handleResetFilters} />
          ) : (
            /* Data View: Desktop Table + Mobile Cards */
            <>
              <TransactionTable
                transactions={transactions}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onSelectTxn={handleSelectTransaction}
                onRequestRefund={handleOpenRefund}
              />

              <TransactionMobileCards
                transactions={transactions}
                onSelectTxn={handleSelectTransaction}
                onRequestRefund={handleOpenRefund}
              />

              {/* Server-Side Pagination Controls */}
              <Pagination
                pagination={pagination}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2024 ArbaazPay Merchant Solutions India.</p>
      </footer>

      {/* Modals */}
      <TransactionDetailModal
        transaction={selectedTxn}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onRequestRefund={handleOpenRefund}
      />

      <RefundRequestModal
        transaction={selectedTxn}
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onSubmit={handleProcessRefund}
        isSubmitting={refundSubmitting}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

const DashboardContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AuthenticatedDashboard />;
};

export const App = () => {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
};

export default App;

