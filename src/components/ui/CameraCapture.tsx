"use client";

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
    onImageCapture: (imageData: string) => void;
    className?: string;
    aspectRatio?: 'square' | '4:3' | '16:9';
    quality?: number; // 0 to 1
    isActive?: boolean; // Indica si la cámara está activa
}

export function CameraCapture({
                                  onImageCapture,
                                  className,
                                  aspectRatio = '4:3',
                                  quality = 0.8,
                                  isActive = false
                              }: CameraCaptureProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Calcular relación de aspecto para Tailwind
    const aspectRatioClass = {
        'square': 'aspect-square',
        '4:3': 'aspect-[4/3]',
        '16:9': 'aspect-[16/9]',
    }[aspectRatio];

    // Iniciar la cámara
    const startCamera = async () => {
        setIsCameraLoading(true);
        setCameraError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accediendo a la cámara:', error);
            setCameraError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
        } finally {
            setIsCameraLoading(false);
        }
    };

    // Detener la cámara
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // Capturar imagen
    const captureImage = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Configurar el canvas con las dimensiones del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dibujar el fotograma actual en el canvas
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg', quality);
            setCapturedImage(imageData);

            try {
                // Enviar la imagen a la API
                const response = await fetch('/api/images', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: imageData,
                        expirationMinutes: 30
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error al subir la imagen');
                }

                const result = await response.json();
                onImageCapture(result.imageUrl);
            } catch (error) {
                console.error('Error al subir la imagen capturada:', error);
                setCameraError('Error al procesar la imagen. Inténtalo de nuevo.');
            }
        }
    };

    // Reiniciar captura
    const resetCapture = () => {
        setCapturedImage(null);
        if (isActive && !stream) {
            startCamera();
        }
    };

    // Controlar la cámara según está activa o no
    useEffect(() => {
        if (isActive) {
            startCamera();
        } else {
            stopCamera();
            setCapturedImage(null);
        }

        return () => {
            stopCamera();
        };
    }, [isActive]);

    if (!isActive) {
        console.log("La cámara no está activa");
        return null;
    }

    return (
        <div className={cn('flex flex-col w-full max-w-md mx-auto', className)}>
            {/* Canvas oculto para capturar imágenes */}
            <canvas ref={canvasRef} className="hidden" />
            {/* Área de visualización */}
            <div className={cn('overflow-hidden bg-slate-100 rounded-lg relative', aspectRatioClass)}>
                {!capturedImage ? (
                    <>
                        {isCameraLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                                <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                            </div>
                        )}

                        {cameraError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                <X className="w-12 h-12 text-red-500 mb-2" />
                                <p className="text-red-500">{cameraError}</p>
                                <Button
                                    onClick={startCamera}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Reintentar
                                </Button>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        )}
                    </>
                ) : (
                    <img
                        src={capturedImage}
                        alt="Imagen capturada"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Controles */}
            <div className="flex justify-between mt-4 gap-2">
                {!capturedImage && !cameraError && (
                    <Button onClick={captureImage} className="flex-1">
                        <Camera className="w-4 h-4 mr-2" />
                        Capturar
                    </Button>
                )}

                {capturedImage && (
                    <Button
                        onClick={resetCapture}
                        variant="outline"
                        className="flex-1"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Nueva captura
                    </Button>
                )}
            </div>
        </div>
    );
}