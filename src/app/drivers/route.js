// src/app/drivers/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pickup = searchParams.get("pickup");
  const destination = searchParams.get("destination");

  const res = await fetch(
    `https://pai.ucab.ro/drivers?pickup=${encodeURIComponent(
      pickup
    )}&destination=${encodeURIComponent(destination)}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
