import { NextRequest, NextResponse } from "next/server";
import { getPublicEnvironment } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Product, RawProduct } from '@/lib/Product';
import ky from "ky";

async function getSimilarProducts(image: string, page: string = '1'): Promise<RawProduct[]> {
    const { inditexApiUrl, siteUrl, imageTest } = getPublicEnvironment();
    let url;
    if (imageTest) {
        url = imageTest;
    } else {
        url = `${siteUrl}/image/${image}`;
    }

    try {
        // Obtener token Bearer usando el cliente de autenticación
        const token = await authClient.getBearerToken();
        const response = await ky(`${inditexApiUrl}?image=${url}&page=${page}&perPage=6`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'user-agent': 'OpenPlatform/1.0',
                'accept': 'application/json',
            },
            timeout: 30000,
            retry: {
                limit: 2,
                methods: ['GET'],
                statusCodes: [408, 429, 500, 502, 503, 504],
            },
        });
        
        return response.json();
    } catch (error) {
        console.error('Error al obtener productos similares:', error);
        
        // Si hay un error de autenticación, intentar invalidar el token y reintentar una vez
        // @ts-expect-error type mismatch
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log('Error de autenticación, regenerando token...');
            authClient.invalidateToken();
            
            // Reintentar con un nuevo token
            const newToken = await authClient.getBearerToken();
            
            const response = await ky(`${inditexApiUrl}?image=${url}&page=${page}&perPage=6`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${newToken}`,
                    'user-agent': 'OpenPlatform/1.0',
                    'accept': 'application/json',
                },
                timeout: 30000,
            });
            
            return response.json();
        }
        
        throw error;
    }
}

function getFirstGroup(html: string, regex: RegExp) {
    return Array.from(html.matchAll(regex), m => m[1]);
}

export async function GET(request: NextRequest) {
    try {
        const {searchParams} = request.nextUrl;
        const image = searchParams.get('image');
        const page = searchParams.get('page') || '1';
        if(!image) {
            return NextResponse.json(
                { error: 'No se proporcionó ninguna imagen' },
                { status: 400 }
            );
        }
        const {siteUrl} = getPublicEnvironment();
        const rawSimilarProducts = await getSimilarProducts(image, page);
        const similarProducts: Product[] = [];

        for (const product of rawSimilarProducts) {
            const firstFetch = fetch(product.link, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Host': "zara.com",
                }
            });

            const firstHtml = await ((await firstFetch).text());
            const baseURL = (await firstFetch).url; // Reemplaza con la URL original
            const bmVerifyToken = getFirstGroup(firstHtml, /bm-verify=(.*)'"/g).pop(); // Extraído manualmente del HTML
            const fetchHtml = fetch(`${baseURL}?bm-verify=${bmVerifyToken}`);
            const html = await ((await fetchHtml).text());
            const imageSrc = html.match(/https:\/\/static\.zara\.net\/assets\/public[^\?]*\.jpg/g)?.shift() || `${siteUrl}/images/noImage.png`;
            similarProducts.push({
                ...rawSimilarProducts[similarProducts.length],
                imageSrc,
            });
        }
        return NextResponse.json(similarProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Error fetching products' },
            { status: 500 }
        );
    }
}