import type { Metadata } from "next";
import {
  Nunito_Sans,
  Varela_Round,
  Libre_Bodoni,
  Public_Sans,
} from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const varelaRound = Varela_Round({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-varela-round",
  display: "swap",
});

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  variable: "--font-libre-bodoni",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adopti — Reportes de mascotas perdidas y encontradas",
  description:
    "Plataforma colaborativa para reportar y reunir mascotas perdidas con sus dueños.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${nunitoSans.variable} ${varelaRound.variable} ${libreBodoni.variable} ${publicSans.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
