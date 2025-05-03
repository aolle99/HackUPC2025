import Image from 'next/image'
import Link from 'next/link';

export default function Page(props: { params: { image: string }}){
  const { params } = props;

  return (
    <div className='flex flex-col items-center'>
      <Image
        src={`/images/${params.image}`}
        width={500}
        height={700}
        alt="Picture of hoodie"
      />

      <Link href={`/process/${params.image}`}>Process</Link>
    </div>
  )
}
