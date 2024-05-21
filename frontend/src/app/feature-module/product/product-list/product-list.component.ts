import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, CartService, CommonService, WishlistService } from 'src/app/core/core.index';
import { ProductQueryResult, ProductRoot } from 'src/app/core/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  categoryId = ''
  products: ProductRoot[] = []
  error: any
  currentUser: any
  wishListItems: any
  baseUrl = 'http://localhost:4000/uploads/'

  constructor(
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router

  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
    this.categoryId = this.activeRoute.snapshot.params['categoryId']
    this.commonService.getProducts().subscribe((result: ProductQueryResult) => {
      this.products = result.data.getProducts;
      this.products = this.products.filter(product => product.categoryId._id == this.categoryId)
      if (this.currentUser.email) {
        this.loadWishLists()
      }
    });

  }

  setUrl(product: any) {
    return product.name + '/' + product._id
  }

  hasFixedPrice(product: ProductRoot): boolean {
    return this.cartService.hasFixedPrice(product)
  }

  hasSpecialPrice(product: ProductRoot): boolean {
    return this.cartService.hasSpecialPrice(product)
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    return this.cartService.calculateDiscountedPrice(originalPrice, discountPercentage)
  }

  loadWishLists() {
    this.wishlistService.getWishlists(this.currentUser.email).subscribe({
      next: (response) => {
        this.wishListItems = response
        this.wishlistService.wishListCount.next(response.length)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  isItemExistsInWishlist(product: any): boolean {
    return this.wishListItems?.findIndex((item: any) => item.productId._id === product._id) > -1;
  }

  addToWishList(email: string, productId: string) {
    if (this.authService.getToken()) {
      this.wishlistService.addToWishlist(email, productId).subscribe({
        next: (res) => {
          alert('Product added.')
          this.loadWishLists()
        },
        error: (error) => {
          console.warn(error);
        }
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
}
