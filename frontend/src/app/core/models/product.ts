
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
    categoryId: {
        _id: string
        name: string
    }
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

export interface WishlistData {
    _id: string
    name: string
    productId: ProductRoot
}