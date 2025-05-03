"use client";
import Image from "next/image";
export const ImageVisualizer = ({image}:{image:string}) => {
    
    return (
        <Image
            src={`/image/${image}`}
            width={500}
            height={700}
            alt="Picture of hoodie"
        />
    )
}