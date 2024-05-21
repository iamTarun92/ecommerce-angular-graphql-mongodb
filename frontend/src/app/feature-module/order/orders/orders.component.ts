import { Component, OnInit } from '@angular/core';
import { AuthService, OrderService } from 'src/app/core/core.index';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  currentUser: any
  allOrder: any

  constructor(private authService: AuthService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')

    this.orderService.getOrdersByEmail(this.currentUser.email).subscribe({
      next: (res) => {
        this.allOrder = res
      }
    })
  }

}
