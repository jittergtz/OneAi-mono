"use client"
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import VideoPlayer from './Showcase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../utils/supabase/types';


function Hero() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Creating the Supabase client correctly with type parameter
  const supabase = createClientComponentClient<Database>();

  // Prefetch the success page route
  useEffect(() => {
    router.prefetch('/success');
  }, [router]);

  const resetFormField = () => {
    setEmail('');
  };

  const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError(null);
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      // Using the API route approach to handle the database operation securely
      const response = await fetch('/api/post-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('Email successfully submitted');
        // Simple and reliable navigation
        router.push('/success');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Email is invalid');
      return;
    }
    submit();
  };

  return (
    <div className="flex flex-col min-h-screen gap-5 pt-40 p-2 items-center relative">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#171717_110%)]"></div>
        <Image
        src="/images/One-logo.jpg"
        alt="One logo"
        width={70}
        height={70}
       className='rounded-xl'
       priority/>
      <h1 className="text-5xl text-center text-transparent bg-clip-text bg-gradient-to-l from-zinc-600 via-neutral-50 to-zinc-500">Take the Shortcut</h1>
      <p className="mx-auto max-w-lg text-lg text-center text-zinc-400">AI at your fingertips One interface, everything you need. fast, free and Open source

</p>
      <form onSubmit={handleSubmit} className="flex h-12 pl-3 w-full max-w-xl rounded-xl bg-neutral-950 border border-[#ffffff1d] overflow-hidden">
        <input 
          value={email} 
          onChange={handleChange} 
          type="email" 
          name="email" 
          id="email" 
          required 
          placeholder="Enter your email" 
          className="bg-transparent text-zinc-100 placeholder:text-zinc-500 outline-none w-full"
          disabled={isLoading}
        />
        <button 
          type='submit' 
          className={`px-4 rounded-lg transition flex items-center justify-center min-w-24 ${
            isLoading 
              ? 'bg-neutral-700 text-neutral-300 cursor-not-allowed' 
              : 'text-neutral-900 hover:from-neutral-300 hover:to-white bg-gradient-to-l from-neutral-400 to-white'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>
      {error && <p className="text-neutral-200 text-light">Youre already on the waitlist!</p>}
      <h3 className=' text-transparent bg-clip-text bg-gradient-to-r from-[#5b5b5b] via-[#ffffffdd] to-[#5b5b5b]'>Join the Waitlist</h3>


      <div className=' mt-16 sm:mt-28'>
      <VideoPlayer videoSrc={"/prod1.mov"}/>
      </div>
    </div>
  );
}

export default Hero;