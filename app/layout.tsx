import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnoringPunch 👊 - Virtual Roommate Therapy",
  description: "Can't sleep because of your roommate's snoring? Punch them virtually! A therapeutic app for frustrated sleepers.",
  openGraph: {
    title: "SnoringPunch 👊",
    description: "Can't sleep? Punch your snoring roommate virtually!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnoringPunch 👊",
    description: "Can't sleep? Punch your snoring roommate virtually!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
