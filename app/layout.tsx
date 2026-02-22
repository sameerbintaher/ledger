import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Ledger — Expense Tracker",
  description: "Track your expenses with style",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='url(%23g)'/><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%23D4A853'/><stop offset='100%25' stop-color='%23B8864A'/></linearGradient></defs><text x='50%25' y='72%25' text-anchor='middle' font-family='Georgia,serif' font-size='20' font-weight='900' fill='%230f0f1a'>L</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
