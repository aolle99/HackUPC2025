"use client";
import Image from 'next/image';
import { useState } from 'react';
import ImageUploader from '@/components/ui/ImageUploader';
import {useRouter} from 'next/navigation';

export default function Home() {
  const [, setUploadedImage] = useState<string | null>(null);
  const router = useRouter()
  const handleLinkGenerated = (imageUrl: string) => {
    const imageUrlWithoutBase = imageUrl.replace(`image/`, '');
    router.push(`/preview/${imageUrlWithoutBase}`);
  };
  
  return (

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

  );
}