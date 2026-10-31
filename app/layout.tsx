import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agri Pipeline Survey | Irrigation Design & Friction Loss Calculator",
  description: "Comprehensive agricultural pipeline survey report system for calculating friction losses, static head, and total head for irrigation projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
