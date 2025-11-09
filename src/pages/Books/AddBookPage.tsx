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
      // Transform to snake_case for backend compatibility
      const payload = {
        title: formData.title,
        writer: formData.writer,
        publisher: formData.publisher,
        price: formData.price,
        stock: formData.stock,
        genre_id: Number(formData.genreId),
        condition: formData.condition,
        publication_year: formData.publicationYear,
        isbn: formData.isbn,
        description: formData.description,
      };

      // Log payload untuk debugging
      console.log("Sending payload:", payload);

      try {
        const response = await api.post("/books", payload);
        console.log("Server response:", response.data);
        console.log("Response headers:", response.headers);
      } catch (err: any) {
        console.log("Full error object:", err);
        if (err.response) {
          console.log("Response data:", err.response.data);
          console.log("Response headers:", err.response.headers);
        }
        throw err; // Re-throw untuk ditangkap oleh catch block di luar
      }
      alert("Buku berhasil ditambahkan!");
      navigate("/books"); // Kembali ke list buku
    } catch (err: any) {
      // Tampilkan pesan error lebih informatif berdasarkan respons API bila ada
      console.error("Add book failed:", err);
      if (err?.response) {
        const status = err.response.status;
        const data = err.response.data;
        const serverMsg = data?.message ?? data?.error ?? JSON.stringify(data);
        setError(`Gagal menambahkan buku. (${status}) ${serverMsg}`);
      } else {
        setError("Gagal menambahkan buku. Cek kembali data Anda.");
      }
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
