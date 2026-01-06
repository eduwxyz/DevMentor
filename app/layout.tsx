import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevMentor",
  description: "Aprenda programação com projetos práticos e um Tech Lead Virtual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
