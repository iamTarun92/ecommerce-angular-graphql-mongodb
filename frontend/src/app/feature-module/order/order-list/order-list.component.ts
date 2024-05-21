import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, CartService, CouponService, OrderService } from 'src/app/core/core.index';
import { ProductRoot } from 'src/app/core/models/product';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  currentUser: any
  allOrder: any
  couponData: any | null = null
  subTotal = 0


  constructor (
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService,
    private couponService: CouponService,
    private orderService: OrderService) { }

  ngOnInit(): void {

    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')

    this.activeRoute.queryParams.subscribe(data => {
      console.log(data);
      
      this.orderService.getOrdersByOrderId(data?.['order_id']).subscribe({
        next: (res) => {
          console.log(res);
          
          this.allOrder = res
          this.subTotal = this.cartService.getSubTotal(this.allOrder[0].attributes.products)
        }
      })
    })

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
}
