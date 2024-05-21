import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, CartService, WishlistService } from 'src/app/core/core.index';
import { WishlistData } from 'src/app/core/models/product';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  baseUrl = 'http://localhost:4000/uploads/'
  wishLists: WishlistData[] = []
  products: any[] = []
  productIds: any[] = []
  currentUser: any

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
  }

  ngOnInit(): void {
    this.loadWishLists()
  }

  loadWishLists() {
    this.wishlistService.getWishlists(this.currentUser.email).subscribe({
      next: (response: WishlistData[]) => {
        this.wishLists = response
        this.wishlistService.wishListCount.next(this.wishLists.length)
      }
    })
  }

  hasFixedPrice(product: any): boolean {
    return this.cartService.hasFixedPrice(product)
  }

  hasSpecialPrice(product: any): boolean {
    return this.cartService.hasSpecialPrice(product)
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    return this.cartService.calculateDiscountedPrice(originalPrice, discountPercentage)
  }

  handleRemoveWishList(id: string) {
    this.wishlistService.removeFromWishlist(id).subscribe({
      next: (res) => {
        alert('Product deleted.')
        this.loadWishLists()
      },
      error: (error) => {
        alert('error')
      }
    })
  }
}
