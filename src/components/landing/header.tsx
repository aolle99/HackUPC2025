"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {Menu, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const navLinks = [
    {name: "Inicio", href: "/"},
    {name: "Cómo funciona", href: "/#how-it-works"},
    {name: "Tecnología", href: "/#technology"},
    {name: "Inditex", href: "https://www.inditex.com/", external: true},
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo.svg"
                            alt="Inditex Visual Search"
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                        />
                        <span className="hidden font-medium sm:inline-block">Visual Search</span>
                    </Link>
                </div>

                {/* Desktop navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground/80",
                                link.external && "flex items-center gap-1"
                            )}
                            {...(link.external ? {target: "_blank", rel: "noopener noreferrer"} : {})}
                        >
                            {link.name}
                            {link.external && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3"
                                >
                                    <path d="M7 7h10v10"/>
                                    <path d="M7 17 17 7"/>
                                </svg>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="md:hidden p-2 -m-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="sr-only">Abrir menú</span>
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" aria-hidden="true"/>
                    ) : (
                        <Menu className="h-6 w-6" aria-hidden="true"/>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-border/40">
                    <div className="space-y-1 px-4 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "block py-2 text-base font-medium",
                                    link.external && "flex items-center gap-1"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                                {...(link.external ? {target: "_blank", rel: "noopener noreferrer"} : {})}
                            >
                                {link.name}
                                {link.external && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-3 w-3"
                                    >
                                        <path d="M7 7h10v10"/>
                                        <path d="M7 17 17 7"/>
                                    </svg>
                                )}
                            </Link>
                        ))}
                        <Button onClick={() => router.push("#app")}>Probar ahora</Button>
                    </div>
                </div>
            )}
        </header>
    );
}