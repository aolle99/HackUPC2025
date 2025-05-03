import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPublicEnvironment(){
  return {
    inditexApiUrl: process.env.INDITEX_API_URL || "",
    inditexApiKey: process.env.INDITEX_API_KEY || "",
  }
}
