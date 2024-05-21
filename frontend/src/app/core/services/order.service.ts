import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { ADD_ORDER_QUERY, Get_Order_By_Order_Id, Get_Orders_By_Email } from 'src/app/graphql.operation';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private apollo: Apollo) { }


    getOrdersByEmail(email: string): Observable<any[]> {
        return this.apollo.watchQuery({
            query: Get_Orders_By_Email,
            variables: { email }
        }).valueChanges.pipe(map((result: any) => result.data.getOrdersByEmail));
    }

    getOrdersByOrderId(orderId: string): Observable<any> {
        return this.apollo.watchQuery({
            query: Get_Order_By_Order_Id,
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
