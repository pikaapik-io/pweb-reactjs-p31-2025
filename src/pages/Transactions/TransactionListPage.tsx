// src/pages/Transactions/TransactionsListPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { api } from '../../lib/axios';
import type { Transaction, PaginatedResponse } from '../../types/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TransactionItem from '../../components/features/TransactionItem'; // <-- 1. IMPORT

const TransactionsListPage = () => {
  // ... (Semua state dan hook di atas sini SAMA, tidak berubah) ...
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search] = useState('');
  const [sortBy] = useState('id');
  const [order] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', '10');
    if (search) params.append('search', search);
    if (sortBy) params.append('sort', sortBy);
    if (order) params.append('order', order);
    return params.toString();
  }, [page, search, sortBy, order]);

  useEffect(() => {
    // ... (Logika fetchTransactions SAMA, tidak berubah) ...
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<PaginatedResponse<Transaction>>(`/transactions?${queryParams}`);
        setTransactions(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (err) {
        setError('Gagal mengambil data transaksi.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [queryParams]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <h2>Riwayat Transaksi</h2>
      {/* TODO: Buat UI untuk Search ID, Sort */}
      
      {transactions.length === 0 ? (
        <div className="empty-message">Anda belum memiliki riwayat transaksi.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Tanggal</th>
              <th>Total Item</th>
              <th>Total Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* 2. GUNAKAN KOMPONEN DI SINI */}
            {transactions.map((trx) => (
              <TransactionItem key={trx.id} transaction={trx} />
            ))}
          </tbody>
        </table>
      )}
      
      {/* ... (Pagination SAMA, tidak berubah) ... */}
      <div className="pagination" style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          &lt; Prev
        </button>
        <span style={{ margin: '0 1rem' }}>
          Halaman {page} dari {totalPages}
        </span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default TransactionsListPage;