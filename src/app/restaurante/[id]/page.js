import { supabase } from "../../../lib/supabaseConfig";
import RestaurantContent from "./RestaurantClient";

// ASTA E PENTRU SHARE FAIN (WhatsApp, FB)
export async function generateMetadata({ params }) {
  const { id } = await params;

  // Luăm datele restaurantului din baza de date
  const { data: res } = await supabase
    .from('restaurants')
    .select('name, category, image_url')
    .eq('id', id)
    .single();

  if (!res) return { title: "Restaurant | UCab Food" };

  // Facem link-ul pozei să fie complet (absolut)
  const imageUrl = res.image_url?.startsWith('http') 
    ? res.image_url 
    : `https://ucab.ro{res.image_url}`;

  return {
    title: `${res.name} - Comandă Online | UCab Food`,
    description: `Mănâncă ceva bun de la ${res.name}. Livrare rapidă prin UCab!`,
    openGraph: {
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
  };
}

export default function Page() {
  // Aici afișăm design-ul tău (codul tău vechi)
  return <RestaurantContent />;
}
