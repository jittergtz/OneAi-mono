


import Footer from "@/components/Footer";
import Hero from "@/components/waitlist/Hero";

export default function Home() {
  return (
    <div className="relative h-screen min-h-screen w-full overflow-auto  dbg-black">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] bg-[linear-gradient(90deg,#ffd5d0_0%,#ffafcc_30%,#dbffe4_70%,#e2d6ff_100%)] rounded-lg blur-[120px] opacity-5 dark:opacity-10" />
      </div>
      <div className="relative mx-auto mb-4 flex flex-col">
        
        <Hero />
        <div className="container mx-auto hidden md:block mt-3">

        </div>
        <div className="container mx-auto block md:hidden">
 
        </div>
        <Footer />
      </div>
    </div>
  );
}