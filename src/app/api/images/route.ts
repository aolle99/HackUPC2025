import { NextRequest, NextResponse } from 'next/server';
import ImageStorageService from '@/lib/imageStore';

// Endpoint para subir imágenes
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { image, expirationMinutes } = data;

        if (!image) {
            return NextResponse.json(
                { error: 'No se proporcionó ninguna imagen' },
                { status: 400 }
            );
        }

        const imageStorage = ImageStorageService.getInstance();
        const imageId = imageStorage.storeImage(image, expirationMinutes || 30);

        // Construir URL para acceder a la imagen
        const imageUrl = `/image/${imageId}`;

        return NextResponse.json({
            success: true,
            imageId,
            imageUrl,
            expiresIn: `${expirationMinutes || 30} minutos`
        });
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        return NextResponse.json(
            { error: 'Error al procesar la imagen' },
            { status: 500 }
        );
    }
}