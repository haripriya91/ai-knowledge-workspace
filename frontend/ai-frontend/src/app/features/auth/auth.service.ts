import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs';

interface User {
  id: string;
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'access_token';

  private token = signal<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  user = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.token());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:3000/api/auth/login', {
      email,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);

        this.token.set(res.accessToken);
        this.user.set(res.user);
      })
    );
  }

  signup(data: { name: string; email: string; password: string }) {
    return this.http.post<any>('http://localhost:3000/api/auth/signup', data);
  }

  getProfile() {
    return this.http.get<User>('http://localhost:3000/api/auth/me')
      .pipe(
        tap(user => this.user.set(user))
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);

    this.token.set(null);
    this.user.set(null);
  }

  getToken() {
    return this.token();
  }
}