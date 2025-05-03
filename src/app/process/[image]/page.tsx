import { getPublicEnvironment } from '@/lib/utils';

type Product = {
    id: string | null,
    name: string,
    price: { currency: string, value: Object[] },
    link: string,
    brand: string
  };

async function getSimilarProducts(image: string): Promise<Product[]>{
    const {inditexApiUrl, inditexApiKey} = getPublicEnvironment();

    const response = await fetch(`${inditexApiUrl}?image=http://localhost:3000/process/${image}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${inditexApiKey}`,
            'user-agent': 'OpenPlatform/1.0',
        }
    });

    return response.json();
}

export default async function Page(props: { params: { image: string }}){
    const { image } = await props.params;
    const similarProducts = await getSimilarProducts(image);
    const products = similarProducts.map((product: Product, idx: number) => <li key={idx}>{product.name}</li>);

    return (
        <ul>{ products }</ul>
        
    )
}
