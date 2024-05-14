import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SignIn, SignUp } from 'src/app/graphql.operation';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:1337/api';
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('authenticated') ? true : false);
  private currentuser: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('user') || '');

  constructor(
    private http: HttpClient,
    private router: Router,
    private apollo: Apollo
  ) {

  }


  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: SignIn,
      variables: {
        email,
        password,
      },
    }).pipe(
      tap((response: any) => {
        const { data: { signIn: { token } } } = response;
        this.setLocalStorage(token)
      })
    );
  }

  logout(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('authenticated');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['login'])
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: SignUp,
      variables: {
        username,
        email,
        password,
      },
    })
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable()
  }

  getToken(): string | null {
    return localStorage.getItem('session_token');
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('user');
  }

  setLocalStorage(token: any) {
    localStorage.setItem('session_token', token);
    localStorage.setItem('authenticated', 'true');
    this.isLoggedInSubject.next(true);
    this.router.navigate(['category'])
  }
}
