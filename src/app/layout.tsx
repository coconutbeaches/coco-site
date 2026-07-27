import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coconut Beach Koh Phangan",
  description:
    "A quiet, off-grid beachfront stay on Koh Phangan for independent travelers seeking nature, simplicity, and direct beach access.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
