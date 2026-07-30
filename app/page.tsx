import { Encryption } from "@/components/main/encryption";
import { Hero } from "@/components/main/hero";
import { Journey } from "@/components/main/journey";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Journey />
        <Encryption />
        <Projects />
      </div>
    </main>
  );
}
