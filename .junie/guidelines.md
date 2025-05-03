
# Project Guidelines

## Descripción General del Proyecto

Este proyecto es una aplicación web moderna desarrollada para HackUPC 2025 utilizando Next.js 15.3.1 con React 19. La aplicación está construida con TypeScript y utiliza Tailwind CSS para los estilos.

### Tecnologías Principales
- **Frontend**: React 19.0.0, Next.js 15.3.1
- **Estilizado**: Tailwind CSS, clsx, tailwind-merge
- **Componentes UI**: Componentes de Radix UI (@radix-ui/react-slot)
- **Iconos**: Lucide React
- **HTTP Cliente**: ky
- **Herramientas de desarrollo**: TypeScript, ESLint

## Estructura del Proyecto
- `/src`: Código fuente principal de la aplicación
- `/public`: Archivos estáticos accesibles públicamente
- `/.junie`: Directrices para el asistente de IA Junie
- `/components.json`: Configuración de componentes UI
- `/docker-compose.yml`: Configuración para entorno Docker

## Guías para Junie

### Ejecución y Pruebas
* Junie debe ejecutar `npm run lint` para verificar el código antes de entregar propuestas de solución
* Para pruebas completas, ejecutar `npm run dev` y verificar que la aplicación se inicie correctamente

### Estilo de Código
* Seguir las reglas de ESLint configuradas en el proyecto
* Mantener el enfoque de TypeScript con tipado estricto
* Utilizar los componentes UI existentes cuando sea posible
* Seguir la arquitectura y patrones del código existente

### Construcción del Proyecto
* Antes de enviar soluciones finales, ejecutar `npm run build` para verificar que la aplicación compila correctamente