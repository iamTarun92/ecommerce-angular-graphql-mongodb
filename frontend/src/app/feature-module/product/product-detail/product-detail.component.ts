import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Attribute, ProductRoot } from 'src/app/core/models/product';
import { AuthService, CartService, CommonService, WishlistService } from 'src/app/core/core.index';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId: any
  product: any;
  productAttributes: any
  attributes: any[] = []
  isLoggedIn$!: Observable<boolean>;
  quantity = 1
  basicPrice = 0
  specialBasicPrice = 0
  selectedPrice = 0
  wishListItems: any
  currentUser: any



  constructor(
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
    this.productId = this.activeRoute.snapshot.params['productId']
    this.loadProductById(this.productId)
  }

  loadProductById(id: string) {
    this.commonService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.productAttributes = this.product.attributes
        this.basicPrice = this.product.price
        this.specialBasicPrice = this.product.specialPrice
        if (this.cartService.getCartItems()) {
          this.updateItemQty(this.cartService.getCartItems(), this.product)
        }
        if (this.currentUser.email) {
          this.loadWishLists()
        }
      },
      error: (error) => {
        console.warn(error);
      }
    });
  }

  addToCart(product: any) {
    const productToAdd = { ...product, quantity: this.quantity };
    productToAdd.stock -= this.quantity;
    productToAdd.selectedAttributes = this.attributes
    this.cartService.addItemToCart(productToAdd)
  }

  isItemExistsInCart(product: any): boolean {
    return this.cartService.isItemExistsInCart(product)
  }

  isItemExistsInWishlist(product: any): boolean {
    return this.wishListItems?.findIndex((item: any) => item.productId._id === product._id) > -1;
  }

  onAttributeChange(priceAttribute: any) {
    const existingItemIndex = this.attributes.findIndex((attribute: any) => attribute.name === priceAttribute.name);
    if (existingItemIndex !== -1) {
      this.attributes[existingItemIndex] = priceAttribute
    } else {
      this.attributes.push(priceAttribute);
    }

    const totalPrice = this.attributes.reduce((acc, attribute) => acc + attribute.price, 0)
    this.selectedPrice = totalPrice
    this.updatePrice(this.selectedPrice)
  }

  updatePrice(price: number) {
    // Create a new object with the updated price
    this.product = {
      ...this.product,
      price: this.basicPrice + price
    };

    // Update special price if applicable
    if (this.product.specialPrice && this.product.isFixedPrice) {
      this.product = {
        ...this.product,
        specialPrice: this.specialBasicPrice + price
      };
    }
  }


  updateItemQty(arr: any, currentItem: any): void {
    const existingItemIndex = arr.findIndex((cartItem: any) => cartItem._id === currentItem._id);
    if (existingItemIndex !== -1) {
      this.quantity = arr[existingItemIndex].quantity;
    }
  }

  setUrl(product: any) {
    return product.name.toLocaleLowerCase() + '/' + product._id.toString()
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
