import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { setContext } from "@apollo/client/link/context";
import { HttpHeaders } from '@angular/common/http';


const uri = 'http://localhost:3000/GraphQL'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('session_token'); // Adjust as necessary to retrieve your token
    return {
      headers: new HttpHeaders().set('Authorization', token ? `${token}` : '')
    };
  });
  return {
    link: authLink.concat(httpLink.create({ uri })),
    cache: new InMemoryCache(
      { addTypename: false }
    ),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
