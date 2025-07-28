import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    res.status(400).json({ message: 'Invalid email' });
    return;
  }

  const { error } = await supabase.from('waitlist').insert([{ email }]);

  if (error) {
    if (error.message.includes('duplicate')) {
      res.status(409).json({ message: 'This email is already on the waitlist.' });
      return;
    }
    res.status(500).json({ message: error.message });
    return;
  }

  res.status(200).json({ message: 'Added to waitlist' });
}