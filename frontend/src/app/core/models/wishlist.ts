export interface WishlistRoot {
    data: Data
}

export interface Data {
    getWishlists: Wishlist[]
}

export interface Wishlist {
    _id: string
    email: string
    productId: string
}
