import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Request_Password_Reset_Query, Reset_Password_Query, SIGN_IN_QUERY, Sign_UP_QUERY } from 'src/app/graphql.operation';
import { SignInResponse } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('authenticated') ? true : false);
  private currentuser: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('user') || '');

  constructor(
    private http: HttpClient,
    private router: Router,
    private apollo: Apollo
  ) {

  }


  login(email: string, password: string): Observable<SignInResponse> {
    return this.apollo.watchQuery<{ signIn: SignInResponse }>({
      query: SIGN_IN_QUERY,
      variables: {
        email,
        password,
      },
    }).valueChanges.pipe(map((result: any) => {
      return result.data.signIn
    }));
  }

  logout(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: Sign_UP_QUERY,
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

  setLocalStorage(res: any) {
    localStorage.setItem('session_token', res.token);
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify(res.user));
    this.isLoggedInSubject.next(true);
    this.router.navigate(['category'])
  }

  requestPasswordReset(email: string) {
    return this.apollo.mutate({
      mutation: Request_Password_Reset_Query,
      variables: {
        email,
      },
    }).pipe(
      map((result: any) => result.data.requestPasswordReset)
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.apollo.mutate({
      mutation: Reset_Password_Query,
      variables: { token, newPassword }
    }).pipe(
      map((result: any) => result.data.resetPassword)
    );
  }
}
