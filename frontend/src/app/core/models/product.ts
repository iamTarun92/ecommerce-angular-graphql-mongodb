
export interface ProductRoot {
    _id: string
    name: string
    description: string
    price: number
    specialPrice: number
    isFixedPrice: boolean
    stock: number
    image: string
    attributes: Attribute[]
    categoryId:string
}

export interface Attribute {
    name: string
    options: Option[]
}

export interface Option {
    value: string
    price: number
    description: string
}

export interface ProductQueryResult {
    data: {
        getProducts: ProductRoot[];
    };
}
