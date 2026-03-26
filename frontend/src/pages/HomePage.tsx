import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FilterBar from "@/components/home/FilterBar";
import FeatureList from "@/components/home/FeatureList";
import CreateFeatureModal from "@/components/features/CreateFeatureModal";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#08080f" }}>
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
    </div>
  );
}
