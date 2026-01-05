import { supabase } from "/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password, phone, address, paymentMethod, acceptPolicy } = req.body;

  try {
    // 1️⃣ Creăm rider în tabelul `riders`
    const { data, error } = await supabase
      .from("riders")
      .insert([{ name, phone, created_at: new Date() }])
      .select()
      .single();

    if (error) throw error;

    // Opțional: salvează și login info în auth table sau bcrypt pentru password
    // Supabase Auth poate fi folosit pentru email/password
    // Ex: supabase.auth.signUp({ email, password })

    return res.status(200).json({ success: true, rider: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
