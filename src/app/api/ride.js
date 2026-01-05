// app/api/ride.js
//author BM25
import { db } from "/app/firebase"; // Firestore config

export async function POST(req) {
  const data = await req.json();
  try {
    const docRef = await db.collection("rides").add({
      pickup: data.pickup,
      destination: data.destination,
      carType: data.carType,
      status: "pending",
      timestamp: Date.now(),
      distance: data.distance || null,
      time: data.time || null,
    });

    const ride = { id: docRef.id, ...data, status: "pending" };
    return new Response(JSON.stringify({ ride }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await db.collection("rides").get();
    const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify({ rides }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Optional: GET /api/ride/:id
export async function GET_ID(req, { params }) {
  try {
    const doc = await db.collection("rides").doc(params.id).get();
    if (!doc.exists) return new Response("Ride not found", { status: 404 });
    return new Response(JSON.stringify({ ride: { id: doc.id, ...doc.data() } }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
