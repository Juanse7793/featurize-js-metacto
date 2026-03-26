import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FilterBar from "@/components/home/FilterBar";
import FeatureList from "@/components/home/FeatureList";
import CreateFeatureModal from "@/components/features/CreateFeatureModal";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100vh", background: "#08080f" }}
    >
      <Navbar />
      <Hero />
      <main
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 20px 60px",
        }}
      >
        <FilterBar />
        <FeatureList />
      </main>
      <CreateFeatureModal />
    </motion.div>
  );
}
