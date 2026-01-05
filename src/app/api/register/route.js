// app/api/register/route.js
// write by BM26

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Server-side client (secret key cloud DB)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email, password, name, phone, address, paymentMethod } = await req.json();

    // Crează user cu Service Role Key (server only)
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 400 });

    // Introdu user în tabela "riders"
    await supabase.from("riders").insert({
      id: user.user.id,
      name,
      phone,
      address,
      preferred_payment: paymentMethod,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
