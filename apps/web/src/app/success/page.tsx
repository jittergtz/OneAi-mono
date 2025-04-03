
import BadgeAnimation from "@/src/components/BadgeAnimation";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="flex justify-center w-full relative overflow-hidden">
        <div className="w-full max-w-5xl" >
      <div className="flex  flex-col gap-5 justify-center items-start h-screen p-5 ">
     
        <h1 className="text-5xl z-50 pointer-events-none py-2 text-start text-transparent bg-clip-text bg-gradient-to-l from-zinc-600 via-neutral-50 to-zinc-500">
          Thank You for Joining!
        </h1>
        <p className=" max-w-lg text-sm z-50 text-start text-zinc-400 pointer-events-none">
          Your email has been successfully added to our waitlist. Well keep you updated on our latest news and developments.
        </p>
        <Link
          href="/" 
          className="mt-8 z-50 hover:cursor-pointer px-6 py-2 rounded-full bg-gradient-to-l from-neutral-500 border border-[#303030] to-neutral-950 text-white hover:from-blue-600 hover:to-neutral-400 transition">
          Back to Home
        </Link>
        </div>
      

        <BadgeAnimation/>
      </div>
      </div>
     
    );
  }