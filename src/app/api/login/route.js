import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// server-side supabase client (FĂRĂ service role!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email și parolă lipsă" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: "Email sau parolă incorectă" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Eroare server" },
      { status: 500 }
    );
  }
}
