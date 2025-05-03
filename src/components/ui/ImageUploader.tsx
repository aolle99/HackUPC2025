// src/components/ui/ImageUploader.tsx
"use client";

import React, {useState, useRef, useCallback} from 'react';
import {Image as ImageIcon, X} from 'lucide-react';
import {cn} from '@/lib/utils';
import Image from "next/image";

export interface ImageUploaderProps {
    onChange?: (file: File | null) => void;
    onPreviewChange?: (preview: string | null) => void;
    onLinkGenerated?: (imageUrl: string, imageId: string) => void; // Nueva prop
    maxSizeMB?: number;
    acceptedTypes?: string[];
    className?: string;
    defaultPreview?: string;
    label?: string;
    generateTemporaryLink?: boolean; // Nueva prop para controlar si generar enlace
    expirationMinutes?: number; // Nueva prop para controlar expiración
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         onChange,
                                                         onPreviewChange,
                                                         onLinkGenerated,
                                                         maxSizeMB = 10,
                                                         acceptedTypes = ['image/png', 'image/jpeg', 'image/gif'],
                                                         className,
                                                         defaultPreview,
                                                         label = "Subir Imagen",
                                                         generateTemporaryLink = false,
                                                         expirationMinutes = 30
                                                     }) => {
    // ... código existente
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(defaultPreview || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);

    // Modificar la función handleFileChange para generar enlace si se solicita
    const handleFileChange = useCallback(async (file: File | null) => {
        setError(null);

        if (!file) {
            setPreview(null);
            onChange?.(null);
            onPreviewChange?.(null);
            return;
        }

        // Validar tipo de archivo
        if (!acceptedTypes.includes(file.type)) {
            setError(`Tipo de archivo no permitido. Formatos válidos: ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`);
            return;
        }

        // Validar tamaño
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
            return;
        }

        // Procesar archivo válido
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            setPreview(dataUrl);
            onPreviewChange?.(dataUrl);

            // Generar enlace temporal si se solicita
            if (generateTemporaryLink && onLinkGenerated) {
                try {
                    setIsGeneratingLink(true);
                    const response = await fetch('/api/images', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            image: dataUrl,
                            expirationMinutes
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Error al generar enlace');
                    }

                    const result = await response.json();
                    onLinkGenerated(result.imageUrl, result.imageId);
                } catch (error) {
                    setError('Error al generar enlace temporal.');
                    console.error(error);
                } finally {
                    setIsGeneratingLink(false);
                }
            }
        };
        reader.readAsDataURL(file);
        onChange?.(file);
    }, [acceptedTypes, expirationMinutes, generateTemporaryLink, maxSizeMB, onChange, onLinkGenerated, onPreviewChange]);

    // ... resto del código existente

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0] || null;
        handleFileChange(file);
    };

    const handleRemoveImage = () => {
        setPreview(null);
        onChange?.(null);
        onPreviewChange?.(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    // Agregar indicador de generación de enlace
    return (
        <div className={className}>
            <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                {label}
            </label>

            <div
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 transition-colors",
                    "px-6 py-10 cursor-pointer hover:bg-gray-50",
                    isDragging && "bg-blue-50 border-blue-500",
                    preview && "p-2"
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={!preview ? handleClickUpload : undefined}
            >
                {preview ? (
                    <div className="relative w-full h-full min-h-32 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage();
                            }}
                            className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            aria-label="Eliminar imagen"
                        >
                            <X size={16}/>
                        </button>
                        <div className="relative w-full max-h-64 overflow-hidden flex items-center justify-center">
                            <Image
                                width={100}
                                height={100}
                                src={preview}
                                alt="Vista previa"
                                className="max-w-full max-h-64 object-contain"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400"/>
                        <div
                            className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-1 text-sm/6 text-gray-600">
                            <button
                                type="button"
                                className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                Seleccionar archivo
                            </button>
                            <p className="text-center sm:text-left">o arrastra y suelta aquí</p>
                        </div>
                        <p className="mt-2 text-xs/5 text-gray-600">
                            {`PNG, JPG, GIF hasta ${maxSizeMB}MB`}
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept={acceptedTypes.join(',')}
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                {error && (
                    <div className="mt-2 text-sm text-red-600">
                        {error}
                    </div>
                )}
            </div>

            {isGeneratingLink && (
                <div className="mt-2 text-sm text-blue-600">
                    Generando enlace temporal...
                </div>
            )}

            {/* ... resto del código existente */}
        </div>
    );
};

export default ImageUploader;