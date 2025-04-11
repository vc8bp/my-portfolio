import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./(components)/NavBar";
import GradientBlob from "./GradiantBlob";
import Footer from "./(components)/Footer";
import SplashScreen from "@/app/(components)/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vivek Chaturvedi | Software Developer",
  description: "Software Developer with expertise in building high-performance systems, trading platforms, web applications, and innovative software solutions.",
  keywords: ["Software Developer", "C++", "React", "Node.js", "TypeScript", "Trading Systems", "System Architecture"],
  authors: [{ name: "Vivek Chaturvedi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-portfolio-url.com",
    siteName: "Vivek Chaturvedi Portfolio",
    title: "Vivek Chaturvedi | Software Developer",
    description: "Software Developer with expertise in building high-performance systems, trading platforms, web applications, and innovative software solutions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vivek Chaturvedi Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivek Chaturvedi | Software Developer",
    description: "Software Developer with expertise in building high-performance systems, trading platforms, web applications, and innovative software solutions.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en">
      <head>
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar/>
        <GradientBlob/>
        <SplashScreen/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
