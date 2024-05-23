import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { GET_CATEGORIES_QUERY, GET_COUPON_BY_CODE_QUERY, GET_PRODUCT_QUERY, GET_PRODUCT_BY_ID_QUERY, GET_ADDRESS_BY_EMAIL_QUERY, ADD_ADDRESS_QUERY, UPDATE_ADDRESS_QUERY, DELETE_ADDRESS_QUERY, Get_Reviews_By_Product_Id_QUERY, ADD_REVIEW_QUERY, UPDATE_REVIEW_QUERY } from 'src/app/graphql.operation';
import { ProductQueryResult, ProductRoot } from '../models/product';
import { CategoryRoot } from '../models/category';
import { Coupon } from '../models/coupon';
import { AddressRoot } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private apollo: Apollo) { }

  getProducts(): Observable<ProductRoot[]> {
    return this.apollo
      .watchQuery<{ getProducts: ProductRoot[] }>({
        query: GET_PRODUCT_QUERY
      })
      .valueChanges
      .pipe(map(result => result.data.getProducts));
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
      query: GET_COUPON_BY_CODE_QUERY,
      variables: { code },
    }).pipe(map(result => result.data.getCouponByCode));
  }

  getAddressByEmail(email: string): Observable<AddressRoot[]> {
    return this.apollo.query<{ getAddressByEmail: AddressRoot[] }>({
      query: GET_ADDRESS_BY_EMAIL_QUERY,
      fetchPolicy: 'network-only',
      variables: { email },
    }).pipe(map(result => result.data.getAddressByEmail));
  }

  addAddress(address: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_ADDRESS_QUERY,
      variables: {
        newAddress: address,
      },
    }).pipe(
      map((result: any) => result.data.addAddress)
    );
  }

  updateAddress(id: string, address: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_ADDRESS_QUERY,
      variables: {
        id,
        address,
      },
    }).pipe(
      map((result: any) => result.data.updateAddress)
    );
  }

  updateReview(id: string, review: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_REVIEW_QUERY,
      variables: {
        id,
        review,
      },
    }).pipe(
      map((result: any) => result.data.updateReview)
    );
  }

  deleteAddress(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_ADDRESS_QUERY,
      variables: {
        id
      },
    }).pipe(
      map((result: any) => result.data.deleteAddress)
    );
  }

  getReviewsByProductId(productId: string): Observable<any> {
    return this.apollo.query({
      query: Get_Reviews_By_Product_Id_QUERY,
      fetchPolicy: 'network-only',
      variables: { productId },
    }).pipe(map(result => result.data));
  }

  addReview(review: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_REVIEW_QUERY,
      variables: {
        newReview: review,
      },
    }).pipe(
      map((result: any) => result.data.addReview)
    );
  }
}
