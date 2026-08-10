import type { Metadata } from "next";
import { Pacifico, Swanky_and_Moo_Moo } from "next/font/google";
import "./globals.css";
import "./hero-overlay.css";
import "./mobile-fixes.css";
import "./search-results.css";
import "./availability-font.css";
import "./date-picker.css";
import "./whatsapp-handoff.css";
import "./room-gallery.css";
import "./site-sections.css";
import "./content-heroes.css";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

const swankyAndMooMoo = Swanky_and_Moo_Moo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-swanky-and-moo-moo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coconut Beach Koh Phangan",
  description:
    "A quiet, off-grid beachfront stay on Koh Phangan for independent travelers seeking nature, simplicity, and direct beach access.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${pacifico.variable} ${swankyAndMooMoo.variable}`}>
        {children}
        <footer className="site-footer">
          <div className="site-footer-wordmark">Coconut Beach</div>
          <div className="site-footer-location">KOH PHANGAN · THAILAND</div>
        </footer>
      </body>
    </html>
  );
}
