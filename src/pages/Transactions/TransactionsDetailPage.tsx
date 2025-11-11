// src/pages/Transactions/TransactionDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/axios';
import type { TransactionDetail } from '../../types/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/transactions/${id}`);
        setTransaction(response.data.data);
      } catch (err) {
        setError('Gagal mengambil data detail transaksi.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!transaction) return <div className="empty-message">Transaksi tidak ditemukan.</div>;

  return (
    <div>
      <h2>Detail Transaksi #{transaction.id}</h2>
      <p><strong>Tanggal:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
      <p><strong>Total Item:</strong> {transaction.total_quantity}</p>
      <p><strong>Total Harga:</strong> Rp {transaction.total_price.toLocaleString()}</p>
      
      <h3 style={{ marginTop: '2rem' }}>Item yang Dibeli</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Judul Buku</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>Rp {item.price.toLocaleString()}</td>
              <td>Rp {(item.quantity * item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDetailPage;