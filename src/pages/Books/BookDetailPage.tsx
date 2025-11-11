// src/pages/Books/BookDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import type { Book } from "../../types/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useCart } from "../../hooks/useCart";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/books/${id}`);
        setBook(response.data.data);
      } catch (err) {
        setError("Gagal mengambil data buku.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    // defensive: accept alternative stock keys from backend
    const stockValue = (book as any).stock ?? (book as any).stok ?? (book as any).quantity ?? 0;
    if (quantity > stockValue) {
      alert("Stok tidak mencukupi!");
      return;
    }
    addToCart(book, quantity);
    alert(`${quantity} ${book.title} ditambahkan ke keranjang!`);
    navigate("/checkout");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!book) return <div className="empty-message">Buku tidak ditemukan.</div>;

// Bagian return() untuk BookDetailPage.tsx
// Copy paste bagian ini ke dalam component BookDetailPage Anda

return (
  <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
    {/* Header / Title */}
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '0.5rem',
        lineHeight: '1.2'
      }}>
        {book.title}
      </h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
        oleh {book.writer}
      </p>
    </div>

    {/* Main Content Card */}
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Info Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.875rem', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Penerbit
            </p>
            <p style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
              {book.publisher}
            </p>
          </div>

          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.875rem', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Genre
            </p>
            {/* compute stock/genre/condition with fallbacks */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#93c5fd'
            }}>
              {typeof book.genre === 'string' ? book.genre : book.genre?.name ?? '-'}
            </span>
          </div>

          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.875rem', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Harga
            </p>
            <p style={{ 
              color: '#86efac', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              margin: 0
            }}>
              Rp {book.price.toLocaleString('id-ID')}
            </p>
          </div>

          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.875rem', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Stok
            </p>
            {/* try multiple keys for stock: stock, stok, quantity */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              background: book.stock > 10 ? 'rgba(34, 197, 94, 0.2)' : book.stock > 5 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: book.stock > 10 ? '#86efac' : book.stock > 5 ? '#fde047' : '#fca5a5'
            }}>
              {(() => {
                const raw = (book as any).stock ?? (book as any).stok ?? (book as any).quantity ?? null;
                // accept numeric strings as well
                const parsed = typeof raw === 'string' && raw.trim() !== '' && !Number.isNaN(Number(raw)) ? Number(raw) : raw;
                if (typeof parsed === 'number') {
                  if (parsed === 0) return 'Habis';
                  return `${parsed} unit tersedia`;
                }
                // clearer fallback text and better contrast
                return 'Tidak tersedia';
              })()}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.875rem', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Kondisi
            </p>
            <p style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
              {(() => {
                const c = (book as any).condition ?? (book as any).kondisi ?? null;
                if (c === null || c === undefined) return 'Tidak diketahui';
                if (typeof c === 'string' && c.trim() === '') return 'Tidak diketahui';
                return String(c);
              })()}
            </p>
          </div>

          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.875rem', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Tahun Terbit
            </p>
            <p style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
              {book.publicationYear}
            </p>
          </div>

          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.875rem', 
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              ISBN
            </p>
            <p style={{ 
              color: 'white', 
              fontSize: '0.9rem', 
              fontWeight: '500',
              fontFamily: 'monospace',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.5rem',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              {book.isbn}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '1.5rem'
      }}>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '0.875rem', 
          marginBottom: '0.75rem',
          fontWeight: '500'
        }}>
          Deskripsi
        </p>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.85)', 
          fontSize: '1rem', 
          lineHeight: '1.7',
          margin: 0
        }}>
          {book.description}
        </p>
      </div>
    </div>

    {/* Add to Cart Section */}
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <p style={{ 
        color: 'white', 
        fontSize: '1.1rem', 
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        Jumlah Pembelian
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          max={book.stock}
          style={{
            width: '100px',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            textAlign: 'center',
            outline: 'none'
          }}
        />
        <button
          onClick={handleAddToCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          + Tambah ke Keranjang
        </button>
      </div>
    </div>

    {/* Back Button */}
    <div>
      <button
        type="button"
        onClick={() => navigate("/books")}
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontWeight: '500',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        ← Kembali ke Daftar Buku
      </button>
    </div>
  </div>
);
};

export default BookDetailPage;
