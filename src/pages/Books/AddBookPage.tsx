// src/pages/Books/AddBookPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import BookForm from "../../components/features/BookForm";
import type { BookFormData } from "../../components/features/BookForm";

const AddBookPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: BookFormData) => {
    setError(null);
    setIsSubmitting(true);

    // Validasi Sisi Client (bisa ditambahkan lagi di sini)
    if (!formData.title || !formData.writer || !formData.genreId || formData.price <= 0) {
      setError("Field wajib (Judul, Penulis, Genre, Harga) tidak boleh kosong.");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/books", {
        ...formData,
        genreId: parseInt(formData.genreId), // Konversi genreId ke angka
      });
      alert("Buku berhasil ditambahkan!");
      navigate("/books"); // Kembali ke list buku
    } catch (err) {
      setError("Gagal menambahkan buku. Cek kembali data Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Tambah Buku Baru</h2>
      <BookForm onSubmit={handleSubmit} submitButtonText="Simpan Buku" isSubmitting={isSubmitting} formError={error} />
      <button type="button" className="form-button" style={{ marginTop: "1rem" }} onClick={() => navigate("/books")}>
        Kembali ke Daftar Buku
      </button>
    </div>
  );
};

export default AddBookPage;
