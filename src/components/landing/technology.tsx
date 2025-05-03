"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const technologies = [
  {
    id: "vision",
    name: "Visión por computadora",
    description:
      "Utilizamos algoritmos avanzados de visión por computadora que identifican características específicas de las prendas como colores, patrones, tejidos y formas con alta precisión.",
    details: [
      "Reconocimiento de objetos para identificar tipos de ropa",
      "Análisis de textura para detectar materiales y tejidos",
      "Segmentación semántica para aislar prendas del fondo",
      "Extracción de características basada en redes neuronales convolucionales"
    ]
  },
  {
    id: "ai",
    name: "Inteligencia artificial",
    description:
      "Nuestros modelos de IA han sido entrenados con millones de imágenes de productos de Inditex para ofrecer recomendaciones precisas y relevantes con cada búsqueda.",
    details: [
      "Modelos de aprendizaje profundo entrenados con el catálogo de Inditex",
      "Sistemas de recomendación con aprendizaje continuo",
      "Procesamiento de lenguaje natural para búsquedas multimodales",
      "Algoritmos de clasificación optimizados para moda"
    ]
  },
  {
    id: "cloud",
    name: "Infraestructura cloud",
    description:
      "La aplicación se ejecuta en una infraestructura cloud escalable que garantiza respuestas rápidas y alta disponibilidad en cualquier parte del mundo.",
    details: [
      "Arquitectura serverless para alta disponibilidad",
      "Procesamiento distribuido de imágenes",
      "CDN global para entrega de contenido optimizada",
      "Equilibrio de carga automático según demanda"
    ]
  },
  {
    id: "ux",
    name: "Experiencia de usuario",
    description:
      "Diseñada pensando en la sencillez y la eficiencia, nuestra interfaz permite a los usuarios encontrar lo que buscan en segundos, sin complicaciones.",
    details: [
      "Interfaz minimalista centrada en la experiencia visual",
      "Optimización para dispositivos móviles y táctiles",
      "Tiempo de respuesta menor a 2 segundos",
      "Soporte para múltiples idiomas y localizaciones"
    ]
  },
];

export function Technology() {
  const [activeTech, setActiveTech] = useState(technologies[0].id);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Tecnología detrás de Visual Search
        </h2>
        <p className="mt-4 text-muted-foreground">
          Combinamos las tecnologías más avanzadas para ofrecer resultados excepcionales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-1">
            {technologies.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setActiveTech(tech.id)}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 text-left rounded-lg transition-colors",
                  activeTech === tech.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <span className="text-sm font-medium">{tech.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "h-4 w-4 transition-transform",
                    activeTech === tech.id ? "rotate-90" : ""
                  )}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border border-border/50 p-6 h-full">
            {technologies.map((tech) => (
              tech.id === activeTech && (
                <div key={tech.id} className="space-y-4">
                  <h3 className="text-xl font-semibold">{tech.name}</h3>
                  <p className="text-muted-foreground">{tech.description}</p>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Características principales:</h4>
                    <ul className="space-y-2">
                      {tech.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-primary shrink-0 mr-2"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          Desarrollado en la HackUPC 2025 por Arnau Casau, Jaya Garcia y Àlex Ollé
        </p>
      </div>
    </div>
  );
}