import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { ADD_ORDER_QUERY } from 'src/app/graphql.operation';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private apollo: Apollo) { }

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
