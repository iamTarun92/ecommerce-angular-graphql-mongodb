import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { CategoriesQuery, GET_COUPON_BY_CODE, ProductQuery, GET_PRODUCT_BY_ID, GET_COUPONS } from 'src/app/graphql.operation';
import { ProductQueryResult, ProductRoot } from '../models/product';
import { CategoryQueryResult, CategoryRoot } from '../models/category';
import { Coupon, CouponQueryResult, CouponRoot } from '../models/coupon';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private apollo: Apollo) { }

  getProducts(): Observable<ProductQueryResult> {
    return this.apollo
      .watchQuery<{ getProducts: ProductRoot[] }>({
        query: ProductQuery
      })
      .valueChanges
      .pipe(map(result => result));
  }

  getProductById(productId: string): Observable<ProductRoot> {
    return this.apollo.query<{ getProductById: ProductRoot }>({
      query: GET_PRODUCT_BY_ID,
      variables: {
        productId
      },
    }).pipe(map(result => result.data.getProductById));;
  }

  getCategories(): Observable<CategoryQueryResult> {
    return this.apollo
      .watchQuery<{ getCategories: CategoryRoot[] }>({
        query: CategoriesQuery
      })
      .valueChanges
      .pipe(map(result => result));
  }

  getCouponByCode(code: string): Observable<Coupon> {
    return this.apollo.query<{ getCouponByCode: Coupon }>({
      query: GET_COUPON_BY_CODE,
      variables: { code },
    }).pipe(map(result => result.data.getCouponByCode));
  }

  getCoupons() {
    return this.apollo.watchQuery({
      query: GET_COUPONS
    }).valueChanges;
  }
}
