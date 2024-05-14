import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/core/core.index';
import { ProductQueryResult, ProductRoot } from 'src/app/core/models/product';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  categoryId = ''
  products: ProductRoot[] = []
  error: any
  baseUrl = 'http://localhost:4000/uploads/'

  constructor(
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    private cartService: CartService,

  ) { }

  ngOnInit() {
    this.categoryId = this.activeRoute.snapshot.params['categoryId']
    this.commonService.getProducts().subscribe((result: ProductQueryResult) => {
      this.products = result.data.getProducts;
      this.products = this.products.filter(product => product.categoryId == this.categoryId)
    });

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

}
