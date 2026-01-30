import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'access_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    // fake success
    if (email && password) {
      const fakeToken = 'dummy-jwt-token';
      const fakeUser = { id: 1, email };

      localStorage.setItem(this.TOKEN_KEY, fakeToken);
      localStorage.setItem('user', JSON.stringify(fakeUser));

      return of({ accessToken: fakeToken, user: fakeUser });
    }

    return throwError(() => 'Invalid login');

    // original call after backend is ready

    /*return this.http
      .post<{ accessToken: string; user: any }>(
        '/api/auth/login',
        { email, password }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        })
      );*/
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    //return !!this.token;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  signup(data: { name: string; email: string; password: string }) {
    return this.http.post<{ accessToken: string }>(
      '/api/auth/signup',
      data
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
      })
    );
  }
}
