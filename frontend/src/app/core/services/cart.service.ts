import { EventEmitter, Injectable } from '@angular/core';
import { ProductRoot } from '../models/product';



@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartKey = 'cartItems';
    cartItems: any[] = []
    cartData = new EventEmitter<any>()

    getCartItems() {
        return this.cartItems
    }

    loadCart(): void {
        const cartItems = localStorage.getItem(this.cartKey);
        this.cartItems = cartItems ? JSON.parse(cartItems) : [];
        this.cartData.emit(this.cartItems)
    }

    addItemToCart(product: any): void {
        const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem._id === product._id);
        if (existingItemIndex !== -1) {
            alert("Product updated.")
            this.cartItems[existingItemIndex] = product;
        } else {
            alert("Product added.")
            this.cartItems.push(product);
        }
        this.saveCart()
    }

    removeItemFromCart(productId: number) {
        const existingItemIndex = this.cartItems.findIndex(o => o._id === productId);
        if (existingItemIndex > -1) {
            this.cartItems.splice(existingItemIndex, 1);
            this.saveCart()
        }
    }

    saveCart(): void {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
        this.cartData.emit(this.cartItems)
        if (!this.cartItems.length) {
            this.clearCart(this.cartKey)
        }
    }

    clearCart(key: string): void {
        this.cartItems = []
        localStorage.removeItem(key);
    }

    itemInCart(item: any): boolean {
        return this.cartItems.findIndex(o => o._id === item._id) > -1;
    }

    getSubTotal(cartItems: any): number {
        return cartItems.reduce((total: any, product: any) => total + (parseInt(!!product.specialPrice && product.isFixedPrice ? product.specialPrice : !!product.specialPrice && !product.isFixedPrice ? this.calculateDiscountedPrice(product.price, product.specialPrice) : product.price) * product.quantity), 0);
    }

    getTotalQuantity(arr: any): number {
        return arr.reduce((total: any, product: any) => total + parseInt(product.quantity), 0);
    
    }
    hasFixedPrice(product: ProductRoot): boolean {
        return product.isFixedPrice
    }

    hasSpecialPrice(product: ProductRoot): boolean {
        return !!product.specialPrice
    }
    
    calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
        return originalPrice - (originalPrice * discountPercentage / 100);
    }
}
