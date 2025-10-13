import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    // Return a friendly message + the count
    res.status(200).json({ message: "Hello from /api/project", count });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Internal Server Error" });
  }
}
