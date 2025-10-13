import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  const { action, payload } = req.body || {};

  if (!action) {
    return res.status(400).json({ message: "Action is required" });
  }

  try {
    switch (req.method) {
      case "POST":
        switch (action) {
          case "createUser":
            return await handleCreateUser(payload, res);
          default:
            return res.status(400).json({ message: "Unknown POST action" });
        }

      case "PUT":
        switch (action) {
          case "updateUsername":
            return await handleUpdateUser(payload, res);
          default:
            return res.status(400).json({ message: "Unknown PUT action" });
        }

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}

// Handlers
async function handleCreateUser(payload: any, res: any) {
  const { email } = payload;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // check if email already exists
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // ignore not found error
  if (selectError && selectError.code !== "PGRST116") throw selectError;

  let userId = existingUser?.id;
  let username = existingUser?.username;
  let alreadyExists = !!existingUser;

  if (!existingUser) {
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([{ email }])
      .select()
      .single();

    if (insertError) throw insertError;
    
    userId = data.id;
    alreadyExists = false;
  }

  return res.status(200).json({ user: { id: userId, email, username }, alreadyExists });
}

async function handleUpdateUser(payload: any, res: any) {
  const { userId, username } = payload;

  const { data, error } = await supabase
    .from("users")
    .update({ username })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return res.status(200).json({ message: "Username updated", user: data });
}