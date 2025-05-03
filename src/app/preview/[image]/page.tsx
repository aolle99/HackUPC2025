import Image from 'next/image'
import Link from 'next/link';

export default async function Page(props: { params: Promise<{ image: string }>}){
    const { image } = await props.params;
    return (
        <div className='flex flex-col items-center'>
            <Image
                src={`/images/${image}`}
                width={500}
                height={700}
                alt="Picture of hoodie"
            />

            <Link href={`/process/${image}`}>Process</Link>
        </div>
    )
}
