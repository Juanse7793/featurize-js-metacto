import { useQuery } from "@tanstack/react-query";
import { Layers, ThumbsUp } from "lucide-react";
import { featureService } from "@/services/feature.service";
import { QUERY_KEYS } from "@/lib/queryKeys";

export default function Hero() {
  const { data } = useQuery({
    queryKey: QUERY_KEYS.features.list({ page: 1, page_size: 100 }),
    queryFn: () => featureService.getFeatures({ page: 1, page_size: 100 }),
  });

  const totalFeatures = data?.total ?? 0;
  const totalVotes = data?.items.reduce((acc, f) => acc + f.voteCount, 0) ?? 0;

  return (
    <section
      style={{
        paddingTop: 72,
        paddingBottom: 48,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at top center, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", textAlign: "center" }}>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Shape the <span className="gradient-text">roadmap</span>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 16,
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          Vote for the features that matter most to you
        </p>

        {/* Stat cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 32,
          }}
        >
          <StatCard
            icon={<Layers size={18} color="#6366f1" />}
            value={totalFeatures}
            label="Features"
          />
          <StatCard
            icon={<ThumbsUp size={18} color="#6366f1" />}
            value={totalVotes}
            label="Votes Cast"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 16,
        padding: "20px 28px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {icon}
      <div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#6366f1",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.4)",
            marginTop: 4,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
