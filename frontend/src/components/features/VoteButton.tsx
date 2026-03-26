import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useVote } from "@/hooks/useFeatures";

interface VoteButtonProps {
  featureId: string;
  voteCount: number;
  hasVoted: boolean;
  isAuthenticated: boolean;
}

export default function VoteButton({
  featureId,
  voteCount,
  hasVoted,
  isAuthenticated,
}: VoteButtonProps) {
  const vote = useVote();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Sign in to vote");
      return;
    }
    vote.mutate(featureId);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <motion.div whileTap={{ scale: 0.85 }}>
        <ChevronUp
          size={20}
          style={{
            color: hasVoted ? "#6366f1" : "rgba(255,255,255,0.3)",
            transition: "color 150ms ease",
          }}
        />
      </motion.div>
      <span
        style={{
          fontSize: 14,
          fontVariantNumeric: "tabular-nums",
          fontWeight: hasVoted ? 700 : 600,
          color: hasVoted ? "#6366f1" : "rgba(255,255,255,0.45)",
        }}
      >
        {voteCount}
      </span>
    </div>
  );
}
