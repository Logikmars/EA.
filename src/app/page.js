import Cooperation from "@/components/sections/Cooperation";
import Hero from "@/components/sections/Hero";
import Info from "@/components/sections/Info";
import Projects from "@/components/sections/Projects";

export default function Home() {
  return (
    <div className="page">
      <Hero />
      <Info />
      <Projects />
      <Cooperation />
    </div>
  );
}
