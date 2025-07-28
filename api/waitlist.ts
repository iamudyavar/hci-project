import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const { error } = await supabase.from('waitlist').insert([{ email }]);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({ message: 'Added to waitlist' });
}