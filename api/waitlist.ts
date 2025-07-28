import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ message: 'Invalid email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await supabase.from('waitlist').insert([{ email }]);

  if (error) {
    // Check for unique constraint violation by code or message
    if (
      error.message.includes('duplicate')
    ) {
      return new Response(JSON.stringify({ message: 'This email is already on the waitlist.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Added to waitlist' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}