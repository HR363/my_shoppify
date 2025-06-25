import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from './interfaces/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  private tokenKey = 'shopie_token';

  constructor(private http: HttpClient) {
    const user = this.getUserFromToken();
    if (user) this.userSubject.next(user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ access_token: string }>('http://localhost:3000/auth/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.access_token);
        const user = this.getUserFromToken();
        this.userSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getUserFromToken(): User | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        name: payload.name || '',
        email: payload.email,
        role: payload.role
      };
    } catch {
      return null;
    }
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/auth/register', { name, email, password });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post('http://localhost:3000/auth/request-reset', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post('http://localhost:3000/auth/reset-password', { token, newPassword });
  }
}
