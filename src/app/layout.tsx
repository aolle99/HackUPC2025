
import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export const metadata: Metadata = {
    title: "Visual Search | Inditex",
    description: "Encuentra prendas similares con tecnología visual avanzada de Inditex",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <body className="min-h-screen flex flex-col w-full">
        <Header />
        <main className="flex-1">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}