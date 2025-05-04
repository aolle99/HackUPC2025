"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";

interface UrlImageUploaderProps {
    onImageCapture: (imageUrl: string) => void;
    className?: string;
    isActive?: boolean; // Indica si el uploader está activo
}

export function UrlImageUploader({
                                     onImageCapture,
                                     className,
                                     isActive = false
                                 }: UrlImageUploaderProps) {
    const [inputUrl, setInputUrl] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputUrl(e.target.value);
        setError(null);
    };

    const validateAndProcessUrl = useCallback(async () => {
        // Validar que el input no esté vacío
        if (!inputUrl || inputUrl.trim() === '') {
            setError('Por favor, introduce una URL válida');
            return;
        }

        // Validar formato básico de URL
        try {
            new URL(inputUrl);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            setError('La URL ingresada no es válida');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Enviar la URL a la API para procesarla y generar una versión almacenada temporalmente
            const response = await fetch('/api/images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: inputUrl,
                    expirationMinutes: 30
                }),
            });

            if (!response.ok) {
                throw new Error('Error al procesar la imagen');
            }

            const result = await response.json();
            setPreviewUrl(result.imageUrl);
            onImageCapture(result.imageUrl);
        } catch (error) {
            console.error('Error al procesar la URL de la imagen:', error);
            setError('No se pudo cargar la imagen. Verifica que la URL sea válida e inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, [inputUrl, onImageCapture]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await validateAndProcessUrl();
    };

    const resetForm = () => {
        setInputUrl('');
        setPreviewUrl(null);
        setError(null);
    };

    if (!isActive) {
        return null;
    }

    return (
        <div className={cn('flex flex-col w-full max-w-md m-auto', className)}>
            <div className="overflow-hidden  rounded-lg relative">
                {!previewUrl ? (
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                        <div className="text-center mb-4">
                            <Globe className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium">Ingresa la URL de una imagen</h3>
                            <p className="text-sm text-gray-500">
                                Introduce la dirección web de la imagen que deseas utilizar
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={inputUrl}
                                onChange={handleInputChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading}
                            />

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !inputUrl}
                            className="w-full mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Cargando imagen...
                                </>
                            ) : (
                                'Cargar imagen'
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="relative w-full aspect-[4/3]">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            aria-label="Eliminar imagen"
                        >
                            <X size={16} />
                        </button>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={`${window.location.host.includes("localhost") ? "http" : "https"}://${window.location.host}${previewUrl}`}
                                alt="Imagen cargada desde URL"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}