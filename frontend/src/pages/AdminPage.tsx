import { Shield } from "lucide-react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { useFeaturesList, useUpdateStatus } from "@/hooks/useFeatures";
import Navbar from "@/components/layout/Navbar";
import StatusBadge from "@/components/features/StatusBadge";
import type { Feature } from "@/types";

const STATUS_OPTIONS: { label: string; value: Feature["status"] }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Planned", value: "PLANNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

function StatusSelect({
  feature,
}: {
  feature: Feature;
}) {
  const { mutate, isPending } = useUpdateStatus();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as Feature["status"];
    mutate(
      { featureId: feature.id, status },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: () => toast.error("Failed to update status"),
      },
    );
  }

  return (
    <select
      value={feature.status}
      onChange={handleChange}
      disabled={isPending}
      style={{
        background: "#0f0f1a",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        padding: "4px 8px",
        color: "white",
        fontSize: 13,
        cursor: "pointer",
        opacity: isPending ? 0.5 : 1,
        outline: "none",
        transition: "border-color 150ms ease",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
      }
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function AdminPage() {
  const { user } = useAuthStore();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const { data, isLoading } = useFeaturesList({ page_size: 100 });
  const features = data?.items ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#08080f" }}>
      <Navbar />
      <main
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 60px" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Shield size={22} style={{ color: "#6366f1" }} />
          <h1 style={{ color: "white", fontSize: 24, fontWeight: 700, margin: 0 }}>
            Admin Panel
          </h1>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 4, marginBottom: 32 }}>
          Manage feature request statuses
        </p>

        {/* Table */}
        <div
          style={{
            background: "#0f0f1a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px 80px 130px 160px",
              background: "rgba(255,255,255,0.03)",
              padding: "12px 20px",
              gap: 12,
            }}
          >
            {["Title", "Author", "Votes", "Status", "Actions"].map((col) => (
              <span
                key={col}
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))
          ) : features.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              No features found
            </div>
          ) : (
            features.map((feature, idx) => (
              <div
                key={feature.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 80px 130px 160px",
                  padding: "16px 20px",
                  gap: 12,
                  borderBottom:
                    idx < features.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  alignItems: "center",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 300,
                  }}
                >
                  {feature.title}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  {feature.authorName.includes("@")
                    ? feature.authorName.split("@")[0]
                    : feature.authorName}
                </div>
                <div style={{ color: "#6366f1", fontWeight: 600, fontSize: 13 }}>
                  {feature.voteCount}
                </div>
                <div>
                  <StatusBadge status={feature.status} />
                </div>
                <div>
                  <StatusSelect feature={feature} />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      className="animate-pulse"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 140px 80px 130px 160px",
        padding: "16px 20px",
        gap: 12,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        alignItems: "center",
      }}
    >
      {[180, 80, 30, 70, 90].map((w, i) => (
        <div
          key={i}
          style={{
            height: 14,
            width: w,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
          }}
        />
      ))}
    </div>
  );
}

