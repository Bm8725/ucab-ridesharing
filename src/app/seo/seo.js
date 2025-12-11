"use client";

import Head from "next/head";

export default function SEO({
  title = "UCab.ro — Transport & Food rapid în România",
  description = "UCab — ride-sharing și livrări rapide. Descarcă UCab App și UCab Food pentru transport și mâncare rapidă.",
  url = "https://ucab.ro",
  image = "/ucabapp.png.png",
}) {
  const jsonLDOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UCab",
    url,
    logo: `${url}/ucabapp.png`,
    sameAs: [
      "https://www.facebook.com/ucab",
      "https://www.instagram.com/ucab",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+40 700 123 x56",
        contactType: "customer service",
        areaServed: "RO",
        availableLanguage: ["Romanian", "English"],
      },
    ],
  };

  const jsonLDApp = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "UCab App",
    operatingSystem: "ANDROID",
    applicationCategory: "Transportation",
    url: "https://play.google.com/store/apps/details?id=com.ucab",
    image: `${url}/ucabapp.png`,
  };

  const jsonLDFood = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "UCab Food",
    operatingSystem: "ANDROID",
    applicationCategory: "FoodDelivery",
    url: "https://play.google.com/store/apps/details?id=com.ucabfood",
    image: `${url}/ucabfood.png`,
  };

  return (
    <Head>
      {/* PRIMARY META */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OPEN GRAPH */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="UCab" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${url}${image}`} />

      {/* TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${image}`} />

      {/* APP STORE HINTS */}
      <meta name="google-play-app" content="app-id=com.ucab" />
      <meta name="google-play-app" content="app-id=com.ucabfood" />

      {/* PRECONNECTS */}
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLDOrganization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLDApp),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLDFood),
        }}
      />
    </Head>
  );
}
