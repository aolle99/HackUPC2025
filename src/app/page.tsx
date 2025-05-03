import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppDemo } from "@/components/landing/app-demo";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Technology } from "@/components/landing/technology";

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background py-16 md:py-24">
                <div className="container px-4 md:px-8 m-auto">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Descubre tu estilo con{" "}
                            <span className="text-primary dark:text-primary-foreground">Visual Search</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Encuentra prendas similares a las que te gustan con la potente tecnología de búsqueda visual de Inditex. Sube una foto o captura una con la cámara y descubre opciones parecidas en segundos.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="#app">
                                <Button size="lg">
                                    Probar ahora
                                </Button>
                            </Link>
                            <Link href="#how-it-works">
                                <Button variant="outline" size="lg">
                                    Cómo funciona
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 -z-10 opacity-30">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 transform blur-3xl xl:-top-6">
                        <div
                            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                            style={{
                                clipPath:
                                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* App Demo Section */}
            <section className="py-12 md:py-20 bg-muted/30" id="app">
                <div className="container px-4 md:px-8 m-auto">
                    <AppDemo />
                </div>
            </section>

            {/* Features Section */}
            <section id="about" className="py-16 md:py-24">
                <div className="container px-4 md:px-8 m-auto">
                    <Features />
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
                <div className="container px-4 md:px-8 m-auto">
                    <HowItWorks />
                </div>
            </section>

            {/* Technology Section */}
            <section id="technology" className="py-16 md:py-24">
                <div className="container px-4 md:px-8 m-auto">
                    <Technology />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-primary">
                <div className="container px-4 md:px-8 m-auto">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                            Descubre el futuro de la moda
                        </h2>
                        <p className="mt-4 text-lg text-primary-foreground/80">
                            Únete a la revolución del comercio electrónico con la tecnología de búsqueda visual de Inditex.
                        </p>
                        <div className="mt-8">
                            <Link href="#app">
                                <Button variant="secondary" size="lg">
                                    Probar ahora
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}