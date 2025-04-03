// app/api/post-info/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Initialize Supabase client correctly
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Insert email into the database
    const { error } = await supabase
      .from('Email')
      .insert([{ Email: email }]);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { message: 'Failed to store email: ' + error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Email successfully stored' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}