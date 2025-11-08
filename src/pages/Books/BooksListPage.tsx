// src/pages/Books/BooksListPage.tsx
import { useEffect, useState, useMemo } from "react";
import { api } from "../../lib/axios";
import type { Book, PaginatedResponse } from "../../types/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";

const BooksListPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk fitur
  // searchInput adalah nilai yang terikat ke input; kita akan melakukan filter secara client-side
  // sehingga mengetik tidak memicu loading / fetch dari server setiap huruf.
  const [searchInput, setSearchInput] = useState("");
  const [condition] = useState(""); // 'New', 'Used'
  const [sortBy] = useState("title"); // 'title', 'publishDate'
  const [order] = useState("asc"); // 'asc', 'desc'

  // State untuk Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Gunakan useMemo untuk query params
  // Ini akan otomatis membuat string query baru setiap state filter berubah
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", "10"); // Misal 10 item per halaman
    if (condition) params.append("condition", condition);
    if (sortBy) params.append("sort", sortBy);
    if (order) params.append("order", order);
    return params.toString();
  }, [page, condition, sortBy, order]);

  // filteredBooks: lakukan filter di client-side dari data yang sudah di-fetch
  // Ini membuat typing terasa instan dan tidak men-trigger loading/spinner.
  const filteredBooks = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) => {
      const title = (b.title ?? "").toString().toLowerCase();
      const writer = (b.writer ?? "").toString().toLowerCase();
      const genreName = (b.genre?.name ?? "").toString().toLowerCase();
      return title.includes(q) || writer.includes(q) || genreName.includes(q);
    });
  }, [books, searchInput]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<PaginatedResponse<Book>>(`/books?${queryParams}`);
        setBooks(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (err) {
        setError("Gagal mengambil data buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [queryParams]); // Re-fetch setiap queryParams berubah

  const handleDelete = async (id: number) => {
    // Konfirmasi sebelum hapus [cite: 34]
    if (!window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      return;
    }
    try {
      await api.delete(`/books/${id}`);
      // Refresh list buku
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      setError("Gagal menghapus buku.");
    }
  };

  // --- Render ---
  if (error) return <div className="error-message">{error}</div>;

  // Bagian return() untuk BooksListPage.tsx
// Copy paste bagian ini ke dalam component BooksListPage Anda

return (
  <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
    {/* Header */}
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem', margin: 0 }}>
        Manajemen Buku
      </h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
        Kelola koleksi buku toko Anda
      </p>
    </div>

    {/* Action Bar */}
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, width: '100%', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Cari judul, penulis, atau genre..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          />
        </div>

        {/* Add Button */}
        <Link
          to="/books/add"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#3b82f6',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            width: window.innerWidth < 768 ? '100%' : 'auto',
            justifyContent: 'center'
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
          + Tambah Buku Baru
        </Link>
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
        marginBottom: '1.5rem'
      }}>
        {error}
      </div>
    )}

    {/* Loading / Content */}
    {loading ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
        <LoadingSpinner />
      </div>
    ) : filteredBooks.length === 0 ? (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.4)', marginBottom: '1rem' }}>
          <svg style={{ width: '4rem', height: '4rem', margin: '0 auto' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
          Tidak ada buku ditemukan
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Coba ubah kata kunci pencarian Anda
        </p>
      </div>
    ) : (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Desktop Table View */}
        <div style={{ display: window.innerWidth < 768 ? 'none' : 'block', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Judul
                </th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Penulis
                </th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Harga
                </th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Stok
                </th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Genre
                </th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr
                  key={book.id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: '500', color: 'white' }}>{book.title}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {book.writer}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ fontWeight: '600', color: 'white' }}>
                      Rp {book.price.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: book.stock > 10 ? 'rgba(34, 197, 94, 0.2)' : book.stock > 5 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: book.stock > 10 ? '#86efac' : book.stock > 5 ? '#fde047' : '#fca5a5'
                    }}>
                      {book.stock} unit
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#93c5fd'
                    }}>
                      {book.genre?.name}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => navigate(`/books/${book.id}`)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#93c5fd',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                        }}
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div style={{ display: window.innerWidth < 768 ? 'block' : 'none' }}>
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '600', color: 'white', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    {book.title}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                    {book.writer}
                  </p>
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  background: book.stock > 10 ? 'rgba(34, 197, 94, 0.2)' : book.stock > 5 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: book.stock > 10 ? '#86efac' : book.stock > 5 ? '#fde047' : '#fca5a5'
                }}>
                  {book.stock} unit
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600', color: 'white' }}>
                  Rp {book.price.toLocaleString('id-ID')}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd'
                }}>
                  {book.genre?.name}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => navigate(`/books/${book.id}`)}
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#93c5fd',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Detail
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Pagination */}
    {!loading && filteredBooks.length > 0 && (
      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{
            padding: '0.625rem 1rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: '500',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (page !== 1) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          &lt; Prev
        </button>
        
        <div style={{
          padding: '0.625rem 1.5rem',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
            Halaman <span style={{ color: '#3b82f6', fontWeight: '600' }}>{page}</span> dari {totalPages}
          </span>
        </div>

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={{
            padding: '0.625rem 1rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: '500',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            opacity: page === totalPages ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (page !== totalPages) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          Next &gt;
        </button>
      </div>
    )}
  </div>
);
};

export default BooksListPage;
