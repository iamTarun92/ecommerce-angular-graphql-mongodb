import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, CartService, CommonService, CouponService } from 'src/app/core/core.index';
import { Coupon } from 'src/app/core/models/coupon';
import { ProductRoot } from 'src/app/core/models/product';
import { AddressRoot } from 'src/app/core/models/user';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  baseUrl = 'http://localhost:4000/uploads/'
  billingAddressForm!: FormGroup
  deliveryAddressForm!: FormGroup

  cartItems: any[] = [];
  currentUser: any
  paymentMethods = [
    { id: 1, name: 'Cash on delivery', value: 'COD' },
  ];
  otpArray = [1, 2, 3, 4, 5];
  selectedPaymentMethod: string | null = null;
  isDelivery = false
  ItemTotalPrice = 0
  subTotal = 0
  couponCode: any;
  couponId: any;
  couponDiscount = 0;
  isCouponValid: boolean | null = null;
  isMinOrder: boolean | null = null;
  couponData: any | null = null
  duplicateCouponCode: boolean | null = null;
  randomIndex = Math.floor(Math.random() * this.otpArray.length);
  randomNumber = this.otpArray[this.randomIndex];
  otp: any
  allAddress: AddressRoot[] = []
  billingAddress!: any;
  deliveryAddress!: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private commonService: CommonService,
    private couponService: CouponService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
    this.loadAddress()
    if (!this.cartService.getCartItems()) {
      this.router.navigate([''])
    }
    this.cartItems = this.cartService.getCartItems()
    this.subTotal = this.cartService.getSubTotal(this.cartItems)
    this.ItemTotalPrice = this.subTotal
    if (localStorage.getItem('couponCode')) {
      this.couponCode = localStorage.getItem('couponCode')
      this.applyCoupon(this.couponCode, false)
    }

    this.billingAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
    });
    this.deliveryAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
    });

    this.billingAddressForm.valueChanges.subscribe(changes => {
      if (this.isDelivery)
        this.deliveryAddressForm.patchValue(changes);
    });
  }

  loadAddress() {
    this.commonService.getAddressByEmail(this.currentUser.email).subscribe({
      next: (res: AddressRoot[]) => {
        this.allAddress = res
        this.billingAddress = this.allAddress?.find((address) => !!address.primary)
        this.deliveryAddress = this.allAddress?.find((address) => !!address.primary)
      }
    })
  }

  billingAddressSelected(address: AddressRoot) {
    this.billingAddress = address;
  }

  deliveryAddressSelected(address: AddressRoot) {
    this.deliveryAddress = address;
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

  otpCheck(num: number) {
    return this.otpArray.includes(num)
  }

  get isCheckedAddressForm() {
    return this.selectedPaymentMethod && this.otpCheck(+this.otp)
  }

  convertTimestampToDate(timestamp: string): string {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleDateString(); // Convert to a readable date format
  }

  loadCouponCode(code: string): void {
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

  applyCoupon(code: string, check: boolean): void {
    if (check) {
      if (this.couponCode !== localStorage.getItem('couponCode')) {
        this.loadCouponCode(code)
      } else {
        this.duplicateCouponCode = true
      }
    } else {
      this.loadCouponCode(code)
    }
  }

  orderConfirm() {
    const orderId = Math.floor(Math.random() * 1000) + '-' + Math.floor(new Date().getTime() / 1000);
    const transactionId = Math.floor(Math.random() * 1000) + '-' + Math.floor(new Date().getTime() / 1000);
    const address = {
      billing: this.billingAddress,
      delivery: this.deliveryAddress,
    }
    const orderData = {
      "email": this.currentUser.email,
      "orderId": orderId.toString(),
      "paymentMethod": this.selectedPaymentMethod,
      "products": this.cartItems,
      "address": address,
      "name": this.billingAddress.fullName,
      "transactionId": transactionId.toString(),
      "amount": this.ItemTotalPrice,
      "couponId": this.couponId?.toString()
    }
    this.orderService.addOrder(orderData).subscribe(response => {
      console.log('Order placed successfully', response);
    });
  }
}
