// src/pages/Books/BookDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import type { Book } from '../../types/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCart } from '../../hooks/useCart';

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
        setError('Gagal mengambil data buku.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    if (quantity > book.stock) {
      alert('Stok tidak mencukupi!');
      return;
    }
    addToCart(book, quantity);
    alert(`${quantity} ${book.title} ditambahkan ke keranjang!`);
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!book) return <div className="empty-message">Buku tidak ditemukan.</div>;

  return (
    <div>
      {/* Tampilkan semua detail  */}
      <h2>{book.title}</h2>
      <p><strong>Penulis:</strong> {book.writer}</p>
      <p><strong>Penerbit:</strong> {book.publisher}</p>
      <p><strong>Genre:</strong> {book.genre.name}</p>
      <p><strong>Harga:</strong> Rp {book.price.toLocaleString()}</p>
      <p><strong>Stok:</strong> {book.stock}</p>
      <p><strong>Kondisi:</strong> {book.condition}</p>
      <p><strong>Tahun Terbit:</strong> {book.publicationYear}</p>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Deskripsi:</strong> {book.description}</p>
      
      {/* Aksi Beli */}
      <div className="add-to-cart" style={{ marginTop: '2rem' }}>
        <input 
          type="number" 
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          min="1"
          max={book.stock}
          style={{ width: '80px', padding: '0.5rem' }}
        />
        <button onClick={handleAddToCart} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          + Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default BookDetailPage;