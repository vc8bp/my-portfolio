import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./(components)/NavBar";
import Footer from "./(components)/Footer";
import CursorField from "./(components)/CursorField";
import Reveal from "./(components)/Reveal";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE = "https://www.vivekchaturvedi.site";
const DESCRIPTION =
  "Software engineer who builds whole systems end to end: product, backend, frontend and infrastructure. Shipped a job-application platform solo, past 135,000 applications.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Vivek Chaturvedi | Software Engineer",
  description: DESCRIPTION,
  keywords: [
    "Software Engineer",
    "Full Stack Engineer",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "C++",
    "PostgreSQL",
    "AWS",
    "Docker",
    "System Design",
  ],
  authors: [{ name: "Vivek Chaturvedi" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    siteName: "Vivek Chaturvedi",
    title: "Vivek Chaturvedi | Software Engineer",
    description: DESCRIPTION,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Vivek Chaturvedi, Software Engineer" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivek Chaturvedi | Software Engineer",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "3vb7PAIymy2lb7q-rHeIelFrbOTQRl4TX_VvfPAxerc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <head>
        {/* Runs before first paint: marks that JS is alive so the reveal
            styles may hide content. No JS, no hiding. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B55519Z9TP"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B55519Z9TP');
            `,
          }}
        ></script>
      </head>
      <body className="antialiased font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>
        <CursorField />
        <Reveal />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
