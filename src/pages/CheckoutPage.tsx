// src/pages/CheckoutPage.tsx
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { api } from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    // Siapkan data untuk dikirim ke API /transactions
    const transactionData = {
      items: cartItems.map(item => ({
        bookId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post('/transactions', transactionData);
      alert('Checkout berhasil!');
      clearCart(); // Kosongkan keranjang
      navigate('/transactions'); // Arahkan ke riwayat transaksi
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Checkout gagal: ${err.response.data.message}`); // Misal: Stok tidak cukup
      } else {
        setError('Checkout gagal. Terjadi kesalahan.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="empty-message">Keranjang Anda kosong.</div>;
  }

  return (
    <div>
      <h2>Keranjang Belanja</h2>
      {cartItems.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
          <div>
            <strong>{item.title}</strong>
            <br />
            {item.quantity} x Rp {item.price.toLocaleString()}
          </div>
          <div>
            <strong>Rp {(item.quantity * item.price).toLocaleString()}</strong>
            <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', marginLeft: '1rem' }}>
              Hapus
            </button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.5rem' }}>
        <strong>Total: Rp {totalPrice.toLocaleString()}</strong>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button 
        className="form-button" 
        onClick={handleCheckout} 
        disabled={loading}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {loading ? 'Memproses...' : 'Buat Transaksi (Checkout)'}
      </button>
    </div>
  );
};

export default CheckoutPage;