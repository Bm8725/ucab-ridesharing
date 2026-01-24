// app/api/cpu/route.js
/*
CPU view on server
*/
export async function GET() {
  return new Response(JSON.stringify({ arch: process.arch }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
