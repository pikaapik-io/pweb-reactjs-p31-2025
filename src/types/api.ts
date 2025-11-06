// src/types/api.ts

// --- User & Auth ---
// Tipe ini mendefinisikan data user yang kita dapat saat login
// Sesuai requirement, minimal ada email
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

// --- Genre ---
// Tipe ini untuk data dari endpoint /genres
export interface Genre {
  id: number;
  name: string;
}

// --- Book ---
// Tipe ini mendefinisikan "cetakan" untuk satu buku
// Mencakup semua data dari list buku dan detail buku
export interface Book {
  id: number;
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stock: number;
  isbn?: string; // Opsional
  description?: string; // Opsional
  publicationYear?: number; // Opsional
  condition?: string; // Opsional
  genre: Genre; // Genre adalah objek relasi
  // book_image?: string; // (Opsional)
}

// --- Transaction ---
// Tipe untuk list transaksi
export interface Transaction {
  id: number;
  userId: number;
  totalAmount: number; // Ini 'amount' di soal
  totalPrice: number; // Ini 'price' di soal
  createdAt: string; // Tanggal transaksi
}

// Tipe untuk detail transaksi
export interface TransactionDetail extends Transaction {
  items: Array<{
    id: number; // ID dari item transaksi (bukan buku)
    title: string; // Judul buku
    quantity: number; // Jumlah yang dibeli
    price: number; // Harga satuan saat itu
  }>;
}

// --- API Responses ---
// Tipe "Generik" untuk membantu kita menangani data
// yang memiliki pagination (seperti di list buku & transaksi)
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}