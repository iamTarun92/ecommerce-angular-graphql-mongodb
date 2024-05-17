import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { ADD_WISHLIST_QUERY, GET_WISHLIST_QUERY, DELETE_WISHLIST_QUERY } from 'src/app/graphql.operation';


@Injectable({
    providedIn: 'root'
})
export class WishlistService {

    public wishListCount: BehaviorSubject<number>

    constructor(private http: HttpClient, private apollo: Apollo) {
        this.wishListCount = new BehaviorSubject<number>(0);
    }

    getWishlists(email: string): Observable<any> {
        return this.apollo.watchQuery({
            query: GET_WISHLIST_QUERY,
            fetchPolicy: 'network-only',
            variables: { email },
        }).valueChanges.pipe(map((result: any) => result.data.getWishlists));
    }

    addToWishlist(email: string, productId: string): Observable<any> {
        return this.apollo.mutate({
            mutation: ADD_WISHLIST_QUERY,
            variables: {
                email,
                productId
            },
        }).pipe(map((result: any) => result.data.addWishlist))
    }

    removeFromWishlist(id: string): Observable<any> {
        return this.apollo.mutate({
            mutation: DELETE_WISHLIST_QUERY,
            variables: {
                id
            },
        }).pipe(map((result: any) => result.data.deleteWishlist));
    }
}
