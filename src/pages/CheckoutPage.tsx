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
        book_id: item.id,
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

  // Bagian return() untuk CheckoutPage.tsx
// Copy paste bagian ini ke dalam component CheckoutPage Anda

return (
  <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
    {/* Header */}
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '0.5rem',
        margin: 0
      }}>
        🛒 Keranjang Belanja
      </h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
        {cartItems.length} item dalam keranjang
      </p>
    </div>

    {/* Cart Items */}
    {cartItems.length === 0 ? (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.4)', marginBottom: '1rem' }}>
          <svg style={{ width: '4rem', height: '4rem', margin: '0 auto' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
          Keranjang Anda Kosong
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Tambahkan buku ke keranjang untuk melanjutkan
        </p>
      </div>
    ) : (
      <>
        {/* Items List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: index < cartItems.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* Item Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {item.title}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem'
                  }}>
                    {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#93c5fd'
                  }}>
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>

              {/* Price & Actions */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                alignItems: window.innerWidth < 640 ? 'flex-end' : 'center'
              }}>
                <strong style={{
                  color: '#86efac',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  minWidth: '120px',
                  textAlign: 'right'
                }}>
                  Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                </strong>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                  }}
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Subtotal
            </span>
            <span style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '700'
            }}>
              Total
            </span>
            <span style={{
              color: '#86efac',
              fontSize: '1.75rem',
              fontWeight: '700'
            }}>
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            background: loading ? 'rgba(59, 130, 246, 0.5)' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Memproses Transaksi...
            </span>
          ) : (
            '💳 Buat Transaksi (Checkout)'
          )}
        </button>
      </>
    )}
  </div>
);
};

export default CheckoutPage;