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

  return (
    <div>
      <h2>Manajemen Buku</h2>
      <Link to="/books/add" className="form-button" style={{ textDecoration: "none", display: "inline-block", width: "auto", marginBottom: "1rem" }}>
        + Tambah Buku Baru
      </Link>

      {/* TODO: Buat UI untuk Filter, Sort  */}
      <div className="filter-controls" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input type="text" placeholder="Cari (title, writer, genre...)" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ padding: "0.5rem", width: "300px" }} />
        {/* TODO: Tambahkan kontrol untuk filter & sort */}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredBooks.length === 0 ? (
        <div className="empty-message">Tidak ada buku yang ditemukan.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Genre</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.writer}</td>
                <td>Rp {book.price.toLocaleString()}</td>
                <td>{book.stock}</td>
                <td>{book.genre?.name}</td>
                <td>
                  <button onClick={() => navigate(`/books/${book.id}`)}>Detail</button>
                  <button onClick={() => handleDelete(book.id)} style={{ color: "red", marginLeft: "0.5rem" }}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* TODO: Implementasikan Pagination  */}
      <div className="pagination" style={{ marginTop: "1rem", textAlign: "center" }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          &lt; Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Halaman {page} dari {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default BooksListPage;
