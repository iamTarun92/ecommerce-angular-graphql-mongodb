import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService,AuthService } from 'src/app/core/core.index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: any;
  wishListCount!: number
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    cartService.loadCart()
    this.cartData = cartService.getCartItems()
    cartService.cartData.subscribe({
      next: (res: any) => {
        this.cartData = res
      }
    })
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  logOut() {
    this.authService.logout()
    this.router.navigate(['category'])
  }
}
