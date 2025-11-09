// src/pages/Transactions/TransactionsListPage.tsx
import { useEffect, useState, useMemo } from "react";
import { api } from "../../lib/axios";
import type { Transaction } from "../../types/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import TransactionItem from "../../components/features/TransactionItem"; // <-- 1. IMPORT

const TransactionsListPage = () => {
  // ... (Semua state dan hook di atas sini SAMA, tidak berubah) ...
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search] = useState("");
  const [sortBy] = useState("id");
  const [order] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", "10");
    if (search) params.append("search", search);
    if (sortBy) params.append("sort", sortBy);
    if (order) params.append("order", order);
    return params.toString();
  }, [page, search, sortBy, order]);

  useEffect(() => {
    // ... (Logika fetchTransactions SAMA, tidak berubah) ...
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/transactions?${queryParams}`);
        console.log("Response data:", response.data);

        // Validasi response
        if (!response.data || !Array.isArray(response.data.data)) {
          console.error("Format response tidak valid:", response.data);
          setError("Format data transaksi tidak valid");
          return;
        }

        setTransactions(response.data.data);
        // Karena API tidak mengembalikan totalPages, kita set 1 untuk sementara
        setTotalPages(1);
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError(err.response?.data?.message || "Gagal mengambil data transaksi.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [queryParams]);

  console.log("Current state:", { loading, error, transactions });

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="error-message" style={{ color: "red", padding: "1rem" }}>
        {error}
      </div>
    );

  // Bagian return() untuk TransactionsPage.tsx
  // Copy paste bagian ini ke dalam component TransactionsPage Anda

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "0.5rem",
            margin: 0,
          }}
        >
          📋 Riwayat Transaksi
        </h2>
        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.95rem", marginTop: "0.5rem" }}>Daftar semua transaksi pembelian Anda</p>
      </div>

      {/* TODO: Search & Sort Controls */}
      {/* Uncomment jika ingin tambahkan search/filter */}
      {/* <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <input
        type="text"
        placeholder="Cari ID Transaksi..."
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0.875rem 1rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          background: 'rgba(255, 255, 255, 0.15)',
          color: 'white',
          fontSize: '0.95rem',
          outline: 'none'
        }}
      />
    </div> */}

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 0" }}>
          <LoadingSpinner />
        </div>
      ) : transactions.length === 0 ? (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <div style={{ color: "rgba(255, 255, 255, 0.4)", marginBottom: "1rem" }}>
            <svg style={{ width: "4rem", height: "4rem", margin: "0 auto" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "white", marginBottom: "0.5rem" }}>Belum Ada Transaksi</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>Anda belum memiliki riwayat transaksi</p>
        </div>
      ) : (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Desktop Table View */}
          <div style={{ display: window.innerWidth < 768 ? "none" : "block", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "1rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.9)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    ID Transaksi
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "1rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.9)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Tanggal
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "1rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.9)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Total Item
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "1rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.9)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Total Harga
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "1rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.9)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => (
                  <TransactionItem key={trx.id} transaction={trx} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div style={{ display: window.innerWidth < 768 ? "block" : "none" }}>
            {transactions.map((trx, index) => (
              <div
                key={trx.id}
                style={{
                  padding: "1.5rem",
                  borderBottom: index < transactions.length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* ID & Date */}
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                      fontWeight: "500",
                    }}
                  >
                    ID Transaksi
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      fontFamily: "monospace",
                      background: "rgba(255, 255, 255, 0.1)",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      display: "inline-block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    #{trx.id}
                  </div>
                  <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem" }}>
                    {new Date((trx as any).transactionDate ?? (trx as any).createdAt ?? (trx as any).created_at ?? (trx as any).date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Items & Price */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div>
                    <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Total Item</div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        background: "rgba(59, 130, 246, 0.2)",
                        color: "#93c5fd",
                      }}
                    >
                      {`${(trx as any).items?.length ?? (trx as any).order_items?.length ?? (trx as any).total_items ?? 0} item`}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Total Harga</div>
                    <div
                      style={{
                        color: "#86efac",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                      }}
                    >
                      Rp {trx.total_price.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {/* Action Button - Assuming you have a detail action */}
                <button
                  onClick={() => {
                    /* handle view detail */
                  }}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    background: "rgba(59, 130, 246, 0.2)",
                    color: "#93c5fd",
                    borderRadius: "6px",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: "500",
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (page !== 1) e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            &lt; Prev
          </button>

          <div
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "500" }}>
              Halaman <span style={{ color: "#3b82f6", fontWeight: "600" }}>{page}</span> dari {totalPages}
            </span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: "500",
              cursor: page === totalPages ? "not-allowed" : "pointer",
              opacity: page === totalPages ? 0.5 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (page !== totalPages) e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsListPage;
