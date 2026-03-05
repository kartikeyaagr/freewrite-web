import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "freewrite",
  description:
    "a faithful recreation of freewrite, the journalling app by farza, just on the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
