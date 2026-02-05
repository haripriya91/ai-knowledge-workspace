import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { of, tap, throwError } from 'rxjs';
interface User {
  id: number;
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  // 🔹 signals
  private token = signal<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  user = signal<User | null>(null);

  // derived state
  isLoggedIn = computed(() => !!this.token());

  constructor(private http: HttpClient) {}

  // ✅ FRONTEND PHASE (dummy login)
  login(email: string, password: string) {
    const fakeToken = 'dummy-jwt-token';
    const fakeUser = { id: 1, email };

    localStorage.setItem(this.TOKEN_KEY, fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));

    this.token.set(fakeToken);
    this.user.set(fakeUser);
  }

  // ✅ REAL BACKEND VERSION (later)
  /*
  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string; user: User }>(
        '/api/auth/login',
        { email, password }
      )
      .pipe(
        tap(res => {
          localStorage.setItem(this.TOKEN_KEY, res.accessToken);
          this.token.set(res.accessToken);
          this.user.set(res.user);
        })
      );
  }
  */

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');

    this.token.set(null);
    this.user.set(null);
  }

  getToken() {
    return this.token();
  }

  signup(data: { name: string; email: string; password: string }) {
    // dummy signup (frontend only)
    const fakeToken = 'dummy-jwt-token';
    const fakeUser = {
      id: 1,
      email: data.email,
      name: data.name
    };
  
    localStorage.setItem('access_token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));
  
    this.token.set(fakeToken);
    this.user.set(fakeUser);
  }
}
