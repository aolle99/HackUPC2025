import {
  Search,
  Camera,
  ShoppingBag,
  TrendingUp,
  Globe,
  Shield,
} from "lucide-react";

const features = [
  {
    name: "Búsqueda visual inteligente",
    description:
      "Nuestra tecnología avanzada de IA identifica características como color, patrón, forma y textura para encontrar prendas similares.",
    icon: Search,
  },
  {
    name: "Captura o sube imágenes",
    description:
      "Utiliza la cámara de tu dispositivo para capturar una prenda que te guste o sube una imagen guardada en tu galería.",
    icon: Camera,
  },
  {
    name: "Resultados en tiempo real",
    description:
      "Obtén recomendaciones al instante de productos similares disponibles en las marcas de Inditex.",
    icon: ShoppingBag,
  },
  {
    name: "Tendencias actualizadas",
    description:
      "Accede a las últimas tendencias y productos de todas las marcas de Inditex en tiempo real.",
    icon: TrendingUp,
  },
  {
    name: "Global y multilingüe",
    description:
      "Disponible en múltiples idiomas y adaptado a todos los mercados donde opera Inditex.",
    icon: Globe,
  },
  {
    name: "Privacidad protegida",
    description:
      "Tus imágenes y datos están seguros con nosotros. No almacenamos tus fotos más tiempo del necesario.",
    icon: Shield,
  },
];

export function Features() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Características principales
        </h2>
        <p className="mt-4 text-muted-foreground">
          Descubre lo que hace única nuestra tecnología de búsqueda visual
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.name} className="group relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground group-hover:bg-primary transition-colors duration-300">
              <feature.icon
                className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300"
                aria-hidden="true"
              />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold leading-6">
                {feature.name}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <div className="relative rounded-full px-4 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border/20 hover:ring-border/30">
          Impulsado por algoritmos avanzados de inteligencia artificial y machine learning.
        </div>
      </div>
    </div>
  );
}