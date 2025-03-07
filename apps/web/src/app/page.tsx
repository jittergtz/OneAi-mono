
import Details from "@/components/Details";
import Showcase from "@/components/Showcase";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="min-h-screen p-2 flex flex-col items-center bg-[#010101]">
      <div className="flex flex-col items-center pt-40 xl:pt-2 gap-4">
        <h1 className="text-[190px] mt-20 leading-tight bg-clip-text text-transparent bg-gradient-to-t from-[#0000005a] from-20% via-[#e8c5b4c2] via-60% to-[#101010] to-80%">
          One
        </h1>
        <p className="text-[#f9e2d695] text-center text-md md:text-lg">
          Download the all in one AI shortcut for your mac.
        </p>
        <p className="text-[#ffffffd1] text-center text-sm">
         100% Free and Open Source
        </p>
        <Link
          href={"/stuff"}
          className="bg-neutral-200 hover:bg-neutral-50 hover:shadow-[0_0_105px_24px_rgba(200,200,200,0.3)] duration-200 text-neutral-800 shadow-[0_0_105px_4px_rgba(200,200,200,0.3)] border p-2.5 px-4 rounded-xl"
        >
          Download for Mac
        </Link>
      </div>
      <div className="mt-28"></div>
      <Showcase />

      <div className="mt-28"></div>
      <Details/>

     
    </div>
  );
}

export default page;
