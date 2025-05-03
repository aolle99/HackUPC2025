import { v4 as uuidv4 } from 'uuid';

// Tipo para almacenar información de la imagen
export interface StoredImage {
    id: string;
    data: string; // Base64 o URL de datos
    contentType: string;
    expires: Date;
}

// Almacenamiento global para mantener las imágenes durante la vida del servidor
let imageStore: Map<string, StoredImage> | null = null;

class ImageStorageService {
    private images: Map<string, StoredImage>;
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Usar el almacenamiento global o crear uno nuevo
        if (!imageStore) {
            imageStore = new Map<string, StoredImage>();
        }
        this.images = imageStore;

        // Solo configurar el intervalo de limpieza si estamos en el servidor
        if (typeof window === 'undefined' && !this.cleanupInterval) {
            this.cleanupInterval = setInterval(() => this.cleanupExpiredImages(), 60000);
        }
    }

    /**
     * Devuelve la instancia singleton del servicio
     */
    public static getInstance(): ImageStorageService {
        return new ImageStorageService();
    }

    /**
     * Guarda una imagen y devuelve un ID único
     */
    public storeImage(
        dataUrl: string,
        expirationMinutes: number = 30
    ): string {
        // Extraer el tipo de contenido del data URL
        const contentType = dataUrl.split(';')[0].split(':')[1];

        // Generar un ID único
        const id = uuidv4();

        // Calcular la fecha de expiración
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + expirationMinutes);

        // Guardar la imagen en el almacenamiento
        this.images.set(id, {
            id,
            data: dataUrl,
            contentType,
            expires
        });

        return id;
    }

    /**
     * Recupera una imagen por su ID
     */
    public getImage(id: string): StoredImage | undefined {
        const image = this.images.get(id);

        // Comprobar si la imagen existe y no ha expirado
        if (image && image.expires > new Date()) {
            return image;
        }

        // Si ha expirado, eliminarla
        if (image) {
            this.images.delete(id);
        }

        return undefined;
    }

    /**
     * Elimina imágenes expiradas
     */
    private cleanupExpiredImages(): void {
        const now = new Date();
        for (const [id, image] of this.images.entries()) {
            if (image.expires <= now) {
                this.images.delete(id);
            }
        }
    }
}

export default ImageStorageService;
