import { getPublicEnvironment } from '@/lib/utils';
import ky from 'ky';
import { Card } from '@/lib/Card';
import { Product, RawProduct } from '@/lib/Product';

async function getSimilarProducts(image: string): Promise<RawProduct[]>{
    const {inditexApiUrl, inditexApiKey, siteUrl, imageTest} = getPublicEnvironment();
    let url;
    if(imageTest){
        url = imageTest
    }
    else{
        url = `${siteUrl}/image/${image}`;
    }
    const response = await ky(`${inditexApiUrl}?image=${url}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${inditexApiKey}`,
            'user-agent': 'OpenPlatform/1.0',
            'accept': 'application/json',
        }
    });
    return response.json();
}


function getFirstGroup(html: string, regex: RegExp) {
    return Array.from(html.matchAll(regex), m => m[1]);
  }

export default async function Page(props: { params: Promise<{ image: string }>}){
    const { image } = await props.params;
    const rawSimilarProducts = await getSimilarProducts(image);
    const similarProducts: Product[] = [];

    if (!rawSimilarProducts || rawSimilarProducts.length === 0) {
        return (
            <div className='flex flex-col items-center'>
                <h1>No results</h1>
            </div>
        )
    }

    for (const product of rawSimilarProducts) {

        const firstFetch = fetch(product.link, {
            method: 'GET',
         });

        const firstHtml = await ((await firstFetch).text());

        const baseURL = (await firstFetch).url; // Reemplaza con la URL original
        const bmVerifyToken = getFirstGroup(firstHtml, /bm-verify=(.*)'"/g).pop(); // Extraído manualmente del HTML

        const fetchHtml = fetch(`${baseURL}?bm-verify=${bmVerifyToken}`);
        const html = await ((await fetchHtml).text());
        // Find the product image
        const imageSrc = html.match( /https:\/\/static\.zara\.net\/assets\/public[^\?]*\.jpg/g)?.shift() || `${baseURL}/images/noImage.png`;
        similarProducts.push({
            ...rawSimilarProducts[similarProducts.length],
            imageSrc,
        });
    }

    return (
        <div className='flex flex-col items-center'>
            <h1>Similar results</h1>
            <div className='flex flex-row gap-4'>
                { similarProducts.map((product: Product, idx: number) => <Card key={idx} productInfo={product}/>) }
            </div>
        </div>
    )
}
