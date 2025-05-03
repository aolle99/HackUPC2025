import { getPublicEnvironment } from '@/lib/utils';
import ky from 'ky';
import puppeteer from 'puppeteer';
import * as cheerio from "cheerio";
import { Card } from '@/lib/Card';
import { Product, RawProduct } from '@/lib/Product';

async function getSimilarProducts(image: string): Promise<RawProduct[]>{
    const {inditexApiUrl, inditexApiKey, siteUrl} = getPublicEnvironment();

    const response = await ky(`${inditexApiUrl}?image=${siteUrl}/image/${image}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${inditexApiKey}`,
            'user-agent': 'OpenPlatform/1.0',
        }
    });

    return response.json();
}

export default async function Page(props: { params: Promise<{ image: string }>}){
    const { image } = await props.params;
    const rawSimilarProducts = await getSimilarProducts(image);

    console.log(rawSimilarProducts)

    const similarProducts: Product[] = [];
    const browser = await puppeteer.launch({ headless: undefined });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

    for (const product of rawSimilarProducts) {    
        await page.goto(product.link, { waitUntil: 'networkidle2' });
        const html = await page.content();
        const $ = cheerio.load(html);

        // Find the product image
        const imageUrl: string = $('.media-image__image').attr("src")!;
        similarProducts.push({
            ...rawSimilarProducts[similarProducts.length],
            imageSrc: imageUrl
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
