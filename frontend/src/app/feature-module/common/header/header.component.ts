import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, AuthService, WishlistService } from 'src/app/core/core.index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: any;
  wishListCount = 0
  isLoggedIn$!: Observable<boolean>;
  currentUser: any


  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
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
    this.currentUser = JSON.parse(this.authService.getCurrentUser() || '{}')
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.wishlistService.wishListCount.subscribe((res) => this.wishListCount = res)
        this.loadWishLists()
      }
    });
  }
  
  loadWishLists() {
    this.wishlistService.getWishlists(this.currentUser.email).subscribe({
      next: (response) => {
        this.wishlistService.wishListCount.next(response.length)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  logOut() {
    this.authService.logout()
    this.router.navigate(['category'])
  }
}
