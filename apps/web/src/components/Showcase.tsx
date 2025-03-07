"use client"
import React from 'react';
import ChatMock from './ChatDemo';
import MacOSDock from './MacosDock';



interface ShowcaseProps {
  // You can define props if you want to make the component more dynamic
}

const Showcase: React.FC<ShowcaseProps> = () => {
  return (
    <section className=' flex flex-col gap-4   w-full max-w-5xl shadow-[0_0_100px_25px_rgba(100,100,100,0.2)] '>
      <div className='bg-gradient-to-tl relative from-black via-[#000000] via-60% to-[#3b54d5] to-90% rounded-md border border-[#393939]  w-full max-w-5xl h-[230px] md:h-[580px] p-4 flex flex-col items-center '>

         <ChatMock/>
         
         <MacOSDock/>

        </div>

    </section>
  );
};

export default Showcase;