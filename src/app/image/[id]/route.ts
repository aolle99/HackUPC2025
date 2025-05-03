import { NextRequest, NextResponse } from 'next/server';
import ImageStorageService from '@/lib/imageStore';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const {id: imageId} = await params;
        const imageStorage = ImageStorageService.getInstance();
        const image = imageStorage.getImage(imageId);

        if (!image) {
            return NextResponse.json(
                { error: 'Imagen no encontrada o expirada' },
                { status: 404 }
            );
        }

        // Extraer la parte de datos del data URL (sin el prefijo)
        const [prefix, data] = image.data.split(',');
        const contentType = image.contentType;

        // Si es un data URL base64, decodificarlo
        if (prefix.includes('base64')) {
            const decodedData = Buffer.from(data, 'base64');
            return new NextResponse(decodedData, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'private, max-age=3600'
                }
            });
        } else {
            // Si no es base64, devolver directamente
            return NextResponse.redirect(image.data);
        }
    } catch (error) {
        console.error('Error al recuperar la imagen:', error);
        return NextResponse.json(
            { error: 'Error al recuperar la imagen' },
            { status: 500 }
        );
    }
}
