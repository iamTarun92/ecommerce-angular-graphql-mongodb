import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { ADD_ORDER_QUERY, GET_ORDER_BY_ID, GET_ORDER_BY_EMAIL } from 'src/app/graphql.operation';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private apollo: Apollo) { }


    getOrdersByEmail(email: string): Observable<any[]> {
        return this.apollo.watchQuery({
            query: GET_ORDER_BY_EMAIL,
            variables: { email }
        }).valueChanges.pipe(map((result: any) => result.data.getOrdersByEmail));
    }

    getOrdersByOrderId(orderId: string): Observable<any> {
        return this.apollo.watchQuery({
            query: GET_ORDER_BY_ID,
            variables: { orderId }
        }).valueChanges.pipe(map((result: any) => result.data.getOrderByOrderId));
    }

    addOrder(order: any): Observable<any> {
        return this.apollo.mutate({
            mutation: ADD_ORDER_QUERY,
            variables: {
                newOrder: order,
            },
        }).pipe(
            map((result: any) => result.data.addOrder)
        );
    }
}
