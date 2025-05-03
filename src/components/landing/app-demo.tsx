"use client";

import {useState} from "react";
import {cn} from "@/lib/utils";
import ImageUploader from "@/components/ui/ImageUploader";
import {CameraCapture} from "@/components/ui/CameraCapture";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";

export function AppDemo() {
    const [activeTab, setActiveTab] = useState<"upload" | "camera" | "results">("upload");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const router = useRouter()
    const handleLinkGenerated = (_imageUrl: string, imageId: string) => {
        setUploadedImage(imageId)

    };

    const handleImageCapture = (imageData: string) => {
        setCapturedImage(imageData);
    };

    const processImage = () => {
        if (activeTab === "upload") {
            router.push(`/process/${uploadedImage}`);
        } else {
            router.push(`/process/${capturedImage}`);
        }
    }

    const tabs = [
        {id: "upload", label: "Subir foto"},
        {id: "camera", label: "Usar cámara"},
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
                            isActive={activeTab === "camera"}
                        />
                    )}
                </div>
                <div className="flex justify-center mt-4 mb-2">
                    <Button
                        onClick={processImage}
                        className="px-4 my-6 flex-1 mx-8"
                        disabled={!uploadedImage && !capturedImage}
                        size={"lg"}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Procesar Imagen
                    </Button>
                </div>
            </div>
        </div>
    );
}