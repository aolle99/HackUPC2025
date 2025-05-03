"use client";

import {useState} from "react";
import {cn} from "@/lib/utils";
import ImageUploader from "@/components/ui/ImageUploader";
import {CameraCapture} from "@/components/ui/CameraCapture";
import {Button} from "@/components/ui/button";
import {ChevronLeft, Send} from "lucide-react";
import {Product} from "@/lib/Product";

interface SkeletonCardProps {
    className?: string;
}

function SkeletonCard({className}: SkeletonCardProps) {
    return (
        <div
            className={cn(
                "skeleton-card overflow-hidden rounded-lg border border-border bg-card p-4",
                className
            )}
        >
            {/* Skeleton para la imagen */}
            <div className="h-auto min-h-44 rounded-md w-full bg-muted/60"/>

            {/* Skeleton para el contenido */}
            <div className="p-4 space-y-3">
                {/* Marca */}
                <div className="h-3 w-16 bg-muted/80 rounded animate-pulse"/>

                {/* Nombre del producto (dos líneas) */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/70 rounded animate-pulse"/>
                    <div className="h-4 w-4/5 bg-muted/70 rounded animate-pulse"/>
                </div>

                {/* Precio */}
                <div className="h-5 w-20 bg-muted/90 rounded mt-3 animate-pulse"/>
            </div>
        </div>
    );
}


export function AppDemo() {
    const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [step, setStep] = useState(0);
    const [results, setResults] = useState<Product[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const handleLinkGenerated = (_imageUrl: string, imageId: string) => {
        setUploadedImage(imageId)

    };

    const handleImageCapture = (imageData: string) => {
        setCapturedImage(imageData);
    };

    const loadSimilarProducts = async (image: string, page: string = '1') => {
        setIsLoading(true);
        console.log(`/api/products?image=${image}&page=${page}`);
        const result = await fetch(`/api/products?image=${image}&page=${page}`);
        if (result.ok) {
            const data = await result.json();
            if (data) {
                if (results) {
                    setResults([...results, ...data]);
                } else setResults(data);
                setStep(1);
            } else {
                setStep(2); // Error state
            }
        } else {
            setStep(2); // Error state
        }
        setIsLoading(false);
    }

    const processImage = async () => {
        setStep(1);
        const imageToProcess = activeTab === "upload" ? uploadedImage : capturedImage;
        if (imageToProcess) {
            await loadSimilarProducts(imageToProcess, page.toString());
        } else {
            setStep(2); // Error state
        }
    }

    const handleLoadMore = async () => {
        setPage(page + 1);
        const imageToProcess = activeTab === "upload" ? uploadedImage : capturedImage;
        if (imageToProcess) {
            await loadSimilarProducts(imageToProcess, (page + 1).toString());
        } else {
            setStep(2); // Error state
        }

    }

    const restartProcess = () => {
        setStep(0);
        setUploadedImage(null);
        setCapturedImage(null);
        setActiveTab("upload");
        setResults(null);
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
            {step === 0 ? (
                <>
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
                                    onClick={() => setActiveTab(tab.id as "upload" | "camera")}
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
                                <Send className="w-4 h-4 mr-2"/>
                                Procesar Imagen
                            </Button>
                        </div>
                    </div>
                </>
            ) : step === 1 ? (
                <div className="flex flex-col items-center justify-center h-full  bg-card rounded-xl shadow-lg p-4">
                    {/* Boton de reinicio */}
                    <Button
                        onClick={restartProcess}
                        className="px-4 py-4 my-6 flex-1 mx-8 mr-auto"
                        size={"lg"}
                        variant={"outline"}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2"/>
                        Probar Otra Imagen
                    </Button>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Resultados
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer mt-4 pb-4">
                        {results && results.map((product, idx) => (
                            <div key={`product-${idx}`} className="bg-white rounded-lg shadow-md p-4"
                                 onClick={() => window.open(product.link)}>
                                <img src={product.imageSrc} alt={product.name}
                                     className="bg-gray-200 object-cover group-hover:opacity-75 cursor-pointer w-full h-auto rounded-md"/>
                                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.brand}</p>
                                <p className="text-lg font-bold mt-2">
                                    {product.price.currency} {product.price.value.current}
                                    {product.price.value.original && (
                                        <span className="line-through text-gray-500 ml-2">
                                                {product.price.currency} {product.price.value.original}
                                            </span>
                                    )}
                                </p>
                            </div>
                        ))}
                        {isLoading && (
                            Array.from({length: 6}).map((_, idx) => (
                                <SkeletonCard key={`skeleton-${idx}`}/>
                            ))

                        )}
                    </div>
                    {results && results.length > 0 && (
                        <Button
                            onClick={handleLoadMore}
                            className="px-4 py-4 my-6 flex-1 mx-8"
                            size={"lg"}
                        >
                            Cargar Más Resultados
                        </Button>
                    )}

                </div>
            ) : (
                /* Error State */
                <div className="flex flex-col items-center justify-center h-full bg-card rounded-xl shadow-lg p-4">
                    <h3 className="text-xl font-bold tracking-tight sm:text-2xl text-red-500">
                        Error al procesar la imagen
                    </h3>
                    <p className="mt-4 text-muted-foreground">
                        Por favor, intenta nuevamente o contacta al soporte.
                    </p>
                    <Button
                        onClick={() => processImage()}
                        className="px-4 py-4 my-2 flex-1 mx-8"
                        size={"lg"}
                    >
                        Volver a Intentar
                    </Button>
                    <Button
                        onClick={() => setStep(0)}
                        className="px-4 py-4 my-2 flex-1 mx-8"
                        size={"lg"}
                        variant={"outline"}
                    >
                        Ir a Inicio
                    </Button>
                    <p className="mt-4 text-muted-foreground">
                        Si el problema persiste, contacta al soporte técnico.
                    </p>
                </div>
            )
            }
        </div>
    );
}