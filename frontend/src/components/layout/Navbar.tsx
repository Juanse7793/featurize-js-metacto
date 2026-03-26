import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { openCreateModal, setSearchQuery } = useUIStore();
  const { logout } = useAuth();
  const [localSearch, setLocalSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, setSearchQuery]);

  return (
    <nav
      style={{
        height: 60,
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8,8,15,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
      }}
    >
      {/* Left */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <Zap
          size={16}
          style={{
            color: "#6366f1",
            filter: "drop-shadow(0 0 6px rgba(99,102,241,0.7))",
          }}
        />
        <span style={{ fontWeight: 600, color: "white", fontSize: 15 }}>
          Featurize
        </span>
      </Link>

      {/* Center search */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 280 }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.3)",
              pointerEvents: "none",
            }}
          />
          <input
            className="input-dark"
            style={{ width: "100%", paddingLeft: 32 }}
            placeholder="Search features..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        {isAuthenticated ? (
          <>
            <button
              className="btn-primary"
              onClick={openCreateModal}
              style={{ fontSize: 13, padding: "6px 14px", height: "auto" }}
            >
              + New Feature
            </button>
            {user?.role === "ADMIN" && <AdminLink />}
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              {user?.name}
            </span>
            <button
              className="btn-ghost"
              onClick={logout}
              style={{ fontSize: 13, padding: "6px 12px", height: "auto" }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link to="/auth" style={{ textDecoration: "none" }}>
            <button
              className="btn-ghost"
              style={{ fontSize: 13, padding: "6px 12px", height: "auto" }}
            >
              Sign in
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

function AdminLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to="/admin"
      style={{
        color: hovered ? "#6366f1" : "rgba(255,255,255,0.5)",
        fontSize: 13,
        textDecoration: "none",
        transition: "color 150ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Admin
    </Link>
  );
}
