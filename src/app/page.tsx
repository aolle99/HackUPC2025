// src/app/page.tsx
"use client";
import Image from 'next/image';
import { useState } from 'react';
import ImageUploader from '@/components/ui/ImageUploader';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [temporaryLink, setTemporaryLink] = useState<string | null>(null);
  
  const handleLinkGenerated = (imageUrl: string) => {
    setTemporaryLink(imageUrl);
  };
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="col-span-full w-full max-w-md">
          <ImageUploader 
            onPreviewChange={setUploadedImage}
            maxSizeMB={10}
            acceptedTypes={['image/png', 'image/jpeg', 'image/gif']}
            label="Subir Imagen"
            generateTemporaryLink={true}
            expirationMinutes={30}
            onLinkGenerated={handleLinkGenerated}
          />
        </div>
        
        {temporaryLink && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-md font-medium text-green-800 mb-2">Enlace temporal generado:</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}${temporaryLink}`}
                className="flex-1 p-2 border rounded text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}${temporaryLink}`);
                  alert('¡Enlace copiado al portapapeles!');
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
              >
                Copiar
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Este enlace expirará en 30 minutos.
            </p>
          </div>
        )}
        
        {uploadedImage && (
          <div className="mt-8 text-center">
            <h2 className="text-lg font-medium mb-2">Imagen procesada</h2>
            <img 
              src={uploadedImage} 
              alt="Imagen procesada" 
              className="max-w-full max-h-64 mx-auto"
            />
          </div>
        )}
      </main>
    </div>
  );
}