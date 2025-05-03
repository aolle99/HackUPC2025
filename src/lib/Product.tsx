export type RawProduct = {
    id: string | null,
    name: string,
    price: { currency: string, value: { current: number, original: null } },
    link: string,
    brand: string
  };

export type Product = RawProduct & {
    imageSrc: string;
}
