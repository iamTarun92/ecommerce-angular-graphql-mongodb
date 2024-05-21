import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { GET_CATEGORIES_QUERY, GET_COUPON_BY_CODE, ProductQuery, GET_PRODUCT_BY_ID_QUERY, Get_Address_By_Email_QUERY } from 'src/app/graphql.operation';
import { ProductQueryResult, ProductRoot } from '../models/product';
import { CategoryRoot } from '../models/category';
import { Coupon } from '../models/coupon';
import { AddressRoot } from '../models/user';


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

  getProductById(id: string): Observable<ProductRoot> {
    return this.apollo.query<{ getProductById: ProductRoot }>({
      query: GET_PRODUCT_BY_ID_QUERY,
      variables: {
        id
      },
    }).pipe(map(result => result.data.getProductById));;
  }

  getCategories(): Observable<CategoryRoot[]> {
    return this.apollo
      .watchQuery<{ getCategories: CategoryRoot[] }>({
        query: GET_CATEGORIES_QUERY
      })
      .valueChanges
      .pipe(map(result => result.data.getCategories));
  }

  getCouponByCode(code: string): Observable<Coupon> {
    return this.apollo.query<{ getCouponByCode: Coupon }>({
      query: GET_COUPON_BY_CODE,
      variables: { code },
    }).pipe(map(result => result.data.getCouponByCode));
  }

  getAddressByEmail(email: string): Observable<AddressRoot[]> {
    return this.apollo.query<{ getAddressByEmail: AddressRoot[] }>({
      query: Get_Address_By_Email_QUERY,
      variables: { email },
    }).pipe(map(result => result.data.getAddressByEmail));
  }
}
