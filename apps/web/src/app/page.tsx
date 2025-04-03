import Details from "../components/Details";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div>
    <main className="flex   flex-col justify-between ">
   

      <Hero/>
    
    <div className="relative ">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_120%,#000_80%,#171717_120%)]"></div>
      <Details/>
      </div>
    
  

    </main>

    <Footer/>

    </div>
  );
}
