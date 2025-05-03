"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ImageUploader from "@/components/ui/ImageUploader";
import {CameraCapture} from "@/components/ui/CameraCapture";
import {useRouter} from "next/navigation";

export function AppDemo() {
    const [activeTab, setActiveTab] = useState<"upload" | "camera" | "results">("upload");
    const [, setUploadedImage] = useState<string | null>(null);
    const [, setCapturedImage] = useState<string | null>(null);

    const router = useRouter()
    const handleLinkGenerated = (imageUrl: string) => {
        const imageUrlWithoutBase = imageUrl.replace(`image/`, '');
        router.push(`/preview/${imageUrlWithoutBase}`);
    };

    const handleImageCapture = (imageData: string) => {
        setCapturedImage(imageData);

        // Aquí puedes enviar la imagen a tu API o procesarla
        console.log("Imagen capturada:", imageData.substring(0, 50) + "...");
    };
    const tabs = [
        { id: "upload", label: "Subir foto" },
        { id: "camera", label: "Usar cámara" },
    ];

    return (
        <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Búsqueda visual simplificada
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Encuentra la moda que deseas con solo una imagen
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-md border border-border p-1 bg-card">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => setActiveTab(tab.id as any)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Demo Content */}
            <div className="relative mx-auto max-w-3xl bg-card rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-[16/9] relative">
                    {activeTab === "upload" && (
                        <ImageUploader
                            onPreviewChange={setUploadedImage}
                            maxSizeMB={10}
                            acceptedTypes={['image/png', 'image/jpeg', 'image/gif']}
                            label="Subir Imagen"
                            generateTemporaryLink={true}
                            expirationMinutes={30}
                            onLinkGenerated={handleLinkGenerated}
                            className={"w-full h-full"}
                        />
                    )}

                    {activeTab === "camera" && (
                        <CameraCapture
                            onImageCapture={handleImageCapture}
                            aspectRatio="4:3"
                            className={"w-full h-full"}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}