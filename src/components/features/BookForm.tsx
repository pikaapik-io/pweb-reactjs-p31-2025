// src/components/features/BookForm.tsx
import { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import type { Genre, Book } from '../../types/api';

// Tipe untuk data form
export type BookFormData = {
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stock: number;
  genreId: string; // Kita pakai string untuk <select>
  condition: string;
  publicationYear: number;
  isbn: string;
  description: string;
};

interface BookFormProps {
  // Jika kita 'edit', kita passing data bukunya
  initialData?: Book; 
  // Fungsi yang akan dijalankan saat form di-submit
  onSubmit: (data: BookFormData) => Promise<void>; 
  submitButtonText: string;
  isSubmitting: boolean;
  formError: string | null;
}

const BookForm = ({ 
  initialData, 
  onSubmit, 
  submitButtonText,
  isSubmitting,
  formError 
}: BookFormProps) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title ?? '',
    writer: initialData?.writer ?? '',
    publisher: initialData?.publisher ?? '',
    price: initialData?.price ?? 0,
    stock: initialData?.stock ?? 0,
    genreId: initialData?.genre.id.toString() ?? '',
    condition: initialData?.condition ?? 'New',
    publicationYear: initialData?.publicationYear ?? new Date().getFullYear(),
    isbn: initialData?.isbn ?? '',
    description: initialData?.description ?? '',
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreLoadingError, setGenreLoadingError] = useState<string | null>(null);

  // Fetch genre untuk dropdown
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setGenres(response.data.data);
      } catch (err) {
        setGenreLoadingError('Gagal memuat data genre.');
      }
    };
    fetchGenres();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Konversi ke angka jika itu field angka
      [name]: (name === 'price' || name === 'stock' || name === 'publicationYear') 
               ? parseInt(value) || 0 // || 0 untuk handle input kosong
               : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Judul Buku</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label>Penulis</label>
        <input type="text" name="writer" value={formData.writer} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Penerbit</label>
        <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label>Genre</label>
        <select name="genreId" value={formData.genreId} onChange={handleChange} required>
          <option value="" disabled>Pilih Genre</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        {genreLoadingError && <p className="form-error">{genreLoadingError}</p>}
      </div>

      <div className="form-group">
        <label>Harga</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
      </div>

      <div className="form-group">
        <label>Stok</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
      </div>
      
      <div className="form-group">
        <label>Kondisi</label>
        <select name="condition" value={formData.condition} onChange={handleChange}>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      <div className="form-group">
        <label>Tahun Terbit</label>
        <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label>ISBN (Opsional)</label>
        <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Deskripsi (Opsional)</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4}></textarea>
      </div>

      {formError && <p className="form-error">{formError}</p>}
      
      <button type="submit" className="form-button" disabled={isSubmitting}>
        {isSubmitting ? 'Menyimpan...' : submitButtonText}
      </button>
    </form>
  );
};

export default BookForm;