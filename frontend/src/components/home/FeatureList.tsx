import { Inbox } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useFeaturesList } from "@/hooks/useFeatures";
import FeatureCard from "../features/FeatureCard";
import type { FeaturesFilters } from "@/services/feature.service";

export default function FeatureList() {
  const { activeStatus, activeSort, searchQuery, openCreateModal } =
    useUIStore();
  const { isAuthenticated } = useAuthStore();

  const filters: FeaturesFilters = {
    ...(activeStatus !== "ALL" ? { status: activeStatus } : {}),
    sort: activeSort,
  };

  const { data, isLoading } = useFeaturesList(filters);

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const allItems = data?.items ?? [];
  const items = searchQuery
    ? allItems.filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allItems;

  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          gap: 12,
        }}
      >
        <Inbox size={40} style={{ color: "rgba(255,255,255,0.1)" }} />
        <div style={{ color: "white", fontSize: 15, fontWeight: 600 }}>
          No features yet
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Be the first to suggest one!
        </div>
        {isAuthenticated && (
          <button
            className="btn-primary"
            onClick={openCreateModal}
            style={{ marginTop: 8 }}
          >
            Submit a feature
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: "#0f0f1a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          width: 72,
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          paddingRight: 16,
          marginRight: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 20,
            height: 32,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 16,
            width: "60%",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 12,
            width: "90%",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 4,
            marginBottom: 4,
          }}
        />
        <div
          style={{
            height: 12,
            width: "70%",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 4,
            marginBottom: 16,
          }}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            style={{
              width: 60,
              height: 10,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 4,
            }}
          />
          <div style={{ marginLeft: "auto" }}>
            <div
              style={{
                width: 50,
                height: 18,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 6,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
