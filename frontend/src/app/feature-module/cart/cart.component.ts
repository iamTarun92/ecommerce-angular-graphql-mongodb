import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, CartService, CommonService, CouponService } from 'src/app/core/core.index';
import { CouponQueryResult, Coupon } from 'src/app/core/models/coupon';
import { ProductRoot } from 'src/app/core/models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  baseUrl = 'http://localhost:4000/uploads/'
  ItemTotalPrice = 0
  subTotal = 0
  isLoggedIn$!: Observable<boolean>;
  cartItems: any[] = [];
  checkAuth = ''
  couponData: Coupon | null = null
  couponCode: any;
  couponDiscount = 0;
  isCouponValid: boolean | null = null;
  isMinOrder: boolean | null = null;
  duplicateCouponCode: boolean | null = null;
  startDate!: string;
  endDate!: string;


  constructor(private cartService: CartService, private commonService: CommonService, private couponService: CouponService, private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems()
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    this.ItemTotalPrice = this.subTotal
    this.isLoggedIn$ = this.authService.isLoggedIn();

    if (localStorage.getItem('couponCode')) {
      this.couponCode = localStorage.getItem('couponCode')
      this.applyCoupon(this.couponCode, false)
    }
  }


  convertTimestampToDate(timestamp: string): string {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleDateString(); // Convert to a readable date format
  }

  removeFromCart(productId: number) {
    this.cartService.removeItemFromCart(productId)
    this.changeSubtotal()
    if (!this.cartItems.length) {
      localStorage.removeItem('couponCode')
    }
  }

  changeSubtotal() {
    this.cartService.saveCart();
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    if (this.couponData?.isfixed) {
      this.ItemTotalPrice = this.subTotal - this.couponData.discount
    } else {
      this.ItemTotalPrice = this.calculateDiscountedPrice(this.subTotal, this.couponDiscount)
    }
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

  applyCoupon(code: string, check: boolean): void {
    if (check) {
      if (this.couponCode !== localStorage.getItem('couponCode')) {
        this.callCouponCode(code)
      } else {
        this.duplicateCouponCode = true
      }
    } else {
      this.callCouponCode(code)
    }
  }

  callCouponCode(code: string): void {
    this.commonService.getCouponByCode(code).subscribe({
      next: (response: Coupon) => {
        if (response) {
          this.couponData = response
          const isFixedPrice = this.couponData.isfixed
          const minOrder = this.couponData.minOrder
          const startDateTimestamp = this.convertTimestampToDate(this.couponData.startDate)
          const endDateTimestamp = this.convertTimestampToDate(this.couponData.endDate)
          this.isCouponValid = this.couponService.isCouponValid(startDateTimestamp, endDateTimestamp)

          if (minOrder <= this.subTotal) {
            if (this.isCouponValid) {
              this.couponDiscount = this.couponData.discount
              localStorage.setItem('couponCode', this.couponCode)
              if (isFixedPrice) {
                this.ItemTotalPrice = this.ItemTotalPrice - this.couponDiscount
              } else {
                this.ItemTotalPrice = this.calculateDiscountedPrice(this.ItemTotalPrice, this.couponDiscount)
              }
            } else {
              localStorage.removeItem('couponCode')
              this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
            }
          } else {
            this.isMinOrder = true
          }
        }
        else {
          this.couponData = null
          this.isCouponValid = false
          localStorage.removeItem('couponCode')
          this.ItemTotalPrice = this.cartService.getSubTotal(this.cartItems)
        }
      },
      error: (error) => {
        console.warn(error);
      }
    })
  }
}