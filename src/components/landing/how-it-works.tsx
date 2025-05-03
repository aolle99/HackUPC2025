
const steps = [
  {
    id: 1,
    title: "Captura o sube una imagen",
    description:
      "Utiliza la cámara de tu dispositivo o sube una foto de una prenda que te guste.",
    image: "/images/paso1.png", // Imágenes de ejemplo - reemplazar con las reales
  },
  {
    id: 2,
    title: "Análisis visual inteligente",
    description:
      "Nuestra IA analiza la imagen identificando características clave como color, patrón, forma y estilo.",
    image: "/images/paso2.png",
  },
  {
    id: 3,
    title: "Búsqueda en catálogo",
    description:
      "El sistema busca en tiempo real en el extenso catálogo de Inditex para encontrar prendas similares.",
    image: "/images/paso3.png",
  },
  {
    id: 4,
    title: "Explorar resultados",
    description:
      "Descubre prendas similares o complementarias disponibles en las marcas de Inditex, listas para comprar.",
    image: "/images/paso4.png",
  },
];

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          ¿Cómo funciona?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Un proceso sencillo que combina tecnología avanzada con una experiencia intuitiva
        </p>
      </div>

      <div className="relative">
        {/* Línea de tiempo vertical para desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

        <div className="space-y-16 relative">
          {steps.map((step, idx) => (
            <div key={step.id} className={`relative md:grid md:grid-cols-2 md:gap-8 md:items-center`}>
              {/* Marcador de paso */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-medium z-10">
                {step.id}
              </div>

              {/* Contenido del paso - alterna lados en desktop */}
              <div className={`md:contents`}>
                <div className={`relative p-6 bg-card rounded-lg shadow-sm border border-border/50 ${idx % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2 md:row-start-1'}`}>
                  <div className="md:hidden flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-primary text-primary-foreground font-medium">
                    {step.id}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
                
                <div className={`mt-6 md:mt-0 ${idx % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'}`}>
                  <div className="h-64 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center rounded-lg overflow-hidden">
                    {/* Placeholder para la imagen - usar Image con las imágenes reales */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="object-cover w-full h-full rounded-lg"
                      loading="lazy"
                        width={500}
                        height={500}
                      />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}