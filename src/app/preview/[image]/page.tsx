import Link from 'next/link';
import { ImageVisualizer } from '@/components/features/preview/imageVisualizer';


export default async function Page(props: { params: Promise<{ image: string }>}){
    const { image } = await props.params;
    return (
        <div className='flex flex-col items-center'>
            {image && <ImageVisualizer image={image} />}
            <Link href={`/process/${image}`}>Process</Link>
        </div>
    )
}
