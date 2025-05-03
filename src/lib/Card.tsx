import { Product } from './Product';
import './style.css';
import Image from 'next/image';

export function Card(props: {productInfo: Product}) {
    const { imageSrc, name, link, brand, price} = props.productInfo;

    console.log(props.productInfo)
    return (
        <div className="card">
            <a href={link}>
                <Image src={imageSrc} width='200' height='200' alt='my card'/>
                <div className="container">
                    <h4><b>{name}</b></h4>
                    <p><b>Brand:</b> {brand}</p>
                    <p><b>Price:</b> {price.value.current} {price.currency}</p>
                </div>
            </a>
         </div>
        );
}
